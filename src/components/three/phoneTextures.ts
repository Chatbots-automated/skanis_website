import * as THREE from "three";
import { MARK_CHECK_PATH, MARK_FRAME_PATH } from "@/components/brand/Logo";
import { canvasFontFamily } from "./shared";

/*
 * The phone screens of the 3D hero, drawn with the 2D canvas API. They mirror
 * the React screens in components/phone/screens.tsx (same palette, same
 * wording) and are, like those, an illustration rather than a screenshot.
 */

/** Logical screen size; the canvas is drawn at SCALE × this for crispness. */
export const SCREEN_W = 300;
export const SCREEN_H = 635;
const SCALE = 2;

const C = {
  canvas: "#f7f5ef",
  ink: "#1c2825",
  muted: "#5b6d66",
  line: "#e4e8e2",
  forest: "#143f39",
  leaf: "#17694a",
  mint: "#9fdfc4",
  danger: "#b3382e",
  dangerSoft: "#f9ebe8",
  dangerLine: "#efcdc7",
};

const font = (weight: number, size: number) => `${weight} ${size}px ${canvasFontFamily()}`;

type Ctx = CanvasRenderingContext2D;

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function spaced(ctx: Ctx, value: string) {
  (ctx as unknown as { letterSpacing: string }).letterSpacing = value;
}

function wrap(ctx: Ctx, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function drawText(ctx: Ctx, text: string, x: number, y: number, maxW: number, lineH: number, color: string) {
  ctx.fillStyle = color;
  const lines = wrap(ctx, text, maxW);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return y + lines.length * lineH;
}

function statusBar(ctx: Ctx) {
  ctx.fillStyle = C.ink;
  ctx.font = font(800, 13);
  ctx.textBaseline = "alphabetic";
  ctx.fillText("9:41", 28, 28);
  // signal bars
  for (let i = 0; i < 4; i++) {
    rr(ctx, 224 + i * 4.5, 27 - (3 + i * 2.2), 3, 3 + i * 2.2, 1);
    ctx.fill();
  }
  // wifi (three arcs)
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(250, 27, 3 + i * 3, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
  }
  // battery
  ctx.lineWidth = 1.4;
  rr(ctx, 262, 18, 22, 11, 3.5);
  ctx.stroke();
  rr(ctx, 264.5, 20.5, 17, 6, 2);
  ctx.fillStyle = C.ink;
  ctx.fill();
  // island + home indicator
  ctx.fillStyle = "#050c0a";
  rr(ctx, 107, 10, 86, 26, 13);
  ctx.fill();
  ctx.fillStyle = "rgb(28 40 37 / 0.8)";
  rr(ctx, 98, SCREEN_H - 12, 104, 4, 2);
  ctx.fill();
}

function appBar(ctx: Ctx, title: string) {
  ctx.strokeStyle = "rgb(28 40 37 / 0.7)";
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(24, 53);
  ctx.lineTo(18, 59);
  ctx.lineTo(24, 65);
  ctx.stroke();
  ctx.fillStyle = C.ink;
  ctx.font = font(800, 13);
  ctx.textAlign = "center";
  ctx.fillText(title, SCREEN_W / 2, 64);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgb(28 40 37 / 0.5)";
  [0, 1, 2].forEach((i) => {
    ctx.beginPath();
    ctx.arc(268 + i * 6, 59, 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
}

function bracket(ctx: Ctx, x: number, y: number, dx: number, dy: number, len: number, color: string, width: number) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x, y + dy * len);
  ctx.lineTo(x, y + dy * 8);
  ctx.quadraticCurveTo(x, y, x + dx * 8, y);
  ctx.lineTo(x + dx * len, y);
  ctx.stroke();
}

function makeCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = SCREEN_W * SCALE;
  canvas.height = SCREEN_H * SCALE;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SCALE, SCALE);
  return { canvas, ctx };
}

