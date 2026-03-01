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
  
  const getRoomCode = (name) => {
    if (name.includes("Entrance")) return "ENT";
    if (name.includes("Guard")) return "GRD";
    if (name.includes("Treasury")) return "TRS";
    if (name.includes("Lich")) return "LCH";
    return name.slice(0, 3).toUpperCase();
  };

  return (
    <div
      style={{
        padding: 8,
        background: "#0e0e1a",
        border: "1px solid #1e1e35",
        borderRadius: 8,
        fontFamily: "'Space Mono', 'Courier New', monospace",
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 6, color: "#2a2a50", fontSize: 9, letterSpacing: "4px" }}> // MAP</div>
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
              background: "transparent",
              borderLeft: isCurrent ? "3px solid #4040ff" : "3px solid #1e1e35",
              borderRadius: 4,
              color: isLocked ? "#2a2a50" : "#6060a0",
              ...(isCurrent && {
                boxShadow: "inset 0 0 20px #4040ff0a",
              }),
            }}
          >
            <span style={{ marginRight: 6, color: "#2a2a50", fontSize: 11 }}>
              {isLocked ? "🔒" : getRoomCode(r.name)}
            </span>
            <span style={{ color: isCurrent ? "#f0f0ff" : "#6060a0" }}>
              {r.name}
            </span>
            {!isLocked && alive.length > 0 && (
              <span style={{ marginLeft: 8, color: "#ff2244", fontSize: 11 }}>
                ⚠ {alive.length} enemy{alive.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
