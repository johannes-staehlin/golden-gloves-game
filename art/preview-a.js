// Art preview — PROPOSAL A: 320x180 internal ("more details").
// Same resolution as before, but every element uses the full pixel budget:
// shaded gloves with cuffs and laces, crowd with faces/hair/phones, and a
// wordless mat logo (wreath + boxer + 76).

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

// 3x5 pixel font
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

// --- palette ---------------------------------------------------------------

const GOLD = '#c99a3f', GOLD_HI = '#e9c568', GOLD_DK = '#8a6a28';

// --- HUD -------------------------------------------------------------------

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
  R(x, y - 5, 2, 5, shirtHi);                          // side lit by the ring
  if (rnd() < 0.18) {                                  // cheering
    R(x - 1, y - 9, 1, 4, skin); R(x + 6, y - 9, 1, 4, skin);
  } else {
    R(x - 1, y - 4, 1, 3, shirt); R(x + 6, y - 4, 1, 3, shirt);
  }
  R(x + 1, y - 9, 4, 4, skin);
  const v = rnd();
  if (v < 0.15) { P(x + 1, y - 10, hair); P(x + 4, y - 10, hair); }        // balding
  else if (v < 0.6) { R(x + 1, y - 10, 4, 2, hair); }                      // short hair
  else if (v < 0.8) { R(x + 1, y - 10, 4, 2, hair); R(x, y - 9, 1, 4, hair); R(x + 5, y - 9, 1, 4, hair); } // long hair
  else { R(x + 1, y - 10, 4, 2, '#5a2828'); P(x + 5, y - 9, '#5a2828'); }  // cap
  P(x + 2, y - 7, '#0c0a08'); P(x + 4, y - 7, '#0c0a08');                  // eyes
  if (rnd() < 0.06) {                                  // phone light
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
  R(0, MAT_Y, SW, SH - MAT_Y, '#141416');
  for (let y = MAT_Y + 6; y < SH; y += 8) R(0, y, SW, 1, '#1a1a1e');
  for (let i = 0; i < 3; i++) {
    g.fillStyle = 'rgba(58,54,44,0.10)';
    g.fillRect(70 - i * 20, 100 + i * 8, 180 + i * 40, 70 - i * 8);
  }
}

