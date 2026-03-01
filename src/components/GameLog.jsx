import { useEffect, useRef } from "react";

export function GameLog({ log, isThinking, logColors }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log, isThinking]);

  const getEntryStyle = (type) => {
    switch (type) {
      case "narrator":
        return {
          borderLeft: "3px solid #ffaa00",
          boxShadow: "0 0 8px #ffaa0044, 0 0 20px #ffaa0022",
          color: "#ffaa00",
        };
      case "combat":
        return {
          borderLeft: "3px solid #ff2244",
          color: "#f0f0ff",
        };
      case "player":
        return {
          borderLeft: "3px solid #4040ff",
          color: "#8888ff",
        };
      case "system":
        return {
          borderLeft: "3px solid #c060ff",
          color: "#9060cc",
        };
      default:
        return {
          borderLeft: "3px solid transparent",
          color: "#f0f0ff",
        };
    }
  };

  return (
    <div
      style={{
        height: 400,
        overflowY: "auto",
        padding: 12,
        background: "transparent",
        fontFamily: "'Space Mono', 'Courier New', monospace",
        fontSize: 14,
      }}
    >
      {log.map((entry, i) => (
        <div
          key={i}
          style={{
            marginBottom: 8,
            paddingLeft: 12,
            animation: "log-entry 0.15s ease-out",
            ...getEntryStyle(entry.type),
          }}
        >
          {entry.text}
        </div>
      ))}
      {isThinking && (
        <div
          style={{
            color: "#2a2a50",
            fontFamily: "'Space Mono', 'Courier New', monospace",
            fontSize: 14,
          }}
        >
          // processing ...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
