const rateLimit = new Map();
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!rateLimit.has(clientIp)) {
    rateLimit.set(clientIp, []);
  }

  const requests = rateLimit.get(clientIp);
  const now = Date.now();

  // Remove expired requests
  while (requests.length > 0 && requests[0] < now - WINDOW_SIZE_MS) {
    requests.shift();
  }

  if (requests.length >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  requests.push(now);

  const mistralKey = process.env.MISTRAL_KEY;
  if (!mistralKey) {
    return res.status(500).json({ error: 'Mistral API key not configured on server.' });
  }

  const { messages, systemPrompt } = req.body;

  try {
    const mistralRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mistralKey}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        tool_choice: "any",
        tools: [{
          type: "function",
          function: {
            name: "perform_game_action",
            description:
              "Parse the player's spoken intent and execute a dungeon action",
            parameters: {
              type: "object",
              required: ["action_type", "narration", "outcome"],
              properties: {
                action_type: {
                  type: "string",
                  enum: [
                    "attack",
                    "negotiate",
                    "flee",
                    "inspect",
                    "pick_up",
                    "use_item",
                    "move",
                    "wait",
                  ],
                },
                target: { type: "string" },
                method: { type: "string" },
                narration: {
                  type: "string",
                  description:
                    "2-3 sentences of sardonic dungeon master narration. Reference the specific room and enemy. Never cheer the player on.",
                },
                outcome: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    damage_dealt: { type: "number" },
                    damage_taken: { type: "number" },
                    enemy_defeated: { type: "boolean" },
                    item_obtained: { type: "string" },
                    direction_moved: { type: "string" },
                    mood_changed_to: { type: "string" },
                  },
                },
              },
            },
          },
        }],
        max_tokens: 500,
      }),
    });

    if (!mistralRes.ok) {
      const errText = await mistralRes.text();
      return res.status(mistralRes.status).json({ error: `Mistral API error: ${errText}` });
    }

    const data = await mistralRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Mistral API call failed:', error);
    return res.status(500).json({ error: 'Internal server error during Mistral API call.' });
  }
}
