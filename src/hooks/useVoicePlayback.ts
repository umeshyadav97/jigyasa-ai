import { Audio, AVPlaybackStatus } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";

export const useVoicePlayback = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const unload = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    setIsPlaying(false);
  }, []);

  const play = useCallback(
    async (audioUrl: string) => {
      await unload();

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
      );

      soundRef.current = sound;
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
          setIsPlaying(false);
          return;
        }

        if (status.didJustFinish || !status.isPlaying) {
          setIsPlaying(false);
        } else {
          setIsPlaying(true);
        }
      });
    },
    [unload],
  );

  useEffect(() => {
    return () => {
      void unload();
    };
  }, [unload]);

  return {
    isPlaying,
    play,
    stop: unload,
  };
};
