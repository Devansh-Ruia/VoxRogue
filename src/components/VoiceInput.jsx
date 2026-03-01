import { useState } from "react";

export function VoiceInput({
  isListening,
  onStartListening,
  onStopListening,
  onSubmitText,
  supported,
  disabled,
}) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    const t = text.trim();
    if (t && !disabled) {
      onSubmitText(t);
      setText("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 0",
        borderTop: "1px solid #1e1e35",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {supported && (
        <button
          type="button"
          onClick={isListening ? onStopListening : onStartListening}
          disabled={disabled}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            border: isListening ? "1px solid #ff2244" : "1px solid #1e1e35",
            background: isListening ? "#200010" : "#0e0e1a",
            color: isListening ? "#ff2244" : "#6060a0",
            fontSize: 9,
            fontFamily: "'Space Mono', 'Courier New', monospace",
            fontWeight: 700,
            cursor: disabled ? "not-allowed" : "pointer",
            ...(isListening && {
              animation: "mic-pulse 1.5s ease-in-out infinite",
            }),
          }}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? "REC" : "MIC"}
        </button>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flex: 1, gap: 8, alignItems: "center" }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="// speak or type your action..."
          disabled={disabled}
          style={{
            flex: 1,
            padding: "10px 12px",
            background: "transparent",
            border: "1px solid #1e1e35",
            borderRadius: 8,
            color: "#f0f0ff",
            fontFamily: "'Space Mono', 'Courier New', monospace",
            fontSize: 14,
            caretColor: "#4040ff",
          }}
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          style={{
            padding: "10px 14px",
            background: "#0e1a10",
            border: "1px solid #00ff88",
            borderRadius: 8,
            color: "#00ff88",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: 14,
            fontFamily: "'Space Mono', 'Courier New', monospace",
            fontWeight: 700,
          }}
          title="Submit"
        >
          RUN
        </button>
      </form>
    </div>
  );
}
