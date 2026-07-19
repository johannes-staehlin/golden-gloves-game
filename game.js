// Golden Gloves Bruchsal — retro pixel boxing.
// Renders the final art direction (art/final.html) at 320x180 internal
// resolution, scaled 3x. Sprites come from art/boxers.js (initBoxers).

'use strict';

function track(event) {
  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({ path: event, event: true });
  }
}

const canvas = document.getElementById('game');
const screenCtx = canvas.getContext('2d');
const SW = 320, SH = 180, SCALE = 3;

const frame = document.createElement('canvas');
frame.width = SW; frame.height = SH;
const frameCtx = frame.getContext('2d');

let g = frameCtx;               // current draw target for the helpers below

// ---------------------------------------------------------------------------
// Draw helpers (shared with the art previews)
// ---------------------------------------------------------------------------

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

// 5×7 pixel-serif font. Each glyph is 7 rows of 5-char strings.
const FONT = {
  A: ['..#..', '.#.#.', '#...#', '#...#', '#####', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.####', '#....', '#....', '#..##', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['#####', '...#.', '...#.', '...#.', '#..#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..##', '.####'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '.#.#.', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '.#.#.', '..#..', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#..##', '#.#.#', '##..#', '#...#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '#####'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['#####', '....#', '...#.', '..##.', '....#', '....#', '#####'],
  '4': ['....#', '...##', '..#.#', '.#..#', '#####', '....#', '....#'],
  '5': ['#####', '#....', '#....', '####.', '....#', '....#', '#####'],
  '6': ['..###', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '###..'],
  ':': ['.....', '..#..', '.....', '.....', '..#..', '.....', '.....'],
  '!': ['..#..', '..#..', '..#..', '..#..', '.....', '..#..', '..#..'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '/': ['....#', '...#.', '..#..', '..#..', '.#...', '#....', '#....'],
  '←': ['.....', '..#..', '.#...', '#####', '.#...', '..#..', '.....'],  // ←
  '→': ['.....', '..#..', '...#.', '#####', '...#.', '..#..', '.....'],  // →
  '↑': ['..#..', '.###.', '#.#.#', '..#..', '..#..', '..#..', '..#..'],  // ↑
  '↓': ['..#..', '..#..', '..#..', '..#..', '#.#.#', '.###.', '..#..'],  // ↓
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};
function text(x, y, s, c, sc = 1) {
  let cx = x;
  for (const ch of s) {
    const gl = FONT[ch] || FONT[' '];
    for (let r = 0; r < 7; r++) for (let i = 0; i < 5; i++) {
      if (gl[r][i] === '#') R(cx + i * sc, y + r * sc, sc, sc, c);
    }
    cx += 6 * sc;
  }
}
function textW(s, sc = 1) { return s.length * 6 * sc - sc; }
function centerText(s, sc, y, c = '#e8e4da') {
  const x = Math.round(160 - textW(s, sc) / 2);
  text(x + 1, y + 1, s, '#08080e', sc);
  text(x, y, s, c, sc);
}
function centerTextOutlined(s, sc, y, c = '#e8e4da') {
  const x = Math.round(160 - textW(s, sc) / 2);
  const d = Math.max(1, sc - 1);
  text(x - d, y - d, s, '#2a2a2a', sc);
  text(x + d, y - d, s, '#2a2a2a', sc);
  text(x - d, y + d, s, '#2a2a2a', sc);
  text(x + d, y + d, s, '#2a2a2a', sc);
  text(x, y, s, c, sc);
}

const GOLD = '#c99a3f', GOLD_HI = '#e9c568', GOLD_DK = '#8a6a28';

// ---------------------------------------------------------------------------
// Sprites: normal + white-flash variants
// ---------------------------------------------------------------------------

const BX = initBoxers(R, P);
const flashCol = (c) => (String(c).startsWith('rgba') ? c : '#ffffff');
const BXF = initBoxers(
  (x, y, w, h, c) => R(x, y, w, h, flashCol(c)),
  (x, y, c) => P(x, y, flashCol(c))
);

// ---------------------------------------------------------------------------
// Settings loaded from settings.js
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

const keys = {};
window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true;
  handleMenuKey(e.key.toLowerCase());
});
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

