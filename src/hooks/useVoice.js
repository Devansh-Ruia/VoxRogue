import { useCallback, useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

/**
 * useVoice(onResult, onError)
 * Returns: { isListening, startListening, stopListening, supported }
 */
export function useVoice(onResult, onError) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const supported = Boolean(SpeechRecognition);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";
      rec.onresult = (e) => {
        const transcript = e.results?.[0]?.[0]?.transcript?.trim();
        if (transcript && onResult) onResult(transcript);
      };
      rec.onerror = (e) => {
        if (e.error !== "aborted" && onError) onError(e.error);
      };
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch (err) {
      if (onError) onError(String(err));
      setIsListening(false);
    }
  }, [onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  return { isListening, startListening, stopListening, supported };
}
