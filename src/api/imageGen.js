export async function generateSceneImage(room, narration) {
  const parts = [
    "dark fantasy dungeon",
    "neon purple lighting",
    "cinematic",
    room.name.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 30),
  ];
  if (narration) {
    const words = narration.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").slice(0, 6).join(" ");
    if (words) parts.push(words);
  }

  const prompt = parts.join(", ");

  try {
    const res = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}