const P1_KEYS = { left: 'a', right: 'd', block: 'w', duck: 's', punch: 'f' };
const P2_KEYS = { left: 'arrowleft', right: 'arrowright', block: 'arrowup', duck: 'arrowdown', punch: 'l' };

// ---------------------------------------------------------------------------
// Audio (tiny WebAudio blips — no assets)
// ---------------------------------------------------------------------------

let audioCtx = null;
function audio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function blip(freq, dur, type = 'square', vol = 0.08, slideTo = null) {
  try {
    const ac = audio();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + dur);
    gain.gain.setValueAtTime(vol, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + dur);
  } catch (_) { /* audio not available */ }
}
const sfx = {
  hit: () => blip(200, 0.12, 'square', 0.1, 90),
  blocked: () => blip(140, 0.08, 'square', 0.05, 100),
  whiff: () => blip(500, 0.05, 'triangle', 0.03, 300),
  bell: () => { blip(880, 0.7, 'triangle', 0.09); blip(1320, 0.5, 'sine', 0.04); },
  down: () => blip(160, 0.5, 'sawtooth', 0.08, 50),
  count: () => blip(660, 0.08, 'square', 0.05),
};

// ---------------------------------------------------------------------------
// Static background (crowd, ring, mat, crest) — prerendered once
// ---------------------------------------------------------------------------

const bg = document.createElement('canvas');
bg.width = SW; bg.height = SH;

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
}

const ROPE_Y = [58, 68, 78];
const MAT_Y = 84;

function drawPost(x) {
  R(x, 48, 12, MAT_Y - 46, '#18181c');
  R(x + 11, 48, 1, MAT_Y - 46, '#2e2e34');
  R(x - 1, 46, 14, 4, '#101014');
  R(x + 4, 60, 4, 4, '#d8d8d8');
}

function drawFloorCrest(cx, cy) {
  // wreath leaves on a true circle; top open for the fists, bottom for the 76
  for (const deg of [-52, -34, -16, 2, 20, 38, 56]) {
    const rad = deg * Math.PI / 180;
    const ox = Math.round(16 * Math.cos(rad));
    const oy = Math.round(16 * Math.sin(rad));
    R(cx - ox - 1, cy + oy, 3, 2, GOLD);
    R(cx + ox - 2, cy + oy, 3, 2, GOLD);
  }
  R(cx - 9, cy - 16, 3, 3, GOLD_HI); R(cx + 6, cy - 16, 3, 3, GOLD_HI);
  R(cx - 9, cy - 13, 3, 6, GOLD); R(cx + 6, cy - 13, 3, 6, GOLD);
  R(cx - 2, cy - 14, 4, 4, GOLD);
  R(cx - 6, cy - 10, 13, 6, GOLD);
  R(cx - 5, cy - 4, 11, 5, GOLD);
  R(cx - 4, cy + 1, 9, 4, GOLD);
  R(cx - 6, cy - 10, 3, 11, GOLD_HI);
  text(cx - textW('76') / 2, cy + 12, '76', GOLD);
}

function renderBackground() {
  g = bg.getContext('2d');
  // crowd
  R(0, 38, SW, 46, '#131019');
  for (let row = 0; row < 4; row++) {
    const y = 48 + row * 11;
    for (let x = 2; x < SW - 6; x += 10) {
      if (rnd() < 0.15) continue;
      crowdPerson(x + Math.floor(rnd() * 3), y);
    }
    if (row < 2) { g.fillStyle = 'rgba(10,8,16,0.35)'; g.fillRect(0, y - 11, SW, 11); }
  }
  // mat, lighter base with a soft wide spotlight pool
  R(0, MAT_Y, SW, SH - MAT_Y, '#1d1d22');
  for (let y = MAT_Y + 6; y < SH; y += 8) R(0, y, SW, 1, '#25252b');
  const widths = [186, 214, 236, 252, 264, 272];
  for (let i = widths.length - 1; i >= 0; i--) {
    const w = widths[i];
    g.fillStyle = 'rgba(255,240,210,0.028)';
    g.fillRect(160 - w / 2, MAT_Y + 4 + i * 2, w, SH - MAT_Y - 4 - i * 2);
  }
  // ropes + straps + posts
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
  // banner
  R(0, 26, SW, 12, '#0c0a06');
  R(0, 26, SW, 1, GOLD_DK);
  R(0, 37, SW, 1, GOLD_DK);
  const s = 'GOLDEN GLOVES BRUCHSAL';
  text(160 - textW(s) / 2, 29, s, GOLD);
  // crest on the mat
  drawFloorCrest(160, 128);
  g = frameCtx;
}
renderBackground();

