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

import { AvatarConfig, AvatarEmotion, MorphState } from "../avatar.types";
import { generateLashPoints } from "../utils/math";

interface EyesProps {
  cx: number;
  cy: number;
  config: AvatarConfig;
  morph: MorphState;
  isBlinking?: boolean;
  emotion?: AvatarEmotion;
}

interface SingleEyeProps {
  ex: number;
  ey: number;
  config: AvatarConfig;
  blinkAmt: number;
  squintAmt: number;
  gazeX: number;
  gazeY: number;
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
  const r = eyes.size;
  const eyeW = r * 2.4;
  const eyeH = r * 1.15 * (1 - squintAmt * 0.45);
  const openH = Math.max(eyeH * (1 - blinkAmt * 0.98), 0.8);
  const gazeOffX = gazeX * r * 0.3;
  const gazeOffY = gazeY * r * 0.2;
  const lashesVisible = blinkAmt < 0.2;

  const eyeSocketPath = `
    M ${ex - eyeW} ${ey}
    Q ${ex - eyeW * 0.5} ${ey - openH} ${ex} ${ey - openH * 1.05}
    Q ${ex + eyeW * 0.5} ${ey - openH} ${ex + eyeW} ${ey}
    Q ${ex + eyeW * 0.5} ${ey + openH * 0.55} ${ex} ${ey + openH * 0.6}
    Q ${ex - eyeW * 0.5} ${ey + openH * 0.55} ${ex - eyeW} ${ey}
    Z
  `;

  const upperLidPath = `
    M ${ex - eyeW * 1.05} ${ey + 1}
    Q ${ex - eyeW * 0.5} ${ey - openH * 1.08 - blinkAmt * eyeH * 2} ${ex} ${ey - openH * 1.1 - blinkAmt * eyeH * 2}
    Q ${ex + eyeW * 0.5} ${ey - openH * 1.08 - blinkAmt * eyeH * 2} ${ex + eyeW * 1.05} ${ey + 1}
    Q ${ex + eyeW * 0.5} ${ey - openH * 0.9} ${ex} ${ey - openH * 0.95}
    Q ${ex - eyeW * 0.5} ${ey - openH * 0.9} ${ex - eyeW * 1.05} ${ey + 1}
    Z
  `;

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

        <Group transform={[{ translateX: gazeOffX }, { translateY: gazeOffY }]}>
          <Circle cx={ex} cy={ey} r={r}>
            <RadialGradient
              c={vec(ex - r * 0.15, ey - r * 0.15)}
              r={r}
              colors={[eyes.irisInner, eyes.irisColor, "#1A0F08"]}
              positions={[0, 0.6, 1]}
            />
          </Circle>

          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
            const radians = (angle * Math.PI) / 180;

            return (
              <Path
                key={index}
                path={`M ${ex + Math.cos(radians) * r * 0.3} ${ey + Math.sin(radians) * r * 0.3} L ${ex + Math.cos(radians) * r * 0.92} ${ey + Math.sin(radians) * r * 0.92}`}
                strokeWidth={0.7}
                color={eyes.irisColor}
                style="stroke"
                opacity={0.4}
              />
            );
          })}

          <Circle
            cx={ex}
            cy={ey}
            r={r}
            strokeWidth={1.8}
            color="#1A0A05"
            style="stroke"
            opacity={0.7}
          />
          <Circle cx={ex} cy={ey} r={r * 0.42} color={eyes.pupilColor} />

          <Circle
            cx={ex - r * 0.28}
            cy={ey - r * 0.32}
            r={r * 0.2}
            color="white"
            opacity={0.9}
          >
            <BlurMask blur={1} style="normal" />
          </Circle>
          <Circle
            cx={ex + r * 0.2}
            cy={ey + r * 0.18}
            r={r * 0.09}
            color="white"
            opacity={0.5}
          />
        </Group>
      </Group>

      <Path path={upperLidPath}>
        <LinearGradient
          start={vec(ex, ey - openH)}
          end={vec(ex, ey + openH * 0.3)}
          colors={[skin.shadow, skin.base]}
        />
      </Path>

      <Path
        path={`M ${ex - eyeW * 0.85} ${ey - openH * 0.5} Q ${ex} ${ey - openH * 1.4 - squintAmt * eyeH * 0.3} ${ex + eyeW * 0.85} ${ey - openH * 0.5}`}
        strokeWidth={1.2}
        color={skin.shadow}
        style="stroke"
        strokeCap="round"
        opacity={0.35}
      />

      {lashesVisible &&
        upperLashes.map((lash, index) => (
          <Path
            key={`upper-${index}`}
            path={`M ${lash.x0} ${lash.y0 - openH * 0.85} L ${lash.x1} ${lash.y1 - openH * 0.85 - 2}`}
            strokeWidth={
              eyes.lashThickness *
              (0.7 + 0.3 * Math.sin((index / upperLashes.length) * Math.PI))
            }
            color={eyes.lashColor}
            style="stroke"
            strokeCap="round"
            opacity={0.9}
          />
        ))}

      {squintAmt < 0.8 &&
        lowerLashes.map((lash, index) => (
          <Path
            key={`lower-${index}`}
            path={`M ${lash.x0} ${lash.y0 + openH * 0.45} L ${lash.x1} ${lash.y1 + openH * 0.45 + 1.5}`}
            strokeWidth={eyes.lashThickness * 0.55}
            color={eyes.lashColor}
            style="stroke"
            strokeCap="round"
            opacity={0.55}
          />
        ))}

      <Path
        path={`M ${ex - eyeW * 0.9} ${ey + 1} Q ${ex} ${ey + openH * 0.62} ${ex + eyeW * 0.9} ${ey + 1}`}
        strokeWidth={1}
        color={skin.shadow}
        style="stroke"
        opacity={0.4}
      />

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

export const EyesLayer = ({
  cx,
  cy,
  config,
  morph,
  isBlinking,
  emotion = "neutral",
}: EyesProps) => {
  const { eyes } = config;
  const happySquint = emotion === "happy" ? 0.08 : 0;
  const blinkAmount = isBlinking ? Math.max(morph.blinkL, 0.85) : morph.blinkL;
  const eyeY = cy + morph.eyeGazeY * 3 + eyes.offsetY;
  const eyeLX = cx - eyes.spacing / 2;
  const eyeRX = cx + eyes.spacing / 2;

  return (
    <Group>
      <SingleEye
        ex={eyeLX}
        ey={eyeY}
        config={config}
        blinkAmt={blinkAmount}
        squintAmt={Math.min(1, morph.squintL + happySquint)}
        gazeX={morph.eyeGazeX}
        gazeY={morph.eyeGazeY}
        side="L"
      />
      <SingleEye
        ex={eyeRX}
        ey={eyeY}
        config={config}
        blinkAmt={isBlinking ? Math.max(morph.blinkR, 0.85) : morph.blinkR}
        squintAmt={Math.min(1, morph.squintR + happySquint)}
        gazeX={morph.eyeGazeX}
        gazeY={morph.eyeGazeY}
        side="R"
      />
    </Group>
  );
};
