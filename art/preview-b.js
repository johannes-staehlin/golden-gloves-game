// Art preview — PROPOSAL B: 640x360 internal ("much more detail").
// Double the pixel grid of proposal A, everything drawn natively at the finer
// resolution: readable rope branding, textured beard/braid, muscle shading,
// crowd with faces and clothing, wordless mat logo (wreath + boxer + 76).

'use strict';

const SW = 640, SH = 360, SCALE = 2;
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
  R(0, 0, SW, 52, '#08080e');
  const bar = (x, fillFrom, frac) => {
    R(x - 2, 10, 232, 24, GOLD);
    R(x - 1, 11, 230, 22, GOLD_DK);
    R(x, 12, 228, 20, '#0e0e12');
    const w = Math.round(224 * frac);
    const fx = fillFrom === 'left' ? x + 2 : x + 2 + (224 - w);
    R(fx, 14, w, 16, '#c02418');
    R(fx, 14, w, 3, '#e05040');
    R(fx, 28, w, 2, '#8a1810');
  };
  bar(18, 'left', 1);
  bar(394, 'right', 0.72);
  for (let i = 0; i < 3; i++) {
    const x = 290 + i * 22;
    R(x, 10, 16, 16, GOLD);
    R(x + 1, 11, 14, 14, i === 0 ? GOLD_HI : '#242430');
    if (i === 0) R(x + 3, 13, 10, 10, GOLD);
  }
  text(320 - textW('0:45', 2) / 2, 32, '0:45', '#e8e4da', 2);
}

// --- banner + crowd --------------------------------------------------------

function drawBanner() {
  R(0, 52, SW, 24, '#0c0a06');
  R(0, 52, SW, 2, GOLD_DK);
  R(0, 74, SW, 2, GOLD_DK);
  const s = 'GOLDEN GLOVES BRUCHSAL';
  text(320 - textW(s, 2) / 2, 58, s, GOLD, 2);
}

const DIM_SHIRTS = [
  ['#2a2438', '#3a3450'], ['#382830', '#4c3842'], ['#243038', '#34424e'],
  ['#302838', '#42384c'], ['#3a3226', '#4e4434'], ['#26263a', '#363650'],
  ['#402830', '#563a42'], ['#1e2a24', '#2c3e34'],
];
const DIM_SKINS = ['#8a6a50', '#a07a58', '#6a4e38', '#96725a', '#b08868'];
const DIM_HAIRS = ['#1a140e', '#2a2014', '#3a2a18', '#151517', '#5a4a2a', '#6a6058', '#8a3a20'];

function crowdPerson(x, y) {
  const [shirt, shirtHi] = pick(DIM_SHIRTS);
  const skin = pick(DIM_SKINS), hair = pick(DIM_HAIRS);
  const cheer = rnd() < 0.15, phone = rnd() < 0.07;
  // torso with a lit edge facing the ring
  R(x, y - 10, 12, 10, shirt);
  R(x, y - 10, 3, 10, shirtHi);
  R(x + 3, y - 10, 6, 2, shirtHi);                     // collar
  if (cheer) {
    R(x - 2, y - 17, 2, 8, skin); R(x + 12, y - 17, 2, 8, skin);
    R(x - 2, y - 18, 2, 2, skin); R(x + 12, y - 18, 2, 2, skin);
  } else {
    R(x - 2, y - 9, 2, 7, shirt); R(x + 12, y - 9, 2, 7, shirt);
    R(x - 2, y - 3, 2, 2, skin); R(x + 12, y - 3, 2, 2, skin);
  }
  if (phone) {
    g.fillStyle = 'rgba(200,210,255,0.16)'; g.fillRect(x + 9, y - 22, 9, 9);
    R(x + 12, y - 19, 3, 4, '#dfe4ff');
  }
  // head + hair style
  R(x + 2, y - 18, 8, 8, skin);
  const v = rnd();
  if (v < 0.14) { R(x + 2, y - 19, 3, 1, hair); R(x + 7, y - 19, 3, 1, hair); } // balding
  else if (v < 0.5) { R(x + 2, y - 20, 8, 3, hair); }                           // short
  else if (v < 0.7) {                                                           // long
    R(x + 1, y - 20, 10, 3, hair);
    R(x + 1, y - 17, 2, 7, hair); R(x + 9, y - 17, 2, 7, hair);
  } else if (v < 0.85) {                                                        // cap
    R(x + 2, y - 21, 8, 3, '#5a2828'); R(x + 8, y - 18, 4, 1, '#5a2828');
  } else { R(x + 2, y - 21, 8, 4, hair); R(x + 4, y - 22, 4, 2, hair); }        // bun
  P(x + 4, y - 15, '#0c0a08'); P(x + 7, y - 15, '#0c0a08');                     // eyes
  R(x + 5, y - 12, 3, 1, '#4a3428');                                            // mouth
}

