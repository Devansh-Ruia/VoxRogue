export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  const seed = Math.floor(Math.random() * 99999);
  const encoded = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=432&seed=${seed}&nologo=true`;

  try {
    const r = await fetch(url, {
      headers: {
        // Identify as a server request, not a browser
        'User-Agent': 'VoxRogue/1.0',
        'Accept': 'image/*',
      }
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: `Pollinations error ${r.status}` });
    }

    const buffer = await r.arrayBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}