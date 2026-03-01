import { useState, useEffect } from "react";
import { getSupabase } from "../lib/supabase";

export function useAuth() {
  const [userId, setUserId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function getOrCreateUser() {
      const { data, error } = await getSupabase().auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      }

      if (data?.session) {
        setUserId(data.session.user.id);
      } else {
        // Sign in anonymously if no session
        const { data: signInData, error: signInError } = await getSupabase().auth.signInAnonymously();
        if (signInError) {
          console.error("Error signing in anonymously:", signInError);
        } else if (signInData?.user) {
          setUserId(signInData.user.id);
        }
      }
      setIsReady(true);
    }

    getOrCreateUser();
  }, []);

  return { userId, isReady };
}
