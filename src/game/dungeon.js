
const BIOMES = [
  {
    name: "Catacombs",
    description: "cold, damp, bones",
    rooms: [
      {
        name: "Bone Corridor",
        icon: "🦴",
        desc: "A chill wind whispers through this narrow passage, carrying the scent of dust and forgotten prayers.",
        enemies: [{ name: "Skeleton Warrior", hp: 20, maxHp: 20, mood: "hostile" }],
        loot: [],
      },
      {
        name: "Crypt Antechamber",
        icon: "🕯️",
        desc: "An eerie silence hangs heavy here, broken only by the drip of unseen water. A perfect place for introspection, or ambush.",
        enemies: [{ name: "Plague Rat", hp: 8, maxHp: 8, mood: "hostile" }],
        loot: [],
      },
      {
        name: "The Ossuary",
        icon: "💀",
        desc: "Walls lined with the neatly stacked remains of countless unfortunate souls. A testament to mortality, or perhaps, poor architectural planning.",
        enemies: [{ name: "Crypt Guardian", hp: 35, maxHp: 35, mood: "hostile" }],
        loot: ["gold pouch"],
      },
      {
        name: "Flooded Passage",
        icon: "🌊",
        desc: "Waterlogged and treacherous, each step through this murky torrent is a gamble. One can only hope the unseen depths hold no unpleasant surprises.",
        enemies: [{ name: "Plague Rat", hp: 8, maxHp: 8, mood: "hostile" }],
        loot: [],
      },
      {
        name: "Gravedigger's Rest",
        icon: "🪦",
        desc: "A small, desolate alcove, filled with discarded tools and the faint, metallic tang of disturbed earth. Even death's laborers need a break, it seems.",
        enemies: [{ name: "Grave Robber", hp: 18, maxHp: 18, mood: "suspicious" }],
        loot: ["health potion"],
      },
      {
        name: "The Sarcophagus Hall",
        icon: "⚰️",
        desc: "Ancient sarcophagi line this grand chamber, their lids heavy with untold secrets and questionable interior design choices. Something stirs within.",
        enemies: [{ name: "Crypt Guardian", hp: 35, maxHp: 35, mood: "hostile" }],
        loot: ["rusty key"],
      },
    ],
  },
  {
    name: "Fungal Caverns",
    description: "bioluminescent, strange, damp",
    rooms: [
      {
        name: "Spore Chamber",
        icon: "🍄",
        desc: "The air here is thick with glowing spores, each breath a delicate dance with unseen flora. Best not to sneeze.",
        enemies: [{ name: "Spore Zombie", hp: 25, maxHp: 25, mood: "hostile" }],
        loot: [],
      },
      {
        name: "Mycelium Hall",
        icon: "🕸️",
        desc: "Intricate networks of glowing mycelium adorn the walls and ceiling, a natural tapestry of decay and strange beauty. Watch your step.",
        enemies: [{ name: "Infected Rat", hp: 10, maxHp: 10, mood: "hostile" }],
        loot: [],
      },
      {
        name: "The Rot",
        icon: "🤢",
        desc: "A fetid pool of organic matter, bubbling gently with unseen processes. The stench alone is a weapon, though not a very effective one.",
        enemies: [{ name: "Fungal Hulk", hp: 45, maxHp: 45, mood: "hostile" }],
        loot: ["gold pouch"],
      },
      {
        name: "Glowing Grotto",
        icon: "✨",
        desc: "A small, serene pocket of intense bioluminescence. The beauty is almost enough to distract from the oppressive humidity and lingering sense of dread.",
        enemies: [{ name: "Infected Rat", hp: 10, maxHp: 10, mood: "hostile" }],
        loot: [],
      },
      {
        name: "Mushroom Throne",
        icon: "👑",
        desc: "A colossal fungal growth dominates this chamber, vaguely resembling a grotesque throne. One wonders who, or what, would dare to sit upon it.",
        enemies: [{ name: "Myconid Scout", hp: 12, maxHp: 12, mood: "suspicious" }],
        loot: ["greater health potion"],
      },
      {
        name: "The Deep Root",
        icon: "🌳",
        desc: "Massive, ancient roots pierce the cavern floor, humming with an almost imperceptible energy. This place feels far older than time itself, and less welcoming.",
        enemies: [{ name: "Fungal Hulk", hp: 45, maxHp: 45, mood: "hostile" }],
        loot: ["shortsword"],
      },
    ],
  },
  {
    name: "Lich's Sanctum",
    description: "arcane, cold, deliberately intimidating",
    rooms: [
      {
        name: "Arcane Antechamber",
        icon: "🔮",
        desc: "The air crackles with latent magic, and ancient runes glow faintly on the polished stone walls. A less discerning visitor might call it 'cozy'.",
        enemies: [{ name: "Bound Specter", hp: 30, maxHp: 30, mood: "hostile" }],
        loot: [],
      },
      {
        name: "The Scriptorium",
        icon: "📜",
        desc: "Shelves groan under the weight of forbidden tomes and forgotten lore. The whispers here are not of pages turning, but of madness slowly seeping in.",
        enemies: [{ name: "Lich Acolyte", hp: 22, maxHp: 22, mood: "suspicious" }],
        loot: [],
      },
      {
        name: "Soul Forge",
        icon: "🔥",
        desc: "Eerie green flames dance within a massive forge, fueled by unseen energies and, presumably, bad life choices. The air thrums with dark power.",
        enemies: [{ name: "Arcane Sentinel", hp: 40, maxHp: 40, mood: "hostile" }],
        loot: ["war axe"],
      },
      {
        name: "Mirror Hall",
        icon: "🪞",
        desc: "A disorienting expanse of polished obsidian, reflecting endless, distorted versions of yourself. One wonders if they are all equally disappointed.",
        enemies: [{ name: "Bound Specter", hp: 30, maxHp: 30, mood: "hostile" }],
        loot: [],
      },
      {
        name: "The Inner Sanctum",
        icon: "✨",
        desc: "This chamber hums with an almost unbearable necrotic energy. The air is thick with anticipation, and perhaps a faint smell of ozone and existential dread.",
        enemies: [{ name: "Lich Acolyte", hp: 22, maxHp: 22, mood: "suspicious" }],
        loot: [],
      },
      {
        name: "Throne of Ash",
        icon: "👑",
        desc: "A skeletal figure, adorned in tattered regalia, sits upon a throne carved from what appears to be pure despair. This is it. The grand finale of your poor decisions.",
        enemies: [{ name: "The Lich King", hp: 80, maxHp: 80, mood: "hostile" }],
        loot: ["enchanted blade"],
      },
    ],
  },
];

