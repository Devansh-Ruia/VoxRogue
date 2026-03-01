import { useState, useCallback, useRef } from "react";
import { getSupabase } from "../lib/supabase";

const DEBOUNCE_TIME = 2000; // 2 seconds

export function useSave() {
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimer = useRef(null);

  const saveGame = useCallback(
    async (userId, roomIdx, playerState, roomsState) => {
      if (!userId) return;
      setIsSaving(true);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        const { data, error } = await getSupabase().from("game_saves").upsert(
          {
            user_id: userId,
            room_idx: roomIdx,
            player_state: playerState,
            rooms_state: roomsState,
          },
          { onConflict: "user_id" }
        );

        if (error) {
          console.error("Error saving game:", error);
        } else {
          console.log("Game saved successfully:", data);
        }
        setIsSaving(false);
      }, DEBOUNCE_TIME);
    },
    []
  );

  const loadGame = useCallback(async (userId) => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("game_saves")
      .select("room_idx, player_state, rooms_state")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 means no rows found
      console.error("Error loading game:", error);
      return null;
    }
    return data;
  }, []);

  const deleteSave = useCallback(async (userId) => {
    if (!userId) return;
    const { error } = await supabase
      .from("game_saves")
      .delete()
      .eq("user_id", userId);
    if (error) {
      console.error("Error deleting save:", error);
    } else {
      console.log("Game save deleted for user:", userId);
    }
  }, []);

  return { saveGame, loadGame, deleteSave, isSaving };
}
