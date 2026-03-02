import { useMemo } from "react";

// Deterministic pseudo-random from a seed string
function seededRand(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return () => { h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) | 0; return ((h >>> 0) / 0xffffffff); };
}

function generateScene(roomName, enemies, loot, isDead, isWon) {
  const rand = seededRand(roomName + Date.now());
  const isBoss = roomName.toLowerCase().includes("lich");
  const hasTreasure = loot.length > 0;
  const hasEnemies = enemies.length > 0;

  // Color palette per room type
  const palettes = {
    "Entrance Hall":        { bg: "#05020d", fog: "#1a0a2e", accent: "#4040ff", floor: "#0d0820" },
    "Guard Room":           { bg: "#080500", fog: "#2a1500", accent: "#ff6600", floor: "#120800" },
    "The Treasury":         { bg: "#020805", fog: "#0a2010", accent: "#00ff88", floor: "#051208" },
    "The Lich King's Chamber": { bg: "#080008", fog: "#200020", accent: "#c060ff", floor: "#100010" },
  };
  const p = palettes[roomName] || { bg: "#05020d", fog: "#1a0a2e", accent: "#4040ff", floor: "#0d0820" };

  // Generate stone pillars
  const pillars = Array.from({ length: 4 }, (_, i) => ({
    x: 60 + i * 180,
    height: 120 + rand() * 60,
    width: 24 + rand() * 12,
  }));

  // Generate floor tiles
  const tiles = Array.from({ length: 12 }, (_, i) => ({
    x: (i % 6) * 130 + rand() * 10,
    y: 160 + Math.floor(i / 6) * 30,
    w: 120 + rand() * 20,
  }));

  // Torches
  const torches = [80, 680].map(x => ({ x, flicker: rand() }));

  // Enemy silhouettes
  const enemySils = enemies.slice(0, 2).map((e, i) => ({
    x: 280 + i * 200,
    hp: e.hp / e.maxHp,
    mood: e.mood,
  }));

  return { p, pillars, tiles, torches, enemySils, isBoss, hasTreasure, rand };
}

