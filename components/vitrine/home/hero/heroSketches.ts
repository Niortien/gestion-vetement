import type { HeroGarment } from "./heroData";

export interface SketchLine {
  d: string;
  thin?: boolean;
}

export interface SketchCircle {
  cx: number;
  cy: number;
  r: number;
}

export interface Sketch {
  /** Silhouette remplie très légèrement. */
  fill: string;
  lines: readonly SketchLine[];
  circles?: readonly SketchCircle[];
  /** Décalage vertical du dessin dans le viewBox 400×400. */
  offsetY?: number;
}

const TEE_OUTLINE =
  "M140 70 L110 80 L50 120 L80 180 L115 165 L115 340 L285 340 L285 165 L320 180 L350 120 L290 80 L260 70 C250 95 225 108 200 108 C175 108 150 95 140 70 Z";
const KICKS_UPPER =
  "M60 285 C58 250 70 225 100 215 L150 200 C170 170 195 150 225 145 L245 145 C255 175 280 195 320 205 C345 212 358 240 358 285";
const POLO_OUTLINE = "M145 72 L112 82 L52 122 L82 182 L117 167 L117 340 L283 340 L283 167 L318 182 L348 122 L288 82 L255 72 Z";
const CARGO_OUTLINE = "M130 50 L270 50 L285 360 L222 360 L205 150 L195 150 L178 360 L115 360 Z";
const CAP_DOME = "M108 232 C108 152 158 112 214 112 C270 112 312 152 312 232 Z";

export const HERO_SKETCHES: Record<HeroGarment, Sketch> = {
  tee: {
    fill: TEE_OUTLINE,
    lines: [
      { d: TEE_OUTLINE },
      { d: "M151 75 C163 92 180 100 200 100 C220 100 237 92 249 75", thin: true },
      { d: "M58 136 L93 120", thin: true },
      { d: "M342 136 L307 120", thin: true },
      { d: "M122 324 L278 324", thin: true },
    ],
  },
  kicks: {
    fill: `${KICKS_UPPER} Z`,
    offsetY: -30,
    lines: [
      { d: KICKS_UPPER },
      { d: "M48 285 L360 285 C362 305 350 316 328 316 L92 316 C66 316 50 304 48 285 Z" },
      { d: "M54 300 L354 300", thin: true },
      { d: "M168 188 L196 204", thin: true },
      { d: "M182 172 L210 189", thin: true },
      { d: "M198 158 L226 174", thin: true },
      { d: "M110 255 C170 248 240 250 305 266", thin: true },
      { d: "M292 285 C294 258 312 238 342 233", thin: true },
    ],
  },
  polo: {
    fill: POLO_OUTLINE,
    lines: [
      { d: POLO_OUTLINE },
      { d: "M148 70 L178 118 L200 100 L222 118 L252 70" },
      { d: "M200 100 L200 176", thin: true },
      { d: "M60 138 L95 122", thin: true },
      { d: "M340 138 L305 122", thin: true },
    ],
    circles: [
      { cx: 200, cy: 128, r: 4 },
      { cx: 200, cy: 154, r: 4 },
    ],
  },
  cargo: {
    fill: CARGO_OUTLINE,
    lines: [
      { d: CARGO_OUTLINE },
      { d: "M130 72 L270 72", thin: true },
      { d: "M200 72 L200 140", thin: true },
      { d: "M150 50 L150 72", thin: true },
      { d: "M250 50 L250 72", thin: true },
      { d: "M126 198 L172 198 L170 262 L124 262 Z", thin: true },
      { d: "M126 214 L172 214", thin: true },
      { d: "M228 198 L274 198 L276 262 L230 262 Z", thin: true },
      { d: "M228 214 L274 214", thin: true },
      { d: "M117 344 L180 344", thin: true },
      { d: "M220 344 L283 344", thin: true },
    ],
  },
  accessory: {
    fill: CAP_DOME,
    lines: [
      { d: CAP_DOME },
      { d: "M240 232 C290 230 345 244 372 264 C330 272 280 262 240 246 Z" },
      { d: "M214 118 L214 232", thin: true },
      { d: "M214 118 C180 150 165 190 165 232", thin: true },
      { d: "M214 118 C248 150 262 190 262 232", thin: true },
    ],
    circles: [
      { cx: 214, cy: 108, r: 6 },
      { cx: 182, cy: 160, r: 3 },
      { cx: 246, cy: 160, r: 3 },
    ],
  },
};
