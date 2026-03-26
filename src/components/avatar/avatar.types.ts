// ─── AVATAR CONFIGURATION TYPES ─────────────────────────────────────────────
// Every visual property of the avatar is driven by this config.
// Nothing is hardcoded in the drawing layer.

export interface SkinConfig {
  base: string; // Main skin tone
  shadow: string; // Darker tone for depth
  highlight: string; // Lighter tone for light hits
  blush: string; // Cheek color
  lip: string; // Lip color
  lipHighlight: string; // Shine on lower lip
}

export interface EyeConfig {
  irisColor: string; // Eye color
  irisInner: string; // Lighter inner iris
  pupilColor: string; // Pupil (near black)
  scleraColor: string; // Eye white (slightly warm)
  size: number; // Iris radius in px
  spacing: number; // Distance between eye centers
  offsetY: number; // Vertical position on face
  lashColor: string; // Eyelash color
  lashThickness: number;
}

export interface BrowConfig {
  color: string;
  thickness: number;
  offsetY: number; // How high above eye
  arch: number; // 0 = flat, 1 = high arch
}

export interface NoseConfig {
  width: number;
  length: number;
  tipSize: number;
  color: string; // Nostril/shadow color
}

export interface MouthConfig {
  width: number; // Natural lip width
  lipColor: string;
  lipColorLower: string; // Lower lip slightly different
  teethColor: string;
  tongueColor: string;
}

export interface HairConfig {
  color: string;
  highlightColor: string;
  style: "short_male" | "medium_wavy" | "long_straight" | "bun" | "curly";
}

export interface FaceConfig {
  width: number;
  height: number;
  jawWidth: number; // Width at jaw vs cheek
  chinShape: number; // 0 = round, 1 = pointed
}

export interface AvatarConfig {
  face: FaceConfig;
  skin: SkinConfig;
  eyes: EyeConfig;
  brows: BrowConfig;
  nose: NoseConfig;
  mouth: MouthConfig;
  hair: HairConfig;
}

// ─── MORPH / ANIMATION STATE ─────────────────────────────────────────────────
// All values 0.0 → 1.0 unless noted
// These are the real-time animated values driven by voice or expressions

export interface MorphState {
  // Mouth morphs (voice driven)
  jawOpen: number; // 0 = closed, 1 = fully open
  lipWide: number; // 0 = neutral, 1 = stretched wide (EE)
  lipRound: number; // 0 = neutral, 1 = rounded O/OO
  lipTight: number; // 0 = relaxed, 1 = pressed
  teethShow: number; // 0 = hidden, 1 = visible
  tongueShow: number; // 0 = hidden, 1 = tip visible

  // Eye morphs
  blinkL: number; // 0 = open, 1 = closed
  blinkR: number;
  squintL: number; // 0 = open, 1 = squinted
  squintR: number;
  eyeGazeX: number; // -1 = left, 0 = center, +1 = right
  eyeGazeY: number; // -1 = up, 0 = center, +1 = down

  // Brow morphs
  browRaiseL: number; // 0 = neutral, 1 = raised
  browRaiseR: number;
  browFurrowL: number; // 0 = neutral, 1 = furrowed inward
  browFurrowR: number;

  // Head motion
  headTiltX: number; // rotation degrees (-15 to +15)
  headTiltY: number; // nod degrees
  headTiltZ: number; // roll degrees

  // Expression overlays
  smileL: number; // 0 = neutral, 1 = full smile (mouth corner up)
  smileR: number;
  cheekRaise: number; // Cheek puff with smile
}

export const DEFAULT_MORPH: MorphState = {
  jawOpen: 0,
  lipWide: 0,
  lipRound: 0,
  lipTight: 0,
  teethShow: 0,
  tongueShow: 0,
  blinkL: 0,
  blinkR: 0,
  squintL: 0,
  squintR: 0,
  eyeGazeX: 0,
  eyeGazeY: 0,
  browRaiseL: 0,
  browRaiseR: 0,
  browFurrowL: 0,
  browFurrowR: 0,
  headTiltX: 0,
  headTiltY: 0,
  headTiltZ: 0,
  smileL: 0,
  smileR: 0,
  cheekRaise: 0,
};

// ─── EXPRESSION PRESETS ───────────────────────────────────────────────────────

export type ExpressionName =
  | "neutral"
  | "happy"
  | "thinking"
  | "surprised"
  | "concerned"
  | "talking";

