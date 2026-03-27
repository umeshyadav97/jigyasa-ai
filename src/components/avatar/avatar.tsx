import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";

import {
  AvatarConfig,
  AvatarEmotion,
  DEFAULT_MORPH,
  MorphState,
  PRESET_AVATARS,
} from "./avatar.types";
import { useAvatarAnimation, useAvatarVoiceSync } from "./useAvatarAnimation";

import { BrowsLayer } from "./layers/Browslayer";
import { EyesLayer } from "./layers/Eyeslayer";
import { FaceBase } from "./layers/Facebase";
import { HairBack, HairFront } from "./layers/Hairlayer";
import { MouthLayer } from "./layers/Mouthlayer";
import { NoseLayer } from "./layers/Noselayer";

interface AudioRefLike {
  current: unknown;
}

export interface AvatarProps {
  config?: AvatarConfig;
  morph?: Partial<MorphState>;
  width?: number;
  height?: number;
  preset?: "default_female" | "default_male";
  isSpeaking?: boolean;
  emotion?: AvatarEmotion;
  audioRef?: AudioRefLike;
}

function useSmoothedMorph(
  target: Partial<MorphState>,
  smoothK = 0.18,
): MorphState {
  const smoothed = useRef<MorphState>({ ...DEFAULT_MORPH });
  const targetRef = useRef<Partial<MorphState>>(target);
  const [displayMorph, setDisplayMorph] = useState<MorphState>({
    ...DEFAULT_MORPH,
  });
  const frameRef = useRef<number>(0);

  targetRef.current = target;

  useEffect(() => {
    const tick = () => {
      const nextTarget = { ...DEFAULT_MORPH, ...targetRef.current };
      const current = smoothed.current;
      let changed = false;

      (Object.keys(DEFAULT_MORPH) as (keyof MorphState)[]).forEach((key) => {
        const nextValue =
          current[key] + (nextTarget[key] - current[key]) * smoothK;

        if (Math.abs(nextValue - current[key]) > 0.001) {
          current[key] = nextValue;
          changed = true;
        }
      });

      if (changed) {
        setDisplayMorph({ ...current });
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [smoothK]);

  return displayMorph;
}

const WebAvatarFallback = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const orbSize = Math.min(width, height) * 0.42;

  return (
    <View
      style={{
        width,
        height,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: orbSize,
          height: orbSize,
          borderRadius: orbSize / 2,
          backgroundColor: "rgba(123,92,250,0.2)",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#9F85FF",
          shadowOpacity: 0.35,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: 12 },
        }}
      >
        <View
          style={{
            width: orbSize * 0.72,
            height: orbSize * 0.72,
            borderRadius: orbSize,
            backgroundColor: "#6F4EF6",
            borderWidth: 8,
            borderColor: "rgba(255,255,255,0.55)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: orbSize * 0.38,
              height: 10,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          />
        </View>
      </View>
    </View>
  );
};

export const MeeraAvatar: React.FC<AvatarProps> = ({
  config: configProp,
  morph: morphProp = {},
  width = 320,
  height = 420,
  preset = "default_female",
  isSpeaking: isSpeakingProp,
  emotion = "neutral",
  audioRef,
}) => {
  if (Platform.OS === "web") {
    return <WebAvatarFallback width={width} height={height} />;
  }

  const config = configProp ?? PRESET_AVATARS[preset];
  const voiceSync = useAvatarVoiceSync(audioRef);
  const isSpeaking = isSpeakingProp ?? voiceSync.isSpeaking;
  const { avatarState, morph } = useAvatarAnimation({
    isSpeaking,
    emotion,
  });

  const mergedMorph = useSmoothedMorph(
    {
      ...morph,
      ...morphProp,
    },
    0.18,
  );

  const cx = width / 2;
  const cy = height * 0.44;

  return (
    <Canvas style={{ width, height }}>
      <Group
        origin={{ x: cx, y: cy }}
        transform={[
          { rotate: ((mergedMorph.headTiltZ ?? 0) * Math.PI) / 180 },
        ]}
      >
        <HairBack cx={cx} cy={cy} face={config.face} hair={config.hair} />
        <FaceBase cx={cx} cy={cy} config={config} morph={mergedMorph} />
        <BrowsLayer cx={cx} cy={cy} config={config} morph={mergedMorph} />
        <NoseLayer cx={cx} cy={cy} config={config} morph={mergedMorph} />
        <EyesLayer
          cx={cx}
          cy={cy}
          config={config}
          morph={mergedMorph}
          isBlinking={avatarState.isBlinking}
          emotion={avatarState.emotion}
        />
        <MouthLayer
          cx={cx}
          cy={cy}
          config={config}
          morph={mergedMorph}
          mouthOpen={avatarState.mouthOpen}
          emotion={avatarState.emotion}
        />
        <HairFront cx={cx} cy={cy} face={config.face} hair={config.hair} />
      </Group>
    </Canvas>
  );
};

export const Avatar = MeeraAvatar;

export default MeeraAvatar;
