export async function generateSceneImage(room, action, narration) {
  const stylePrefix = "dark fantasy dungeon, pixel art inspired, neon indigo lighting, cinematic, moody atmosphere —";
  const prompt = `${stylePrefix} ${room.name}: ${room.desc} ${narration ? narration.slice(0, 120) : ''}`;

  try {
    const r = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data.image ?? null;
  } catch {
    return null;
  }
}