export const EXPRESSIONS: Record<ExpressionName, Partial<MorphState>> = {
  neutral: {
    browRaiseL: 0,
    browRaiseR: 0,
    browFurrowL: 0,
    browFurrowR: 0,
    smileL: 0.1,
    smileR: 0.1,
    squintL: 0,
    squintR: 0,
  },
  happy: {
    browRaiseL: 0.3,
    browRaiseR: 0.3,
    smileL: 0.85,
    smileR: 0.85,
    squintL: 0.35,
    squintR: 0.35,
    cheekRaise: 0.6,
    jawOpen: 0.2,
    teethShow: 0.4,
  },
  thinking: {
    browFurrowL: 0.3,
    browFurrowR: 0.6,
    browRaiseL: 0.1,
    browRaiseR: 0.4,
    squintL: 0.2,
    squintR: 0.1,
    eyeGazeX: 0.4,
    eyeGazeY: -0.3,
    smileL: 0,
    smileR: 0,
  },
  surprised: {
    browRaiseL: 0.95,
    browRaiseR: 0.95,
    squintL: 0,
    squintR: 0,
    jawOpen: 0.5,
    teethShow: 0.3,
    eyeGazeX: 0,
    eyeGazeY: 0,
  },
  concerned: {
    browFurrowL: 0.6,
    browFurrowR: 0.6,
    browRaiseL: 0.3,
    browRaiseR: 0.3,
    squintL: 0.15,
    squintR: 0.15,
    smileL: -0.2,
    smileR: -0.2,
  },
  talking: {
    browRaiseL: 0.15,
    browRaiseR: 0.15,
    smileL: 0.3,
    smileR: 0.3,
    jawOpen: 0.3,
    teethShow: 0.2,
  },
};

// ─── PRESET AVATAR CONFIGS ────────────────────────────────────────────────────

export const PRESET_AVATARS: Record<string, AvatarConfig> = {
  default_female: {
    face: { width: 200, height: 240, jawWidth: 0.72, chinShape: 0.5 },
    skin: {
      base: "#F5C5A3",
      shadow: "#D4956A",
      highlight: "#FDE8D5",
      blush: "#E8968A",
      lip: "#C97B84",
      lipHighlight: "#F0AABB",
    },
    eyes: {
      irisColor: "#4A7FB5",
      irisInner: "#6AADE0",
      pupilColor: "#0D1B2A",
      scleraColor: "#F8F3EC",
      size: 18,
      spacing: 84,
      offsetY: -20,
      lashColor: "#2A1F1A",
      lashThickness: 2.2,
    },
    brows: {
      color: "#5C3D2E",
      thickness: 5,
      offsetY: 18,
      arch: 0.55,
    },
    nose: {
      width: 32,
      length: 36,
      tipSize: 10,
      color: "#C8896A",
    },
    mouth: {
      width: 56,
      lipColor: "#C97B84",
      lipColorLower: "#D98E96",
      teethColor: "#F5F0E8",
      tongueColor: "#E07070",
    },
    hair: {
      color: "#3D2314",
      highlightColor: "#6B3A22",
      style: "medium_wavy",
    },
  },

  default_male: {
    face: { width: 210, height: 250, jawWidth: 0.82, chinShape: 0.3 },
    skin: {
      base: "#D4956A",
      shadow: "#A8673A",
      highlight: "#E8B088",
      blush: "#C07858",
      lip: "#A06050",
      lipHighlight: "#C07868",
    },
    eyes: {
      irisColor: "#5C7A4A",
      irisInner: "#7AAA60",
      pupilColor: "#0D1B0D",
      scleraColor: "#F5F0E8",
      size: 17,
      spacing: 88,
      offsetY: -18,
      lashColor: "#1A1208",
      lashThickness: 1.8,
    },
    brows: {
      color: "#2A1A08",
      thickness: 7,
      offsetY: 15,
      arch: 0.3,
    },
    nose: {
      width: 38,
      length: 42,
      tipSize: 13,
      color: "#A86840",
    },
    mouth: {
      width: 64,
      lipColor: "#A06050",
      lipColorLower: "#B07060",
      teethColor: "#F0EBE0",
      tongueColor: "#D06060",
    },
    hair: {
      color: "#1A0E08",
      highlightColor: "#3D2314",
      style: "short_male",
    },
  },
};
