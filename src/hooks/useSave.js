import { useCallback, useRef, useState } from "react";
import { saveGameREST, loadGameREST, deleteGameREST } from "../lib/supabase";

const DEBOUNCE = 2000;

export function useSave() {
  const [isSaving, setIsSaving] = useState(false);
  const timer = useRef(null);

  const saveGame = useCallback((jwt, userId, roomIdx, player, rooms) => {
    if (!userId || !jwt) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setIsSaving(true);
      try { await saveGameREST(jwt, userId, roomIdx, player, rooms); }
      catch (e) { console.error("Save failed:", e); }
      finally { setIsSaving(false); }
    }, DEBOUNCE);
  }, []);

  const loadGame = useCallback(async (jwt, userId) => {
    if (!userId || !jwt) return null;
    try { return await loadGameREST(jwt, userId); }
    catch (e) { console.error("Load failed:", e); return null; }
  }, []);

  const deleteSave = useCallback(async (jwt, userId) => {
    if (!userId || !jwt) return;
    try { await deleteGameREST(jwt, userId); }
    catch (e) { console.error("Delete failed:", e); }
  }, []);

  return { saveGame, loadGame, deleteSave, isSaving };
}