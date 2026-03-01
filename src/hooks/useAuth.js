import { useState, useEffect } from "react";
import { getSession, signInAnonymously, persistSession } from "../lib/supabase";

export function useAuth() {
  const [userId, setUserId] = useState(null);
  const [jwt,    setJwt]    = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      let session = await getSession();
      if (!session) {
        const { user, jwt: token, error } = await signInAnonymously();
        if (!error && user) {
          session = { userId: user.id, jwt: token };
          await persistSession(session);
        }
      }
      if (session) {
        setUserId(session.userId);
        setJwt(session.jwt);
      }
      setIsReady(true);
    }
    init();
  }, []);

  return { userId, jwt, isReady };
}