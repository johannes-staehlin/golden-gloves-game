// Pose sheet: each boxer in guard plus one action pose, enlarged 4x.

'use strict';

const SW = 300, SH = 112, SCALE = 4;
const off = document.createElement('canvas');
off.width = SW; off.height = SH;
const g = off.getContext('2d');

function R(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function P(x, y, c) { R(x, y, 1, 1, c); }

const FONT = {
  A: ['###', '#.#', '###', '#.#', '#.#'], C: ['###', '#..', '#..', '#..', '###'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'], G: ['###', '#..', '#.#', '#.#', '###'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'], K: ['#.#', '#.#', '##.', '#.#', '#.#'],
  N: ['#.#', '###', '#.#', '#.#', '#.#'], P: ['###', '#.#', '###', '#..', '#..'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'], U: ['#.#', '#.#', '#.#', '#.#', '###'],
  ' ': ['...', '...', '...', '...', '...'],
};
function text(x, y, s, c) {
  let cx = x;
  for (const ch of s) {
    const gl = FONT[ch] || FONT[' '];
    for (let r = 0; r < 5; r++) for (let i = 0; i < 3; i++) {
      if (gl[r][i] === '#') R(cx + i, y + r, 1, 1, c);
    }
    cx += 4;
  }
}
function textW(s) { return s.length * 4 - 1; }

const GOLD = '#c99a3f';

// stage
R(0, 0, SW, SH, '#141416');
R(0, 0, SW, 8, '#0e0e12');
for (let y = 14; y < SH; y += 8) R(0, y, SW, 1, '#1a1a1e');

const BX = initBoxers(R, P);
const slots = [
  [40, 'GUARD', () => BX.drawMan(40, 92, 1, BX.MAN, 'guard')],
  [112, 'PUNCH', () => BX.drawMan(112, 92, 1, BX.MAN, 'punch')],
  [190, 'GUARD', () => BX.drawWoman(190, 92, 1, BX.WOMAN, 'guard')],
  [262, 'DUCK', () => BX.drawWoman(262, 92, 1, BX.WOMAN, 'duck')],
];
for (const [x, label, draw] of slots) {
  draw();
  text(x - textW(label) / 2, 100, label, GOLD);
}

const cv = document.getElementById('cv');
const c2 = cv.getContext('2d');
c2.imageSmoothingEnabled = false;
c2.drawImage(off, 0, 0, SW * SCALE, SH * SCALE);
