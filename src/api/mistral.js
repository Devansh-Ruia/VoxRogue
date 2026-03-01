const GAME_TOOLS = [
  {
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
  },
];

function buildSystemPrompt(room, player) {
  const exitsStr = room.exits
    ? Object.keys(room.exits).join(", ")
    : "none";
  const enemiesStr =
    room.enemies?.length > 0
      ? room.enemies
          .filter((e) => (e.hp ?? e.maxHp) > 0)
          .map(
            (e) =>
              `${e.name} (hp:${e.hp ?? e.maxHp}/${e.maxHp}, mood:${e.mood ?? "hostile"})`
          )
          .join("; ") || "none"
      : "none";
  const lootStr =
    room.loot?.length > 0 ? room.loot.join(", ") : "none";
  const invStr =
    player.inventory?.length > 0 ? player.inventory.join(", ") : "none";

  return `You are the sardonic dungeon master of VoxRogue. Always call perform_game_action.

Room: ${room.name} — ${room.desc}
Exits: ${exitsStr}
Enemies: ${enemiesStr}
Loot: ${lootStr}
Player HP: ${player.hp ?? player.maxHp}/${player.maxHp} | Gold: ${player.gold ?? 0}
Inventory: ${invStr}

Rules:
- Rusty dagger: 8–15 damage. Enemies retaliate for 5–12 damage.
- Negotiation only works on mood:suspicious enemies.
- Movement only valid in listed exits.
- Pick up only items present in loot list.
- Health potion: restores 30 HP, max 100.
- Narration: 2–3 sentences, sardonic, specific to this room and enemy. Grudging acknowledgment is the ceiling of praise.`;
}

/**
 * Call Mistral game master. Returns parsed tool call result or throws.
 */
export async function callGameMaster(playerSpeech, room, player) {
  const systemPrompt = buildSystemPrompt(room, player);
  const messages = [
    { role: "user", content: playerSpeech },
  ];

  const res = await fetch("/api/game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, systemPrompt }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `API error ${res.status}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];
  const toolCalls = choice?.message?.tool_calls;
  if (!toolCalls?.length) throw new Error("No tool call in response");
  const argsStr = toolCalls[0].function?.arguments;
  if (!argsStr) throw new Error("Empty tool arguments");
  let parsed;
  try {
    parsed = JSON.parse(argsStr);
  } catch {
    throw new Error("Game master returned an unreadable response. Try again.");
  }
  return {
    action_type: parsed.action_type,
    target: parsed.target,
    method: parsed.method,
    narration: parsed.narration ?? "",
    outcome: parsed.outcome ?? {},
  };
}
