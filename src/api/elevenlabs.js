const ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB";

/**
 * Speak text via ElevenLabs TTS or Web Speech fallback.
 * Fire-and-forget — do not await from game loop.
 */
export async function speak(text, apiKey, voiceOn) {
  if (!voiceOn || !text?.trim()) return;
  console.log("[ElevenLabs] speaking:", text.slice(0, 40));
  try {
    if (apiKey) {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim(), voiceId: ELEVENLABS_VOICE_ID }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `TTS API error ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
    } else {
      const u = new SpeechSynthesisUtterance(text.trim());
      u.rate = 0.85;
      u.pitch = 0.75;
      window.speechSynthesis.speak(u);
    }
  } catch (_) {
    try {
      const u = new SpeechSynthesisUtterance(text.trim());
      u.rate = 0.85;
      u.pitch = 0.75;
      window.speechSynthesis.speak(u);
    } catch (__) {}
  }
}
