import React, { useState, useEffect } from "react";
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
    processAction,
    resetGame,
    logColors,
    isTakingDamage,
    turnCount,
  } = useGame();

  const handleSpeech = (speech) => {
    processAction(speech, elevenLabsKey, voiceOn);
  };

  const { isListening, startListening, stopListening, supported, finalTranscript, clearFinalTranscript } = useVoice();
  useEffect(() => {
    if (finalTranscript) {
      processAction(finalTranscript, elevenLabsKey, voiceOn);
      clearFinalTranscript();
    }
  }, [finalTranscript]); // eslint-disable-line

  const currentRoom = rooms[roomIdx];
  const disabled = isThinking || isDead || isWon;
  return (
    <React.Fragment>
      {/* Scanline overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          zIndex: 1,
        }}
      />
      
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
          position: "relative",
          zIndex: 0,
        }}
      >
      <div style={{ width: "100%", maxWidth: 860 }}>
        <header
          style={{
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <h1 style={{ 
            color: "#f0f0ff", 
            margin: 0, 
            fontSize: 32, 
            fontFamily: "'Space Mono', 'Courier New', monospace",
            fontWeight: 700,
            letterSpacing: "10px",
            marginBottom: 8,
          }}>
            VOXROGUE
          </h1>
          <div style={{
            color: "#2a2a50",
            fontSize: 10,
            fontFamily: "'Space Mono', 'Courier New', monospace",
            letterSpacing: "2px",
          }}>
            // DUNGEON_SYS v0.1 // MISTRAL_ENGINE // VOICE_INPUT_ACTIVE
          </div>
        </header>

        {settingsOpen && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: "#0e0e1a",
              border: "1px solid #1e1e35",
              borderRadius: 8,
            }}
          >
            <label style={{ display: "block", marginBottom: 8, color: "#6060a0", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
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
                  background: "#080810",
                  border: "1px solid #1e1e35",
                  color: "#f0f0ff",
                  borderRadius: 4,
                  fontFamily: "'Space Mono', 'Courier New', monospace",
                }}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#6060a0", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
              <input
                type="checkbox"
                checked={voiceOn}
                onChange={(e) => setVoiceOn(e.target.checked)}
              />
              Voice output (TTS)
            </label>
            <p style={{ fontSize: 12, color: "#2a2a50", marginTop: 8, fontFamily: "'Space Mono', 'Courier New', monospace" }}>
              Mistral: set VITE_MISTRAL_KEY in .env for game master.
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
              key={turnCount}
              roomName={currentRoom?.name}
              enemies={currentRoom?.enemies || []}
              loot={currentRoom?.loot || []}
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
            color: "#6060a0",
            fontFamily: "'Space Mono', 'Courier New', monospace",
          }}
        >
          "attack goblin" · "reason with guard" · "pick up key" ·
          "go north"
        </div>
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
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#0e1a10",
              border: "2px solid #00ff88",
              borderRadius: 8,
              padding: 32,
              maxWidth: 420,
              textAlign: "center",
            }}
          >
            <h2 style={{ 
              color: "#00ff88", 
              marginTop: 0,
              fontSize: 64,
              fontFamily: "'Space Mono', 'Courier New', monospace",
              fontWeight: 700,
              textShadow: "0 0 20px #00ff88, 0 0 40px #00ff8844",
            }}>
              VICTORY
            </h2>
            <p style={{ color: "#6060a0", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
              Final HP: {player.hp}/{player.maxHp} · Gold: {player.gold}
            </p>
            <p style={{ fontStyle: "italic", color: "#f0f0ff", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
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
                background: "#0e1a10",
                border: "1px solid #00ff88",
                color: "#00ff88",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'Space Mono', 'Courier New', monospace",
                fontWeight: 700,
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
            background: "rgba(8,0,16,0.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#0e0010",
              border: "2px solid #ff2244",
              borderRadius: 8,
              padding: 32,
              maxWidth: 420,
              textAlign: "center",
            }}
          >
            <h2 style={{ 
              color: "#ff2244", 
              marginTop: 0,
              fontSize: 80,
              fontFamily: "'Space Mono', 'Courier New', monospace",
              fontWeight: 700,
              textShadow: "0 0 20px #ff2244, 0 0 40px #ff224444",
            }}>
              DEAD
            </h2>
            <p style={{ fontStyle: "italic", color: "#f0f0ff", fontFamily: "'Space Mono', 'Courier New', monospace" }}>
              The dungeon adds your bones to its extensive collection. You
              were, at minimum, memorable. Mostly as a cautionary tale.
            </p>
            <button
              type="button"
              onClick={resetGame}
              style={{
                marginTop: 16,
                padding: "10px 20px",
                background: "#0e0010",
                border: "1px solid #ff2244",
                color: "#ff2244",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'Space Mono', 'Courier New', monospace",
                fontWeight: 700,
              }}
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
