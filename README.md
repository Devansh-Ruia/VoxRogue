# VoxRogue

A **voice-native dungeon crawler** where your spoken words drive the game. Tell the dungeon master what you want to do—attack, negotiate, pick up items, move—and the LLM turns your intent into mechanical game state via function calling.

Built for hackathon demos (Mistral SF prize, Supercell Best Video Game). Optimized for **demo reliability** over feature breadth.

---

## Tech Stack

- **React 18** (Vite)
- **Mistral API** (`mistral-large-latest`) — OpenAI-style function calling for the game master
- **Web Speech API** — voice input
- **ElevenLabs TTS** — voice output, with Web Speech API fallback
- **State** — React `useState` / `useReducer` only (no persistence, no external store)

---

## Quick Start

1. **Clone and install**
   ```bash
   git clone https://github.com/Devansh-Ruia/VoxRogue.git
   cd VoxRogue
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - Set `VITE_MISTRAL_KEY` (required for play)
   - Optionally set `VITE_ELEVENLABS_KEY` for TTS; otherwise the app uses browser speech synthesis

3. **Run**
   ```bash
   npm run dev
   ```
   Open the URL shown (e.g. http://localhost:5173).

4. **Play**
   - Use the mic or type in the input bar
   - Examples: *"attack the goblin"*, *"go north"*, *"pick up the key"*, *"reason with the orc"*

---

## Demo Arc

Recommended path to show off the game:

1. **Entrance Hall** — *"attack the goblin with my dagger"* (repeat until defeated)
2. *"go north"* → **Guard Room**
3. *"try to reason with the orc"* (or fight)
4. *"pick up the health potion"*
5. *"go east"* → **The Treasury**
6. *"pick up the ancient artifact"*
7. *"go north"* → **The Lich King's Chamber**
8. *"attack the lich king"* (repeat until defeated)
9. *"pick up the lich's crown"* → **Victory**

---

## Project Structure

```
src/
├── game/          # dungeon data, pure state transitions
├── api/           # Mistral (LLM + tools), ElevenLabs TTS
├── hooks/         # useVoice (Web Speech), useGame (orchestration)
└── components/    # GameLog, DungeonMap, StatusPanel, VoiceInput, VoxRogue
```

---

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

---

## License

MIT
