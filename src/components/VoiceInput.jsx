import { useEffect, useState } from "react";

const micWaveformBarStyle = (delay) => ({
  position: "absolute",
  bottom: 0,
  width: 2,
  backgroundColor: "#ff2244",
  animation: `waveform-bar 1.5s infinite ease-in-out ${delay * 0.2}s`,
});

export function VoiceInput({
  isListening,
  onStartListening,
  onStopListening,
  onSubmitText,
  supported,
  disabled,
  interimTranscript,
}) {
  const [text, setText] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const t = (isListening ? interimTranscript : text).trim();
    if (t && !disabled) {
      onSubmitText(t);
      setText("");
      if (isListening) onStopListening();
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
            width: isMobile ? 56 : 40,
            height: isMobile ? 56 : 40,
            borderRadius: 8,
            border: `1px solid ${isListening ? "#ff2244" : "#1e1e35"}`,
            background: isListening ? "#200010" : "#0e0e1a",
            color: isListening ? "#ff2244" : "#6060a0",
            fontSize: isMobile ? 12 : 9,
            cursor: disabled ? "not-allowed" : "pointer",
            position: "relative",
            overflow: "hidden",
          }}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening && (
            <>
              <div style={micWaveformBarStyle(0)}></div>
              <div style={micWaveformBarStyle(1)}></div>
              <div style={micWaveformBarStyle(2)}></div>
            </>
          )}
          <span
            style={{
              position: "relative",
              zIndex: 1,
              display: "block",
              lineHeight: 1,
            }}
          >
            {isListening ? "REC" : "MIC"}
          </span>
        </button>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flex: 1, gap: 8, alignItems: "center" }}
      >
        <input
          type="text"
          value={isListening ? interimTranscript : text}
          onChange={(e) => setText(e.target.value)}
          placeholder="// speak or type your action..."
          disabled={disabled}
          style={{
            flex: 1,
            padding: "10px 12px",
            background: "transparent",
            border: "none",
            borderRadius: 6,
            color: isListening && interimTranscript ? "#808080" : "#f0f0ff",
            fontFamily: "inherit",
            fontSize: 14,
            caretColor: "#4040ff",
            fontStyle: isListening && interimTranscript ? "italic" : "normal",
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
