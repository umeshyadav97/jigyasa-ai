// ─── EYES LAYER ───────────────────────────────────────────────────────────────
// Renders both eyes with: sclera, iris gradient, pupil, corneal highlight,
// eyelid, lashes, and morph-driven blink / squint / gaze

import {
  BlurMask,
  Circle,
  Group,
  LinearGradient,
  Oval,
  Path,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { AvatarConfig, MorphState } from "../avatar.types";
import { generateLashPoints } from "../utils/math";

interface EyesProps {
  cx: number;
  cy: number;
  config: AvatarConfig;
  morph: MorphState;
}

interface SingleEyeProps {
  ex: number; // Eye center X
  ey: number; // Eye center Y
  config: AvatarConfig;
  blinkAmt: number; // 0 = open, 1 = closed
  squintAmt: number; // 0 = open, 1 = squinted
  gazeX: number; // -1 to +1
  gazeY: number; // -1 to +1
  side: "L" | "R";
}

const SingleEye = ({
  ex,
  ey,
  config,
  blinkAmt,
  squintAmt,
  gazeX,
  gazeY,
  side,
}: SingleEyeProps) => {
  const { eyes, skin } = config;
  const r = eyes.size; // Iris radius
  const eyeW = r * 2.4; // Eye opening width
  const eyeH = r * 1.15 * (1 - squintAmt * 0.45); // Eye opening height (reduced by squint)

  // Open height reduced by blink
  const openH = eyeH * (1 - blinkAmt * 0.98);

  // Gaze offset (pupil/iris shift)
  const gazeOffX = gazeX * r * 0.3;
  const gazeOffY = gazeY * r * 0.2;

  // Eye socket path (the opening)
  const eyeSocketPath = `
    M ${ex - eyeW} ${ey}
    Q ${ex - eyeW * 0.5} ${ey - openH} ${ex} ${ey - openH * 1.05}
    Q ${ex + eyeW * 0.5} ${ey - openH} ${ex + eyeW} ${ey}
    Q ${ex + eyeW * 0.5} ${ey + openH * 0.55} ${ex} ${ey + openH * 0.6}
    Q ${ex - eyeW * 0.5} ${ey + openH * 0.55} ${ex - eyeW} ${ey}
    Z
  `;

  // Upper eyelid path (draws over top half)
  const upperLidPath = `
    M ${ex - eyeW * 1.05} ${ey + 1}
    Q ${ex - eyeW * 0.5} ${ey - openH * 1.08 - blinkAmt * eyeH * 2} ${ex} ${ey - openH * 1.1 - blinkAmt * eyeH * 2}
    Q ${ex + eyeW * 0.5} ${ey - openH * 1.08 - blinkAmt * eyeH * 2} ${ex + eyeW * 1.05} ${ey + 1}
    Q ${ex + eyeW * 0.5} ${ey - openH * 0.9} ${ex} ${ey - openH * 0.95}
    Q ${ex - eyeW * 0.5} ${ey - openH * 0.9} ${ex - eyeW * 1.05} ${ey + 1}
    Z
  `;

  // Lash positions
  const upperLashes = generateLashPoints(ex, ey, eyeW, true, 12);
  const lowerLashes = generateLashPoints(
    ex,
    ey + openH * 0.1,
    eyeW * 0.85,
    false,
    7,
  );

  return (
    <Group>
      {/* ── Eye socket shadow (depth) ── */}
      <Oval
        rect={{
          x: ex - eyeW * 0.9,
          y: ey - eyeH * 1.1,
          width: eyeW * 1.8,
          height: eyeH * 1.6,
        }}
        color={skin.shadow}
        opacity={0.18}
      >
        <BlurMask blur={6} style="normal" />
      </Oval>

      {/* ── Sclera (eye white) — clipped to eye socket shape ── */}
      <Group clip={eyeSocketPath}>
        <Oval
          rect={{
            x: ex - eyeW * 0.9,
            y: ey - eyeH * 0.9,
            width: eyeW * 1.8,
            height: eyeH * 1.8,
          }}
          color={eyes.scleraColor}
        />
        {/* Sclera inner shadow (gives it depth, not pure white) */}
        <Oval
          rect={{
            x: ex - eyeW * 0.8,
            y: ey - eyeH * 0.7,
            width: eyeW * 1.6,
            height: eyeH * 1.4,
          }}
          opacity={0.1}
        >
          <RadialGradient
            c={vec(ex, ey)}
            r={eyeW * 0.9}
            colors={["transparent", "#8B7D70"]}
            positions={[0.6, 1]}
          />
        </Oval>

        {/* ── Iris ── */}
        <Group transform={[{ translateX: gazeOffX }, { translateY: gazeOffY }]}>
          <Circle cx={ex} cy={ey} r={r}>
            <RadialGradient
              c={vec(ex - r * 0.15, ey - r * 0.15)}
              r={r}
              colors={[eyes.irisInner, eyes.irisColor, "#1A0F08"]}
              positions={[0, 0.6, 1]}
            />
          </Circle>

          {/* Iris texture lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <Path
                key={i}
                path={`M ${ex + Math.cos(rad) * r * 0.3} ${ey + Math.sin(rad) * r * 0.3} L ${ex + Math.cos(rad) * r * 0.92} ${ey + Math.sin(rad) * r * 0.92}`}
                strokeWidth={0.7}
                color={eyes.irisColor}
                style="stroke"
                opacity={0.4}
              />
            );
          })}

          {/* Iris limbal ring (dark edge) */}
          <Circle
            cx={ex}
            cy={ey}
            r={r}
            strokeWidth={1.8}
            color="#1A0A05"
            style="stroke"
            opacity={0.7}
          />

          {/* ── Pupil ── */}
          <Circle cx={ex} cy={ey} r={r * 0.42} color={eyes.pupilColor} />

          {/* ── Corneal highlight (main) ── */}
          <Circle
            cx={ex - r * 0.28}
            cy={ey - r * 0.32}
            r={r * 0.2}
            color="white"
            opacity={0.9}
          >
            <BlurMask blur={1} style="normal" />
          </Circle>

          {/* ── Corneal highlight (small secondary) ── */}
          <Circle
            cx={ex + r * 0.2}
            cy={ey + r * 0.18}
            r={r * 0.09}
            color="white"
            opacity={0.5}
          />
        </Group>
      </Group>

      {/* ── Upper eyelid (skin-colored, draws over eye when closing) ── */}
      <Path path={upperLidPath}>
        <LinearGradient
          start={vec(ex, ey - openH)}
          end={vec(ex, ey + openH * 0.3)}
          colors={[skin.shadow, skin.base]}
        />
      </Path>

      {/* ── Eyelid crease ── */}
      <Path
        path={`M ${ex - eyeW * 0.85} ${ey - openH * 0.5} Q ${ex} ${ey - openH * 1.4 - squintAmt * eyeH * 0.3} ${ex + eyeW * 0.85} ${ey - openH * 0.5}`}
        strokeWidth={1.2}
        color={skin.shadow}
        style="stroke"
        strokeCap="round"
        opacity={0.35}
      />

      {/* ── Upper eyelashes ── */}
      {!blinkAmt &&
        upperLashes.map((lash, i) => (
          <Path
            key={`ul-${i}`}
            path={`M ${lash.x0} ${lash.y0 - openH * 0.85} L ${lash.x1} ${lash.y1 - openH * 0.85 - 2}`}
            strokeWidth={
              eyes.lashThickness *
              (0.7 + 0.3 * Math.sin((i / upperLashes.length) * Math.PI))
            }
            color={eyes.lashColor}
            style="stroke"
            strokeCap="round"
            opacity={0.9}
          />
        ))}

      {/* ── Lower eyelashes ── */}
      {squintAmt < 0.8 &&
        lowerLashes.map((lash, i) => (
          <Path
            key={`ll-${i}`}
            path={`M ${lash.x0} ${lash.y0 + openH * 0.45} L ${lash.x1} ${lash.y1 + openH * 0.45 + 1.5}`}
            strokeWidth={eyes.lashThickness * 0.55}
            color={eyes.lashColor}
            style="stroke"
            strokeCap="round"
            opacity={0.55}
          />
        ))}

      {/* ── Lower lid line ── */}
      <Path
        path={`M ${ex - eyeW * 0.9} ${ey + 1} Q ${ex} ${ey + openH * 0.62} ${ex + eyeW * 0.9} ${ey + 1}`}
        strokeWidth={1}
        color={skin.shadow}
        style="stroke"
        opacity={0.4}
      />

      {/* ── Tear duct (inner corner) ── */}
      <Circle
        cx={side === "L" ? ex + eyeW * 0.88 : ex - eyeW * 0.88}
        cy={ey + openH * 0.1}
        r={3}
        color="#F5C8C0"
        opacity={0.7}
      />
    </Group>
  );
};

export const EyesLayer = ({ cx, cy, config, morph }: EyesProps) => {
  const { eyes, face } = config;
  const fh = face.height / 2;

  const eyeY = cy + morph.eyeGazeY * 3 + config.eyes.offsetY;
  const eyeLX = cx - eyes.spacing / 2;
  const eyeRX = cx + eyes.spacing / 2;

  return (
    <Group>
      <SingleEye
        ex={eyeLX}
        ey={eyeY}
        config={config}
        blinkAmt={morph.blinkL}
        squintAmt={morph.squintL}
        gazeX={morph.eyeGazeX}
        gazeY={morph.eyeGazeY}
        side="L"
      />
      <SingleEye
        ex={eyeRX}
        ey={eyeY}
        config={config}
        blinkAmt={morph.blinkR}
        squintAmt={morph.squintR}
        gazeX={morph.eyeGazeX}
        gazeY={morph.eyeGazeY}
        side="R"
      />
    </Group>
  );
};