// ---------------------------------------------------------------------------
// Fighters
// ---------------------------------------------------------------------------

function makeBoxer(x, facing, isMan, keymap, isAI) {
  return {
    x, facing, isMan, keymap, isAI,
    hp: MAX_HP,
    state: 'idle',        // idle | punch | block | duck | hit | down
    punch: null,
    punchT: 0,
    punchLanded: false,
    cooldown: 0,
    stunT: 0,
    flashT: 0,
    moving: false,
    knockdowns: 0,
    roundKnockdowns: 0,
    roundDamage: 0,
    ai: { timer: 0, move: 0, wantPunch: false, blockT: 0, duckT: 0 },
  };
}

let p1, p2;

function resetBoxersForRound() {
  p1.x = 104; p2.x = 216;
  for (const b of [p1, p2]) {
    b.state = 'idle'; b.punch = null; b.punchT = 0; b.cooldown = 0;
    b.stunT = 0; b.flashT = 0; b.roundDamage = 0; b.roundKnockdowns = 0; b.moving = false;
    b.hp = Math.min(MAX_HP, b.hp + 35);
  }
  p1.facing = 1; p2.facing = -1;
}

// ---------------------------------------------------------------------------
// Game state machine
// ---------------------------------------------------------------------------

const game = {
  scene: 'title',   // title | intro | fight | count | roundEnd | matchEnd
  twoPlayer: false,
  round: 1,
  wins: { p1: 0, p2: 0 },
  timeLeft: ROUND_SECONDS,
  sceneT: 0,
  message: '',
  subMessage: '',
  count: 0,
  downed: null,
  matchWinner: null,
};

function startMatch(twoPlayer) {
  track(twoPlayer ? 'game-2-player' : 'game-1-player');
  game.twoPlayer = twoPlayer;
  game.round = 1;
  game.wins = { p1: 0, p2: 0 };
  game.matchWinner = null;
  p1 = makeBoxer(104, 1, true, P1_KEYS, false);
  p2 = makeBoxer(216, -1, false, P2_KEYS, !twoPlayer);
  p1.hp = MAX_HP; p2.hp = MAX_HP;
  startRound();
}

function startRound() {
  resetBoxersForRound();
  game.timeLeft = ROUND_SECONDS;
  game.scene = 'intro';
  game.sceneT = 0;
  game.isFight = false;
  game.message = `${t('ROUND')} ${game.round}`;
  game.subMessage = '';
  sfx.bell();
}

const MENU_ITEMS = [
  { label: () => t('ONE_PLAYER'), action: () => startMatch(false) },
  { label: () => t('TWO_PLAYERS'), action: () => startMatch(true) },
  { label: () => t('VISIT_WEBSITE'), action: () => { track('visit-website'); window.open('https://www.golden-gloves-bruchsal.de/', '_blank'); } },
];
let menuSel = 0;

