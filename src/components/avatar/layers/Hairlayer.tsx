// ─── HAIR LAYER ───────────────────────────────────────────────────────────────
// Renders behind and in front of the face depending on style.
// Two exports: HairBack (drawn first) and HairFront (drawn last)

import { Group, LinearGradient, Path, vec } from "@shopify/react-native-skia";
import React from "react";
import { FaceConfig, HairConfig } from "../avatar.types";

interface HairProps {
  cx: number;
  cy: number;
  face: FaceConfig;
  hair: HairConfig;
}

// ── Short male hair ───────────────────────────────────────────────────────────
const ShortMaleHair = ({ cx, cy, face, hair }: HairProps) => {
  const fw = face.width / 2;
  const fh = face.height / 2;
  const top = cy - fh;

  // Hair cap — tight to head
  const hairPath = `
    M ${cx - fw * 1.05} ${cy - fh * 0.3}
    Q ${cx - fw * 1.1} ${cy - fh * 0.8} ${cx - fw * 0.6} ${top - 10}
    Q ${cx} ${top - 22} ${cx + fw * 0.6} ${top - 10}
    Q ${cx + fw * 1.1} ${cy - fh * 0.8} ${cx + fw * 1.05} ${cy - fh * 0.3}
    Q ${cx + fw * 0.9} ${cy - fh * 0.5} ${cx} ${cy - fh * 0.6}
    Q ${cx - fw * 0.9} ${cy - fh * 0.5} ${cx - fw * 1.05} ${cy - fh * 0.3}
    Z
  `;

  return (
    <Group>
      <Path path={hairPath}>
        <LinearGradient
          start={vec(cx, top - 20)}
          end={vec(cx, cy - fh * 0.2)}
          colors={[hair.highlightColor, hair.color, hair.color]}
        />
      </Path>
      {/* Hair texture lines */}
      <Path
        path={`M ${cx - fw * 0.3} ${top - 15} Q ${cx - fw * 0.1} ${top - 20} ${cx + fw * 0.2} ${top - 15}`}
        strokeWidth={1.5}
        color={hair.highlightColor}
        style="stroke"
        strokeCap="round"
      />
    </Group>
  );
};

// ── Medium wavy hair (back portion) ──────────────────────────────────────────
const MediumWavyHairBack = ({ cx, cy, face, hair }: HairProps) => {
  const fw = face.width / 2;
  const fh = face.height / 2;
  const top = cy - fh;

  // Back hair falls below shoulders
  const backHair = `
    M ${cx - fw * 1.1} ${cy - fh * 0.25}
    Q ${cx - fw * 1.35} ${cy} ${cx - fw * 1.3} ${cy + fh * 0.6}
    Q ${cx - fw * 1.25} ${cy + fh * 1.1} ${cx - fw * 0.9} ${cy + fh * 1.4}
    Q ${cx - fw * 0.5} ${cy + fh * 1.55} ${cx} ${cy + fh * 1.5}
    Q ${cx + fw * 0.5} ${cy + fh * 1.55} ${cx + fw * 0.9} ${cy + fh * 1.4}
    Q ${cx + fw * 1.25} ${cy + fh * 1.1} ${cx + fw * 1.3} ${cy + fh * 0.6}
    Q ${cx + fw * 1.35} ${cy} ${cx + fw * 1.1} ${cy - fh * 0.25}
    Q ${cx + fw * 1.1} ${cy - fh * 0.6} ${cx + fw * 0.8} ${top - 5}
    Q ${cx} ${top - 25} ${cx - fw * 0.8} ${top - 5}
    Q ${cx - fw * 1.1} ${cy - fh * 0.6} ${cx - fw * 1.1} ${cy - fh * 0.25}
    Z
  `;

  return (
    <Path path={backHair}>
      <LinearGradient
        start={vec(cx, top)}
        end={vec(cx, cy + fh * 1.5)}
        colors={[hair.highlightColor, hair.color, hair.color]}
      />
    </Path>
  );
};

// ── Medium wavy hair (front/top portion) ─────────────────────────────────────
const MediumWavyHairFront = ({ cx, cy, face, hair }: HairProps) => {
  const fw = face.width / 2;
  const fh = face.height / 2;
  const top = cy - fh;

  // Hairline with natural wavy part
  const frontHair = `
    M ${cx - fw * 1.08} ${cy - fh * 0.28}
    Q ${cx - fw * 1.12} ${cy - fh * 0.6} ${cx - fw * 0.85} ${top - 2}
    Q ${cx - fw * 0.4} ${top - 28} ${cx - fw * 0.05} ${top - 20}
    Q ${cx + fw * 0.1} ${top - 16} ${cx + fw * 0.4} ${top - 28}
    Q ${cx + fw * 0.85} ${top - 2} ${cx + fw * 1.12} ${cy - fh * 0.6}
    Q ${cx + fw * 1.08} ${cy - fh * 0.28} ${cx + fw * 0.9} ${cy - fh * 0.5}
    Q ${cx} ${cy - fh * 0.62} ${cx - fw * 0.9} ${cy - fh * 0.5}
    Z
  `;

  // Strand details
  const strand1 = `M ${cx - fw * 0.1} ${top - 20} Q ${cx - fw * 0.15} ${cy - fh * 0.75} ${cx - fw * 0.05} ${cy - fh * 0.6}`;
  const strand2 = `M ${cx + fw * 0.15} ${top - 24} Q ${cx + fw * 0.2} ${cy - fh * 0.8} ${cx + fw * 0.1} ${cy - fh * 0.62}`;

  return (
    <Group>
      <Path path={frontHair}>
        <LinearGradient
          start={vec(cx, top - 25)}
          end={vec(cx, cy - fh * 0.45)}
          colors={[hair.highlightColor, hair.color]}
        />
      </Path>
      <Path
        path={strand1}
        strokeWidth={2}
        color={hair.highlightColor}
        style="stroke"
        strokeCap="round"
      />
      <Path
        path={strand2}
        strokeWidth={1.5}
        color={hair.highlightColor}
        style="stroke"
        strokeCap="round"
      />
    </Group>
  );
};

// ─── PUBLIC EXPORTS ───────────────────────────────────────────────────────────

export const HairBack = (props: HairProps) => {
  switch (props.hair.style) {
    case "medium_wavy":
      return <MediumWavyHairBack {...props} />;
    default:
      return null;
  }
};

export const HairFront = (props: HairProps) => {
  switch (props.hair.style) {
    case "short_male":
      return <ShortMaleHair {...props} />;
    case "medium_wavy":
      return <MediumWavyHairFront {...props} />;
    default:
      return null;
  }
};
