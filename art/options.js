// Final look options A-D. Open options.html#a .. #d to switch.
// Shared: 320x180, floor crest (tight circle, proposal-2 design enlarged),
// proposal-1 HUD, updated fighters. Options vary lighting/mood only.

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
  H: ['#.#', '#.#', '###', '#.#', '#.#'], I: ['###', '.#.', '.#.', '.#.', '###'],
  L: ['#..', '#..', '#..', '#..', '###'], N: ['#.#', '###', '#.#', '#.#', '#.#'],
  O: ['###', '#.#', '#.#', '#.#', '###'], P: ['###', '#.#', '###', '#..', '#..'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'], S: ['###', '#..', '###', '..#', '###'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'], U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'],
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

// --- look options ----------------------------------------------------------

const OPTS = {
  a: {
    name: 'A CLASSIC ARENA',
    crowdBg: '#131019', rowDim: 0.35, flashP: 0.06,
    matBase: '#141416', matSheen: '#1a1a1e', pool: 'rgba(58,54,44,0.10)',
    bannerBg: '#0c0a06', bannerFg: null, // gold text
  },
  b: {
    name: 'B SPOTLIGHT NIGHT',
    crowdBg: '#0b0a10', rowDim: 0.5, dimAll: 0.3, flashP: 0.1,
    matBase: '#0f0f11', matSheen: '#151517', pool: 'rgba(255,236,190,0.10)',
    spotlight: true, vignette: true,
    bannerBg: '#0a0804', bannerFg: null,
  },
  c: {
    name: 'C GOLD GALA',
    crowdBg: '#161009', rowDim: 0.35, warmOverlay: 'rgba(201,154,63,0.07)', flashP: 0.06,
    matBase: '#161210', matSheen: '#201812', pool: 'rgba(201,154,63,0.09)',
    goldTrim: true,
    bannerBg: '#0e0a04', bannerFg: null,
  },
  d: {
    name: 'D TV BROADCAST',
    crowdBg: '#1a2030', rowDim: 0.22, flashP: 0.14,
    matBase: '#191b21', matSheen: '#232530', pool: 'rgba(180,200,255,0.08)',
    coolBanner: true, cornerPads: true,
    bannerBg: '#101420', bannerFg: '#e8e4da',
  },
};
const opt = OPTS[(location.hash || '#a').slice(1)] || OPTS.a;

// --- HUD + banner ----------------------------------------------------------

function drawHud() {
  R(0, 0, SW, 26, '#08080e');
  const bar = (x, fillFrom, frac) => {
    R(x - 1, 5, 114, 11, GOLD);
    R(x, 6, 112, 9, '#0e0e12');
    const w = Math.round(110 * frac);
    if (fillFrom === 'left') { R(x + 1, 7, w, 7, '#c02418'); R(x + 1, 7, w, 1, '#e05040'); }
    else { R(x + 1 + (110 - w), 7, w, 7, '#c02418'); R(x + 1 + (110 - w), 7, w, 1, '#e05040'); }
  };
  bar(9, 'left', 1);
  bar(199, 'right', 0.72);
  for (let i = 0; i < 3; i++) {
    const x = 146 + i * 11;
    R(x, 5, 8, 8, GOLD);
    if (i > 0) R(x + 1, 6, 6, 6, '#242430');
  }
  text(160 - textW('0:45') / 2, 16, '0:45', '#e8e4da');
}

function drawBanner() {
  R(0, 26, SW, 12, opt.bannerBg);
  R(0, 26, SW, 1, opt.coolBanner ? '#3a4a6a' : GOLD_DK);
  R(0, 37, SW, 1, opt.coolBanner ? '#3a4a6a' : GOLD_DK);
  if (opt.goldTrim) for (let x = 6; x < SW; x += 12) P(x, 31, GOLD_DK);
  const s = 'GOLDEN GLOVES BRUCHSAL';
  text(160 - textW(s) / 2, 29, s, opt.bannerFg || GOLD);
}

// --- crowd -----------------------------------------------------------------

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
  if (rnd() < opt.flashP) {
    g.fillStyle = 'rgba(200,210,255,0.18)'; g.fillRect(x + 4, y - 12, 5, 5);
    P(x + 6, y - 10, '#dfe4ff');
  }
}

