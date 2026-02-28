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
        background: "#0e0e1a",
        border: "1px solid #1e1e35",
        borderRadius: 8,
        fontFamily: "'Space Mono', monospace",
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 6, color: "#2a2a50", fontSize: 9, letterSpacing: 4 }}>// MAP</div>
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
              border: "none",
              borderLeft: isCurrent ? "3px solid #4040ff" : "3px solid #1e1e35",
              boxShadow: isCurrent ? "inset 0 0 20px #4040ff0a" : "none",
              borderRadius: 8,
              color: isLocked ? "#2a2a50" : "#f0f0ff",
            }}
          >
            <span style={{ marginRight: 6 }}>
              {r.name === "Entrance Hall" && "ENT"}
              {r.name === "Guard Room" && "GRD"}
              {r.name === "Treasury" && "TRS"}
              {r.name === "Lich's Lair" && "LCH"}
            </span>
            <span>{r.name}</span>
            {!isLocked && alive.length > 0 && (
              <span style={{ marginLeft: 8, color: "#ff2244" }}>
                ⚠ {alive.length} enemy{alive.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
