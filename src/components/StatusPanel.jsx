export function StatusPanel({ player, room }) {
  const hpPct = ((player.hp ?? player.maxHp) / (player.maxHp || 1)) * 100;
  const hpColor = hpPct > 30 ? "#00b4ff" : "#ff2244";
  const hpGlow = hpPct <= 30 ? "animation: danger-pulse 1s ease-in-out infinite" : "";
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
        fontFamily: "'Space Mono', 'Courier New', monospace",
        fontSize: 13,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <section>
        <div style={{ color: "#2a2a50", marginBottom: 4, fontSize: 9, letterSpacing: "4px" }}>// PLAYER</div>
        <div style={{ marginBottom: 4 }}>
          <div
            style={{
              height: 6,
              background: "#12121f",
              borderRadius: 3,
              overflow: "hidden",
              marginBottom: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, Math.min(100, hpPct))}%`,
                background: hpColor,
                borderRadius: 3,
                boxShadow: "0 0 8px #00b4ff44, 0 0 20px #00b4ff22",
                ...hpGlow && { animation: "danger-pulse 1s ease-in-out infinite" },
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: "#6060a0" }}>
            {player.hp ?? player.maxHp} / {player.maxHp} HP
          </span>
        </div>
        <div style={{ marginBottom: 4, color: "#6060a0" }}>Gold: {player.gold ?? 0}</div>
        <div>
          <div style={{ marginBottom: 4, color: "#6060a0" }}>Inventory:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {(player.inventory || []).length
              ? (player.inventory || []).map((item, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#12121f",
                      border: "1px solid #1e1e35",
                      borderRadius: 4,
                      padding: "2px 8px",
                      color: "#6060a0",
                      fontSize: 11,
                    }}
                  >
                    {item}
                  </span>
                ))
              : <span style={{ color: "#2a2a50", fontSize: 11 }}>—</span>}
          </div>
        </div>
      </section>

      {aliveEnemies.length > 0 && (
        <section>
          <div style={{ color: "#2a2a50", marginBottom: 6, fontSize: 9, letterSpacing: "4px" }}>// ENEMIES</div>
          <div style={{ background: "#0e0010", padding: 8, borderRadius: 4 }}>
            {aliveEnemies.map((e) => {
              const epct = ((e.hp ?? e.maxHp) / (e.maxHp || 1)) * 100;
              const ecolor = epct > 30 ? "#00b4ff" : "#ff2244";
              const moodColor = e.mood === "hostile" ? "#ff2244" : e.mood === "suspicious" ? "#ffaa00" : "#00ff88";
              const moodPulse = e.mood === "hostile" ? "animation: danger-pulse 1s ease-in-out infinite" : "";
              return (
                <div key={e.name} style={{ marginBottom: 8 }}>
                  <div style={{ marginBottom: 2, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#f0f0ff", fontSize: 12 }}>{e.name}</span>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: moodColor,
                        ...moodPulse && { animation: "danger-pulse 1s ease-in-out infinite" },
                      }}
                    />
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "#12121f",
                      borderRadius: 3,
                      overflow: "hidden",
                      marginBottom: 2,
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
                    {e.hp ?? e.maxHp}/{e.maxHp} · {e.mood ?? "hostile"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {loot.length > 0 && (
        <section>
          <div style={{ color: "#2a2a50", marginBottom: 4, fontSize: 9, letterSpacing: "4px" }}>// LOOT</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {loot.map((item, i) => (
              <span
                key={i}
                style={{
                  background: "#12121f",
                  border: "1px solid #1e1e35",
                  borderRadius: 4,
                  padding: "2px 8px",
                  color: "#6060a0",
                  fontSize: 11,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <div style={{ color: "#2a2a50", marginBottom: 4, fontSize: 9, letterSpacing: "4px" }}> // EXITS</div>
        <div>
          {exits.length ? exits.map((exit, i) => (
            <div key={i} style={{ color: "#6060a0", marginBottom: 2, fontSize: 12 }}>
              ↑ {room.exits[exit]} → {exit.charAt(0).toUpperCase() + exit.slice(1)}
            </div>
          )) : <div style={{ color: "#2a2a50", fontSize: 11 }}>—</div>}
        </div>
      </section>
    </div>
  );
}