function drawCrowd() {
  R(0, 76, SW, 92, '#131019');
  for (let row = 0; row < 4; row++) {
    const y = 98 + row * 22;
    for (let x = 4, i = 0; x < SW - 12; x += 20, i++) {
      if (rnd() < 0.14) continue;
      crowdPerson(x + Math.floor(rnd() * 5), y + Math.floor(rnd() * 2));
    }
    if (row < 2) { g.fillStyle = 'rgba(10,8,16,0.35)'; g.fillRect(0, y - 22, SW, 22); }
  }
}

// --- ring ------------------------------------------------------------------

const ROPE_Y = [116, 136, 156];
const MAT_Y = 168;

function drawMat() {
  R(0, MAT_Y, SW, SH - MAT_Y, '#141416');
  // canvas texture: subtle noise + sheen rows
  for (let i = 0; i < 900; i++) {
    P(Math.floor(rnd() * SW), MAT_Y + Math.floor(rnd() * (SH - MAT_Y)), rnd() < 0.5 ? '#17171a' : '#121214');
  }
  for (let y = MAT_Y + 12; y < SH; y += 16) R(0, y, SW, 1, '#1a1a1e');
  for (let i = 0; i < 3; i++) {
    g.fillStyle = 'rgba(58,54,44,0.10)';
    g.fillRect(140 - i * 40, 200 + i * 16, 360 + i * 80, 140 - i * 16);
  }
}

function drawGoldLogo(cx, cy) {
  // laurel wreath: paired leaves with vein + lit tip
  const leaves = [
    [68, 8], [68, 4], [68, 0], [68, -3], [68, -6], [67, -10], [66, -14],
    [65, -17], [64, -20], [62, -23], [60, -26], [58, -29], [56, -32],
    [53, -35], [50, -38], [47, -40], [44, -42], [40, -44], [36, -46],
    [32, -47], [28, -48], [24, -49], [20, -50],
    [67, 15], [66, 20], [64, 23], [62, 26], [60, 28], [58, 30], [55, 32],
    [52, 34], [49, 36], [46, 38], [42, 40], [38, 42], [34, 43], [30, 44],
    [26, 45], [22, 46],
  ];
  for (const [ox, oy] of leaves) {
    for (const s of [-1, 1]) {
      const x = cx + s * ox;
      R(x - 2, cy + oy, 5, 3, GOLD);
      R(x - 2, cy + oy, 2, 1, GOLD_HI);
      P(x, cy + oy + 1, GOLD_DK);
      P(x - 2, cy + oy + 2, GOLD_DK);
    }
  }
  // victorious boxer silhouette
  R(cx - 6, cy - 60, 12, 12, GOLD);                    // head
  R(cx - 4, cy - 62, 8, 2, GOLD);
  R(cx - 14, cy - 48, 28, 14, GOLD);                   // chest
  R(cx - 12, cy - 34, 24, 14, GOLD);
  R(cx - 10, cy - 20, 20, 10, GOLD);
  R(cx - 20, cy - 46, 6, 10, GOLD); R(cx + 14, cy - 46, 6, 10, GOLD);     // shoulders
  R(cx - 24, cy - 62, 6, 18, GOLD); R(cx + 18, cy - 62, 6, 18, GOLD);     // raised arms
  R(cx - 25, cy - 69, 8, 8, GOLD_HI); R(cx + 17, cy - 69, 8, 8, GOLD_HI); // fists
  R(cx - 14, cy - 48, 5, 26, GOLD_HI);                 // catch-light
  R(cx + 9, cy - 48, 5, 26, GOLD_DK);                  // shade side
  // '76' nested between the wreath tails
  text(cx - textW('76', 2) / 2, cy + 38, '76', GOLD, 2);
}

