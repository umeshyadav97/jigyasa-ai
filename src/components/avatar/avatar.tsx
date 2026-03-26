// ─── AVATAR COMPONENT ─────────────────────────────────────────────────────────
// Main entry point. Composes all layers in correct draw order.
// Handles idle animations (blink, head sway) via reanimated shared values.

import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useEffect, useRef } from "react";

import {
  AvatarConfig,
  DEFAULT_MORPH,
  MorphState,
  PRESET_AVATARS,
} from "./avatar.types";

import { BrowsLayer } from "./layers/Browslayer";
import { EyesLayer } from "./layers/Eyeslayer";
import { FaceBase } from "./layers/Facebase";
import { HairBack, HairFront } from "./layers/Hairlayer";
import { MouthLayer } from "./layers/Mouthlayer";
import { NoseLayer } from "./layers/Noselayer";
import { lerp } from "./utils/math";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface AvatarProps {
  /** Avatar visual configuration */
  config?: AvatarConfig;
  /** Live morph state (from voice analysis or manual) */
  morph?: Partial<MorphState>;
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Enable idle animations (blink, subtle sway) */
  idleAnimations?: boolean;
  /** Preset name instead of full config */
  preset?: "default_female" | "default_male";
}

// ─── SMOOTHED MORPH HOOK ──────────────────────────────────────────────────────
// Takes raw morph targets and returns smoothed values using lerp each frame

function useSmoothedMorph(
  target: Partial<MorphState>,
  smoothK = 0.14,
): MorphState {
  const smoothed = useRef<MorphState>({ ...DEFAULT_MORPH });
  const [displayMorph, setDisplayMorph] = React.useState<MorphState>({
    ...DEFAULT_MORPH,
  });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const s = smoothed.current;
      const t = { ...DEFAULT_MORPH, ...target };
      let changed = false;

      (Object.keys(DEFAULT_MORPH) as (keyof MorphState)[]).forEach((key) => {
        const next = lerp(s[key], t[key], smoothK);
        if (Math.abs(next - s[key]) > 0.001) {
          (s as any)[key] = next;
          changed = true;
        }
      });

      if (changed) setDisplayMorph({ ...s });
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, smoothK]);

  return displayMorph;
}

// ─── IDLE ANIMATION HOOK ──────────────────────────────────────────────────────

function useIdleAnimations(enabled: boolean): Partial<MorphState> {
  const [idle, setIdle] = React.useState<Partial<MorphState>>({});
  const frameRef = useRef<number>(0);
  const blinkTimer = useRef(0);
  const blinkState = useRef<"open" | "closing" | "closed" | "opening">("open");
  const blinkPhase = useRef(0);
  const nextBlink = useRef(3.5 + Math.random() * 2);

  useEffect(() => {
    if (!enabled) return;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      blinkTimer.current += dt;

      // Blink state machine
      let blinkL = 0;
      let blinkR = 0;

      if (blinkTimer.current >= nextBlink.current) {
        blinkState.current = "closing";
        blinkPhase.current = 0;
        nextBlink.current = blinkTimer.current + 3.5 + Math.random() * 3;
      }

      if (blinkState.current === "closing") {
        blinkPhase.current += dt / 0.06;
        blinkL = blinkR = Math.min(1, blinkPhase.current);
        if (blinkPhase.current >= 1) blinkState.current = "opening";
      } else if (blinkState.current === "opening") {
        blinkPhase.current -= dt / 0.1;
        blinkL = blinkR = Math.max(0, blinkPhase.current);
        if (blinkPhase.current <= 0) blinkState.current = "open";
      }

      // Subtle gaze drift
      const t = blinkTimer.current;
      const gazeX = Math.sin(t * 0.23) * 0.15 + Math.sin(t * 0.7) * 0.05;
      const gazeY = Math.sin(t * 0.18) * 0.1;

      // Head sway
      const headTiltZ = Math.sin(t * 0.35) * 1.5 + Math.sin(t * 0.8) * 0.5;
      const headTiltX = Math.sin(t * 0.28) * 1.0;

      // Occasional micro brow raise
      const browMicro = Math.max(0, Math.sin(t * 0.15) * 0.12);

      setIdle({
        blinkL,
        blinkR,
        eyeGazeX: gazeX,
        eyeGazeY: gazeY,
        headTiltZ,
        headTiltX,
        browRaiseL: browMicro,
        browRaiseR: browMicro,
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled]);

  return idle;
}

// ─── AVATAR COMPONENT ─────────────────────────────────────────────────────────

export const Avatar: React.FC<AvatarProps> = ({
  config: configProp,
  morph: morphProp = {},
  width = 320,
  height = 420,
  idleAnimations = true,
  preset = "default_female",
}) => {
  const config = configProp ?? PRESET_AVATARS[preset];

  // Merge idle + morph (morph prop overrides idle blinks/gaze if provided)
  const idle = useIdleAnimations(idleAnimations);
  const mergedMorph: Partial<MorphState> = { ...idle, ...morphProp };

  // Smooth all values
  const smoothed = useSmoothedMorph(mergedMorph, 0.14);

  // Avatar center point
  const cx = width / 2;
  const cy = height * 0.44;

  return (
    <Canvas style={{ width, height }}>
      <Group
        transform={[
          { translateX: cx },
          { translateY: cy },
          { rotate: ((smoothed.headTiltZ ?? 0) * Math.PI) / 180 },
        ]}
      >
        {/* Draw order: back → front */}

        {/* 1. Hair (back layer) */}
        <HairBack cx={cx} cy={cy} face={config.face} hair={config.hair} />

        {/* 2. Face base (skin, shading, neck, ears) */}
        <FaceBase cx={cx} cy={cy} config={config} morph={smoothed} />

        {/* 3. Eyebrows */}
        <BrowsLayer cx={cx} cy={cy} config={config} morph={smoothed} />

        {/* 4. Nose */}
        <NoseLayer cx={cx} cy={cy} config={config} morph={smoothed} />

        {/* 5. Eyes (with lashes over skin) */}
        <EyesLayer cx={cx} cy={cy} config={config} morph={smoothed} />

        {/* 6. Mouth */}
        <MouthLayer cx={cx} cy={cy} config={config} morph={smoothed} />

        {/* 7. Hair (front/fringe layer — over face) */}
        <HairFront cx={cx} cy={cy} face={config.face} hair={config.hair} />
      </Group>
    </Canvas>
  );
};

export default Avatar;
