import { useEffect, useState } from "react";

export function SceneViewer({ imageSrc, isThinking, isTakingDamage, isDead, isWon }) {
  const [displayed, setDisplayed] = useState(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!imageSrc || imageSrc === displayed) return;
    setFading(true);
    const t = setTimeout(() => {
      setDisplayed(imageSrc);
      setFading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [imageSrc]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: 220,
      borderRadius: 8,
      overflow: "hidden",
      background: "#080810",
      marginBottom: 12,
      border: "1px solid #1e1e35",
    }}>
      {/* Scene image */}
      {displayed && (
// Find the <img> tag and add onError:
        <img
          src={displayed}
          alt="dungeon scene"
          onError={() => setDisplayed(null)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: fading ? 0 : 1,
            transition: "opacity 0.4s ease-in",
            display: "block",
          }}
        />
      )}

      {/* Placeholder when no image yet */}
      {!displayed && (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#2a2a50", fontSize: 11, fontFamily: "'Space Mono', monospace",
          letterSpacing: 4,
        }}>
          // SCENE_LOADING
        </div>
      )}

      {/* Thinking shimmer overlay */}
      {isThinking && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(64,64,255,0.08) 50%, transparent 100%)",
          animation: "shimmer 1.5s infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* Damage vignette */}
      {isTakingDamage && (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(255,34,68,0.6) 100%)",
          animation: "damage-flash 0.3s ease-out forwards",
          pointerEvents: "none",
        }} />
      )}

      {/* Death overlay */}
      {isDead && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(20,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#ff2244", fontFamily: "'Space Mono', monospace",
          fontSize: 11, letterSpacing: 4,
        }}>
          // CONNECTION_LOST
        </div>
      )}

      {/* Win overlay */}
      {isWon && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,20,10,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#00ff88", fontFamily: "'Space Mono', monospace",
          fontSize: 11, letterSpacing: 4,
          animation: "win-pulse 2s ease-in-out infinite",
        }}>
          // DUNGEON_CONQUERED
        </div>
      )}

      {/* Scanline overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
      }} />
    </div>
  );
}