const WEAPONS = {
  "rusty dagger": { damage: [8, 15] },
  "shortsword": { damage: [12, 20] },
  "war axe": { damage: [18, 28] },
  "enchanted blade": { damage: [22, 35] },
};

const CONSUMABLES = {
  "health potion": { effect: "restore_hp", value: 30 },
  "greater health potion": { effect: "restore_hp", value: 60 },
  "antidote": { effect: "cure_poison" },
  "torch": { effect: "flavour" },
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateDungeon(biomeIndex) {
  const biome = BIOMES[biomeIndex];
  if (!biome) throw new Error("Invalid biome index");

  let rooms = JSON.parse(JSON.stringify(biome.rooms)); // Deep copy to avoid modifying original
  shuffle(rooms);

  // Ensure first room has no enemies
  rooms[0].enemies = [];

  // Ensure last room contains the boss (Lich King for Biome 3, or a strong enemy for others)
  const bossRoom = rooms.pop(); // Take last room
  // If it's Biome 3, ensure The Lich King is in the last room
  if (biomeIndex === 2) {
    const lichKingRoom = biome.rooms.find(r => r.enemies.some(e => e.name === "The Lich King"));
    if (lichKingRoom) {
      // Replace the boss room with the actual Lich King room, ensuring its enemies are present
      rooms.push(JSON.parse(JSON.stringify(lichKingRoom)));
    } else {
      // Fallback if Lich King room somehow not found in biome definition
      rooms.push(bossRoom);
    }
  } else {
    // For other biomes, ensure the last room has at least one enemy if it's empty
    if (bossRoom.enemies.length === 0 && biome.rooms.some(r => r.enemies.length > 0)) {
        // Find a random room from the original biome that has enemies and use its enemies for the boss room
        const roomWithEnemies = biome.rooms.find(r => r.enemies.length > 0);
        if (roomWithEnemies) {
            bossRoom.enemies = JSON.parse(JSON.stringify(roomWithEnemies.enemies));
        }
    }
    rooms.push(bossRoom);
  }


  // Assign IDs and generate linear connections with some branching
  for (let i = 0; i < rooms.length; i++) {
    rooms[i].id = i;
    rooms[i].exits = {};

    // Main linear connection (north/south or east/west)
    if (i < rooms.length - 1) {
      const direction = Math.random() < 0.5 ? "north" : "east"; // Randomize main direction
      rooms[i].exits[direction] = i + 1;
    }

    // Add 1-2 optional branches (avoid connecting back to previous rooms directly)
    const potentialBranches = rooms.filter(r => r.id !== i && r.id !== i - 1 && !Object.values(rooms[i].exits).includes(r.id));
    shuffle(potentialBranches);

    const numBranches = Math.floor(Math.random() * 2); // 0 or 1 optional branch
    for (let j = 0; j < numBranches && j < potentialBranches.length; j++) {
      const branchRoom = potentialBranches[j];
      const branchDirection = ["south", "west", "north", "east"].find(d => !rooms[i].exits[d]); // Find an available direction
      if (branchDirection) {
        rooms[i].exits[branchDirection] = branchRoom.id;
      }
    }
  }

  return rooms;
}

export const DUNGEON = generateDungeon(0); // Default to biome 0 for now

const WEAPONS_EXCEPT_ENCHANTED = Object.keys(WEAPONS).filter(w => w !== "enchanted blade");
export const INIT_PLAYER = {
  hp: 100,
  maxHp: 100,
  gold: 10,
  inventory: [WEAPONS_EXCEPT_ENCHANTED[Math.floor(Math.random() * WEAPONS_EXCEPT_ENCHANTED.length)], "torch"],
};