export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  const hfKey = process.env.HF_KEY;
  if (!hfKey) return res.status(500).json({ error: 'HF_KEY not set' });

  try {
    const r = await fetch(
      'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          num_inference_steps: 4,
          width: 768,
          height: 432,
          response_format: 'b64_json',
        }),
      }
    );

    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).json({ error: err });
    }

    const data = await r.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return res.status(500).json({ error: 'No image in response' });

    const buffer = Buffer.from(b64, 'base64');
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).send(buffer);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}