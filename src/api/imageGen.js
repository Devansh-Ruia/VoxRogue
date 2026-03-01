export async function generateSceneImage(room, narration) {
  // Keep prompt very short — Pollinations fails on long URLs
  const parts = [
    "dark fantasy dungeon",
    "neon purple lighting",
    "cinematic",
    room.name.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 30),
  ];
  if (narration) {
    // Take only first 6 words of narration
    const words = narration.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").slice(0, 6).join(" ");
    if (words) parts.push(words);
  }

  const prompt = encodeURIComponent(parts.join(", "));
  const seed   = Math.floor(Math.random() * 99999);
  const url    = `https://image.pollinations.ai/prompt/${prompt}?width=768&height=432&seed=${seed}&nologo=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}