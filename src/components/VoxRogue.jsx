import { useState } from "react";
import { useGame } from "../hooks/useGame";
import { useVoice } from "../hooks/useVoice";
import { GameLog } from "./GameLog";
import { DungeonMap } from "./DungeonMap";
import { StatusPanel } from "./StatusPanel";
import { VoiceInput } from "./VoiceInput";
import { SceneViewer } from "./SceneViewer";

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
    sceneImage,
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
  const isTakingDamage = false; // TODO: implement damage detection logic

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#e2e8f0",
        fontFamily: "'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 860 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h1 style={{ color: "#fde68a", margin: 0, fontSize: 24 }}>
            ⚔️ VOXROGUE
          </h1>
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
            <SceneViewer
              imageSrc={sceneImage}
              isThinking={isThinking}
              isTakingDamage={isTakingDamage}
              isDead={isDead}
              isWon={isWon}
            />
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
            color: "#64748b",
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
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#0a0f0a",
              border: "2px solid #14532d",
              borderRadius: 8,
              padding: 32,
              maxWidth: 420,
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#fde68a", marginTop: 0 }}>
              ☠️ THE DUNGEON IS CONQUERED
            </h2>
            <p style={{ color: "#94a3b8" }}>
              Final HP: {player.hp}/{player.maxHp} · Gold: {player.gold}
            </p>
            <p style={{ fontStyle: "italic", color: "#e2e8f0" }}>
              Against all probability, and certainly against all good taste,
              you've won. The dungeon is mildly impressed. Don't let it go to
              your head.
            </p>
            <button
              type="button"
              onClick={resetGame}
              style={{
                marginTop: 16,
                padding: "10px 20px",
                background: "#14532d",
                border: "1px solid #166534",
                color: "#e2e8f0",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Play Again
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
              background: "#0f0a0a",
              border: "2px solid #7f1d1d",
              borderRadius: 8,
              padding: 32,
              maxWidth: 420,
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#f87171", marginTop: 0 }}>
              ☠️ YOU HAVE DIED
            </h2>
            <p style={{ fontStyle: "italic", color: "#e2e8f0" }}>
              The dungeon adds your bones to its extensive collection. You
              were, at minimum, memorable. Mostly as a cautionary tale.
            </p>
            <button
              type="button"
              onClick={resetGame}
              style={{
                marginTop: 16,
                padding: "10px 20px",
                background: "#7f1d1d",
                border: "1px solid #991b1b",
                color: "#e2e8f0",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
