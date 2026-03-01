// No SDK — direct Supabase REST API calls only
const URL  = import.meta.env.VITE_SUPABASE_URL;
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY;

function headers(jwt) {
  return {
    "Content-Type": "application/json",
    "apikey": KEY,
    "Authorization": `Bearer ${jwt || KEY}`,
  };
}

// ── Auth ────────────────────────────────────────────────────────────────────

export async function signInAnonymously() {
  const r = await fetch(`${URL}/auth/v1/signup`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email: undefined, password: undefined }),
  });
  const d = await r.json();
  return { user: d.user, jwt: d.access_token, error: d.error ?? null };
}

export async function getSession() {
  const raw = localStorage.getItem("vr_session");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function persistSession(session) {
  localStorage.setItem("vr_session", JSON.stringify(session));
}

// ── Game saves ──────────────────────────────────────────────────────────────

export async function saveGameREST(jwt, userId, roomIdx, playerState, roomsState) {
  await fetch(`${URL}/rest/v1/game_saves`, {
    method: "POST",
    headers: {
      ...headers(jwt),
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      user_id: userId,
      room_idx: roomIdx,
      player_state: playerState,
      rooms_state: roomsState,
    }),
  });
}

export async function loadGameREST(jwt, userId) {
  const r = await fetch(
    `${URL}/rest/v1/game_saves?user_id=eq.${userId}&select=room_idx,player_state,rooms_state&limit=1`,
    { headers: headers(jwt) }
  );
  const d = await r.json();
  return Array.isArray(d) && d.length ? d[0] : null;
}

export async function deleteGameREST(jwt, userId) {
  await fetch(`${URL}/rest/v1/game_saves?user_id=eq.${userId}`, {
    method: "DELETE",
    headers: headers(jwt),
  });
}