/** Screen 1: camera view of a product label while it is being scanned. */
export function drawScanScreen(): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = C.canvas;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx);
  appBar(ctx, "Nuskenuok etiketę");

  // camera viewport
  ctx.save();
  rr(ctx, 16, 80, 268, 474, 27);
  ctx.clip();
  ctx.fillStyle = "#1b2924";
  ctx.fillRect(16, 80, 268, 474);
  const blob = (cx: number, cy: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgb(0 0 0 / 0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  };
  blob(46, 170, 110, "rgb(154 59 42 / 0.75)");
  blob(270, 470, 120, "rgb(63 107 80 / 0.7)");
  const shade = ctx.createLinearGradient(0, 80, 0, 554);
  shade.addColorStop(0, "rgb(0 0 0 / 0.08)");
  shade.addColorStop(1, "rgb(0 0 0 / 0.42)");
  ctx.fillStyle = shade;
  ctx.fillRect(16, 80, 268, 474);
  ctx.restore();

  // the label
  ctx.save();
  ctx.translate(150, 245);
  ctx.rotate((-1.5 * Math.PI) / 180);
  ctx.shadowColor = "rgb(0 0 0 / 0.55)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = "#f6efe0";
  rr(ctx, -112, -96, 224, 192, 12);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.font = font(800, 8.5);
  spaced(ctx, "1.2px");
  ctx.fillStyle = "#6b5b3a";
  ctx.fillText("AVIŽINIAI SAUSAINIAI", -98, -74);
  ctx.font = font(800, 10.5);
  spaced(ctx, "0px");
  ctx.fillStyle = "#3b3426";
  ctx.fillText("SUDĖTIS", -98, -52);
  ctx.font = font(600, 10.5);
  drawText(
    ctx,
    "avižų dribsniai (38 %), cukrus, kviečių miltai, augalinis aliejus, sviestas, pieno milteliai, kepimo milteliai (amonio karbonatas), druska, vanilės aromatas.",
    -98,
    -34,
    196,
    15,
    "#4a4232",
  );
  ctx.font = font(500, 8.5);
  drawText(ctx, "Laikyti sausoje vietoje. Geriausias iki: žr. dugne.", -98, 74, 196, 12, "#6b5b3a");
  ctx.restore();

  // scan frame
  const L = 28;
  const x0 = 28;
  const y0 = 140;
  const x1 = 272;
  const y1 = 352;
  bracket(ctx, x0, y0, 1, 1, L, C.mint, 3.5);
  bracket(ctx, x1, y0, -1, 1, L, C.mint, 3.5);
  bracket(ctx, x0, y1, 1, -1, L, C.mint, 3.5);
  bracket(ctx, x1, y1, -1, -1, L, C.mint, 3.5);

  // hint
  ctx.font = font(800, 11);
  const hint = "Nukreipk į ingredientų sąrašą";
  const hw = ctx.measureText(hint).width + 28;
  ctx.fillStyle = "rgb(0 0 0 / 0.5)";
  rr(ctx, 150 - hw / 2, 498, hw, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(hint, 150, 518);
  ctx.textAlign = "left";

  // shutter
  ctx.strokeStyle = "rgb(20 63 57 / 0.25)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(150, 591, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = C.forest;
  ctx.beginPath();
  ctx.arc(150, 591, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2.4;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => bracket(ctx, 150 + sx * 8, 591 + sy * 8, -sx, -sy, 5, "#fff", 2.4));
  return canvas;
}

/** Screen 2: the result for the same product. */
export function drawResultScreen(): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = C.canvas;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx);
  appBar(ctx, "Rezultatas");

  // product row
  ctx.shadowColor = "rgb(20 63 57 / 0.25)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "#fff";
  rr(ctx, 20, 84, 44, 44, 14);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.save();
  ctx.translate(30, 94);
  ctx.scale(0.1, 0.1);
  ctx.strokeStyle = C.forest;
  ctx.lineWidth = 21;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(new Path2D(MARK_FRAME_PATH));
  ctx.lineWidth = 25;
  ctx.stroke(new Path2D(MARK_CHECK_PATH));
  ctx.restore();
  ctx.fillStyle = C.ink;
  ctx.font = font(800, 15);
  ctx.fillText("Avižiniai sausainiai", 74, 103);
  ctx.fillStyle = C.muted;
  ctx.font = font(500, 12);
  ctx.fillText("200 g", 74, 121);

  // verdict card
  ctx.fillStyle = C.dangerSoft;
  rr(ctx, 16, 144, 268, 196, 22);
  ctx.fill();
  ctx.strokeStyle = C.dangerLine;
  ctx.lineWidth = 1;
  rr(ctx, 16.5, 144.5, 267, 195, 22);
  ctx.stroke();
  ctx.fillStyle = C.danger;
  ctx.beginPath();
  ctx.arc(52, 182, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = font(800, 24);
  ctx.textAlign = "center";
  ctx.fillText("!", 52, 191);
  ctx.textAlign = "left";
  ctx.fillStyle = C.danger;
  ctx.font = font(800, 9.5);
  spaced(ctx, "1.1px");
  ctx.fillText("RASTAS NEATITIKIMAS", 84, 170);
  spaced(ctx, "0px");
  ctx.fillStyle = C.ink;
  ctx.font = font(800, 15.5);
  drawText(ctx, "Aptiktas pasirinktas alergenas", 84, 190, 188, 19, C.ink);

  ctx.fillStyle = "rgb(255 255 255 / 0.85)";
  rr(ctx, 28, 222, 244, 42, 14);
  ctx.fill();
  ctx.fillStyle = C.danger;
  ctx.font = font(800, 11);
  spaced(ctx, "0.9px");
  const chipW = ctx.measureText("PIENAS").width + 28;
  rr(ctx, 38, 231, chipW, 24, 12);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillText("PIENAS", 52, 247);
  spaced(ctx, "0px");
  ctx.fillStyle = C.muted;
  ctx.font = font(500, 11);
  ctx.fillText("pagal tavo pasirinkimus", 38 + chipW + 10, 247);
  ctx.font = font(600, 12.5);
  drawText(ctx, "Sudėtyje aptiktas pienas arba jo sudedamosios dalys.", 30, 288, 240, 18, "rgb(28 40 37 / 0.85)");

  // ingredients card
  ctx.fillStyle = "#fff";
  rr(ctx, 16, 352, 268, 146, 22);
  ctx.fill();
  ctx.strokeStyle = C.line;
  rr(ctx, 16.5, 352.5, 267, 145, 22);
  ctx.stroke();
  ctx.fillStyle = C.muted;
  ctx.font = font(800, 9.5);
  spaced(ctx, "1.1px");
  ctx.fillText("NUSKAITYTA SUDĖTIS", 32, 378);
  spaced(ctx, "0px");

  const parts: Array<{ t: string; hit?: boolean }> = [
    { t: "avižų dribsniai (38 %), cukrus, kviečių miltai, augalinis aliejus, sviestas, " },
    { t: "pieno milteliai", hit: true },
    { t: ", kepimo milteliai (amonio karbonatas), druska, vanilės aromatas." },
  ];
  const words: Array<{ w: string; hit: boolean; join: boolean }> = [];
  parts.forEach((p) => {
    const ws = p.t.match(/\S+\s*/g) ?? [];
    ws.forEach((w, i) => words.push({ w, hit: !!p.hit, join: !!p.hit && i < ws.length - 1 }));
  });
  let x = 32;
  let y = 400;
  const maxX = 268;
  ctx.font = font(600, 12.5);
  // words inside a highlight keep their trailing space outside the box
  words.forEach(({ w, hit, join }) => {
    const text = w.replace(/ $/, "");
    const width = ctx.measureText(text).width;
    const space = ctx.measureText(" ").width;
    if (x + width > maxX && x > 32) {
      x = 32;
      y += 19;
    }
    if (hit) {
      ctx.fillStyle = C.dangerSoft;
      rr(ctx, x - 3, y - 13, width + 6 + (join ? space : 0), 19, 5);
      ctx.fill();
      ctx.strokeStyle = C.dangerLine;
      ctx.stroke();
      ctx.fillStyle = C.danger;
      ctx.font = font(800, 12.5);
    } else {
      ctx.fillStyle = "rgb(28 40 37 / 0.85)";
      ctx.font = font(600, 12.5);
    }
    ctx.fillText(text, x, y);
    x += width + (w.endsWith(" ") ? space : 0);
  });

  ctx.fillStyle = C.muted;
  ctx.font = font(500, 11);
  ctx.fillText("Visada patikrink originalią pakuotę.", 20, 524);

  ctx.fillStyle = C.forest;
  rr(ctx, 16, 550, 268, 46, 23);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = font(800, 13);
  ctx.textAlign = "center";
  ctx.fillText("Skenuoti dar kartą", 150, 578);
  ctx.textAlign = "left";
  return canvas;
}

/** Floating "PIENAS" callout shown next to the milk drop when the scan finds it. */
export function drawCalloutTexture(label: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 176;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);
  ctx.shadowColor = "rgb(120 30 20 / 0.45)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = C.danger;
  rr(ctx, 16, 12, 224, 52, 26);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#fff";
  ctx.font = font(800, 21);
  spaced(ctx, "2px");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 128, 39);
  return canvas;
}

export function canvasTexture(canvas: HTMLCanvasElement, maxAnisotropy = 4) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}
