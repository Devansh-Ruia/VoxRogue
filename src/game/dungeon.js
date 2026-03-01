export const DUNGEON = [
  {
    id: 0,
    name: "Entrance Hall",
    icon: "🚪",
    desc: "The stench of damp stone and poor life choices fills the air. Torches flicker, perhaps in judgment.",
    enemies: [{ name: "Goblin Scout", hp: 15, maxHp: 15, mood: "hostile" }],
    loot: ["iron key"],
    exits: { north: 1 },
  },
  {
    id: 1,
    name: "Guard Room",
    icon: "⚔️",
    desc: "Overturned tables and loaded dice speak of a game interrupted. One hopes the interruption was suitably dramatic.",
    enemies: [{ name: "Orc Guard", hp: 30, maxHp: 30, mood: "suspicious" }],
    loot: ["health potion", "gold pouch"],
    exits: { south: 0, east: 2 },
  },
  {
    id: 2,
    name: "The Treasury",
    icon: "💎",
    desc: "Dust motes dance in the gold's reflection. A skeletal guardian, forever employed, gazes upon a chest. How utterly pointless.",
    enemies: [],
    loot: ["ancient artifact", "50 gold coins"],
    exits: { west: 1, north: 3 },
  },
  {
    id: 3,
    name: "The Lich King's Chamber",
    icon: "💀",
    desc: "The Lich King resides here, a bone-deep testament to collective failures. One might even call it a throne of disappointment.",
    enemies: [{ name: "The Lich King", hp: 80, maxHp: 80, mood: "hostile" }],
    loot: ["lich's crown"],
    exits: { south: 2 },
  },
];

export const INIT_PLAYER = {
  hp: 100,
  maxHp: 100,
  gold: 10,
  inventory: ["rusty dagger", "torch"],
};
