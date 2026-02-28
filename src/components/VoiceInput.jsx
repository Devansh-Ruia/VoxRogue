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
      }}
    >
      {supported && (
        <button
          type="button"
          onClick={isListening ? onStopListening : onStartListening}
          disabled={disabled}
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            border: "1px solid #333",
            background: isListening ? "#7f1d1d" : "#1e293b",
            color: "#e2e8f0",
            fontSize: 20,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? "🔴" : "🎤"}
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

          placeholder="Say or type your action..."
          disabled={disabled}
          style={{
            flex: 1,
            padding: "10px 12px",
            background: "#0f0f0f",
            border: "1px solid #333",
            borderRadius: 6,
            color: "#e2e8f0",
            fontFamily: "Courier New, monospace",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          style={{
            padding: "10px 14px",
            background: "#1e293b",
            border: "1px solid #333",
            borderRadius: 6,
            color: "#e2e8f0",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: 16,
          }}
          title="Submit"
        >
          ↵
        </button>
      </form>
    </div>
  );
}
