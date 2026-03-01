const ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Keep this hardcoded for the specific narrator voice

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const elevenLabsKey = process.env.ELEVENLABS_KEY;
  if (!elevenLabsKey) {
    return res.status(500).json({ error: 'ElevenLabs API key not configured on server.' });
  }

  const { text, voiceId } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  try {
    const elevenLabsRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": elevenLabsKey,
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.4, similarity_boost: 0.8 },
        }),
      }
    );

    if (!elevenLabsRes.ok) {
      const errText = await elevenLabsRes.text();
      return res.status(elevenLabsRes.status).json({ error: `ElevenLabs API error: ${errText}` });
    }

    const audioBuffer = await elevenLabsRes.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');
    return res.status(200).send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('ElevenLabs API call failed:', error);
    return res.status(500).json({ error: 'Internal server error during ElevenLabs API call.' });
  }
}
