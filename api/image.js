export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  const hfKey = process.env.HF_KEY;
  if (!hfKey) return res.status(500).json({ error: 'HF_KEY not set' });

  try {
    const r = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { width: 768, height: 432, num_inference_steps: 4 },
        }),
      }
    );

    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).json({ error: err });
    }

    const buffer = await r.arrayBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}