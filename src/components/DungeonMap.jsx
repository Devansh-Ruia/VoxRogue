export function DungeonMap({ rooms, roomIdx, visitedRooms }) {
  const visited = visitedRooms || new Set([0]);
  const isAdjacentToVisited = (roomId) => {
    return rooms.some(
      (r) =>
        visited.has(r.id) &&
        r.exits &&
        Object.values(r.exits).includes(roomId)
    );
  };
  const locked = (r) => !visited.has(r.id) && !isAdjacentToVisited(r.id);

  return (
    <div
      style={{
        padding: 8,
        background: "#0f0f0f",
        border: "1px solid #333",
        borderRadius: 4,
        fontFamily: "Courier New, monospace",
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 6, color: "#94a3b8" }}>Map</div>
      {rooms.map((r, i) => {
        const isCurrent = i === roomIdx;
        const alive = (r.enemies || []).filter((e) => (e.hp ?? e.maxHp) > 0);
        const isLocked = locked(r);
        return (
          <div
            key={r.id}
            style={{
              padding: "6px 8px",
              marginBottom: 4,
              background: isCurrent ? "#1a0f00" : "transparent",
              border: isCurrent ? "1px solid #fde68a" : "1px solid transparent",
              borderRadius: 4,
              color: isLocked ? "#475569" : "#e2e8f0",
            }}
          >
            <span style={{ marginRight: 6 }}>{isLocked ? "🔒" : r.icon}</span>
            <span>{r.name}</span>
            {!isLocked && alive.length > 0 && (
              <span style={{ marginLeft: 8, color: "#7f1d1d" }}>
                ⚠ {alive.length} enemy{alive.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
