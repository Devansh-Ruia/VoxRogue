import { useEffect, useRef } from "react";

export function GameLog({ log, isThinking, logColors }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log, isThinking]);

  return (
    <div
      style={{
        height: 400,
        overflowY: "auto",
        padding: 12,
        background: "transparent",
        border: "none",
        borderRadius: 0,
        fontFamily: "'Space Mono', monospace",
        fontSize: 14,
      }}
    >
      {log.map((entry, i) => (
        <div
          key={i}
          style={{
            marginBottom: 8,
            paddingLeft: 12,
            borderLeft: `3px solid ${
              entry.type === "narrator"
                ? "#ffaa00"
                : entry.type === "combat"
                ? "#ff2244"
                : entry.type === "player"
                ? "#4040ff"
                : entry.type === "system"
                ? "#c060ff"
                : "transparent"
            }`,
            color:
              entry.type === "player"
                ? "#8888ff"
                : entry.type === "system"
                ? "#9060cc"
                : entry.type === "narrator"
                ? "#ffaa00"
                : "#f0f0ff",
            boxShadow:
              entry.type === "narrator"
                ? "0 0 8px #ffaa0044, 0 0 20px #ffaa0022"
                : "none",
            animation: "log-entry 0.15s ease-out",
          }}
        >
          {entry.text}
        </div>
      ))}
      {isThinking && (
        <div
          style={{
            color: "#2a2a50",
            fontStyle: "normal",
            animation: "pulse 1.2s ease-in-out infinite",
          }}
        >
          // processing <span style={{ animation: "dot-blink 1s infinite step-end" }}>...</span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
