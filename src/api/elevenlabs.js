const ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB";
const ELEVENLABS_MODEL = "eleven_monolingual_v1";

/**
 * Speak text via ElevenLabs TTS or Web Speech fallback.
 * Fire-and-forget — do not await from game loop.
 */
export async function speak(text, apiKey, voiceOn) {
  if (!voiceOn || !text?.trim()) return;
  console.log("[ElevenLabs] speaking:", text.slice(0, 40));
  try {
    if (apiKey) {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
            Accept: "audio/mpeg",
          },
          body: JSON.stringify({
            text: text.trim(),
            model_id: ELEVENLABS_MODEL,
            voice_settings: { stability: 0.4, similarity_boost: 0.8 },
          }),
        }
      );
      if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
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
