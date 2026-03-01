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
        background: "#0f0f0f",
        border: "1px solid #333",
        borderRadius: 4,
        fontFamily: "Courier New, monospace",
        fontSize: 14,
      }}
    >
      {log.map((entry, i) => (
        <div
          key={i}
          style={{
            marginBottom: 8,
            color: logColors?.[entry.type] ?? "#e2e8f0",
            borderLeft:
              entry.type === "narrator"
                ? "2px solid #451a03"
                : "2px solid transparent",
            paddingLeft: entry.type === "narrator" ? 8 : 0,
          }}
        >
          {entry.text}
        </div>
      ))}
      {isThinking && (
        <div
          style={{
            color: "#94a3b8",
            fontStyle: "italic",
            animation: "pulse 1.2s ease-in-out infinite",
          }}
        >
          The dungeon master considers your fate...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