function drawGoldLogo(cx, cy) {
  // laurel wreath, curling in at the bottom around the 76
  const leaves = [
    [34, 4], [34, 0], [34, -3], [33, -7], [32, -10], [30, -13], [28, -16],
    [25, -19], [22, -21], [18, -23], [14, -24], [10, -25],
    [33, 10], [31, 13], [29, 15], [26, 17], [23, 19], [19, 21], [15, 22], [11, 23],
  ];
  for (const [ox, oy] of leaves) {
    R(cx - ox - 1, cy + oy, 3, 2, GOLD);
    P(cx - ox, cy + oy + 1, GOLD_DK);
    R(cx + ox - 1, cy + oy, 3, 2, GOLD);
    P(cx + ox, cy + oy + 1, GOLD_DK);
  }
  // victorious boxer silhouette (bigger — no text ring around it)
  R(cx - 3, cy - 30, 6, 6, GOLD);                      // head
  R(cx - 7, cy - 24, 14, 7, GOLD);                     // chest
  R(cx - 6, cy - 17, 12, 7, GOLD);
  R(cx - 5, cy - 10, 10, 5, GOLD);
  R(cx - 10, cy - 23, 3, 5, GOLD); R(cx + 7, cy - 23, 3, 5, GOLD);       // shoulders
  R(cx - 12, cy - 31, 4, 9, GOLD); R(cx + 8, cy - 31, 4, 9, GOLD);       // raised arms
  R(cx - 12, cy - 35, 4, 4, GOLD_HI); R(cx + 8, cy - 35, 4, 4, GOLD_HI); // fists
  R(cx - 7, cy - 24, 3, 12, GOLD_HI);                  // catch-light
  // '76' nested between the wreath tails
  text(cx - textW('76') / 2, cy + 19, '76', GOLD);
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

// --- boxers ----------------------------------------------------------------

const MAN = {
  skin: '#d89860', skinHi: '#eab27c', skinShad: '#a86e40',
  hair: '#1e1712', beard: '#241a12', tattoo: '#4e5866',
  trunk: '#1c1c20', trunkHi: '#34343a', trunkShad: '#101012',
  glove: '#cc2222', gloveHi: '#ee5544', gloveShad: '#8a1414',
};
const WOMAN = {
  skin: '#f0c098', skinHi: '#f8d8b8', skinShad: '#c89060',
  hair: '#d8b84c', hairHi: '#f0d878', hairShad: '#a8853a',
  bra: '#141418', braHi: '#26262e',
  leg: '#17171b', legHi: '#2c2c34', legShad: '#101014',
  glove: '#2244cc', gloveHi: '#4466ee', gloveShad: '#141c8a',
};

// Fully shaded glove: wrist cuff with laces, sheen, knuckle seam, thumb.
function drawGlove(M, dx, y, s, c) {
  M(dx - 2, y + 2, 2, s - 4, c.gloveShad);             // wrist cuff
  M(dx - 2, y + 3, 1, 1, '#e8e8e8');                   // laces
  M(dx - 2, y + 5, 1, 1, '#e8e8e8');
  M(dx, y, s, s, c.glove);                             // fist
  M(dx, y, s, 1, c.gloveHi);                           // top light
  M(dx + 1, y + 1, 3, 3, c.gloveHi);                   // sheen
  M(dx + s - 2, y + 1, 1, s - 4, c.gloveShad);         // knuckle seam
  M(dx + s - 4, y + s - 3, 4, 2, c.gloveShad);         // thumb
  M(dx, y + s - 1, s, 1, c.gloveShad);                 // under shade
}

function drawMan(bx, by, dir, c) {
  const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
  const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

  M(-16, by - 2, 34, 4, 'rgba(0,0,0,0.4)');

  M(-11, by - 28, 6, 13, c.skinShad);
  M(-11, by - 16, 5, 12, c.skinShad);
  M(-13, by - 4, 9, 4, '#202024');
  M(-12, by - 3, 7, 1, '#3a3a40');
  M(-13, by - 1, 9, 1, '#0c0c0c');
  M(4, by - 28, 6, 13, c.skin);
  M(4, by - 28, 2, 13, c.skinHi);
  M(5, by - 16, 5, 12, c.skin);
  M(5, by - 16, 2, 12, c.skinHi);
  Px(6, by - 29, c.skinShad);                          // knee
  M(4, by - 4, 10, 4, '#202024');
  M(5, by - 3, 7, 1, '#3a3a40');
  M(4, by - 1, 10, 1, '#0c0c0c');

  M(-9, by - 42, 17, 15, c.trunk);
  M(-9, by - 42, 17, 2, GOLD);
  M(-2, by - 40, 5, 1, '#d8d8d8');
  M(4, by - 40, 2, 12, c.trunkHi);
  M(-1, by - 33, 2, 6, c.trunkShad);
  M(-9, by - 40, 2, 13, c.trunkShad);
  M(-6, by - 31, 1, 4, c.trunkShad);                   // fold

  M(-8, by - 58, 16, 16, c.skin);
  M(-8, by - 58, 3, 16, c.skinShad);
  M(3, by - 58, 5, 15, c.skinHi);
  M(0, by - 57, 5, 1, c.skinShad);                     // collarbone
  M(-1, by - 51, 6, 1, c.skinShad);
  Px(4, by - 53, c.skinShad);
  for (let i = 0; i < 3; i++) {
    Px(-1, by - 48 + i * 3, c.skinShad);
    Px(1, by - 47 + i * 3, c.skinShad);
  }

  M(-2, by - 61, 6, 4, c.skinShad);
  M(-4, by - 72, 11, 12, c.skin);
  M(-5, by - 74, 12, 4, c.hair);
  M(-5, by - 70, 3, 5, c.hair);
  M(3, by - 68, 4, 2, c.hair);
  M(4, by - 66, 3, 2, '#ffffff');
  Px(6, by - 66, '#241408');
  M(7, by - 64, 2, 3, c.skinShad);
  M(1, by - 63, 8, 3, c.beard);
  M(5, by - 65, 3, 2, c.beard);
  Px(3, by - 62, '#3a2c22');                           // beard texture
  Px(6, by - 61, '#3a2c22');
  Px(5, by - 62, '#8a5a4a');
  M(-2, by - 67, 2, 3, c.skinShad);

  M(-12, by - 58, 5, 10, c.skinShad);
  M(-9, by - 51, 10, 5, c.skinShad);
  for (const [tx, ty] of [[-11, 56], [-10, 53], [-12, 51], [-8, 50], [-6, 49], [-9, 55], [-4, 50]]) {
    M(tx, by - ty, 2, 2, c.tattoo);
  }
  drawGlove(M, 3, by - 62, 9, c);

  M(5, by - 56, 6, 5, c.skin);
  M(10, by - 54, 5, 5, c.skinHi);
  drawGlove(M, 14, by - 58, 9, c);
}

function drawWoman(bx, by, dir, c) {
  const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
  const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

  M(-14, by - 2, 30, 4, 'rgba(0,0,0,0.4)');

  M(-11, by - 3, 8, 3, '#d8d8d8');
  M(-11, by - 1, 8, 1, '#909090');
  M(3, by - 3, 9, 3, '#e8e8e8');
  M(3, by - 1, 9, 1, '#909090');

  M(-9, by - 30, 5, 27, c.legShad);
  M(3, by - 30, 5, 27, c.leg);
  M(3, by - 30, 2, 27, c.legHi);
  Px(4, by - 16, c.legHi);
  M(-8, by - 36, 15, 7, c.leg);
  M(-8, by - 36, 15, 2, c.legHi);
  Px(3, by - 34, GOLD);

  M(-6, by - 46, 12, 10, c.skin);
  M(-6, by - 46, 2, 10, c.skinShad);
  M(3, by - 46, 3, 10, c.skinHi);
  Px(0, by - 42, c.skinShad);
  Px(0, by - 39, c.skinShad);
  Px(1, by - 38, c.skinShad);

  M(-6, by - 53, 12, 7, c.bra);
  M(2, by - 52, 2, 5, c.braHi);
  M(-5, by - 56, 2, 4, c.bra);
  M(3, by - 56, 2, 4, c.bra);

  M(-1, by - 56, 4, 3, c.skinShad);
  M(-3, by - 66, 9, 11, c.skin);
  M(-4, by - 68, 10, 3, c.hairHi);
  M(-5, by - 66, 3, 9, c.hair);
  M(-6, by - 58, 3, 16, c.hair);
  Px(-5, by - 54, c.hairShad); Px(-5, by - 49, c.hairShad); Px(-5, by - 44, c.hairShad);
  M(2, by - 62, 3, 1, c.hairShad);
  M(3, by - 61, 3, 2, '#ffffff');
  Px(5, by - 61, '#24303e');
  M(6, by - 59, 1, 2, c.skinShad);
  M(4, by - 57, 3, 1, '#c06858');
  M(-1, by - 61, 2, 3, c.skinShad);
  Px(0, by - 58, GOLD);                                // earring

  M(-8, by - 52, 4, 8, c.skinShad);
  M(-5, by - 47, 8, 4, c.skinShad);
  drawGlove(M, 3, by - 56, 8, c);

  M(4, by - 50, 5, 4, c.skin);
  M(8, by - 48, 4, 4, c.skinHi);
  drawGlove(M, 12, by - 52, 8, c);
}

// --- compose ---------------------------------------------------------------

drawCrowd();
drawMat();
drawRopes();
drawGoldLogo(160, 128);
drawMan(104, 150, 1, MAN);
drawWoman(216, 154, -1, WOMAN);
drawBanner();
drawHud();

const cv = document.getElementById('cv');
const c2 = cv.getContext('2d');
c2.imageSmoothingEnabled = false;
c2.drawImage(off, 0, 0, SW * SCALE, SH * SCALE);
