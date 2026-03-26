// ─── MATH UTILITIES FOR AVATAR DRAWING ───────────────────────────────────────

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * Math.max(0, Math.min(1, t));

export const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

export const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Map a value from one range to another
export const remap = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);

// Build a cubic bezier path string for Skia
// Returns a path string: "M x0 y0 C cx1 cy1 cx2 cy2 x1 y1"
export const cubicBez = (
  x0: number,
  y0: number,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  x1: number,
  y1: number,
): string => `M ${x0} ${y0} C ${cx1} ${cy1} ${cx2} ${cy2} ${x1} ${y1}`;

// Build an arc approximation for lips / eye shapes
// Returns array of points along a quadratic curve
export const quadCurvePoints = (
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  steps = 20,
): { x: number; y: number }[] => {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    pts.push({
      x: mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
      y: mt * mt * y0 + 2 * mt * t * cy + t * t * y1,
    });
  }
  return pts;
};

// Convert points array to SVG path string
export const pointsToPath = (
  pts: { x: number; y: number }[],
  close = false,
): string => {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
  }
  if (close) d += " Z";
  return d;
};

// Convert degrees to radians
export const deg2rad = (deg: number): number => (deg * Math.PI) / 180;

// Rotate a point around a center
export const rotatePoint = (
  px: number,
  py: number,
  cx: number,
  cy: number,
  angleDeg: number,
): { x: number; y: number } => {
  const r = deg2rad(angleDeg);
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return {
    x: cx + (px - cx) * cos - (py - cy) * sin,
    y: cy + (px - cx) * sin + (py - cy) * cos,
  };
};

// Generate eyelash curve points
// Returns array of {start, ctrl, end} bezier points for individual lashes
export const generateLashPoints = (
  cx: number,
  cy: number,
  eyeWidth: number,
  isUpper: boolean,
  count = 10,
): Array<{ x0: number; y0: number; x1: number; y1: number }> => {
  const lashes = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const angle = isUpper
      ? lerp(-Math.PI * 0.85, -Math.PI * 0.15, t)
      : lerp(Math.PI * 0.15, Math.PI * 0.85, t);

    const rx = eyeWidth * 0.9;
    const ry = eyeWidth * 0.5;

    const x0 = cx + Math.cos(angle) * rx;
    const y0 = cy + Math.sin(angle) * ry;

    // Lash extends outward + curves
    const lashLen = lerp(4, 9, Math.sin(t * Math.PI)) * (isUpper ? 1 : 0.5);
    const curve = isUpper ? -1 : 1;
    const x1 =
      x0 + Math.cos(angle) * lashLen * 0.5 + Math.sin(angle) * lashLen * curve;
    const y1 =
      y0 + Math.sin(angle) * lashLen * 0.5 - Math.cos(angle) * lashLen * curve;

    lashes.push({ x0, y0, x1, y1 });
  }
  return lashes;
};
