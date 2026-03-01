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
        background: "#0f0f0f",
        border: "1px solid #333",
        borderRadius: 4,
        fontFamily: "Courier New, monospace",
        fontSize: 13,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <section>
        <div style={{ color: "#94a3b8", marginBottom: 4 }}>Player</div>
        <div style={{ marginBottom: 4 }}>
          <div
            style={{
              height: 8,
              background: "#1e293b",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, Math.min(100, hpPct))}%`,
                background: hpColor,
                borderRadius: 4,
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
          {(player.inventory || []).length
            ? (player.inventory || []).join(", ")
            : "—"}
        </div>
      </section>

      {aliveEnemies.length > 0 && (
        <section>
          <div style={{ color: "#94a3b8", marginBottom: 6 }}>Enemies</div>
          {aliveEnemies.map((e) => {
            const epct = ((e.hp ?? e.maxHp) / (e.maxHp || 1)) * 100;
            const ecolor =
              epct > 60 ? "#22c55e" : epct > 30 ? "#eab308" : "#ef4444";
            return (
              <div key={e.name} style={{ marginBottom: 8 }}>
                <div style={{ marginBottom: 2 }}>{e.name}</div>
                <div
                  style={{
                    height: 6,
                    background: "#1e293b",
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
                <span style={{ fontSize: 11 }}>
                  {e.hp ?? e.maxHp}/{e.maxHp} · {e.mood ?? "hostile"}
                </span>
              </div>
            );
          })}
        </section>
      )}

      {loot.length > 0 && (
        <section>
          <div style={{ color: "#94a3b8", marginBottom: 4 }}>
            On the Ground
          </div>
          <div>{loot.join(", ")}</div>
        </section>
      )}

      <section>
        <div style={{ color: "#94a3b8", marginBottom: 4 }}>Exits</div>
        <div>
          {exits.length ? exits.join(", ") : "None"}
        </div>
      </section>
    </div>
  );
}