export function SceneViewer({ roomName = "Entrance Hall", enemies = [], loot = [], isThinking, isTakingDamage, isDead, isWon }) {
  const scene = useMemo(
    () => generateScene(roomName, enemies, loot, isDead, isWon),
    [roomName, enemies.length, loot.length, isDead, isWon]
  );
  const { p, pillars, tiles, torches, enemySils, isBoss, hasTreasure } = scene;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: 220,
      borderRadius: 8,
      overflow: "hidden",
      background: p.bg,
      marginBottom: 12,
      border: `1px solid ${isTakingDamage ? "#ff2244" : "#1e1e35"}`,
      transition: "border-color 0.1s",
      boxShadow: isTakingDamage ? "0 0 20px #ff224444" : "none",
    }}>
      <svg width="100%" height="220" viewBox="0 0 768 220" preserveAspectRatio="xMidYMid slice">

        {/* Background gradient */}
        <defs>
          <radialGradient id="fogGrad" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor={p.fog} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={p.bg} stopOpacity="1"/>
          </radialGradient>
          <radialGradient id="torchLight0" cx="10%" cy="70%" r="30%">
            <stop offset="0%" stopColor={p.accent} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={p.accent} stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="torchLight1" cx="90%" cy="70%" r="30%">
            <stop offset="0%" stopColor={p.accent} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={p.accent} stopOpacity="0"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Sky/ceiling */}
        <rect width="768" height="220" fill={p.bg}/>
        <rect width="768" height="220" fill="url(#fogGrad)"/>
        <rect width="768" height="220" fill="url(#torchLight0)"/>
        <rect width="768" height="220" fill="url(#torchLight1)"/>

        {/* Ceiling arch */}
        <path d="M0,0 Q384,-30 768,0 L768,40 Q384,10 0,40 Z" fill={p.floor} opacity="0.6"/>

        {/* Floor */}
        <rect y="175" width="768" height="45" fill={p.floor}/>
        {tiles.map((t, i) => (
          <rect key={i} x={t.x} y={t.y} width={t.w} height="8"
            fill={p.accent} opacity="0.04" rx="1"/>
        ))}

        {/* Far wall */}
        <rect y="80" width="768" height="100" fill={p.floor} opacity="0.4"/>

        {/* Pillars */}
        {pillars.map((pl, i) => (
          <g key={i}>
            <rect x={pl.x} y={220 - pl.height} width={pl.width} height={pl.height}
              fill={p.floor} stroke={p.accent} strokeWidth="0.5" strokeOpacity="0.3"/>
            <rect x={pl.x - 4} y={220 - pl.height} width={pl.width + 8} height="12"
              fill={p.floor} stroke={p.accent} strokeWidth="0.5" strokeOpacity="0.4"/>
            <rect x={pl.x - 4} y="208" width={pl.width + 8} height="12"
              fill={p.floor} stroke={p.accent} strokeWidth="0.5" strokeOpacity="0.4"/>
          </g>
        ))}

        {/* Torches */}
        {torches.map((t, i) => (
          <g key={i} filter="url(#glow)">
            <rect x={t.x - 2} y="120" width="4" height="20" fill="#8B4513"/>
            <ellipse cx={t.x} cy="118" rx="5" ry="8" fill="#ff6600" opacity="0.9">
              <animate attributeName="ry" values="8;10;7;9;8" dur="0.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.9;0.7;1;0.8;0.9" dur="0.6s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx={t.x} cy="116" rx="3" ry="5" fill="#ffdd00" opacity="0.8">
              <animate attributeName="ry" values="5;7;4;6;5" dur="0.7s" repeatCount="indefinite"/>
            </ellipse>
          </g>
        ))}

        {/* Enemy silhouettes */}
        {enemySils.map((e, i) => (
          <g key={i} opacity={0.5 + e.hp * 0.5}>
            <ellipse cx={e.x} cy="175" rx="18" ry="4" fill={p.accent} opacity="0.2"/>
            <rect x={e.x - 10} y="140" width="20" height="35" rx="3"
              fill={e.mood === "hostile" ? "#ff2244" : "#ffaa00"} opacity="0.15"/>
            <circle cx={e.x} cy="132" r="10"
              fill={e.mood === "hostile" ? "#ff2244" : "#ffaa00"} opacity="0.2"/>
            <circle cx={e.x} cy="132" r="10"
              fill="none" stroke={e.mood === "hostile" ? "#ff2244" : "#ffaa00"}
              strokeWidth="1" opacity="0.4"/>
          </g>
        ))}

        {/* Treasure glow */}
        {hasTreasure && !isDead && (
          <ellipse cx="384" cy="185" rx="40" ry="8" fill="#ffaa00" opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2s" repeatCount="indefinite"/>
          </ellipse>
        )}

        {/* Boss atmosphere */}
        {isBoss && (
          <>
            <ellipse cx="384" cy="100" rx="120" ry="60" fill="#c060ff" opacity="0.06">
              <animate attributeName="opacity" values="0.04;0.1;0.04" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            <line x1="384" y1="0" x2="384" y2="220" stroke="#c060ff" strokeWidth="0.5" opacity="0.1"/>
          </>
        )}

        {/* Thinking shimmer */}
        {isThinking && (
          <rect width="768" height="220" fill="url(#fogGrad)" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.5s" repeatCount="indefinite"/>
          </rect>
        )}

        {/* Damage flash */}
        {isTakingDamage && (
          <rect width="768" height="220" fill="#ff2244" opacity="0.25"/>
        )}

        {/* Death overlay */}
        {isDead && (
          <g>
            <rect width="768" height="220" fill="#000" opacity="0.7"/>
            <text x="384" y="118" textAnchor="middle" fill="#ff2244"
              fontSize="11" fontFamily="'Space Mono', monospace" letterSpacing="4" opacity="0.8">
              // CONNECTION_LOST
            </text>
          </g>
        )}

        {/* Win overlay */}
        {isWon && (
          <g>
            <rect width="768" height="220" fill="#00ff88" opacity="0.08">
              <animate attributeName="opacity" values="0.05;0.12;0.05" dur="2s" repeatCount="indefinite"/>
            </rect>
            <text x="384" y="118" textAnchor="middle" fill="#00ff88"
              fontSize="11" fontFamily="'Space Mono', monospace" letterSpacing="4" opacity="0.8">
              // DUNGEON_CONQUERED
            </text>
          </g>
        )}

        {/* Scanlines */}
        <rect width="768" height="220"
          fill="url(#scanlines)" opacity="0.4"
          style={{backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)"}}/>

        {/* Room name watermark */}
        <text x="12" y="214" fill={p.accent} fontSize="9"
          fontFamily="'Space Mono', monospace" letterSpacing="3" opacity="0.3">
          // {roomName.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}