function drawCrowd() {
  R(0, 38, SW, 46, opt.crowdBg);
  for (let row = 0; row < 4; row++) {
    const y = 48 + row * 11;
    for (let x = 2; x < SW - 6; x += 10) {
      if (rnd() < 0.15) continue;
      crowdPerson(x + Math.floor(rnd() * 3), y);
    }
    if (row < 2) { g.fillStyle = `rgba(10,8,16,${opt.rowDim})`; g.fillRect(0, y - 11, SW, 11); }
  }
  if (opt.dimAll) { g.fillStyle = `rgba(8,6,12,${opt.dimAll})`; g.fillRect(0, 38, SW, 46); }
  if (opt.warmOverlay) { g.fillStyle = opt.warmOverlay; g.fillRect(0, 38, SW, 46); }
}

// --- ring ------------------------------------------------------------------

const ROPE_Y = [58, 68, 78];
const MAT_Y = 84;

function drawMat() {
  R(0, MAT_Y, SW, SH - MAT_Y, opt.matBase);
  for (let y = MAT_Y + 6; y < SH; y += 8) R(0, y, SW, 1, opt.matSheen);
  for (let i = 0; i < 3; i++) {
    g.fillStyle = opt.pool;
    g.fillRect(70 - i * 20, 100 + i * 8, 180 + i * 40, 70 - i * 8);
  }
}

// Tight club crest on the mat: proposal-2 design, slightly enlarged.
function drawFloorCrest(cx, cy) {
  const lv = [
    [18, 8], [18, 4], [18, 0], [17, -4], [15, -8], [13, -11], [10, -13], [6, -14],
    [17, 12], [15, 15], [12, 17], [8, 18],
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

function drawPost(x, padColor) {
  R(x, 48, 12, MAT_Y - 46, '#18181c');
  R(x + 11, 48, 1, MAT_Y - 46, '#2e2e34');
  R(x - 1, 46, 14, 4, opt.goldTrim ? GOLD_DK : '#101014');
  if (padColor) R(x + 1, 52, 10, 8, padColor);
  R(x + 4, 62, 4, 4, '#d8d8d8');
}

function drawRopes() {
  for (const y of ROPE_Y) {
    R(12, y, SW - 24, 3, '#1c1c20');
    R(12, y, SW - 24, 1, '#34343a');
    for (let x = 20; x < SW - 24; x += 16) R(x, y + 1, 6, 1, opt.goldTrim ? GOLD_HI : GOLD);
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
  drawPost(2, opt.cornerPads ? '#c02418' : null);
  drawPost(SW - 14, opt.cornerPads ? '#2244cc' : null);
}

// --- lighting effects ------------------------------------------------------

function drawSpotlight() {
  // two beams from above converging on the ring center
  for (let y = 30; y < 165; y++) {
    const t = (y - 30) / 135;
    const w = 30 + t * 150;
    g.fillStyle = 'rgba(255,240,200,0.035)';
    g.fillRect(160 - w / 2, y, w, 1);
    if (t > 0.3) {
      const w2 = 20 + t * 90;
      g.fillRect(160 - w2 / 2, y, w2, 1);
    }
  }
}

function drawVignette() {
  g.fillStyle = 'rgba(0,0,0,0.22)';
  g.fillRect(0, 26, 26, SH - 26); g.fillRect(SW - 26, 26, 26, SH - 26);
  g.fillStyle = 'rgba(0,0,0,0.16)';
  g.fillRect(0, SH - 18, SW, 18);
  g.fillRect(26, 26, 30, SH - 44); g.fillRect(SW - 56, 26, 30, SH - 44);
}

// --- compose ---------------------------------------------------------------

drawCrowd();
drawMat();
drawRopes();
drawFloorCrest(160, 128);
const BX = initBoxers(R, P);
BX.drawMan(104, 150, 1, BX.MAN);
BX.drawWoman(216, 154, -1, BX.WOMAN);
if (opt.spotlight) drawSpotlight();
if (opt.vignette) drawVignette();
drawBanner();
drawHud();
text(SW - 2 - textW(opt.name), SH - 8, opt.name, '#4a4a56');

const cv = document.getElementById('cv');
const c2 = cv.getContext('2d');
c2.imageSmoothingEnabled = false;
c2.drawImage(off, 0, 0, SW * SCALE, SH * SCALE);
