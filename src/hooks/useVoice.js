import { useCallback, useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export function useVoice() {
  const [isListening,        setIsListening]        = useState(false);
  const [interimTranscript,  setInterimTranscript]  = useState("");
  const [finalTranscript,    setFinalTranscript]    = useState("");
  const recognitionRef = useRef(null);

  const supported = Boolean(SpeechRecognition);

  const clearFinalTranscript = useCallback(() => setFinalTranscript(""), []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition || isListening) return;
    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map(r => r[0].transcript).join("");
        const isFinal = e.results[e.results.length - 1].isFinal;
        if (isFinal) {
          setFinalTranscript(transcript);
          setInterimTranscript("");
        } else {
          setInterimTranscript(transcript);
        }
      };

      rec.onerror = (e) => {
        if (e.error !== "aborted") setIsListening(false);
      };

      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch (err) {
      setIsListening(false);
    }
  }, [isListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    supported,
    interimTranscript,
    finalTranscript,
    clearFinalTranscript,
  };
}