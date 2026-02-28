export function StatusPanel({ player, room }) {
  const hpPct = ((player.hp ?? player.maxHp) / (player.maxHp || 1)) * 100;
  const hpColor =
    hpPct > 60 ? "#22c55e" : hpPct > 30 ? "#eab308" : "#ef4444";
  const aliveEnemies = (room?.enemies || []).filter(
    (e) => (e.hp ?? e.maxHp) > 0
  );
  const loot = room?.loot || [];
  const exits = room?.exits ? Object.keys(room.exits) : [];

  return (
    <div
      style={{
        width: 260,
        padding: 12,
        background: "#0e0e1a",
        border: "1px solid #1e1e35",
        borderRadius: 8,
        fontFamily: "'Space Mono', monospace",
        fontSize: 13,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <section>
        <div style={{ color: "#2a2a50", marginBottom: 4, fontSize: 9, letterSpacing: 4 }}>// PLAYER</div>
        <div style={{ marginBottom: 4 }}>
          <div
            style={{
              height: 6,
              background: "#12121f",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, Math.min(100, hpPct))}%`,
                background: hpPct < 30 ? "#ff2244" : "#00b4ff",
                borderRadius: 4,
                boxShadow: hpPct < 30 ? "0 0 8px #ff224444, 0 0 20px #ff224422" : "0 0 8px #00b4ff44, 0 0 20px #00b4ff22",
                animation: hpPct < 30 ? "danger-pulse 1.5s infinite" : "none",
              }}
            />
          </div>
          <span style={{ fontSize: 12 }}>
            {player.hp ?? player.maxHp} / {player.maxHp} HP
          </span>
        </div>
        <div style={{ marginBottom: 4 }}>Gold: {player.gold ?? 0}</div>
        <div>
          Inventory:{" "}
          <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
            {(player.inventory || []).length
              ? (player.inventory || []).map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#12121f",
                      border: "1px solid #1e1e35",
                      borderRadius: 4,
                      padding: "2px 8px",
                      color: "#6060a0",
                    }}
                  >
                    {item}
                  </span>
                ))
              : "—"}
          </div>
        </div>
      </section>

      {aliveEnemies.length > 0 && (
        <section style={{ background: "#0e0010", padding: 12, borderRadius: 8 }}>
          <div style={{ color: "#2a2a50", marginBottom: 6, fontSize: 9, letterSpacing: 4 }}>// ENEMIES</div>
          {aliveEnemies.map((e) => {
            const epct = ((e.hp ?? e.maxHp) / (e.maxHp || 1)) * 100;
            const ecolor = "#ff2244";
            return (
              <div key={e.name} style={{ marginBottom: 8 }}>
                <div style={{ marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: e.mood === "hostile" ? "#ff2244" : "#ffaa00",
                    boxShadow: e.mood === "hostile" ? "0 0 4px #ff2244, 0 0 8px #ff224466" : "none",
                    animation: e.mood === "hostile" ? "mic-pulse 1.5s infinite" : "none",
                  }} />
                  {e.name}
                </div>
                <div
                  style={{
                    height: 6,
                    background: "#12121f",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max(0, Math.min(100, epct))}%`,
                      background: ecolor,
                      borderRadius: 3,
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: "#6060a0" }}>
                  {e.hp ?? e.maxHp}/{e.maxHp} HP · {e.mood ?? "hostile"}
                </span>
              </div>
            );
          })}
        </section>
      )}

      {loot.length > 0 && (
        <section>
          <div style={{ color: "#2a2a50", marginBottom: 4, fontSize: 9, letterSpacing: 4 }}>// LOOT</div>
          <div>{loot.join(", ")}</div>
        </section>
      )}

      <section>
        <div style={{ color: "#2a2a50", marginBottom: 4, fontSize: 9, letterSpacing: 4 }}>// EXITS</div>
        <div>
          {(exits || []).map((exit) => (
            <div key={exit} style={{ color: "#6060a0", marginBottom: 4 }}>
              {exit === "north" && "↑"} {exit === "east" && "→"}{" "}
              {exit === "south" && "↓"} {exit === "west" && "←"} {room.exits[exit]}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
