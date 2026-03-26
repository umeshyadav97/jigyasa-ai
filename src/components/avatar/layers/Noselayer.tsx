// ─── NOSE LAYER ───────────────────────────────────────────────────────────────

import { BlurMask, Circle, Group, Path } from "@shopify/react-native-skia";
import React from "react";
import { AvatarConfig, MorphState } from "../avatar.types";

interface NoseProps {
  cx: number;
  cy: number;
  config: AvatarConfig;
  morph: MorphState;
}

export const NoseLayer = ({ cx, cy, config, morph }: NoseProps) => {
  const { nose, skin, face } = config;
  const fh = face.height / 2;

  const noseTopY = cy - fh * 0.18;
  const noseBotY = noseTopY + nose.length;
  const nostrilY = noseBotY - nose.tipSize * 0.4;

  // Nose bridge — subtle highlight line
  const bridgePath = `
    M ${cx} ${noseTopY}
    Q ${cx - nose.width * 0.08} ${noseTopY + nose.length * 0.5}
      ${cx} ${noseBotY - nose.tipSize * 0.5}
  `;

  // Nose tip highlight
  const tipHighlightPath = `
    M ${cx - nose.tipSize * 0.3} ${noseBotY - nose.tipSize * 0.6}
    Q ${cx} ${noseBotY - nose.tipSize * 0.9} ${cx + nose.tipSize * 0.3} ${noseBotY - nose.tipSize * 0.6}
  `;

  // Left nostril
  const nostrilLPath = `
    M ${cx - nose.width * 0.15} ${nostrilY}
    Q ${cx - nose.width * 0.55} ${nostrilY + nose.tipSize * 0.5}
      ${cx - nose.width * 0.42} ${nostrilY + nose.tipSize * 0.9}
    Q ${cx - nose.width * 0.25} ${nostrilY + nose.tipSize * 1.0}
      ${cx - nose.width * 0.1} ${nostrilY + nose.tipSize * 0.5}
    Z
  `;

  // Right nostril
  const nostrilRPath = `
    M ${cx + nose.width * 0.15} ${nostrilY}
    Q ${cx + nose.width * 0.55} ${nostrilY + nose.tipSize * 0.5}
      ${cx + nose.width * 0.42} ${nostrilY + nose.tipSize * 0.9}
    Q ${cx + nose.width * 0.25} ${nostrilY + nose.tipSize * 1.0}
      ${cx + nose.width * 0.1} ${nostrilY + nose.tipSize * 0.5}
    Z
  `;

  // Nose bottom / base line
  const noseLine = `
    M ${cx - nose.width * 0.4} ${noseBotY - nose.tipSize * 0.1}
    Q ${cx} ${noseBotY + nose.tipSize * 0.05} ${cx + nose.width * 0.4} ${noseBotY - nose.tipSize * 0.1}
  `;

  // Side shading of nose
  const noseShadowL = `
    M ${cx - nose.width * 0.08} ${noseTopY + nose.length * 0.3}
    Q ${cx - nose.width * 0.38} ${noseTopY + nose.length * 0.65}
      ${cx - nose.width * 0.35} ${nostrilY + 2}
  `;
  const noseShadowR = `
    M ${cx + nose.width * 0.08} ${noseTopY + nose.length * 0.3}
    Q ${cx + nose.width * 0.38} ${noseTopY + nose.length * 0.65}
      ${cx + nose.width * 0.35} ${nostrilY + 2}
  `;

  return (
    <Group>
      {/* Nose side shading */}
      <Path
        path={noseShadowL}
        strokeWidth={3.5}
        color={skin.shadow}
        style="stroke"
        strokeCap="round"
        opacity={0.22}
      >
        <BlurMask blur={4} style="normal" />
      </Path>
      <Path
        path={noseShadowR}
        strokeWidth={3.5}
        color={skin.shadow}
        style="stroke"
        strokeCap="round"
        opacity={0.22}
      >
        <BlurMask blur={4} style="normal" />
      </Path>

      {/* Nostril shadows */}
      <Path path={nostrilLPath} color={nose.color} opacity={0.55}>
        <BlurMask blur={2} style="normal" />
      </Path>
      <Path path={nostrilRPath} color={nose.color} opacity={0.55}>
        <BlurMask blur={2} style="normal" />
      </Path>

      {/* Dark nostril openings */}
      <Circle
        cx={cx - nose.width * 0.28}
        cy={nostrilY + nose.tipSize * 0.55}
        r={nose.tipSize * 0.28}
        color={nose.color}
        opacity={0.7}
      />
      <Circle
        cx={cx + nose.width * 0.28}
        cy={nostrilY + nose.tipSize * 0.55}
        r={nose.tipSize * 0.28}
        color={nose.color}
        opacity={0.7}
      />

      {/* Nose base line */}
      <Path
        path={noseLine}
        strokeWidth={1.5}
        color={nose.color}
        style="stroke"
        strokeCap="round"
        opacity={0.4}
      />

      {/* Bridge highlight */}
      <Path
        path={bridgePath}
        strokeWidth={2.5}
        color={skin.highlight}
        style="stroke"
        strokeCap="round"
        opacity={0.35}
      >
        <BlurMask blur={3} style="normal" />
      </Path>

      {/* Tip highlight */}
      <Path
        path={tipHighlightPath}
        strokeWidth={2}
        color={skin.highlight}
        style="stroke"
        strokeCap="round"
        opacity={0.55}
      >
        <BlurMask blur={2} style="normal" />
      </Path>
    </Group>
  );
};
