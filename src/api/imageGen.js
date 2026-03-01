export async function generateSceneImage(room, narration) {
  const prompt = encodeURIComponent(
    `dark fantasy dungeon scene, neon indigo lighting, cinematic, moody, pixel art inspired. ` +
    `${room.name}: ${room.desc} ` +
    `${narration ? narration.slice(0, 100) : ''}`
  );

  // Pollinations returns the image directly as a URL — no key needed
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=768&height=432&seed=${seed}&model=flux&nologo=true`;

  // Return the URL directly — no fetch needed,  handles it
  return url;
}