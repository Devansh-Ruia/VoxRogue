import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@deepgram/sdk";

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_KEY;

/**
 * useVoice(onResult, onInterim, onError)
 * Returns: { isListening, startListening, stopListening, supported, interimTranscript }
 */
export function useVoice(onResult, onInterim, onError) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const deepgramSocketRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const lastTranscriptTimeRef = useRef(0);

  const supported = Boolean(DEEPGRAM_API_KEY);

  const startListening = useCallback(() => {
    if (!DEEPGRAM_API_KEY) {
      if (onError) onError("Deepgram API key is not configured.");
      return;
    }
    if (isListening) return;

    try {
      const deepgram = createClient(DEEPGRAM_API_KEY);
      const connection = deepgram.listen.live({
        interim_results: true,
        language: "en-US",
        model: "nova-2",
        smart_format: true,
      });

      connection.on("open", () => {
        console.log("Deepgram connection opened.");
        setIsListening(true);
        setInterimTranscript("");
        lastTranscriptTimeRef.current = Date.now();
        // Start silence timer
        silenceTimerRef.current = setInterval(() => {
          if (Date.now() - lastTranscriptTimeRef.current > 2000) {
            console.log("2 seconds of silence detected, stopping listening.");
            stopListening();
          }
        }, 500); // Check every 500ms
      });

      connection.on("transcriptReceived", (message) => {
        const data = JSON.parse(message);
        const transcript = data.channel.alternatives[0].transcript;
        const isFinal = data.is_final;

        if (transcript) {
          lastTranscriptTimeRef.current = Date.now(); // Reset silence timer
          if (isFinal) {
            setInterimTranscript("");
            if (onResult) onResult(transcript);
          } else {
            setInterimTranscript(transcript);
            if (onInterim) onInterim(transcript);
          }
        }
      });

      connection.on("error", (err) => {
        console.error("Deepgram error:", err);
        if (onError) onError(String(err));
        stopListening(); // Ensure listening state is reset on error
      });

      connection.on("close", () => {
        console.log("Deepgram connection closed.");
        stopListening(); // Ensure listening state is reset on close
      });

      // Get microphone access and stream to Deepgram
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        };
        mediaRecorder.start(250); // Send data every 250ms
        deepgramSocketRef.current = connection;
      }).catch((err) => {
        console.error("Microphone access error:", err);
        if (onError) onError("Microphone access denied or failed: " + err.message);
        setIsListening(false);
      });

    } catch (err) {
      console.error("Failed to start Deepgram listening:", err);
      if (onError) onError(String(err));
      setIsListening(false);
    }
  }, [isListening, onResult, onInterim, onError, stopListening]);

  const stopListening = useCallback(() => {
    if (deepgramSocketRef.current) {
      try {
        deepgramSocketRef.current.finish(); // Close Deepgram connection
      } catch (e) {
        console.error("Error closing Deepgram connection:", e);
      }
      deepgramSocketRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return { isListening, startListening, stopListening, supported, interimTranscript };
}
