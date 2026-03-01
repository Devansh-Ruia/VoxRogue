import { useCallback, useEffect, useRef, useState } from "react";

const DEEPGRAM_KEY = import.meta.env.VITE_DEEPGRAM_KEY;
const HAS_WEB_SPEECH = typeof window !== "undefined" &&
  Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

export function useVoice() {
  const [isListening,       setIsListening]       = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript,   setFinalTranscript]   = useState("");

  const socketRef    = useRef(null);
  const recorderRef  = useRef(null);
  const silenceTimer = useRef(null);
  const lastSpeech   = useRef(0);
  const webSpeechRef = useRef(null);

  // Supported if either Deepgram key exists OR Web Speech API is available
  const supported = Boolean(DEEPGRAM_KEY) || HAS_WEB_SPEECH;

  // ── Web Speech fallback ───────────────────────────────────────────────────
  const startWebSpeech = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = "en-US";

    r.onstart  = () => { setIsListening(true); setInterimTranscript(""); setFinalTranscript(""); };
    r.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      const isFinal = e.results[e.results.length - 1].isFinal;
      if (isFinal) { setFinalTranscript(t); setInterimTranscript(""); }
      else { setInterimTranscript(t); }
    };
    r.onerror = () => setIsListening(false);
    r.onend   = () => setIsListening(false);
    r.start();
    webSpeechRef.current = r;
  }, []);

  // ── Deepgram WebSocket ────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    if (silenceTimer.current) { clearInterval(silenceTimer.current); silenceTimer.current = null; }
    if (recorderRef.current)  { try { recorderRef.current.stop(); } catch (_) {} recorderRef.current = null; }
    if (socketRef.current)    { try { socketRef.current.close(); } catch (_) {} socketRef.current = null; }
    if (webSpeechRef.current) { try { webSpeechRef.current.stop(); } catch (_) {} webSpeechRef.current = null; }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const startListening = useCallback(() => {
    if (isListening) return;

    // Use Web Speech if no Deepgram key
    if (!DEEPGRAM_KEY) { startWebSpeech(); return; }

    const ws = new WebSocket(
      `wss://api.deepgram.com/v1/listen?model=nova-2&language=en-US&interim_results=true&smart_format=true`,
      ["token", DEEPGRAM_KEY]
    );
    socketRef.current = ws;

    ws.onopen = () => {
      setIsListening(true);
      setInterimTranscript("");
      setFinalTranscript("");
      lastSpeech.current = Date.now();

      silenceTimer.current = setInterval(() => {
        if (Date.now() - lastSpeech.current > 2000) stopListening();
      }, 500);

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
          recorderRef.current = recorder;
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) ws.send(e.data);
          };
          recorder.start(250);
        })
        .catch((err) => { console.error("Mic access error:", err); stopListening(); });
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const t = data?.channel?.alternatives?.[0]?.transcript;
        if (!t) return;
        lastSpeech.current = Date.now();
        if (data.is_final) { setFinalTranscript(t); setInterimTranscript(""); }
        else { setInterimTranscript(t); }
      } catch (_) {}
    };

    ws.onerror = (err) => { console.error("Deepgram WS error:", err); stopListening(); };
    ws.onclose = () => { stopListening(); };

  }, [isListening, stopListening, startWebSpeech]);

  useEffect(() => () => stopListening(), [stopListening]);

  return { isListening, startListening, stopListening, supported, interimTranscript, finalTranscript };
}