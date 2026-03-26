// ─── FACE BASE LAYER ──────────────────────────────────────────────────────────
// Draws: neck, head shape, skin gradients, shading, highlights, blush

import {
  BlurMask,
  Group,
  LinearGradient,
  Oval,
  Paint,
  Path,
  RadialGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { AvatarConfig, MorphState } from "../avatar.types";

interface FaceBaseProps {
  cx: number;
  cy: number;
  config: AvatarConfig;
  morph: MorphState;
}

export const FaceBase = ({ cx, cy, config, morph }: FaceBaseProps) => {
  const { face, skin } = config;
  const fw = face.width / 2;
  const fh = face.height / 2;

  // ── Head shape: oval that narrows toward jaw ─────────────────────────────
  // We draw a custom path for a more natural face shape
  const jawW = fw * face.jawWidth;
  const chinY = cy + fh;
  const cheekY = cy + fh * 0.15;
  const topY = cy - fh;

  const headPath = `
    M ${cx} ${topY}
    C ${cx + fw * 1.05} ${topY} ${cx + fw * 1.08} ${cheekY - fh * 0.3} ${cx + fw * 1.06} ${cy}
    C ${cx + fw * 1.02} ${cheekY + fh * 0.3} ${cx + jawW} ${cheekY + fh * 0.5} ${cx + jawW * 0.5} ${chinY - fh * 0.08}
    Q ${cx} ${chinY + fh * face.chinShape * 0.1} ${cx - jawW * 0.5} ${chinY - fh * 0.08}
    C ${cx - jawW} ${cheekY + fh * 0.5} ${cx - fw * 1.02} ${cheekY + fh * 0.3} ${cx - fw * 1.06} ${cy}
    C ${cx - fw * 1.08} ${cheekY - fh * 0.3} ${cx - fw * 1.05} ${topY} ${cx} ${topY}
    Z
  `;

  // ── Neck ────────────────────────────────────────────────────────────────
  const neckW = fw * 0.38;
  const neckTop = chinY - 8;
  const neckBot = chinY + fh * 0.7;

  const neckPath = `
    M ${cx - neckW} ${neckTop}
    Q ${cx - neckW * 1.05} ${neckTop + (neckBot - neckTop) * 0.5} ${cx - neckW * 0.9} ${neckBot}
    Q ${cx} ${neckBot + 8} ${cx + neckW * 0.9} ${neckBot}
    Q ${cx + neckW * 1.05} ${neckTop + (neckBot - neckTop) * 0.5} ${cx + neckW} ${neckTop}
    Z
  `;

  // ── Ear shapes ───────────────────────────────────────────────────────────
  const earY = cy - fh * 0.05;
  const earH = fh * 0.28;
  const earW = fw * 0.14;

  const leftEarPath = `
    M ${cx - fw * 1.03} ${earY - earH * 0.5}
    Q ${cx - fw * 1.03 - earW} ${earY - earH * 0.3} ${cx - fw * 1.03 - earW * 0.9} ${earY}
    Q ${cx - fw * 1.03 - earW} ${earY + earH * 0.3} ${cx - fw * 1.03} ${earY + earH * 0.5}
    Z
  `;
  const rightEarPath = `
    M ${cx + fw * 1.03} ${earY - earH * 0.5}
    Q ${cx + fw * 1.03 + earW} ${earY - earH * 0.3} ${cx + fw * 1.03 + earW * 0.9} ${earY}
    Q ${cx + fw * 1.03 + earW} ${earY + earH * 0.3} ${cx + fw * 1.03} ${earY + earH * 0.5}
    Z
  `;

  // ── Shading paths ────────────────────────────────────────────────────────
  // Temple shadow (left)
  const templeShadowL = `
    M ${cx - fw * 0.85} ${topY + fh * 0.15}
    Q ${cx - fw * 1.05} ${cy - fh * 0.3} ${cx - fw * 0.9} ${cy + fh * 0.2}
    Q ${cx - fw * 0.6} ${cy + fh * 0.35} ${cx - fw * 0.4} ${cy - fh * 0.1}
    Q ${cx - fw * 0.5} ${topY + fh * 0.05} ${cx - fw * 0.85} ${topY + fh * 0.15}
    Z
  `;
  // Temple shadow (right)
  const templeShadowR = `
    M ${cx + fw * 0.85} ${topY + fh * 0.15}
    Q ${cx + fw * 1.05} ${cy - fh * 0.3} ${cx + fw * 0.9} ${cy + fh * 0.2}
    Q ${cx + fw * 0.6} ${cy + fh * 0.35} ${cx + fw * 0.4} ${cy - fh * 0.1}
    Q ${cx + fw * 0.5} ${topY + fh * 0.05} ${cx + fw * 0.85} ${topY + fh * 0.15}
    Z
  `;

  // Under-chin shadow
  const chinShadowPath = `
    M ${cx - jawW * 0.7} ${chinY - fh * 0.12}
    Q ${cx} ${chinY + fh * 0.05} ${cx + jawW * 0.7} ${chinY - fh * 0.12}
    Q ${cx + jawW * 0.4} ${chinY + fh * 0.1} ${cx} ${chinY + fh * 0.12}
    Q ${cx - jawW * 0.4} ${chinY + fh * 0.1} ${cx - jawW * 0.7} ${chinY - fh * 0.12}
    Z
  `;

  // Cheek blush regions (opacity driven by smile morph)
  const blushOpacity = 0.15 + morph.smileL * 0.2 + morph.cheekRaise * 0.15;

  return (
    <Group>
      {/* ── Neck ── */}
      <Path path={neckPath}>
        <LinearGradient
          start={vec(cx - neckW, neckTop)}
          end={vec(cx + neckW, neckTop)}
          colors={[skin.shadow, skin.base, skin.base, skin.shadow]}
          positions={[0, 0.3, 0.7, 1]}
        />
      </Path>

      {/* ── Neck shadow under chin ── */}
      <Path
        path={`M ${cx - neckW * 0.8} ${neckTop} Q ${cx} ${neckTop - 5} ${cx + neckW * 0.8} ${neckTop} Q ${cx} ${neckTop + 15} ${cx - neckW * 0.8} ${neckTop} Z`}
      >
        <Paint color={skin.shadow} opacity={0.35}>
          <BlurMask blur={8} style="normal" />
        </Paint>
      </Path>

      {/* ── Ears ── */}
      <Path path={leftEarPath}>
        <LinearGradient
          start={vec(cx - fw, earY)}
          end={vec(cx - fw * 1.15, earY)}
          colors={[skin.base, skin.shadow]}
        />
      </Path>
      <Path path={rightEarPath}>
        <LinearGradient
          start={vec(cx + fw, earY)}
          end={vec(cx + fw * 1.15, earY)}
          colors={[skin.base, skin.shadow]}
        />
      </Path>
      {/* Ear inner detail */}
      <Path
        path={`M ${cx - fw * 1.06} ${earY - earH * 0.25} Q ${cx - fw * 1.06 - earW * 0.5} ${earY} ${cx - fw * 1.06} ${earY + earH * 0.25}`}
        strokeWidth={2}
        color={skin.shadow}
        style="stroke"
        strokeCap="round"
        opacity={0.5}
      />
      <Path
        path={`M ${cx + fw * 1.06} ${earY - earH * 0.25} Q ${cx + fw * 1.06 + earW * 0.5} ${earY} ${cx + fw * 1.06} ${earY + earH * 0.25}`}
        strokeWidth={2}
        color={skin.shadow}
        style="stroke"
        strokeCap="round"
        opacity={0.5}
      />

      {/* ── Base skin fill ── */}
      <Path path={headPath}>
        <RadialGradient
          c={vec(cx, cy - fh * 0.1)}
          r={fw * 1.3}
          colors={[skin.highlight, skin.base, skin.shadow]}
          positions={[0, 0.55, 1]}
        />
      </Path>

      {/* ── Side shading (temple to jaw) ── */}
      <Path path={templeShadowL} opacity={0.25}>
        <Paint color={skin.shadow}>
          <BlurMask blur={18} style="normal" />
        </Paint>
      </Path>
      <Path path={templeShadowR} opacity={0.25}>
        <Paint color={skin.shadow}>
          <BlurMask blur={18} style="normal" />
        </Paint>
      </Path>

      {/* ── Forehead highlight ── */}
      <Oval
        rect={{
          x: cx - fw * 0.45,
          y: topY + fh * 0.1,
          width: fw * 0.9,
          height: fh * 0.3,
        }}
        color={skin.highlight}
        opacity={0.3}
      >
        <BlurMask blur={14} style="normal" />
      </Oval>

      {/* ── Nose bridge highlight ── */}
      <Rect
        x={cx - fw * 0.055}
        y={cy - fh * 0.32}
        width={fw * 0.11}
        height={fh * 0.42}
        color={skin.highlight}
        opacity={0.22}
      >
        <BlurMask blur={8} style="normal" />
      </Rect>

      {/* ── Under-chin shadow ── */}
      <Path path={chinShadowPath} opacity={0.3}>
        <Paint color={skin.shadow}>
          <BlurMask blur={10} style="normal" />
        </Paint>
      </Path>

      {/* ── Cheek blush LEFT ── */}
      <Oval
        rect={{
          x: cx - fw * 0.88,
          y: cy + fh * 0.05,
          width: fw * 0.55,
          height: fh * 0.22,
        }}
        color={skin.blush}
        opacity={blushOpacity}
      >
        <BlurMask blur={18} style="normal" />
      </Oval>

      {/* ── Cheek blush RIGHT ── */}
      <Oval
        rect={{
          x: cx + fw * 0.33,
          y: cy + fh * 0.05,
          width: fw * 0.55,
          height: fh * 0.22,
        }}
        color={skin.blush}
        opacity={blushOpacity}
      >
        <BlurMask blur={18} style="normal" />
      </Oval>

      {/* ── Skin outline / edge shadow ── */}
      <Path
        path={headPath}
        strokeWidth={2.5}
        color={skin.shadow}
        style="stroke"
        opacity={0.4}
      />
    </Group>
  );
};
