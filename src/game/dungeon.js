export const DUNGEON = [
  {
    id: 0,
    name: "Entrance Hall",
    icon: "🚪",
    desc: "Damp stone, flickering torches, and the unmistakable stench of bad decisions.",
    enemies: [{ name: "Goblin Scout", hp: 15, maxHp: 15, mood: "hostile" }],
    loot: ["iron key"],
    exits: { north: 1 },
  },
  {
    id: 1,
    name: "Guard Room",
    icon: "⚔️",
    desc: "Overturned tables and loaded dice. Someone's last hand was interrupted.",
    enemies: [{ name: "Orc Guard", hp: 30, maxHp: 30, mood: "suspicious" }],
    loot: ["health potion", "gold pouch"],
    exits: { south: 0, east: 2 },
  },
  {
    id: 2,
    name: "The Treasury",
    icon: "💎",
    desc: "Gold catches dusty light. A skeleton guards a chest. Irony is eternal.",
    enemies: [],
    loot: ["ancient artifact", "50 gold coins"],
    exits: { west: 1, north: 3 },
  },
  {
    id: 3,
    name: "The Lich King's Chamber",
    icon: "💀",
    desc: "A skeletal mage enthroned on the failures of everyone who came before you. Cozy.",
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
