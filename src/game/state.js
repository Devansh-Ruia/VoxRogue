/**
 * Pure state transition functions. No side effects, no React.
 * All functions return new objects/arrays — never mutate inputs.
 */

export function applyDamageToPlayer(player, amount) {
  const newHp = Math.max(0, (player.hp ?? player.maxHp) - amount);
  return { ...player, hp: newHp };
}

export function applyDamageToEnemy(rooms, roomIdx, enemyName, amount) {
  return rooms.map((r, i) => {
    if (i !== roomIdx) return r;
    return {
      ...r,
      enemies: (r.enemies || []).map((e) => {
        if (e.name !== enemyName) return e;
        const newHp = Math.max(0, (e.hp ?? e.maxHp) - amount);
        return { ...e, hp: newHp };
      }),
    };
  });
}

export function pickUpItem(player, rooms, roomIdx, item) {
  const room = rooms[roomIdx];
  if (!room || !room.loot.includes(item)) return { player, rooms };

  const newPlayer = {
    ...player,
    inventory: [...(player.inventory || []), item],
  };
  const newRooms = rooms.map((r, i) =>
    i === roomIdx ? { ...r, loot: r.loot.filter((x) => x !== item) } : r
  );
  return { player: newPlayer, rooms: newRooms };
}

export function movePlayer(rooms, roomIdx, direction) {
  const room = rooms[roomIdx];
  if (!room || !room.exits || room.exits[direction] == null) return null;
  return room.exits[direction];
}

export function changeEnemyMood(rooms, roomIdx, enemyName, mood) {
  return rooms.map((r, i) => {
    if (i !== roomIdx) return r;
    return {
      ...r,
      enemies: (r.enemies || []).map((e) =>
        e.name === enemyName ? { ...e, mood } : e
      ),
    };
  });
}

export function checkWinCondition(player) {
  return (player.inventory || []).includes("lich's crown");
}

export function checkDeathCondition(player) {
  return (player.hp ?? 0) <= 0;
}
