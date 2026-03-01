import { useCallback, useEffect, useRef, useState } from "react";

const DEEPGRAM_KEY = import.meta.env.VITE_DEEPGRAM_KEY;

export function useVoice() {
  const [isListening,       setIsListening]       = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript,   setFinalTranscript]   = useState("");

  const socketRef    = useRef(null);
  const recorderRef  = useRef(null);
  const silenceTimer = useRef(null);
  const lastSpeech   = useRef(0);

  const supported = Boolean(DEEPGRAM_KEY);

  const stopListening = useCallback(() => {
    if (silenceTimer.current) { clearInterval(silenceTimer.current); silenceTimer.current = null; }
    if (recorderRef.current)  { try { recorderRef.current.stop(); } catch (_) {} recorderRef.current = null; }
    if (socketRef.current)    { try { socketRef.current.close(); } catch (_) {} socketRef.current = null; }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const startListening = useCallback(() => {
    if (!DEEPGRAM_KEY || isListening) return;

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

      // silence detection
      silenceTimer.current = setInterval(() => {
        if (Date.now() - lastSpeech.current > 2000) stopListening();
      }, 500);

      // mic stream
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
          recorderRef.current = recorder;
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) ws.send(e.data);
          };
          recorder.start(250);
        })
        .catch((err) => {
          console.error("Mic access error:", err);
          stopListening();
        });
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const t = data?.channel?.alternatives?.[0]?.transcript;
        if (!t) return;
        lastSpeech.current = Date.now();
        if (data.is_final) {
          setFinalTranscript(t);
          setInterimTranscript("");
        } else {
          setInterimTranscript(t);
        }
      } catch (_) {}
    };

    ws.onerror = (err) => { console.error("Deepgram WS error:", err); stopListening(); };
    ws.onclose = ()    => { stopListening(); };

  }, [isListening, stopListening]);

  useEffect(() => () => stopListening(), [stopListening]);

  return { isListening, startListening, stopListening, supported, interimTranscript, finalTranscript };
}