function drawPost(x) {
  R(x, 96, 24, MAT_Y - 92, '#18181c');
  R(x + 22, 96, 2, MAT_Y - 92, '#2e2e34');
  R(x + 11, 96, 2, MAT_Y - 92, '#101014');             // pad seam
  R(x - 2, 92, 28, 8, '#101014');                      // top cap
  R(x + 8, 120, 8, 8, '#d8d8d8');                      // sponsor patch
  R(x + 10, 122, 4, 4, '#202024');
}

function drawRopes() {
  // back ropes: black, top edge lit; middle rope carries readable branding
  ROPE_Y.forEach((y, i) => {
    R(24, y, SW - 48, 6, '#1c1c20');
    R(24, y, SW - 48, 2, '#34343a');
    if (i === 1) {
      for (const x of [64, 264, 464]) text(x, y + 1, 'GOLDEN GLOVES', GOLD);
    } else {
      for (let x = 40; x < SW - 48; x += 32) R(x, y + 2, 12, 2, GOLD);
    }
  });
  // white velcro straps
  for (const x of [112, 244, 396, 528]) {
    R(x, ROPE_Y[0] - 4, 6, ROPE_Y[2] - ROPE_Y[0] + 14, '#e4e4e0');
    R(x + 4, ROPE_Y[0] - 4, 2, ROPE_Y[2] - ROPE_Y[0] + 14, '#a8a8a4');
    R(x + 1, ROPE_Y[2] + 8, 4, 2, '#c8c8c4');          // stitched end
  }
  // side ropes receding past the camera
  for (let i = 0; i < 3; i++) {
    const y = ROPE_Y[i];
    line(26, y + 2, -8, 192 + i * 52, '#1c1c20', 6);
    line(26, y, -8, 190 + i * 52, '#34343a', 2);
    line(SW - 26, y + 2, SW + 8, 192 + i * 52, '#1c1c20', 6);
    line(SW - 26, y, SW + 8, 190 + i * 52, '#34343a', 2);
  }
  drawPost(4);
  drawPost(SW - 28);
}

// --- boxers ----------------------------------------------------------------

const MAN = {
  skin: '#d89860', skinHi: '#eab27c', skinShad: '#a86e40', skinDeep: '#8a5732',
  hair: '#1e1712', beard: '#241a12', beardHi: '#3a2c22', tattoo: '#4e5866', tattooDk: '#38424e',
  trunk: '#1c1c20', trunkHi: '#34343a', trunkShad: '#101012',
  glove: '#cc2222', gloveHi: '#ee5544', gloveShad: '#8a1414',
};
const WOMAN = {
  skin: '#f0c098', skinHi: '#f8d8b8', skinShad: '#c89060', skinDeep: '#a8744a',
  hair: '#d8b84c', hairHi: '#f0d878', hairShad: '#a8853a',
  bra: '#141418', braHi: '#26262e',
  leg: '#17171b', legHi: '#2c2c34', legShad: '#101014',
  glove: '#2244cc', gloveHi: '#4466ee', gloveShad: '#141c8a',
};

