// Static art preview for the detailed VGA-style look.
// Scene is drawn at 320x180 and scaled 3x with no smoothing.

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
function trap(yTop, yBot, xTL, xTR, xBL, xBR, c) {
  for (let y = yTop; y <= yBot; y++) {
    const t = (y - yTop) / Math.max(1, yBot - yTop);
    const xl = Math.round(xTL + (xBL - xTL) * t);
    const xr = Math.round(xTR + (xBR - xTR) * t);
    R(xl, y, xr - xl + 1, 1, c);
  }
}

let seed = 1337;
function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }

// 3x5 pixel font (just the letters we need)
const FONT = {
  C: ['###', '#..', '#..', '#..', '###'],
  O: ['###', '#.#', '#.#', '#.#', '###'],
  U: ['#.#', '#.#', '#.#', '#.#', '###'],
  G: ['###', '#..', '#.#', '#.#', '###'],
  A: ['###', '#.#', '###', '#.#', '#.#'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['###', '#..', '###', '..#', '###'],
  L: ['#..', '#..', '#..', '#..', '###'],
  K: ['#.#', '#.#', '##.', '#.#', '#.#'],
  E: ['###', '#..', '##.', '#..', '###'],
  M: ['#.#', '###', '#.#', '#.#', '#.#'],
  Y: ['#.#', '#.#', '###', '.#.', '.#.'],
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

// --- wall ------------------------------------------------------------------

function drawWall() {
  R(0, 0, SW, 100, '#a85818');
  R(0, 0, SW, 4, '#5c3210');                       // ceiling trim
  R(0, 4, SW, 1, '#7c4414');
  // vertical panel seams
  for (let x = 20; x < SW; x += 44) { R(x, 4, 1, 96, '#8a4a14'); }
  // baseboard shadow where wall meets floor
  R(0, 94, SW, 2, '#6a3a10');
}

function drawSign() {
  // COUGARS banner
  R(120, 4, 82, 20, '#7a1410');
  R(122, 6, 78, 16, '#e8a020');
  R(122, 6, 78, 2, '#f8c050');
  text(126, 9, 'COUGARS', '#203890', 2);
  text(125, 8, 'COUGARS', '#f8e858', 2);
}

function drawDoor() {
  // locker room sign + double door, left of the bleachers
  R(30, 26, 42, 8, '#3a2a20');
  text(33, 27, 'LOCKER RM', '#c8c0a8', 1);
  R(32, 38, 38, 56, '#4a3222');                    // frame
  R(34, 40, 16, 54, '#6a4830');                    // left door
  R(52, 40, 16, 54, '#5e3f2a');                    // right door
  R(38, 46, 8, 10, '#2c3e50');                     // windows
  R(56, 46, 8, 10, '#26374a');
  P(48, 68, '#c8b060'); P(54, 68, '#c8b060');      // handles
}

function drawHoop(x, mirror) {
  // backboard
  R(x, 36, 14, 12, '#d8d8d0');
  R(x + 1, 37, 12, 10, '#b8b8b0');
  R(x + 4, 39, 6, 6, '#c86820');                   // target square
  // rim + net
  const rimX = mirror ? x - 6 : x + 12;
  R(rimX, 47, 8, 2, '#e07820');
  for (let i = 0; i < 4; i++) line(rimX + 1 + i * 2, 49, rimX + 3 + i, 55, '#cfcfc8');
  R(rimX + 1, 55, 5, 1, '#cfcfc8');
  // support strut to wall
  line(mirror ? x + 14 : x, 40, mirror ? x + 18 : x - 4, 36, '#6a3a10', 2);
}

// --- bleachers + crowd -----------------------------------------------------

const SHIRTS = ['#c03030', '#3050b0', '#2f8f4f', '#8040a0', '#e0e0e0', '#e0a020', '#20a0a0', '#d06090'];
const SKINS = ['#eaa56b', '#c07a44', '#8a5530', '#f0b888'];
const HAIRS = ['#2a1c10', '#5a3a1c', '#e8cc50', '#888078', '#a04818'];

function person(x, y) {
  // seated spectator, (x,y) = bottom-left of torso
  const shirt = pick(SHIRTS), skin = pick(SKINS), hair = pick(HAIRS);
  const cheer = rnd() < 0.25;
  R(x, y - 6, 6, 6, shirt);                        // torso
  R(x + 1, y - 6, 4, 1, shirt);
  if (cheer) {                                     // arms up
    R(x - 1, y - 10, 1, 4, skin); R(x + 6, y - 10, 1, 4, skin);
  } else {
    R(x - 1, y - 5, 1, 4, skin); R(x + 6, y - 5, 1, 4, skin);
  }
  R(x + 1, y - 10, 4, 4, skin);                    // head
  R(x + 1, y - 11, 4, 2, hair);                    // hair
  P(x + 1, y - 9, hair);
  P(x + 3, y - 9, '#201408'); P(x + 5, y - 9, '#201408'); // eyes hint (dark px)
}

function drawBleachers() {
  const left = 78, right = 316;
  for (let row = 0; row < 4; row++) {
    const seatY = 40 + row * 14;                   // top of the seat plank
    R(left, seatY, right - left, 3, '#98a2b6');    // seat
    R(left, seatY + 3, right - left, 11, '#5e6880'); // riser
    R(left, seatY + 3, right - left, 1, '#454e63');
  }
  R(78, 40, 2, 56, '#454e63');                     // end cap
  // crowd, one row per bleacher step (drawn back to front)
  for (let row = 0; row < 4; row++) {
    const y = 40 + row * 14 + 10;
    for (let x = 84; x < 306; x += 11) {
      if (rnd() < 0.18) continue;                  // empty seat
      person(x + Math.floor(rnd() * 3), y);
    }
  }
}

// --- gym floor + mats ------------------------------------------------------

function drawFloor() {
  for (let y = 96; y < SH; y++) {
    const t = (y - 96) / (SH - 96);
    const c = t < 0.33 ? '#b06a2c' : t < 0.66 ? '#bd7634' : '#c8823c';
    R(0, y, SW, 1, c);
  }
  // horizontal plank lines with staggered seams
  for (let y = 100; y < SH; y += 6) {
    R(0, y, SW, 1, '#8a5220');
    const o = (y * 7) % 40;
    for (let x = o; x < SW; x += 46) P(x, y + 3, '#8a5220');
  }
}

function drawMat(x, w) {
  R(x, 150, w, 30, '#2543a5');
  R(x, 150, w, 2, '#7f9fdf');
  R(x, 150, 2, 30, '#7f9fdf');
  R(x + w - 2, 150, 2, 30, '#7f9fdf');
  R(x, 178, w, 2, '#182d78');
}

function drawProps() {
  // spare gloves on the left mat
  R(14, 166, 5, 4, '#a01818'); R(19, 168, 5, 4, '#c02020');
  P(15, 165, '#d84040'); P(20, 167, '#d84040');
  // dumbbell
  R(34, 172, 12, 2, '#606068');
  R(32, 170, 3, 6, '#3a3a42'); R(45, 170, 3, 6, '#3a3a42');
  // bucket + towel by the right corner
  trap(158, 170, 282, 292, 284, 290, '#8a929e');
  R(282, 158, 10, 2, '#b8c0cc');
  line(282, 156, 292, 156, '#5a626e');
  R(268, 152, 10, 4, '#e8e4d8');                   // towel on the apron
  R(268, 152, 10, 1, '#c8c4b8');
  // stool bottom-left of ring
  R(84, 160, 10, 3, '#8a4a20');
  R(85, 163, 2, 9, '#6a3616'); R(91, 163, 2, 9, '#6a3616');
}

// --- ring ------------------------------------------------------------------

const RING = {
  backY: 100, frontY: 142, apronY: 154,
  backL: 82, backR: 238, frontL: 58, frontR: 262,
};

function drawRingPlatform() {
  const r = RING;
  // canvas surface (lighter toward the front)
  trap(r.backY, r.frontY, r.backL, r.backR, r.frontL, r.frontR, '#d9b070');
  trap(r.backY, r.backY + 12, r.backL, r.backR, r.backL - 7, r.backR + 7, '#cda361');
  R(r.frontL, r.frontY, r.frontR - r.frontL, 1, '#a87c40');
  // wooden apron (front + angled sides)
  trap(r.frontY + 1, r.apronY, r.frontL, r.frontR, r.frontL, r.frontR, '#8a4a20');
  R(r.frontL, r.frontY + 1, r.frontR - r.frontL, 2, '#a85c28');
  for (let x = r.frontL + 6; x < r.frontR; x += 9) R(x, r.frontY + 3, 1, r.apronY - r.frontY - 3, '#6a3616');
  trap(r.backY, r.apronY, r.backL - 1, r.backL, r.frontL - 1, r.frontL, '#703c1a');
  trap(r.backY, r.apronY, r.backR, r.backR + 1, r.frontR, r.frontR + 1, '#703c1a');
  // shadow under the apron
  R(r.frontL - 2, r.apronY, r.frontR - r.frontL + 4, 2, '#7c4818');
}

function drawPost(x, topY, baseY, w) {
  R(x, topY, w, baseY - topY, '#e0e0e0');
  R(x + w - 1, topY, 1, baseY - topY, '#a0a0a0');
  R(x, topY, w, 1, '#ffffff');
  // red turnbuckle pad on the lower half
  R(x - 1, topY + 6, w + 2, baseY - topY - 10, '#c02020');
  R(x - 1, topY + 6, 1, baseY - topY - 10, '#e04040');
}

function ropes3(x0, ys0, x1, ys1, sag) {
  for (let i = 0; i < 3; i++) {
    const y0 = ys0[i], y1 = ys1[i];
    // draw as two halves so long ropes sag in the middle
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + sag;
    line(x0, y0, mx, my, '#d02020', 2);
    line(mx, my, x1, y1, '#d02020', 2);
    line(x0, y0 - 1, mx, my - 1, '#f05050', 1);
    line(mx, my - 1, x1, y1 - 1, '#f05050', 1);
  }
}

function drawRingBack() {
  const r = RING;
  drawPost(r.backL - 2, 72, r.backY + 2, 3);
  drawPost(r.backR - 1, 72, r.backY + 2, 3);
  ropes3(r.backL, [76, 84, 92], r.backR, [76, 84, 92], 1);
}

function drawRingFrontRopesAndPosts() {
  const r = RING;
  // side ropes: back post height down to front post height
  ropes3(r.backL, [76, 84, 92], r.frontL + 2, [108, 119, 130], 0);
  ropes3(r.backR, [76, 84, 92], r.frontR - 2, [108, 119, 130], 0);
  drawPost(r.frontL - 2, 102, r.frontY + 2, 4);
  drawPost(r.frontR - 2, 102, r.frontY + 2, 4);
  ropes3(r.frontL + 2, [108, 119, 130], r.frontR - 2, [108, 119, 130], 2);
}

// --- detailed boxers -------------------------------------------------------

function drawBoxerV2(bx, by, dir, c) {
  // (bx, by) = center of stance at the feet; dir = +1 faces right. ~54px tall.
  const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
  const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

  // shadow on the canvas
  M(-12, by - 1, 26, 3, '#b89058');

  // back leg (shaded) + shoe
  M(-9, by - 18, 5, 7, c.skinShad);        // thigh
  M(-10, by - 12, 4, 9, c.skinShad);       // shin
  M(-12, by - 4, 8, 4, '#e8e8e8');
  M(-11, by - 3, 2, 1, '#b0b0b0');         // laces
  M(-12, by - 1, 8, 1, '#303030');
  // front leg + shoe
  M(3, by - 18, 5, 7, c.skin);
  M(3, by - 18, 2, 7, c.skinHi);
  M(4, by - 12, 4, 9, c.skin);
  M(4, by - 12, 2, 9, c.skinHi);
  M(3, by - 4, 9, 4, '#e8e8e8');
  M(5, by - 3, 2, 1, '#b0b0b0');
  M(3, by - 1, 9, 1, '#303030');

  // trunks
  M(-8, by - 29, 15, 11, c.trunk);
  M(-8, by - 29, 15, 2, c.trunkHi);        // waistband
  M(4, by - 27, 2, 9, c.trunkHi);          // side stripe
  M(-1, by - 22, 2, 4, c.trunkShad);       // leg split
  M(-8, by - 27, 2, 9, c.trunkShad);       // back shade

  // torso (muscled: shaded back, lit chest)
  M(-7, by - 42, 14, 13, c.skin);
  M(-7, by - 42, 3, 13, c.skinShad);       // back
  M(3, by - 42, 4, 12, c.skinHi);          // chest catch-light
  M(-1, by - 37, 5, 1, c.skinShad);        // pec underline
  M(0, by - 34, 1, 1, c.skinShad);         // abs
  M(1, by - 32, 1, 1, c.skinShad);
  M(0, by - 30, 1, 1, c.skinShad);
  Px(4, by - 38, c.skinShad);              // nipple

  // neck + head
  M(-1, by - 44, 5, 2, c.skinShad);
  M(-3, by - 52, 9, 9, c.skin);
  M(-4, by - 54, 10, 3, c.hair);           // hair top
  M(-5, by - 52, 3, 8, c.hair);            // back of head
  M(3, by - 49, 3, 1, c.hair);             // brow
  M(3, by - 48, 2, 2, '#ffffff');          // eye
  Px(5, by - 48, '#241408');
  M(5, by - 46, 2, 2, c.skinShad);         // nose
  Px(5, by - 44, '#8a4030');               // mouth
  M(-1, by - 47, 2, 3, c.skinShad);        // ear
  M(0, by - 44, 4, 1, c.skinShad);         // jaw shade

  // rear arm: bent, glove guarding the chin
  M(-9, by - 42, 4, 7, c.skinShad);        // deltoid/upper arm
  M(-6, by - 37, 7, 4, c.skinShad);        // forearm coming forward
  M(2, by - 45, 7, 7, c.glove);            // glove by the chin
  M(2, by - 45, 3, 3, c.gloveHi);
  M(2, by - 39, 7, 1, c.gloveShad);

  // lead arm: extended guard
  M(4, by - 40, 5, 4, c.skin);
  M(8, by - 39, 4, 4, c.skinHi);
  M(11, by - 41, 7, 7, c.glove);
  M(11, by - 41, 3, 3, c.gloveHi);
  M(11, by - 35, 7, 1, c.gloveShad);
}

const RED_BOXER = {
  skin: '#eaa56b', skinHi: '#f7c18d', skinShad: '#c07a44',
  hair: '#33231a',
  trunk: '#f0f0f0', trunkHi: '#ffffff', trunkShad: '#c03028',
  glove: '#cc2222', gloveHi: '#ee5544', gloveShad: '#8a1414',
};
const BLUE_BOXER = {
  skin: '#f0b080', skinHi: '#fbd0a0', skinShad: '#c8854e',
  hair: '#e8cc50',
  trunk: '#3050c0', trunkHi: '#5070e0', trunkShad: '#203890',
  glove: '#2244cc', gloveHi: '#4466ee', gloveShad: '#141c8a',
};

// --- edge characters -------------------------------------------------------

function drawCornerMan(x, y) {
  // trainer in a red tee standing by the door
  R(x + 1, y - 20, 6, 8, '#c03030');
  R(x, y - 19, 1, 5, '#eaa56b'); R(x + 7, y - 19, 1, 5, '#eaa56b');
  R(x + 1, y - 12, 6, 9, '#31456a');       // jeans
  R(x + 1, y - 12, 3, 9, '#3b527c');
  R(x + 1, y - 3, 3, 3, '#28201a'); R(x + 5, y - 3, 3, 3, '#28201a');
  R(x + 2, y - 24, 4, 4, '#eaa56b');
  R(x + 2, y - 25, 4, 2, '#2a1c10');
  P(x + 4, y - 23, '#201408');
}

function drawCheerleader(x, y) {
  R(x + 1, y - 18, 6, 7, '#e8e8e8');       // top
  R(x + 1, y - 15, 6, 1, '#c03030');
  R(x, y - 11, 8, 5, '#c03030');           // skirt
  R(x + 1, y - 6, 2, 6, '#f0b888'); R(x + 5, y - 6, 2, 6, '#f0b888');
  R(x + 1, y - 1, 2, 2, '#e8e8e8'); R(x + 5, y - 1, 2, 2, '#e8e8e8');
  R(x - 1, y - 21, 2, 2, '#c03030'); R(x + 7, y - 21, 2, 2, '#c03030'); // pompoms
  R(x, y - 20, 1, 3, '#f0b888'); R(x + 7, y - 20, 1, 3, '#f0b888');
  R(x + 2, y - 22, 4, 4, '#f0b888');       // head
  R(x + 2, y - 23, 4, 1, '#e8cc50');
  R(x + 6, y - 22, 1, 4, '#e8cc50');       // ponytail
  P(x + 3, y - 21, '#201408');
}

// --- compose ---------------------------------------------------------------

drawWall();
drawSign();
drawDoor();
drawHoop(2, false);
drawHoop(304, true);
drawBleachers();
drawFloor();
drawMat(0, 74);
drawMat(246, 74);
drawRingBack();
drawRingPlatform();
drawBoxerV2(130, 139, 1, RED_BOXER);
drawBoxerV2(192, 137, -1, BLUE_BOXER);
drawRingFrontRopesAndPosts();
drawProps();
drawCornerMan(8, 94);
drawCheerleader(300, 148);

// blit up
const cv = document.getElementById('cv');
const c2 = cv.getContext('2d');
c2.imageSmoothingEnabled = false;
c2.drawImage(off, 0, 0, SW * SCALE, SH * SCALE);
