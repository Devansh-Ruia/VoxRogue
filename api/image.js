export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const togetherKey = process.env.TOGETHER_KEY;
  if (!togetherKey) return res.status(500).json({ error: 'TOGETHER_KEY not set' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  try {
    const r = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell-Free',
        prompt,
        width: 768,
        height: 432,
        steps: 4,
        n: 1,
        response_format: 'b64_json',
      }),
    });
    const data = await r.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return res.status(500).json({ error: 'No image returned' });
    return res.status(200).json({ image: `data:image/jpeg;base64,${b64}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
