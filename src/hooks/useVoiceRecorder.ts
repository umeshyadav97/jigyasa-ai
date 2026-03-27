import { Audio } from "expo-av";
import { Platform } from "react-native";
import { useCallback, useRef, useState } from "react";

interface VoiceRecordingResult {
  uri: string;
  mimeType: string;
  fileName: string;
}

export const useVoiceRecorder = () => {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === "web") {
      throw new Error("Voice recording is not supported on web in this MVP.");
    }

    const permission = await Audio.requestPermissionsAsync();

    if (!permission.granted) {
      throw new Error("Microphone permission is required to record audio.");
    }
  }, []);

  const startRecording = useCallback(async () => {
    await requestPermission();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );

    recordingRef.current = recording;
    setIsRecording(true);
  }, [requestPermission]);

  const stopRecording = useCallback(async (): Promise<VoiceRecordingResult> => {
    const recording = recordingRef.current;

    if (!recording) {
      throw new Error("No active recording to stop.");
    }

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    const uri = recording.getURI();
    recordingRef.current = null;
    setIsRecording(false);

    if (!uri) {
      throw new Error("Recording finished but no audio file was created.");
    }

    return {
      uri,
      mimeType: "audio/m4a",
      fileName: "voice-input.m4a",
    };
  }, []);

  return {
    isRecording,
    requestPermission,
    startRecording,
    stopRecording,
  };
};
