// FINAL art direction: Classic Arena (option A) with the agreed tweaks —
// lighter mat with a soft, wide spotlight pool (feathered only at the edge),
// tighter floor crest, per-fighter round boxes under the health bars, and a
// bigger center timer. This file is the reference for the game renderer.

'use strict';

const SW = 320, SH = 180, SCALE = 3;
const off = document.createElement('canvas');
off.width = SW; off.height = SH;
const g = off.getContext('2d');

// --- helpers ---------------------------------------------------------------

function R(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function P(x, y, c) { R(x, y, 1, 1, c); }
function line(x0, y0, x1, y1, c, t = 1) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) {
    R(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), 1, t, c);
  }
}

let seed = 20260719;
function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }

const FONT = {
  A: ['###', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'],
  C: ['###', '#..', '#..', '#..', '###'], D: ['##.', '#.#', '#.#', '#.#', '##.'],
  E: ['###', '#..', '##.', '#..', '###'], G: ['###', '#..', '#.#', '#.#', '###'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'], L: ['#..', '#..', '#..', '#..', '###'],
  N: ['#.#', '###', '#.#', '#.#', '#.#'], O: ['###', '#.#', '#.#', '#.#', '###'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'], S: ['###', '#..', '###', '..#', '###'],
  U: ['#.#', '#.#', '#.#', '#.#', '###'], V: ['#.#', '#.#', '#.#', '#.#', '.#.'],
  '0': ['###', '#.#', '#.#', '#.#', '###'], '4': ['#.#', '#.#', '###', '..#', '..#'],
  '5': ['###', '#..', '###', '..#', '###'], '6': ['###', '#..', '###', '#.#', '###'],
  '7': ['###', '..#', '.#.', '.#.', '.#.'], ':': ['...', '.#.', '...', '.#.', '...'],
  ' ': ['...', '...', '...', '...', '...'],
};
function text(x, y, s, c, sc = 1) {
  let cx = x;
  for (const ch of s) {
    const gl = FONT[ch] || FONT[' '];
    for (let r = 0; r < 5; r++) for (let i = 0; i < 3; i++) {
      if (gl[r][i] === '#') R(cx + i * sc, y + r * sc, sc, sc, c);
    }
    cx += 4 * sc;
  }
}
function textW(s, sc = 1) { return s.length * 4 * sc - sc; }

const GOLD = '#c99a3f', GOLD_HI = '#e9c568', GOLD_DK = '#8a6a28';

// --- HUD: bars with round boxes below, big center timer --------------------

function drawHud() {
  R(0, 0, SW, 26, '#08080e');
  const bar = (x, fillFrom, frac) => {
    R(x - 1, 4, 114, 11, GOLD);
    R(x, 5, 112, 9, '#0e0e12');
    const w = Math.round(110 * frac);
    if (fillFrom === 'left') { R(x + 1, 6, w, 7, '#c02418'); R(x + 1, 6, w, 1, '#e05040'); }
    else { R(x + 1 + (110 - w), 6, w, 7, '#c02418'); R(x + 1 + (110 - w), 6, w, 1, '#e05040'); }
  };
  bar(9, 'left', 1);
  bar(199, 'right', 0.72);
  // round wins (first to 2), under each fighter's bar
  const pip = (x, won) => {
    R(x, 17, 7, 7, GOLD);
    if (!won) R(x + 1, 18, 5, 5, '#242430');
  };
  pip(9, true); pip(19, false);          // red took round 1
  pip(295, false); pip(305, false);
  // big round timer, center
  text(160 - textW('0:45', 2) / 2, 8, '0:45', '#e8e4da', 2);
}

// --- banner + crowd --------------------------------------------------------

function drawBanner() {
  R(0, 26, SW, 12, '#0c0a06');
  R(0, 26, SW, 1, GOLD_DK);
  R(0, 37, SW, 1, GOLD_DK);
  const s = 'GOLDEN GLOVES BRUCHSAL';
  text(160 - textW(s) / 2, 29, s, GOLD);
}

const DIM_SHIRTS = [
  ['#2a2438', '#3a3450'], ['#382830', '#4c3842'], ['#243038', '#34424e'],
  ['#302838', '#42384c'], ['#3a3226', '#4e4434'], ['#26263a', '#363650'],
  ['#402830', '#563a42'],
];
const DIM_SKINS = ['#8a6a50', '#a07a58', '#6a4e38', '#96725a'];
const DIM_HAIRS = ['#1a140e', '#2a2014', '#3a2a18', '#151517', '#5a4a2a', '#6a6058'];

function crowdPerson(x, y) {
  const [shirt, shirtHi] = pick(DIM_SHIRTS);
  const skin = pick(DIM_SKINS), hair = pick(DIM_HAIRS);
  R(x, y - 5, 6, 5, shirt);
  R(x, y - 5, 2, 5, shirtHi);
  if (rnd() < 0.18) {
    R(x - 1, y - 9, 1, 4, skin); R(x + 6, y - 9, 1, 4, skin);
  } else {
    R(x - 1, y - 4, 1, 3, shirt); R(x + 6, y - 4, 1, 3, shirt);
  }
  R(x + 1, y - 9, 4, 4, skin);
  const v = rnd();
  if (v < 0.15) { P(x + 1, y - 10, hair); P(x + 4, y - 10, hair); }
  else if (v < 0.6) { R(x + 1, y - 10, 4, 2, hair); }
  else if (v < 0.8) { R(x + 1, y - 10, 4, 2, hair); R(x, y - 9, 1, 4, hair); R(x + 5, y - 9, 1, 4, hair); }
  else { R(x + 1, y - 10, 4, 2, '#5a2828'); P(x + 5, y - 9, '#5a2828'); }
  P(x + 2, y - 7, '#0c0a08'); P(x + 4, y - 7, '#0c0a08');
  if (rnd() < 0.06) {
    g.fillStyle = 'rgba(200,210,255,0.18)'; g.fillRect(x + 4, y - 12, 5, 5);
    P(x + 6, y - 10, '#dfe4ff');
  }
}

function drawCrowd() {
  R(0, 38, SW, 46, '#131019');
  for (let row = 0; row < 4; row++) {
    const y = 48 + row * 11;
    for (let x = 2; x < SW - 6; x += 10) {
      if (rnd() < 0.15) continue;
      crowdPerson(x + Math.floor(rnd() * 3), y);
    }
    if (row < 2) { g.fillStyle = 'rgba(10,8,16,0.35)'; g.fillRect(0, y - 11, SW, 11); }
  }
}

// --- ring ------------------------------------------------------------------

const ROPE_Y = [58, 68, 78];
const MAT_Y = 84;

function drawMat() {
  // lighter base so black trunks/leggings read against it
  R(0, MAT_Y, SW, SH - MAT_Y, '#1d1d22');
  for (let y = MAT_Y + 6; y < SH; y += 8) R(0, y, SW, 1, '#25252b');
}

function drawSoftSpotlight() {
  // wide bright plateau; the layers fan out only near the edge so the
  // falloff is gentle and low-contrast
  const widths = [186, 214, 236, 252, 264, 272];
  for (let i = widths.length - 1; i >= 0; i--) {
    const w = widths[i];
    g.fillStyle = 'rgba(255,240,210,0.028)';
    g.fillRect(160 - w / 2, MAT_Y + 4 + i * 2, w, SH - MAT_Y - 4 - i * 2);
  }
}

// Tight club crest on the mat (rounder circle).
function drawFloorCrest(cx, cy) {
  const lv = [
    [17, 8], [17, 3], [16, -2], [14, -7], [12, -10], [9, -13], [5, -14],
    [16, 13], [14, 16], [11, 17], [7, 18],
  ];
  for (const [ox, oy] of lv) {
    R(cx - ox - 1, cy + oy, 3, 2, GOLD);
    R(cx + ox - 2, cy + oy, 3, 2, GOLD);
  }
  R(cx - 9, cy - 16, 3, 3, GOLD_HI); R(cx + 6, cy - 16, 3, 3, GOLD_HI);  // fists
  R(cx - 9, cy - 13, 3, 6, GOLD); R(cx + 6, cy - 13, 3, 6, GOLD);        // arms
  R(cx - 2, cy - 14, 4, 4, GOLD);                                        // head
  R(cx - 6, cy - 10, 13, 6, GOLD);                                       // chest
  R(cx - 5, cy - 4, 11, 5, GOLD);
  R(cx - 4, cy + 1, 9, 4, GOLD);
  R(cx - 6, cy - 10, 3, 11, GOLD_HI);                                    // catch-light
  text(cx - textW('76') / 2, cy + 13, '76', GOLD);
}

function drawPost(x) {
  R(x, 48, 12, MAT_Y - 46, '#18181c');
  R(x + 11, 48, 1, MAT_Y - 46, '#2e2e34');
  R(x - 1, 46, 14, 4, '#101014');
  R(x + 4, 60, 4, 4, '#d8d8d8');
}

function drawRopes() {
  for (const y of ROPE_Y) {
    R(12, y, SW - 24, 3, '#1c1c20');
    R(12, y, SW - 24, 1, '#34343a');
    for (let x = 20; x < SW - 24; x += 16) R(x, y + 1, 6, 1, GOLD);
  }
  for (const x of [56, 122, 198, 264]) {
    R(x, ROPE_Y[0] - 2, 3, ROPE_Y[2] - ROPE_Y[0] + 7, '#e4e4e0');
    R(x + 2, ROPE_Y[0] - 2, 1, ROPE_Y[2] - ROPE_Y[0] + 7, '#a8a8a4');
  }
  for (let i = 0; i < 3; i++) {
    const y = ROPE_Y[i];
    line(13, y + 1, -3, 96 + i * 26, '#1c1c20', 3);
    line(13, y, -3, 95 + i * 26, '#34343a', 1);
    line(SW - 13, y + 1, SW + 3, 96 + i * 26, '#1c1c20', 3);
    line(SW - 13, y, SW + 3, 95 + i * 26, '#34343a', 1);
  }
  drawPost(2);
  drawPost(SW - 14);
}

// --- compose ---------------------------------------------------------------

drawCrowd();
drawMat();
drawSoftSpotlight();
drawRopes();
drawFloorCrest(160, 128);
const BX = initBoxers(R, P);
BX.drawMan(104, 150, 1, BX.MAN);
BX.drawWoman(216, 154, -1, BX.WOMAN);
drawBanner();
drawHud();

const cv = document.getElementById('cv');
const c2 = cv.getContext('2d');
c2.imageSmoothingEnabled = false;
c2.drawImage(off, 0, 0, SW * SCALE, SH * SCALE);
