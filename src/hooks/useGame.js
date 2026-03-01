import { useCallback, useState } from "react";
import { DUNGEON, INIT_PLAYER } from "../game/dungeon";
import {
  applyDamageToPlayer,
  applyDamageToEnemy,
  pickUpItem,
  movePlayer,
  changeEnemyMood,
  checkWinCondition,
  checkDeathCondition,
} from "../game/state";
import { callGameMaster } from "../api/mistral";
import { speak } from "../api/elevenlabs";
import { generateSceneImage } from "../api/imageGen";

const LOG_COLORS = {
  player: "#7dd3fc",
  narrator: "#fde68a",
  combat: "#f87171",
  system: "#6b7280",
};

function deepCloneDungeon() {
  return DUNGEON.map((r) => ({
    ...r,
    enemies: (r.enemies || []).map((e) => ({ ...e })),
    loot: [...(r.loot || [])],
  }));
}

export function useGame() {
  const [player, setPlayer] = useState({ ...INIT_PLAYER });
  const [rooms, setRooms] = useState(deepCloneDungeon());
  const [roomIdx, setRoomIdx] = useState(0);
  const [visitedRooms, setVisitedRooms] = useState(new Set([0]));
  const [log, setLog] = useState([]);
  const [isDead, setIsDead] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [sceneImage, setSceneImage] = useState(null);
  const [isTakingDamage, setIsTakingDamage] = useState(false);

  const addLog = useCallback((type, text) => {
    setLog((prev) => [...prev, { type, text }]);
  }, []);

  const resetGame = useCallback(() => {
    setPlayer({ ...INIT_PLAYER });
    setRooms(deepCloneDungeon());
    setRoomIdx(0);
    setVisitedRooms(new Set([0]));
    setLog([]);
    setIsDead(false);
    setIsWon(false);
    setIsThinking(false);
    setSceneImage(null);
  }, []);

  const processAction = useCallback(
    async (speech, elevenLabsKey, voiceOn) => {
      if (isThinking || isDead || isWon) return;
      const currentRoom = rooms[roomIdx];

      addLog("player", speech);
      setIsThinking(true);

      try {
        const result = await callGameMaster(speech, currentRoom, player);
        const { action_type, target, narration, outcome } = result;
        const o = outcome || {};

        addLog("narrator", narration || "The dungeon master shrugs.");
        speak(narration, elevenLabsKey, voiceOn);

        // fire and forget — don't await
        const img = generateSceneImage(currentRoom, narration).then(img => {
          if (img) setSceneImage(img);
        });

        let nextPlayer = { ...player };
        let nextRooms = [...rooms];

        if (o.damage_dealt != null && o.damage_dealt > 0 && target) {
          nextRooms = applyDamageToEnemy(
            nextRooms,
            roomIdx,
            target,
            o.damage_dealt
          );
          addLog("combat", `You deal ${o.damage_dealt} damage to ${target}.`);
        }
        if (o.damage_taken != null && o.damage_taken > 0) {
          setIsTakingDamage(true);
setTimeout(() => setIsTakingDamage(false), 300);
          nextPlayer = applyDamageToPlayer(nextPlayer, o.damage_taken);
          addLog("combat", `You take ${o.damage_taken} damage.`);
        }
        if (o.enemy_defeated && target) {
          addLog("system", `${target} has been defeated.`);
        }
        if (action_type === "pick_up") {
          const rawItem = o.item_obtained || target;
          const roomLoot = nextRooms[roomIdx]?.loot || [];
          const item = rawItem
            ? roomLoot.find(
                (l) =>
                  l.toLowerCase() === String(rawItem).toLowerCase().trim() ||
                  l.toLowerCase().includes(String(rawItem).toLowerCase().trim())
              ) || rawItem
            : null;
          if (item && roomLoot.includes(item)) {
            const { player: p, rooms: r } = pickUpItem(
              nextPlayer,
              nextRooms,
              roomIdx,
              item
            );
            nextPlayer = p;
            nextRooms = r;
            addLog("system", `Picked up: ${item}.`);
          }
        }
        if (action_type === "move" && o.direction_moved) {
          const dir = o.direction_moved.toLowerCase();
          const newIdx = movePlayer(nextRooms, roomIdx, dir);
          if (newIdx != null) {
            setRoomIdx(newIdx);
            setVisitedRooms((prev) => new Set([...prev, newIdx]));
            addLog("system", `You go ${dir}.`);
          }
        }
        if (o.mood_changed_to && target) {
          nextRooms = changeEnemyMood(
            nextRooms,
            roomIdx,
            target,
            o.mood_changed_to
          );
          addLog("system", `${target}'s mood: ${o.mood_changed_to}.`);
        }
        if (action_type === "use_item" && target === "health potion") {
          const idx = nextPlayer.inventory?.indexOf("health potion");
          if (idx != null && idx >= 0) {
            const inv = [...(nextPlayer.inventory || [])];
            inv.splice(idx, 1);
            nextPlayer = {
              ...nextPlayer,
              inventory: inv,
              hp: Math.min(nextPlayer.maxHp, (nextPlayer.hp ?? 0) + 30),
            };
            addLog("system", "Used health potion. Restored 30 HP.");
          }
        }

        setPlayer(nextPlayer);
        setRooms(nextRooms);

        if (checkDeathCondition(nextPlayer)) {
          setIsDead(true);
          addLog("system", "You have died.");
        } else if (checkWinCondition(nextPlayer)) {
          setIsWon(true);
          addLog("system", "You have claimed the lich's crown. Victory!");
        }
      } catch (err) {
        addLog(
          "system",
          `Something went wrong: ${err?.message || String(err)}`
        );
      } finally {
        setIsThinking(false);
      }
    },
    [
      isThinking,
      isDead,
      isWon,
      rooms,
      roomIdx,
      player,
      addLog,
    ]
  );

  return {
    player,
    rooms,
    roomIdx,
    visitedRooms,
    log,
    isDead,
    isWon,
    isThinking,
    sceneImage,
    processAction,
    resetGame,
    isTakingDamage,
    logColors: LOG_COLORS,
  };
}
