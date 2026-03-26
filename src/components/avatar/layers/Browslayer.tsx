// ─── EYEBROWS LAYER ───────────────────────────────────────────────────────────
// Draws realistic arched brows with:
// - raise morph (browRaise)
// - furrow morph (browFurrow — inner ends pull down + together)

import { BlurMask, Group, Paint, Path } from "@shopify/react-native-skia";
import React from "react";
import { AvatarConfig, MorphState } from "../avatar.types";

interface BrowsProps {
  cx: number;
  cy: number;
  config: AvatarConfig;
  morph: MorphState;
}

interface SingleBrowProps {
  config: AvatarConfig;
  morph: MorphState;
  eyeX: number;
  eyeY: number;
  side: "L" | "R";
  raise: number;
  furrow: number;
}

const SingleBrow = ({
  config,
  morph,
  eyeX,
  eyeY,
  side,
  raise,
  furrow,
}: SingleBrowProps) => {
  const { brows, eyes } = config;
  const dir = side === "L" ? 1 : -1; // L brow extends to the right (away from center)

  const browW = eyes.spacing * 0.48;
  const browH = brows.thickness;
  const baseY = eyeY - brows.offsetY - raise * 12;

  // Inner end (toward nose bridge) pulled down and in by furrow
  const innerX = eyeX - dir * browW * 0.5;
  const innerY = baseY + brows.arch * 6 + furrow * 8;

  // Middle peak (highest point of arch)
  const midX = eyeX + dir * browW * 0.08;
  const midY = baseY - brows.arch * 5 - raise * 4;

  // Outer end (toward temple) — tail of brow
  const outerX = eyeX + dir * browW * 0.55;
  const outerY = baseY + brows.arch * 3 - raise * 2;

  // Stroke path: inner → mid → outer
  const browPath = `
    M ${innerX} ${innerY}
    C ${eyeX - dir * browW * 0.15} ${innerY - 2}
      ${eyeX + dir * browW * 0.15} ${midY}
      ${midX} ${midY}
    C ${eyeX + dir * browW * 0.32} ${midY + 1}
      ${outerX - dir * browW * 0.1} ${outerY - 1}
      ${outerX} ${outerY}
  `;

  // Filled thick brow path (inner region)
  const browFillPath = `
    M ${innerX} ${innerY - browH * 0.3}
    C ${eyeX - dir * browW * 0.15} ${innerY - browH * 0.5}
      ${eyeX + dir * browW * 0.15} ${midY - browH * 0.7}
      ${midX} ${midY - browH * 0.7}
    C ${eyeX + dir * browW * 0.32} ${midY - browH * 0.5}
      ${outerX - dir * browW * 0.1} ${outerY - browH * 0.15}
      ${outerX} ${outerY}
    C ${outerX - dir * browW * 0.05} ${outerY + browH * 0.3}
      ${eyeX + dir * browW * 0.18} ${midY + browH * 0.4}
      ${midX} ${midY + browH * 0.5}
    C ${eyeX - dir * browW * 0.1} ${innerY + browH * 0.4}
      ${innerX + dir * browW * 0.05} ${innerY + browH * 0.5}
      ${innerX} ${innerY + browH * 0.3}
    Z
  `;

  // Highlight stroke along top of brow
  const browHighlightPath = `
    M ${innerX + dir * browW * 0.1} ${innerY - browH * 0.1}
    C ${eyeX + dir * browW * 0.05} ${midY - browH * 0.3}
      ${eyeX + dir * browW * 0.3} ${midY - browH * 0.2}
      ${outerX - dir * browW * 0.15} ${outerY - browH * 0.1}
  `;

  // Furrow wrinkle between brows (only shown when furrowing)
  const wrinkleOpacity = furrow * 0.55;
  const wrinkleX = side === "L" ? innerX + 4 : innerX - 4;

  return (
    <Group>
      {/* Soft shadow under brow */}
      <Path path={browFillPath} color={config.skin.shadow} opacity={0.15}>
        <Paint>
          <BlurMask blur={5} style="normal" />
        </Paint>
      </Path>

      {/* Main brow fill */}
      <Path path={browFillPath} color={brows.color} opacity={0.92} />

      {/* Fine hair strokes along brow */}
      {[-0.15, 0, 0.15].map((offset, i) => (
        <Path
          key={i}
          path={`
            M ${innerX + dir * offset * browW * 0.3} ${innerY + offset * browH}
            C ${eyeX} ${midY + offset * browH * 0.5}
              ${eyeX + dir * browW * 0.3} ${midY + offset * browH * 0.3}
              ${outerX} ${outerY + offset * browH * 0.5}
          `}
          strokeWidth={0.8}
          color={brows.color}
          style="stroke"
          opacity={0.35}
        />
      ))}

      {/* Brow highlight */}
      <Path
        path={browHighlightPath}
        strokeWidth={0.9}
        color={config.skin.highlight}
        style="stroke"
        strokeCap="round"
        opacity={0.3}
      />

      {/* Furrow wrinkle lines */}
      {furrow > 0.1 && (
        <Path
          path={`M ${wrinkleX} ${innerY - 2} Q ${wrinkleX + dir * 2} ${innerY + 6} ${wrinkleX} ${innerY + 12}`}
          strokeWidth={1}
          color={config.skin.shadow}
          style="stroke"
          strokeCap="round"
          opacity={wrinkleOpacity}
        />
      )}
    </Group>
  );
};

export const BrowsLayer = ({ cx, cy, config, morph }: BrowsProps) => {
  const { eyes } = config;
  const eyeY = cy + eyes.offsetY;
  const eyeLX = cx - eyes.spacing / 2;
  const eyeRX = cx + eyes.spacing / 2;

  return (
    <Group>
      <SingleBrow
        config={config}
        morph={morph}
        eyeX={eyeLX}
        eyeY={eyeY}
        side="L"
        raise={morph.browRaiseL}
        furrow={morph.browFurrowL}
      />
      <SingleBrow
        config={config}
        morph={morph}
        eyeX={eyeRX}
        eyeY={eyeY}
        side="R"
        raise={morph.browRaiseR}
        furrow={morph.browFurrowR}
      />
    </Group>
  );
};
