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
        opacity: disabled ? 0.6 : 1,
        borderTop: "1px solid #1e1e35",
        fontFamily: "'Space Mono', monospace",
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
            border: `1px solid ${isListening ? "#ff2244" : "#1e1e35"}`,
            background: isListening ? "#200010" : "#0e0e1a",
            color: isListening ? "#ff2244" : "#6060a0",
            fontSize: 9,
            cursor: disabled ? "not-allowed" : "pointer",
            animation: isListening ? "mic-pulse 1.5s infinite" : "none",
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
          placeholder="// speak or type your action..."
          disabled={disabled}
          style={{
            flex: 1,
            padding: "10px 12px",
            background: "transparent",
            border: "none",
            borderRadius: 6,
            color: "#f0f0ff",
            fontFamily: "inherit",
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
            borderRadius: 6,
            color: "#00ff88",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: 16,
            fontFamily: "inherit",
          }}
          title="Submit"
        >
          RUN
        </button>
      </form>
    </div>
  );
}
