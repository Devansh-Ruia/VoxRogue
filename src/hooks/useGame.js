import { useState, useCallback, useEffect } from "react";
import { DUNGEON, INIT_PLAYER } from "../game/dungeon";
import {
  applyDamageToPlayer,
  applyDamageToEnemy,
  pickUpItem,
  movePlayer,
  changeEnemyMood,
  checkDeathCondition,
} from "../game/state";
import { callGameMaster } from "../api/mistral";
import { speak } from "../api/elevenlabs";
import { useAuth } from "./useAuth";
import { useSave } from "./useSave";
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
  const [isTakingDamage, setIsTakingDamage] = useState(false);

  const { userId, jwt, isReady: authReady } = useAuth();
  const { saveGame, loadGame, deleteSave, isSaving } = useSave();

  const addLog = useCallback((type, text) => {
    setLog((prev) => [...prev, { type, text }]);
  }, []);

  const resetGame = useCallback(async () => {
    await deleteSave(jwt, userId);
    setPlayer({ ...INIT_PLAYER });
    setRooms(deepCloneDungeon());
    setRoomIdx(0);
    setVisitedRooms(new Set([0]));
    setLog([]);
    setIsDead(false);
    setIsWon(false);
    setIsThinking(false);
    addLog("narrator", "Welcome, meatbag. Another fresh attempt to defy the inevitable. Let's see how long this one lasts.");
  }, [addLog, deleteSave, userId]);

  // Load game on mount
  useEffect(() => {
    if (authReady && userId) {
      const fetchSave = async () => {
        const savedGame = await loadGame(jwt, userId);
        if (savedGame) {
          setPlayer(savedGame.player_state);
          setRooms(savedGame.rooms_state);
          setRoomIdx(savedGame.room_idx);
          setVisitedRooms(new Set(savedGame.rooms_state.map((_, i) => i))); // Mark all loaded rooms as visited
          addLog("system", "A familiar chill. Your past self lives on. For better or worse.");
        } else {
          addLog("narrator", "Welcome, meatbag. Another fresh attempt to defy the inevitable. Let's see how long this one lasts.");
        }
      };
      fetchSave();
    }
  }, [authReady, userId, loadGame, addLog]);

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
          nextPlayer = applyDamageToPlayer(nextPlayer, o.damage_taken);
          addLog("combat", `You take ${o.damage_taken} damage.`);
          setIsTakingDamage(true);
          setTimeout(() => setIsTakingDamage(false), 300);
        }
        if (o.enemy_defeated && target) {
          if (target === "The Lich King") {
            addLog("narrator", "The Lich King collapses with the weary dignity of someone who has been dramatically defeated approximately four thousand times. He seems almost relieved.");
          } else {
            addLog("system", `${target} ceases to be a problem. For now.`);
          }
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
            addLog("system", `You acquire the ${item}. Try not to drop it. Or yourself.`);
            if (nextPlayer.inventory.includes("lich's crown")) {
              setIsWon(true);
              addLog("system", "The 'lich's crown' now graces your inventory. A hollow victory, but a victory nonetheless.");
            }
          }
        }
        if (action_type === "move" && o.direction_moved) {
          const dir = o.direction_moved.toLowerCase();
          const newIdx = movePlayer(nextRooms, roomIdx, dir);
          if (newIdx != null) {
            setRoomIdx(newIdx);
            setVisitedRooms((prev) => new Set([...prev, newIdx]));
            addLog("system", `You lumber ${dir}. The dungeon awaits your next questionable decision.`);
          }
        }
        if (o.mood_changed_to && target) {
          nextRooms = changeEnemyMood(
            nextRooms,
            roomIdx,
            target,
            o.mood_changed_to
          );
          addLog("system", `The ${target} now appears ${o.mood_changed_to}. Your attempts at diplomacy are... noted.`);
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
            addLog("system", "A 'health potion' grudgingly provides some respite. Don't get used to it.");
          }
        }

        setPlayer(nextPlayer);
        setRooms(nextRooms);

        if (checkDeathCondition(nextPlayer)) {
          setIsDead(true);
          addLog("system", "Ah, a familiar scent. You've met your ignoble end.");
        } else if (isWon) {
          // Win condition is already handled by setIsWon above
          addLog("system", "You have claimed the lich's crown. Victory!");
        }
        // Save game after every action
        saveGame(jwt, userId, roomIdx, nextPlayer, nextRooms);
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
      setIsTakingDamage,
      saveGame, // Add saveGame to dependencies
      userId,   // Add userId to dependencies
      jwt,      // Add jwt to dependencies
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
    isTakingDamage,
    processAction,
    resetGame,
    logColors: LOG_COLORS,
    isSaving, // Export isSaving state
  };
}
