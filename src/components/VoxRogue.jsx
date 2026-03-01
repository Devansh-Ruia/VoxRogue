import { useState } from "react";
import { useGame } from "../hooks/useGame";
import { useVoice } from "../hooks/useVoice";
import { GameLog } from "./GameLog";
import { DungeonMap } from "./DungeonMap";
import { StatusPanel } from "./StatusPanel";
import { VoiceInput } from "./VoiceInput";

export function VoxRogue() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [voiceOn, setVoiceOn] = useState(true);

  const {
    player,
    rooms,
    roomIdx,
    visitedRooms,
    log,
    isDead,
    isWon,
    isThinking,
    isTakingDamage,
    processAction,
    resetGame,
    logColors,
  } = useGame();

  const handleSpeech = (speech) => {
    processAction(speech, elevenLabsKey, voiceOn);
  };

  const { isListening, startListening, stopListening, supported } = useVoice(
    handleSpeech,
    (err) => {
      if (err && err !== "aborted") {
        processAction(
          "[Voice error: " + err + ". Use text input.]",
          elevenLabsKey,
          false
        );
      }
    }
  );

  const currentRoom = rooms[roomIdx];
  const disabled = isThinking || isDead || isWon;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 50%, #0d0d22, #080810)",
        color: "#f0f0ff",
        fontFamily: "'Space Mono', 'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          zIndex: 999,
        }}
      ></div>
      <div style={{ width: "100%", maxWidth: 860 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h1 style={{ color: "#f0f0ff", margin: 0, fontSize: 24, letterSpacing: 10, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
            VOXROGUE
          </h1>
          <div style={{ color: "#2a2a50", fontSize: 10 }}>
            // DUNGEON_SYS v0.1 // MISTRAL_ENGINE // VOICE_INPUT_ACTIVE
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen((s) => !s)}
            style={{
              background: "transparent",
              border: "1px solid #333",
              color: "#94a3b8",
              padding: "6px 10px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ⚙️
          </button>
        </header>

        {settingsOpen && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: "#0f0f0f",
              border: "1px solid #333",
              borderRadius: 4,
            }}
          >
            <label style={{ display: "block", marginBottom: 8 }}>
              ElevenLabs API Key (optional):{" "}
              <input
                type="password"
                value={elevenLabsKey}
                onChange={(e) => setElevenLabsKey(e.target.value)}
                placeholder="sk-..."
                style={{
                  marginLeft: 8,
                  padding: "4px 8px",
                  width: 240,
                  background: "#1e293b",
                  border: "1px solid #333",
                  color: "#e2e8f0",
                  borderRadius: 4,
                }}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={voiceOn}
                onChange={(e) => setVoiceOn(e.target.checked)}
              />
              Voice output (TTS)
            </label>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
              Mistral: set VITE_MISTRAL_KEY in .env for the game master.
            </p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 260px",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <GameLog
              log={log}
              isThinking={isThinking}
              logColors={logColors}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <DungeonMap rooms={rooms} roomIdx={roomIdx} visitedRooms={visitedRooms} />
            <StatusPanel player={player} room={currentRoom} />
          </div>
        </div>

        <VoiceInput
          isListening={isListening}
          onStartListening={startListening}
          onStopListening={stopListening}
          onSubmitText={handleSpeech}
          supported={supported}
          disabled={disabled}
        />

        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: "#2a2a50",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: 2,
            lineHeight: 1.6,
          }}
        >
          "attack the goblin" · "reason with the guard" · "pick up the key" ·
          "go north"
        </div>
      </div>

      {isWon && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,8,4,0.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 64,
                color: "#00ff88",
                textShadow: "0 0 40px #00ff8866",
                margin: 0,
              }}
            >
              VICTORY
            </h2>
            <p style={{ color: "#6060a0", fontSize: 14, margin: "10px 0" }}>
              Against all probability, and certainly against all good taste,
              you've won. The dungeon is mildly impressed. Don't let it go to
              your head.
            </p>
            <p style={{ color: "#00b4ff", fontSize: 14 }}>
              Final HP: {player.hp}/{player.maxHp} · Gold: {player.gold}
            </p>
            <button
              type="button"
              onClick={resetGame}
              style={{
                marginTop: 20,
                border: "1px solid #00ff88",
                color: "#00ff88",
                background: "transparent",
                borderRadius: 6,
                padding: "8px 24px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 16,
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {isDead && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#100a0a",
              border: "2px solid #ff2244",
              borderRadius: 8,
              padding: 32,
              maxWidth: 420,
              textAlign: "center",
              boxShadow: "0 0 20px #ff224444",
            }}
          >
            <h2 style={{ color: "#ff2244", marginTop: 0, fontSize: 28 }}>
              // SYSTEM OVERLOAD //
            </h2>
            <p style={{ fontStyle: "italic", color: "#f0f0ff" }}>
              The dungeon accepts your demise with grim satisfaction. Your futile struggles, now merely echoes. Perhaps next time, a slightly less embarrassing end.
            </p>
            <button
              type="button"
              onClick={resetGame}
              style={{
                marginTop: 16,
                padding: "10px 20px",
                background: "#1f0a0a",
                border: "1px solid #ff2244",
                color: "#ff2244",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              // RESTART
            </button>
          </div>
        </div>
      )}

      {isTakingDamage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 999,
            animation: "damage-flash 0.3s ease-out",
          }}
        ></div>
      )}
    </div>
  );
}
