export function generateSceneImage(room, narration) {
  // Strip all special characters before encoding — Pollinations
  // chokes on apostrophes, em dashes, and smart quotes even when encoded
  const clean = (str) => str
    ? str.replace(/[''""—–]/g, " ").replace(/[^\w\s,.:!?]/g, "").trim()
    : "";

  const prompt = [
    "dark fantasy dungeon",
    "neon indigo and purple lighting",
    "cinematic moody atmosphere",
    "detailed environment",
    clean(room.name),
    clean(room.desc).slice(0, 80),
    clean(narration).slice(0, 60),
  ].filter(Boolean).join(", ");

  const seed = Math.floor(Math.random() * 999999);
  const encoded = encodeURIComponent(prompt);

  return `https://image.pollinations.ai/prompt/${encoded}?width=768&height=432&seed=${seed}&model=flux&nologo=true&enhance=true`;
}