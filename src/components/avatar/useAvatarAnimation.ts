import { Animated } from "react-native";
import { RefObject, useEffect, useRef, useState } from "react";

import {
  AvatarEmotion,
  AvatarState,
  DEFAULT_MORPH,
  MorphState,
} from "./avatar.types";

type AudioRefLike = RefObject<unknown> | undefined;

interface UseAvatarAnimationOptions {
  isSpeaking?: boolean;
  emotion?: AvatarEmotion;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const createSpeakingLoop = (value: Animated.Value) =>
  Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 0.72,
        duration: 140,
        useNativeDriver: false,
      }),
      Animated.timing(value, {
        toValue: 0.18,
        duration: 120,
        useNativeDriver: false,
      }),
      Animated.timing(value, {
        toValue: 0.88,
        duration: 160,
        useNativeDriver: false,
      }),
      Animated.timing(value, {
        toValue: 0.08,
        duration: 140,
        useNativeDriver: false,
      }),
    ]),
  );

export const useAvatarAnimation = ({
  isSpeaking = false,
  emotion = "neutral",
}: UseAvatarAnimationOptions) => {
  const [mouthOpen, setMouthOpen] = useState(0);
  const [blinkValue, setBlinkValue] = useState(0);
  const mouthAnimated = useRef(new Animated.Value(0)).current;
  const blinkAnimated = useRef(new Animated.Value(0)).current;
  const mouthLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const blinkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mouthListenerId = mouthAnimated.addListener(({ value }) => {
      setMouthOpen(clamp01(value));
    });
    const blinkListenerId = blinkAnimated.addListener(({ value }) => {
      setBlinkValue(clamp01(value));
    });

    return () => {
      mouthAnimated.removeListener(mouthListenerId);
      blinkAnimated.removeListener(blinkListenerId);
    };
  }, [blinkAnimated, mouthAnimated]);

  useEffect(() => {
    if (isSpeaking) {
      mouthLoopRef.current?.stop();
      mouthLoopRef.current = createSpeakingLoop(mouthAnimated);
      mouthLoopRef.current.start();
      return () => {
        mouthLoopRef.current?.stop();
      };
    }

    mouthLoopRef.current?.stop();
    Animated.timing(mouthAnimated, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isSpeaking, mouthAnimated]);

  useEffect(() => {
    let cancelled = false;

    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      blinkTimeoutRef.current = setTimeout(() => {
        Animated.sequence([
          Animated.timing(blinkAnimated, {
            toValue: 1,
            duration: 110,
            useNativeDriver: false,
          }),
          Animated.timing(blinkAnimated, {
            toValue: 0,
            duration: 140,
            useNativeDriver: false,
          }),
        ]).start(({ finished }) => {
          if (!cancelled && finished) {
            scheduleBlink();
          }
        });
      }, delay);
    };

    scheduleBlink();

    return () => {
      cancelled = true;
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
      blinkAnimated.stopAnimation();
    };
  }, [blinkAnimated]);

  const avatarState: AvatarState = {
    isSpeaking,
    mouthOpen,
    isBlinking: blinkValue > 0.45,
    emotion,
  };

  const isHappy = emotion === "happy";
  const morph: MorphState = {
    ...DEFAULT_MORPH,
    jawOpen: mouthOpen * 0.75,
    lipWide: isSpeaking ? 0.08 + mouthOpen * 0.12 : 0.04,
    lipRound: isSpeaking ? mouthOpen * 0.18 : 0,
    lipTight: isSpeaking ? 0.05 : 0.12,
    teethShow: mouthOpen > 0.38 ? mouthOpen * 0.55 : 0,
    tongueShow: mouthOpen > 0.72 ? (mouthOpen - 0.72) * 1.3 : 0,
    blinkL: blinkValue,
    blinkR: blinkValue,
    squintL: isHappy ? 0.12 : 0,
    squintR: isHappy ? 0.12 : 0,
    smileL: isHappy ? 0.52 : 0.08,
    smileR: isHappy ? 0.52 : 0.08,
    cheekRaise: isHappy ? 0.35 : 0,
    browRaiseL: isHappy ? 0.08 : 0,
    browRaiseR: isHappy ? 0.08 : 0,
  };

  return {
    avatarState,
    morph,
  };
};

export const useAvatarVoiceSync = (audioRef?: AudioRefLike) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const audio = audioRef?.current as
      | {
          addListener?: (event: string, listener: () => void) => { remove?: () => void };
          addEventListener?: (
            event: string,
            listener: () => void,
          ) => { remove?: () => void } | void;
          on?: (event: string, listener: () => void) => (() => void) | void;
          off?: (event: string, listener: () => void) => void;
          removeListener?: (event: string, listener: () => void) => void;
          setOnPlaybackStatusUpdate?: (
            listener: ((status: { isLoaded?: boolean; isPlaying?: boolean; didJustFinish?: boolean }) => void) | null,
          ) => void;
        }
      | undefined;

    if (!audio) {
      return;
    }

    const handlePlay = () => setIsSpeaking(true);
    const handleStop = () => setIsSpeaking(false);
    const removers: Array<() => void> = [];

    if (typeof audio.setOnPlaybackStatusUpdate === "function") {
      audio.setOnPlaybackStatusUpdate((status) => {
        if (!status?.isLoaded) {
          handleStop();
          return;
        }

        if (status.didJustFinish || !status.isPlaying) {
          handleStop();
          return;
        }

        handlePlay();
      });

      removers.push(() => {
        audio.setOnPlaybackStatusUpdate?.(null);
      });
    }

    const subscribe = (
      eventName: string,
      listener: () => void,
      fallbackEventName?: string,
    ) => {
      if (typeof audio.addListener === "function") {
        const subscription = audio.addListener(eventName, listener);
        removers.push(() => subscription?.remove?.());
        return;
      }

      if (typeof audio.addEventListener === "function") {
        const subscription = audio.addEventListener(eventName, listener);
        removers.push(() => subscription && "remove" in subscription && subscription.remove?.());
        return;
      }

      if (typeof audio.on === "function") {
        const unsubscribe = audio.on(eventName, listener);
        removers.push(() => {
          if (typeof unsubscribe === "function") {
            unsubscribe();
            return;
          }

          if (typeof audio.off === "function") {
            audio.off(eventName, listener);
            return;
          }

          audio.removeListener?.(fallbackEventName ?? eventName, listener);
        });
      }
    };

    subscribe("play", handlePlay);
    subscribe("playing", handlePlay);
    subscribe("pause", handleStop);
    subscribe("ended", handleStop);
    subscribe("end", handleStop, "end");
    subscribe("stop", handleStop);

    return () => {
      removers.forEach((remove) => remove());
    };
  }, [audioRef]);

  return {
    isSpeaking,
    setIsSpeaking,
  };
};