// 18/16px glove: laced cuff, sheen, knuckle seam, thumb.
function drawGlove(M, dx, y, s, c) {
  M(dx - 4, y + 4, 4, s - 8, c.gloveShad);             // wrist cuff
  M(dx - 4, y + 5, 4, 1, '#e8e8e8');                   // laces
  M(dx - 4, y + 8, 4, 1, '#e8e8e8');
  M(dx - 4, y + 11, 4, 1, '#e8e8e8');
  M(dx, y, s, s, c.glove);                             // fist
  M(dx, y, s, 2, c.gloveHi);                           // top light
  M(dx + 2, y + 2, 6, 6, c.gloveHi);                   // sheen
  M(dx + 3, y + 3, 3, 3, '#ff7766');                   // hot spot
  M(dx + s - 3, y + 3, 2, s - 8, c.gloveShad);         // knuckle seam
  M(dx + s - 8, y + s - 5, 8, 3, c.gloveShad);         // thumb
  M(dx + s - 7, y + s - 5, 3, 2, c.glove);
  M(dx, y + s - 2, s, 2, c.gloveShad);                 // under shade
}

// Bearded, tattooed male boxer (~148px tall). dir = +1 faces right.
function drawMan(bx, by, dir, c) {
  const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);

  M(-32, by - 4, 68, 7, 'rgba(0,0,0,0.4)');            // shadow

  // back leg + shoe
  M(-22, by - 56, 12, 26, c.skinShad);                 // thigh
  M(-19, by - 50, 3, 16, c.skinDeep);                  // quad line
  M(-22, by - 32, 10, 24, c.skinShad);                 // shin
  M(-23, by - 30, 3, 10, c.skinShad);                  // calf
  M(-26, by - 8, 18, 8, '#202024');
  M(-24, by - 7, 14, 2, '#3a3a40');
  M(-20, by - 6, 3, 1, '#e8e8e8');                     // lace
  M(-26, by - 2, 18, 2, '#0c0c0c');
  // front leg + shoe
  M(8, by - 56, 12, 26, c.skin);
  M(8, by - 56, 4, 26, c.skinHi);
  M(10, by - 34, 6, 2, c.skinShad);                    // knee
  M(10, by - 32, 10, 24, c.skin);
  M(10, by - 32, 4, 24, c.skinHi);
  M(19, by - 30, 2, 10, c.skinShad);                   // calf shade
  M(8, by - 8, 20, 8, '#202024');
  M(10, by - 7, 14, 2, '#3a3a40');
  M(14, by - 6, 3, 1, '#e8e8e8');
  M(8, by - 2, 20, 2, '#0c0c0c');

  // trunks: black, gold waistband, print + folds
  M(-18, by - 84, 34, 30, c.trunk);
  M(-18, by - 84, 34, 4, GOLD);
  M(-16, by - 81, 8, 1, GOLD_DK);                      // waistband stitching
  M(-4, by - 78, 12, 2, '#d8d8d8');                    // brand print
  M(-2, by - 75, 8, 1, '#a8a8a8');
  M(8, by - 80, 4, 24, c.trunkHi);                     // side sheen
  M(-2, by - 66, 3, 12, c.trunkShad);                  // leg split
  M(-18, by - 80, 4, 26, c.trunkShad);                 // back shade
  M(-12, by - 62, 2, 8, c.trunkShad);                  // folds
  M(2, by - 60, 2, 6, c.trunkShad);
  M(-18, by - 56, 34, 2, c.trunkShad);                 // hem

  // torso: lats, pecs, abs, collarbone
  M(-16, by - 116, 32, 32, c.skin);
  M(-16, by - 116, 6, 32, c.skinShad);                 // back
  M(-16, by - 114, 4, 8, c.skinDeep);                  // lat flare
  M(6, by - 116, 10, 30, c.skinHi);                    // chest catch-light
  M(0, by - 114, 10, 2, c.skinShad);                   // collarbone
  M(-2, by - 102, 12, 2, c.skinShad);                  // pec underline
  M(4, by - 112, 2, 10, c.skinShad);                   // pec separation
  M(8, by - 106, 3, 3, c.skinDeep);                    // nipple
  for (let i = 0; i < 3; i++) {                        // abs 2x3
    M(-2, by - 96 + i * 6, 3, 2, c.skinShad);
    M(3, by - 94 + i * 6, 3, 2, c.skinShad);
  }
  M(-8, by - 90, 4, 2, c.skinShad);                    // oblique

  // neck + traps
  M(-4, by - 122, 12, 8, c.skinShad);
  M(-12, by - 120, 8, 5, c.skinShad);

  // head
  M(-8, by - 144, 22, 24, c.skin);
  M(-10, by - 148, 24, 8, c.hair);                     // short dark hair
  M(-6, by - 141, 3, 1, c.skin);                       // hairline notches
  M(1, by - 141, 3, 1, c.skin);
  M(-10, by - 140, 6, 11, c.hair);                     // back of head
  M(-4, by - 140, 3, 3, '#3a2c20');                    // temple fade
  M(6, by - 136, 8, 3, c.hair);                        // heavy brow
  M(8, by - 132, 6, 3, '#ffffff');                     // eye
  M(11, by - 132, 2, 3, '#5a4028');                    // iris
  M(12, by - 132, 1, 2, '#1a0f08');                    // pupil
  M(8, by - 133, 6, 1, c.skinShad);                    // lid
  M(14, by - 130, 3, 5, c.skinShad);                   // nose
  M(15, by - 126, 1, 1, c.skinDeep);                   // nostril
  M(2, by - 126, 16, 6, c.beard);                      // full beard
  M(10, by - 130, 6, 4, c.beard);                      // up the cheek
  M(7, by - 125, 9, 2, c.beard);                       // mustache
  for (const [px2, py] of [[4, 125], [8, 122], [12, 124], [15, 122], [6, 121]]) {
    M(px2, by - py, 2, 1, c.beardHi);                  // beard texture
  }
  M(9, by - 124, 5, 1, '#8a5a4a');                     // lip
  M(-4, by - 134, 4, 6, c.skinShad);                   // ear
  M(-3, by - 132, 2, 3, c.skinDeep);

  // rear arm — tattoo sleeve
  M(-24, by - 116, 10, 20, c.skinShad);                // deltoid
  M(-22, by - 100, 8, 8, c.skinShad);                  // bicep
  M(-18, by - 102, 20, 10, c.skinShad);                // forearm forward
  for (const [tx, ty, tw] of [[-23, 113, 3], [-20, 108, 4], [-24, 104, 3], [-19, 100, 3],
                               [-15, 101, 4], [-11, 99, 3], [-7, 100, 3], [-22, 96, 3], [-16, 97, 2]]) {
    M(tx, by - ty, tw, 2, c.tattoo);
    M(tx + 1, by - ty + 2, tw - 1, 1, c.tattooDk);
  }
  drawGlove(M, 6, by - 124, 18, c);                    // glove by the chin

  // lead arm
  M(10, by - 112, 12, 10, c.skin);
  M(20, by - 108, 10, 10, c.skinHi);
  M(20, by - 100, 4, 2, c.skinShad);                   // elbow crease
  drawGlove(M, 28, by - 116, 18, c);
}

