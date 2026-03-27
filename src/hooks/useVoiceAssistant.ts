import { useCallback, useMemo, useState } from "react";

import { AvatarEmotion } from "../components/avatar/avatar.types";
import { postVoiceMessage } from "../services/voiceApi";
import { useVoicePlayback } from "./useVoicePlayback";
import { useVoiceRecorder } from "./useVoiceRecorder";

export type VoiceFlowStatus =
  | "idle"
  | "recording"
  | "uploading"
  | "playing"
  | "error";

export const useVoiceAssistant = () => {
  const recorder = useVoiceRecorder();
  const playback = useVoicePlayback();
  const [status, setStatus] = useState<VoiceFlowStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [replyText, setReplyText] = useState("");
  const [emotion, setEmotion] = useState<AvatarEmotion>("neutral");
  const [audioUrl, setAudioUrl] = useState("");

  const beginRecording = useCallback(async () => {
    setError(null);
    await recorder.startRecording();
    setStatus("recording");
  }, [recorder]);

  const finishRecording = useCallback(async () => {
    try {
      setError(null);
      const result = await recorder.stopRecording();
      setStatus("uploading");

      const response = await postVoiceMessage({
        audioUri: result.uri,
        fileName: result.fileName,
        mimeType: result.mimeType,
      });

      setTranscript(response.transcript);
      setReplyText(response.replyText);
      setEmotion(response.emotion);
      setAudioUrl(response.audioUrl);

      if (response.audioUrl) {
        await playback.play(response.audioUrl);
        setStatus("playing");
      } else {
        setStatus("idle");
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while processing your voice request.";

      setError(message);
      setStatus("error");
    }
  }, [playback, recorder]);

  const toggleRecording = useCallback(async () => {
    if (recorder.isRecording) {
      await finishRecording();
      return;
    }

    await beginRecording();
  }, [beginRecording, finishRecording, recorder.isRecording]);

  const replay = useCallback(async () => {
    if (!audioUrl) {
      return;
    }

    setError(null);
    await playback.play(audioUrl);
    setStatus("playing");
  }, [audioUrl, playback]);

  const stopPlayback = useCallback(async () => {
    await playback.stop();
    setStatus("idle");
  }, [playback]);

  const effectiveStatus = useMemo<VoiceFlowStatus>(() => {
    if (playback.isPlaying) {
      return "playing";
    }

    if (status === "playing") {
      return "idle";
    }

    return status;
  }, [playback.isPlaying, status]);

  return {
    status: effectiveStatus,
    error,
    transcript,
    replyText,
    emotion,
    audioUrl,
    isRecording: recorder.isRecording,
    isPlaying: playback.isPlaying,
    isAvatarSpeaking: playback.isPlaying,
    toggleRecording,
    replay,
    stopPlayback,
  };
};
