import {
  BlurMask,
  Group,
  LinearGradient,
  Oval,
  Path,
  vec,
} from "@shopify/react-native-skia";
import React from "react";

import { AvatarConfig, AvatarEmotion, MorphState } from "../avatar.types";
import { clamp } from "../utils/math";

interface MouthProps {
  cx: number;
  cy: number;
  config: AvatarConfig;
  morph: MorphState;
  mouthOpen?: number;
  emotion?: AvatarEmotion;
}

export const MouthLayer = ({
  cx,
  cy,
  config,
  morph,
  mouthOpen,
  emotion = "neutral",
}: MouthProps) => {
  const { mouth, skin, face } = config;
  const fh = face.height / 2;
  const talkingOpen = mouthOpen ?? morph.jawOpen;
  const smileLeft = clamp(
    morph.smileL + (emotion === "happy" ? 0.18 : 0),
    0,
    1,
  );
  const smileRight = clamp(
    morph.smileR + (emotion === "happy" ? 0.18 : 0),
    0,
    1,
  );
  const smileAmt = (smileLeft + smileRight) / 2;

  const baseWidth = mouth.width;
  const mouthCenterY = cy + fh * 0.42;
  const cornerLift = smileAmt * 10;
  const wideExtra = morph.lipWide * 14;
  const halfW = baseWidth / 2 + wideExtra;
  const roundCompress = morph.lipRound * 0.75;
  const effectiveHalfW = halfW * (1 - roundCompress * 0.3);
  const jawGap = talkingOpen * 28;
  const tightness = morph.lipTight;

  const leftCornerX = cx - effectiveHalfW;
  const rightCornerX = cx + effectiveHalfW;
  const leftCornerY = mouthCenterY - cornerLift * smileLeft;
  const rightCornerY = mouthCenterY - cornerLift * smileRight;

  const cupidBowDepth = 5 - tightness * 3;
  const upperLipTopY = mouthCenterY - 9 - tightness * 2;
  const upperLipBowY = upperLipTopY + cupidBowDepth;
  const upperLipMidY = mouthCenterY - 2 - tightness * 1.5;

  const lowerLipBotY = mouthCenterY + 10 - tightness * 3 + jawGap * 0.15;
  const lowerLipMidY = mouthCenterY + 2 + tightness;
  const mouthOpenTop = mouthCenterY - 1;
  const mouthOpenBot = mouthCenterY + jawGap;

  const innerMouthPath =
    jawGap > 2
      ? `
    M ${leftCornerX + effectiveHalfW * 0.12} ${leftCornerY + 1}
    Q ${cx} ${mouthCenterY - 3} ${rightCornerX - effectiveHalfW * 0.12} ${rightCornerY + 1}
    Q ${cx + effectiveHalfW * 0.3} ${mouthOpenBot * 0.7 + mouthCenterY * 0.3}
      ${cx} ${mouthOpenBot}
    Q ${cx - effectiveHalfW * 0.3} ${mouthOpenBot * 0.7 + mouthCenterY * 0.3}
      ${leftCornerX + effectiveHalfW * 0.12} ${leftCornerY + 1}
    Z
  `
      : "";

  const teethPath =
    jawGap > 4
      ? `
    M ${leftCornerX + effectiveHalfW * 0.15} ${mouthOpenTop + 2}
    Q ${cx} ${mouthOpenTop - 1} ${rightCornerX - effectiveHalfW * 0.15} ${mouthOpenTop + 2}
    Q ${rightCornerX - effectiveHalfW * 0.1} ${mouthOpenTop + jawGap * 0.45}
      ${cx + effectiveHalfW * 0.5} ${mouthOpenTop + jawGap * 0.48}
    Q ${cx} ${mouthOpenTop + jawGap * 0.52} ${cx - effectiveHalfW * 0.5} ${mouthOpenTop + jawGap * 0.48}
    Q ${leftCornerX + effectiveHalfW * 0.1} ${mouthOpenTop + jawGap * 0.45}
      ${leftCornerX + effectiveHalfW * 0.15} ${mouthOpenTop + 2}
    Z
  `
      : "";

  const tongueOpacity =
    clamp((jawGap - 16) / 12, 0, 1) + morph.tongueShow * 0.8;

  const upperLipPath = `
    M ${leftCornerX} ${leftCornerY}
    C ${leftCornerX + effectiveHalfW * 0.25} ${leftCornerY - 4}
      ${cx - effectiveHalfW * 0.4} ${upperLipTopY}
      ${cx - effectiveHalfW * 0.08} ${upperLipBowY}
    Q ${cx} ${upperLipBowY - 1} ${cx + effectiveHalfW * 0.08} ${upperLipBowY}
    C ${cx + effectiveHalfW * 0.4} ${upperLipTopY}
      ${rightCornerX - effectiveHalfW * 0.25} ${rightCornerY - 4}
      ${rightCornerX} ${rightCornerY}
    Q ${cx + effectiveHalfW * 0.3} ${upperLipMidY}
      ${cx} ${upperLipMidY}
    Q ${cx - effectiveHalfW * 0.3} ${upperLipMidY}
      ${leftCornerX} ${leftCornerY}
    Z
  `;

  const lowerLipPath = `
    M ${leftCornerX} ${leftCornerY + 1}
    Q ${cx - effectiveHalfW * 0.3} ${lowerLipMidY}
      ${cx} ${lowerLipMidY}
    Q ${cx + effectiveHalfW * 0.3} ${lowerLipMidY}
      ${rightCornerX} ${rightCornerY + 1}
    C ${rightCornerX - effectiveHalfW * 0.15} ${lowerLipBotY}
      ${cx + effectiveHalfW * 0.35} ${lowerLipBotY + 2}
      ${cx} ${lowerLipBotY + 3}
    C ${cx - effectiveHalfW * 0.35} ${lowerLipBotY + 2}
      ${leftCornerX + effectiveHalfW * 0.15} ${lowerLipBotY}
      ${leftCornerX} ${leftCornerY + 1}
    Z
  `;

  const mouthLinePath = `
    M ${leftCornerX} ${leftCornerY}
    C ${leftCornerX + effectiveHalfW * 0.3} ${mouthCenterY - smileAmt * 3}
      ${cx - effectiveHalfW * 0.3} ${mouthCenterY - smileAmt * 5}
      ${cx} ${mouthCenterY - smileAmt * 5}
    C ${cx + effectiveHalfW * 0.3} ${mouthCenterY - smileAmt * 5}
      ${rightCornerX - effectiveHalfW * 0.3} ${mouthCenterY - smileAmt * 3}
      ${rightCornerX} ${rightCornerY}
  `;

  const foldOpacity = smileAmt * 0.5;
  const foldLPath = `M ${leftCornerX - 4} ${leftCornerY - 6} Q ${leftCornerX - 8} ${leftCornerY + 14} ${leftCornerX - 4} ${leftCornerY + 24}`;
  const foldRPath = `M ${rightCornerX + 4} ${rightCornerY - 6} Q ${rightCornerX + 8} ${rightCornerY + 14} ${rightCornerX + 4} ${rightCornerY + 24}`;

  return (
    <Group>
      {smileAmt > 0.1 && (
        <>
          <Path
            path={foldLPath}
            strokeWidth={1.5}
            color={skin.shadow}
            style="stroke"
            strokeCap="round"
            opacity={foldOpacity}
          >
            <BlurMask blur={2} style="normal" />
          </Path>
          <Path
            path={foldRPath}
            strokeWidth={1.5}
            color={skin.shadow}
            style="stroke"
            strokeCap="round"
            opacity={foldOpacity}
          >
            <BlurMask blur={2} style="normal" />
          </Path>
        </>
      )}

      {jawGap > 2 && <Path path={innerMouthPath} color="#0D0508" />}

      {jawGap > 4 && morph.teethShow > 0.05 && (
        <Group opacity={morph.teethShow}>
          <Path path={teethPath} color={mouth.teethColor} />
          <Path path={teethPath} opacity={0.15}>
            <LinearGradient
              start={vec(cx, mouthOpenTop)}
              end={vec(cx, mouthOpenTop + jawGap * 0.5)}
              colors={[skin.shadow, "transparent"]}
            />
          </Path>
          {[-0.35, -0.12, 0.12, 0.35].map((offset, index) => (
            <Path
              key={index}
              path={`M ${cx + offset * effectiveHalfW} ${mouthOpenTop + 3} L ${cx + offset * effectiveHalfW} ${mouthOpenTop + jawGap * 0.42}`}
              strokeWidth={0.8}
              color={skin.shadow}
              style="stroke"
              opacity={0.25}
            />
          ))}
        </Group>
      )}

      {tongueOpacity > 0.05 && (
        <Oval
          rect={{
            x: cx - effectiveHalfW * 0.45,
            y: mouthOpenTop + jawGap * 0.35,
            width: effectiveHalfW * 0.9,
            height: jawGap * 0.45,
          }}
          color={mouth.tongueColor}
          opacity={tongueOpacity * 0.9}
        />
      )}

      <Path path={upperLipPath}>
        <LinearGradient
          start={vec(cx, upperLipTopY)}
          end={vec(cx, upperLipMidY)}
          colors={[mouth.lipColor, mouth.lipColor]}
        />
      </Path>
      <Path path={upperLipPath} opacity={0.3}>
        <LinearGradient
          start={vec(cx, upperLipTopY - 2)}
          end={vec(cx, upperLipMidY)}
          colors={[skin.shadow, "transparent"]}
        />
      </Path>

      <Path path={lowerLipPath}>
        <LinearGradient
          start={vec(cx, lowerLipMidY)}
          end={vec(cx, lowerLipBotY + 3)}
          colors={[mouth.lipColorLower, mouth.lipColor]}
        />
      </Path>

      <Path
        path={`M ${cx - effectiveHalfW * 0.35} ${lowerLipMidY + 4} Q ${cx} ${lowerLipBotY - 1} ${cx + effectiveHalfW * 0.35} ${lowerLipMidY + 4}`}
        strokeWidth={3}
        color={skin.lipHighlight}
        style="stroke"
        strokeCap="round"
        opacity={0.55}
      >
        <BlurMask blur={2} style="normal" />
      </Path>

      <Path
        path={mouthLinePath}
        strokeWidth={1.2}
        color={skin.shadow}
        style="stroke"
        strokeCap="round"
        opacity={0.65}
      />

      <Oval
        rect={{ x: leftCornerX - 4, y: leftCornerY - 3, width: 8, height: 6 }}
        color={skin.shadow}
        opacity={0.4}
      >
        <BlurMask blur={2} style="normal" />
      </Oval>
      <Oval
        rect={{
          x: rightCornerX - 4,
          y: rightCornerY - 3,
          width: 8,
          height: 6,
        }}
        color={skin.shadow}
        opacity={0.4}
      >
        <BlurMask blur={2} style="normal" />
      </Oval>
    </Group>
  );
};