// Female boxer with a blonde braid (~136px tall). dir = +1 faces right.
function drawWoman(bx, by, dir, c) {
  const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);

  M(-28, by - 4, 60, 7, 'rgba(0,0,0,0.4)');            // shadow

  // sneakers
  M(-22, by - 6, 16, 6, '#d8d8d8');
  M(-22, by - 2, 16, 2, '#909090');
  M(-19, by - 5, 3, 1, '#b8b8b8');                     // lace
  M(6, by - 6, 18, 6, '#e8e8e8');
  M(6, by - 2, 18, 2, '#909090');
  M(10, by - 5, 3, 1, '#c8c8c8');

  // black leggings
  M(-18, by - 60, 10, 54, c.legShad);                  // back leg
  M(6, by - 60, 10, 54, c.leg);                        // front leg
  M(6, by - 60, 4, 54, c.legHi);                       // sheen
  M(8, by - 32, 5, 2, c.legHi);                        // knee
  M(-16, by - 72, 30, 14, c.leg);                      // hips
  M(-16, by - 72, 30, 4, c.legHi);                     // high waistband
  M(6, by - 67, 4, 4, GOLD);                           // hip logo
  M(-16, by - 60, 4, 10, c.legShad);                   // seat shade

  // bare midriff
  M(-12, by - 92, 24, 20, c.skin);
  M(-12, by - 92, 4, 20, c.skinShad);
  M(6, by - 92, 5, 20, c.skinHi);
  M(-12, by - 84, 3, 12, c.skinShad);                  // oblique
  M(0, by - 88, 2, 3, c.skinShad);                     // ab line
  M(0, by - 81, 2, 3, c.skinShad);
  M(2, by - 76, 3, 2, c.skinDeep);                     // navel

  // sports bra
  M(-12, by - 106, 24, 14, c.bra);
  M(-12, by - 95, 24, 3, '#0e0e12');                   // under band
  M(4, by - 104, 4, 10, c.braHi);
  M(-1, by - 104, 2, 9, '#0a0a10');                    // center seam
  M(-10, by - 112, 4, 8, c.bra);                       // straps
  M(6, by - 112, 4, 8, c.bra);

  // neck + head
  M(-2, by - 112, 8, 7, c.skinShad);
  M(-6, by - 132, 18, 22, c.skin);
  M(-8, by - 136, 20, 6, c.hairHi);                    // blonde crown
  M(-8, by - 135, 20, 1, c.hair);                      // parting shade
  M(-4, by - 131, 2, 2, c.hairShad);                   // strand
  M(2, by - 131, 2, 1, c.hairShad);
  M(-10, by - 132, 6, 18, c.hair);                     // back of head
  M(-12, by - 116, 6, 32, c.hair);                     // braid down the back
  for (let i = 0; i < 5; i++) {                        // braid chevrons
    M(i % 2 === 0 ? -12 : -9, by - 112 + i * 6, 3, 2, c.hairShad);
  }
  M(-12, by - 86, 6, 3, '#5a4630');                    // hair tie
  M(-11, by - 82, 3, 4, c.hairShad);                   // tail wisp
  P(dir > 0 ? bx - 13 : bx + 12, by - 122, c.hairHi);  // flyaway
  M(4, by - 124, 6, 2, c.hairShad);                    // brow
  M(6, by - 122, 6, 3, '#ffffff');                     // eye
  M(9, by - 122, 2, 3, '#4a6a8a');                     // blue iris
  M(10, by - 122, 1, 2, '#101820');                    // pupil
  M(6, by - 123, 6, 1, '#3a2c1a');                     // lashes
  M(12, by - 118, 2, 4, c.skinShad);                   // nose
  M(8, by - 114, 6, 2, '#c06858');                     // lips
  M(9, by - 114, 3, 1, '#e08878');
  M(-2, by - 122, 4, 6, c.skinShad);                   // ear
  M(0, by - 117, 2, 2, GOLD);                          // earring

  // rear arm
  M(-16, by - 104, 8, 16, c.skinShad);                 // deltoid
  M(-10, by - 94, 16, 8, c.skinShad);                  // forearm
  drawGlove(M, 6, by - 112, 16, c);                    // glove by the chin

  // lead arm
  M(8, by - 100, 10, 8, c.skin);
  M(16, by - 96, 8, 8, c.skinHi);
  drawGlove(M, 24, by - 104, 16, c);
}

// --- compose ---------------------------------------------------------------

drawCrowd();
drawMat();
drawRopes();
drawGoldLogo(320, 256);
drawMan(208, 300, 1, MAN);
drawWoman(432, 308, -1, WOMAN);
drawBanner();
drawHud();

const cv = document.getElementById('cv');
const c2 = cv.getContext('2d');
c2.imageSmoothingEnabled = false;
c2.drawImage(off, 0, 0, SW * SCALE, SH * SCALE);
