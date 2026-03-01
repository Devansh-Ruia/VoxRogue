// must be a plain function, not async
export function generateSceneImage(room, narration) {
  const prompt = encodeURIComponent(
    `dark fantasy dungeon, neon indigo lighting, cinematic, moody, pixel art inspired. ` +
    `${room.name}: ${room.desc} ` +
    `${narration ? narration.slice(0, 100) : ''}`
  );
  const seed = Math.floor(Math.random() * 999999);
  return `https://image.pollinations.ai/prompt/${prompt}?width=768&height=432&seed=${seed}&model=flux&nologo=true`;
}