function handleMenuKey(key) {
  if (game.scene === 'title') {
    if (key === 'arrowup') { menuSel = (menuSel + MENU_ITEMS.length - 1) % MENU_ITEMS.length; sfx.count(); }
    else if (key === 'arrowdown') { menuSel = (menuSel + 1) % MENU_ITEMS.length; sfx.count(); }
    else if (key === 'enter' || key === ' ') { MENU_ITEMS[menuSel].action(); }
    else if (key === '1') { menuSel = 0; startMatch(false); }
    else if (key === '2') { menuSel = 1; startMatch(true); }
  } else if (game.scene === 'matchEnd' && game.sceneT > 1.5) {
    if (key === 'enter' || key === ' ') { game.scene = 'title'; game.sceneT = 0; menuSel = 0; }
  }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

function opponentOf(b) { return b === p1 ? p2 : p1; }

function boxerIntent(b) {
  if (!b.isAI) {
    const k = b.keymap;
    return {
      move: (keys[k.right] ? 1 : 0) - (keys[k.left] ? 1 : 0),
      block: !!keys[k.block],
      duck: !!keys[k.duck],
      punch: !!keys[k.punch],
    };
  }
  const foe = opponentOf(b);
  const dist = Math.abs(foe.x - b.x);
  const ai = b.ai;
  ai.timer -= dt;
  ai.blockT -= dt;
  ai.duckT -= dt;
  if (ai.timer <= 0) {
    ai.timer = (AI.reactionTime + Math.random() * AI.reactionJitter) / AI.skill;
    ai.wantPunch = false;

    const sk = AI.skill;
    // foe just whiffed — seize the moment
    const foeWhiffed = foe.state === 'punch' && foe.punchT > foe.punch.duration * 0.7;

    if (dist > PUNCH.reach - 4) {
      // close the distance
      ai.move = Math.sign(foe.x - b.x);
      if (Math.random() < AI.approachHesitate / sk) ai.move = 0;
    } else {
      // in punching range
      if (foe.state === 'punch' && Math.random() < Math.min(0.95, 0.72 * sk)) {
        // react to incoming punch — mostly block, sometimes duck
        if (Math.random() < AI.blockChance) ai.blockT = AI.blockDuration;
        else ai.duckT = AI.duckDuration;
        ai.move = 0;
      } else {
        const r = Math.random();
        const punchBias = Math.min(0.9, (foeWhiffed ? AI.punchChance + AI.counterChance : AI.punchChance) * sk);
        if (r < punchBias) {
          ai.wantPunch = true;
          ai.move = 0;
        } else if (r < punchBias + AI.circleChance) {
          ai.move = -Math.sign(foe.x - b.x);  // step away
        } else {
          ai.move = 0;
        }
      }
    }
    // occasionally step in after landing a punch
    if (ai.lastHit && Math.random() < AI.chaseAfterHit) {
      ai.move = Math.sign(foe.x - b.x);
      ai.lastHit = false;
    }
  }
  return {
    move: ai.move,
    block: ai.blockT > 0,
    duck: ai.duckT > 0,
    punch: ai.wantPunch,
  };
}

const sparks = [];   // hit effects {x, y, t}

function tryLandPunch(b) {
  const foe = opponentOf(b);
  const dist = Math.abs(foe.x - b.x);
  if (dist > b.punch.reach || foe.state === 'down') { return; }
  if (foe.state === 'duck') { return; }
  b.punchLanded = true;
  let dmg = b.punch.damage;
  if (foe.state === 'block') {
    dmg = Math.max(1, Math.round(dmg * BLOCK_FACTOR));
    sfx.blocked();
  } else {
    foe.state = 'hit';
    foe.stunT = HIT_STUN;
    foe.flashT = 0.12;
    sparks.push({ x: foe.x + foe.facing * 6, y: FLOOR - 62, t: 0 });
    sfx.hit();
    if (b.isAI) b.ai.lastHit = true;
  }
  foe.hp = Math.max(0, foe.hp - dmg);
  b.roundDamage += dmg;
  foe.x += b.facing * KNOCKBACK;
  foe.x = Math.max(RING_LEFT, Math.min(RING_RIGHT, foe.x));
  if (foe.hp <= 0) knockDown(foe);
}

function knockDown(b) {
  b.state = 'down';
  b.flashT = 0;
  b.knockdowns++;
  b.roundKnockdowns++;
  game.scene = 'count';
  game.sceneT = 0;
  game.count = 0;
  game.downed = b;
  game.message = '';
  sfx.down();
}

function updateBoxer(b) {
  const intent = boxerIntent(b);
  b.flashT = Math.max(0, b.flashT - dt);
  b.cooldown = Math.max(0, b.cooldown - dt);
  b.moving = false;

  if (b.state === 'down') return;

  if (b.state === 'hit') {
    b.stunT -= dt;
    if (b.stunT <= 0) b.state = 'idle';
    return;
  }

  if (b.state === 'punch') {
    b.punchT += dt;
    const [a0, a1] = b.punch.active;
    if (!b.punchLanded && b.punchT >= a0 && b.punchT <= a1) tryLandPunch(b);
    if (b.punchT >= b.punch.duration) {
      if (!b.punchLanded) sfx.whiff();
      b.cooldown = b.punch.cooldown;
      b.punch = null;
      b.state = 'idle';
    }
    return;
  }

  b.state = intent.block ? 'block' : intent.duck ? 'duck' : 'idle';

  if (b.state === 'idle' && intent.move !== 0) {
    b.x += intent.move * MOVE_SPEED * dt;
    b.x = Math.max(RING_LEFT, Math.min(RING_RIGHT, b.x));
    b.moving = true;
    const foe = opponentOf(b);
    if (Math.abs(foe.x - b.x) < MIN_GAP) {
      b.x = foe.x - Math.sign(foe.x - b.x) * MIN_GAP;
    }
  }

  if (b.state === 'idle' && b.cooldown <= 0 && intent.punch) {
    b.state = 'punch';
    b.punch = PUNCH;
    b.punchT = 0;
    b.punchLanded = false;
  }

  b.facing = Math.sign(opponentOf(b).x - b.x) || b.facing;
}

function endRound() {
  sfx.bell();
  const score = (b) => b.hp - b.roundKnockdowns * GETUP_HP;
  const s1 = score(p1), s2 = score(p2);
  let result;
  if (s1 > s2) result = 'p1';
  else if (s2 > s1) result = 'p2';
  else result = p1.roundDamage >= p2.roundDamage ? 'p1' : 'p2';
  game.wins[result]++;
  game.scene = 'roundEnd';
  game.sceneT = 0;
  game.message = t('ROUND_GOES_TO', { round: game.round, winner: result === 'p1' ? t('RED') : t('BLUE') });
}

function endMatch(winner, how) {
  game.matchWinner = winner;
  track(winner === 'p1' ? 'win-red' : 'win-blue');
  game.scene = 'matchEnd';
  game.sceneT = 0;
  game.message = t('WINS', { winner: winner === 'p1' ? t('RED') : t('BLUE') });
  game.subMessage = how;
  sfx.bell();
  setTimeout(sfx.bell, 350);
  setTimeout(sfx.bell, 700);
}

function update() {
  game.sceneT += dt;

  for (let i = sparks.length - 1; i >= 0; i--) {
    sparks[i].t += dt;
    if (sparks[i].t > 0.25) sparks.splice(i, 1);
  }

  switch (game.scene) {
    case 'title':
      break;

    case 'intro':
      if (game.sceneT > 1.2 && !game.isFight) {
        game.message = t('FIGHT');
        game.isFight = true;
      }
      if (game.sceneT > 1.9) {
        game.scene = 'fight';
        game.message = '';
      }
      break;

    case 'fight':
      game.timeLeft -= dt;
      updateBoxer(p1);
      updateBoxer(p2);
      if (game.timeLeft <= 0) {
        game.timeLeft = 0;
        endRound();
      }
      break;

    case 'count': {
      const b = game.downed;
      const nextCount = Math.floor(game.sceneT / 0.7);
      if (nextCount > game.count) {
        game.count = nextCount;
        if (game.count <= 10) sfx.count();
        if (b.knockdowns < 3 && game.count >= 4 + b.knockdowns * 2) {
          b.hp = GETUP_HP;
          b.state = 'idle';
          game.downed = null;
          game.scene = 'fight';
          game.message = '';
          break;
        }
        if (game.count >= 10) {
          const winner = b === p1 ? 'p2' : 'p1';
          game.wins[winner]++;
          endMatch(winner, t('BY_KNOCKOUT'));
        }
      }
      break;
    }

    case 'roundEnd':
      if (game.sceneT > 2.2) {
        if (game.wins.p1 >= ROUNDS_TO_WIN || game.wins.p2 >= ROUNDS_TO_WIN || game.round >= 3) {
          const winner = game.wins.p1 >= game.wins.p2 ? 'p1' : 'p2';
          endMatch(winner, t('BY_DECISION'));
        } else {
          game.round++;
          startRound();
        }
      }
      break;

    case 'matchEnd':
      break;
  }
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

let elapsed = 0;

function poseOf(b) {
  switch (b.state) {
    case 'punch': return 'punch';
    case 'block': return 'block';
    case 'duck': return 'duck';
    case 'hit': return 'hit';
    case 'down': return 'down';
    default: return 'guard';
  }
}

function drawFighterShadow(b) {
  const cx = b.x, cy = FLOOR - 1;
  const rx = b.isMan ? 18 : 15;
  // draw concentric ellipses, wide and flat, fading outward
  const steps = [
    [rx,       3, 0.22],
    [rx * 1.3, 2, 0.13],
    [rx * 1.6, 1, 0.07],
  ];
  g.save();
  g.scale(1, 1);
  for (const [ew, eh, alpha] of steps) {
    g.fillStyle = `rgba(0,0,0,${alpha})`;
    g.beginPath();
    g.ellipse(cx, cy, ew, eh, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

function drawFighter(b) {
  const api = b.flashT > 0 ? BXF : BX;
  let bob = 0;
  if (b.state === 'idle') {
    bob = b.moving ? Math.floor(elapsed * 8) % 2 : Math.floor(elapsed * 2) % 2;
  }
  const draw = b.isMan ? api.drawMan : api.drawWoman;
  draw(b.x, FLOOR - bob, b.facing, b.isMan ? BX.MAN : BX.WOMAN, poseOf(b));
}

function drawSparks() {
  for (const s of sparks) {
    const r = 2 + s.t * 14;
    const c = s.t < 0.1 ? '#ffffff' : GOLD_HI;
    P(s.x + r, s.y, c); P(s.x - r, s.y, c);
    P(s.x, s.y + r * 0.6, c); P(s.x, s.y - r * 0.6, c);
    P(s.x + r * 0.7, s.y - r * 0.5, c); P(s.x - r * 0.7, s.y + r * 0.5, c);
  }
}

// occasional camera flashes in the crowd
const crowdFlashes = [];
function updateCrowdFlashes() {
  if (Math.random() < CROWD.flashRate) {
    crowdFlashes.push({ x: 6 + Math.random() * (SW - 12), y: 42 + Math.random() * 38, t: 0 });
  }
  for (let i = crowdFlashes.length - 1; i >= 0; i--) {
    crowdFlashes[i].t += dt;
    if (crowdFlashes[i].t > 0.3) crowdFlashes.splice(i, 1);
  }
}
function drawCrowdFlashes() {
  for (const f of crowdFlashes) {
    const a = 0.5 * (1 - f.t / 0.3);
    g.fillStyle = `rgba(220,228,255,${a * 0.35})`;
    g.fillRect(f.x - 2, f.y - 2, 5, 5);
    g.fillStyle = `rgba(240,244,255,${a})`;
    g.fillRect(f.x, f.y, 1, 1);
  }
}




function drawHud() {
  R(0, 0, SW, 26, '#08080e');
  const bar = (x, fillFrom, frac) => {
    R(x - 1, 4, 114, 11, GOLD);
    R(x, 5, 112, 9, '#0e0e12');
    const w = Math.round(110 * Math.max(0, frac));
    if (w > 0) {
      const fx = fillFrom === 'left' ? x + 1 : x + 1 + (110 - w);
      R(fx, 6, w, 7, '#c02418');
      R(fx, 6, w, 1, '#e05040');
    }
  };
  bar(9, 'left', p1 ? p1.hp / MAX_HP : 1);
  bar(199, 'right', p2 ? p2.hp / MAX_HP : 1);
  const pip = (x, won) => {
    R(x, 17, 7, 7, GOLD);
    if (!won) R(x + 1, 18, 5, 5, '#242430');
  };
  pip(9, game.wins.p1 >= 1); pip(19, game.wins.p1 >= 2);
  pip(305, game.wins.p2 >= 1); pip(295, game.wins.p2 >= 2);
  const t = Math.max(0, Math.ceil(game.timeLeft));
  const mm = Math.floor(t / 60);
  const ss = (t % 60).toString().padStart(2, '0');
  text(160 - textW(`${mm}:${ss}`, 1) / 2, 6, `${mm}:${ss}`, '#e8e4da', 1);
}

function drawOverlay() {
  switch (game.scene) {
    case 'title': {
      g.fillStyle = 'rgba(10,10,18,0.72)';
      g.fillRect(0, 0, SW, SH);

      // title
      centerText('GOLDEN GLOVES BRUCHSAL', 2, 26, GOLD_HI);
      centerText('THE GAME', 2, 48, GOLD);

      // menu
      const menuY = [76, 87, 98];
      for (let i = 0; i < MENU_ITEMS.length; i++) {
        const sel = i === menuSel;
        if (sel) {
          const tw = textW(MENU_ITEMS[i].label(), 1);
          R(160 - tw / 2 - 4, menuY[i] - 1, tw + 8, 9, GOLD_DK);
        }
        centerText(MENU_ITEMS[i].label(), 1, menuY[i], sel ? GOLD_HI : '#e8e4da');
      }
      // controls table — no grid lines
      const TC = '#9b95ab', TH = '#c8c4d8';
      const tHdrY = 122, tR1Y = 133, tR2Y = 144;
      const colW = [
        Math.max(textW(t('RED'), 1), textW(t('BLUE'), 1)),
        Math.max(textW(t('MOVE'), 1), textW('A/D', 1), textW('←/→', 1)),
        Math.max(textW(t('DUCK'), 1), textW('S', 1), textW('↓', 1)),
        Math.max(textW(t('BLOCK'), 1), textW('W', 1), textW('↑', 1)),
        Math.max(textW(t('PUNCH'), 1), textW('F', 1), textW('L', 1)),
      ];
      const GAP = 8;
      const tableW = colW.reduce((s, w) => s + w + GAP, 0) - GAP;
      let cx = Math.round((SW - tableW) / 2);
      const tx = colW.map(w => { const x = cx; cx += w + GAP; return x; });

      text(tx[1], tHdrY, t('MOVE'),  TC, 1);
      text(tx[2], tHdrY, t('DUCK'),  TC, 1);
      text(tx[3], tHdrY, t('BLOCK'), TC, 1);
      text(tx[4], tHdrY, t('PUNCH'), TC, 1);

      text(tx[0], tR1Y, t('RED'),  TH, 1);
      text(tx[1], tR1Y, 'A/D',  TC, 1);
      text(tx[2], tR1Y, 'S',    TC, 1);
      text(tx[3], tR1Y, 'W',    TC, 1);
      text(tx[4], tR1Y, 'F',    TC, 1);

      text(tx[0], tR2Y, t('BLUE'), TH, 1);
      text(tx[1], tR2Y, '←/→', TC, 1);
      text(tx[2], tR2Y, '↓',   TC, 1);
      text(tx[3], tR2Y, '↑',   TC, 1);
      text(tx[4], tR2Y, 'L',   TC, 1);
      break;
    }
    case 'intro':
      centerText(game.message, 3, 96, game.isFight ? GOLD_HI : '#e8e4da');
      break;
    case 'count':
      if (game.count >= 1) {
        const cs = String(Math.min(10, game.count));
        centerTextOutlined(cs, 4, 92, GOLD_HI);
      }
      break;
    case 'roundEnd':
      centerText(game.message, 2, 96);
      break;
    case 'matchEnd':
      g.fillStyle = 'rgba(10,10,18,0.45)';
      g.fillRect(0, 0, SW, SH);
      centerText(game.message, 3, 84, GOLD_HI);
      centerText(game.subMessage, 2, 108);
      if (game.sceneT > 1.5) centerText(t('PRESS_ENTER'), 2, 132, '#9b95ab');
      break;
  }
}

function draw() {
  g.drawImage(bg, 0, 0);
  drawCrowdFlashes();
  if (p1 && p2) {
    // the puncher draws last so the extended glove overlaps
    const order = p1.state === 'punch' ? [p2, p1] : [p1, p2];
    drawFighterShadow(order[0]);
    drawFighterShadow(order[1]);
    drawFighter(order[0]);
    drawFighter(order[1]);
  }
  drawSparks();
  drawHud();
  drawOverlay();

  screenCtx.imageSmoothingEnabled = false;
  screenCtx.drawImage(frame, 0, 0, SW * SCALE, SH * SCALE);
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

let dt = 0;
let lastTime = performance.now();

function tick(now) {
  dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  elapsed += dt;
  updateCrowdFlashes();
  update();
  draw();
  requestAnimationFrame(tick);
}

// idle fighters behind the title screen
p1 = makeBoxer(104, 1, true, P1_KEYS, false);
p2 = makeBoxer(216, -1, false, P2_KEYS, true);

requestAnimationFrame(tick);
