// Golden Gloves Boxing — a retro pixel boxing game.
// Canvas is a fixed 1024x576 stage; sprites are drawn from chunky rects on a
// 16px grid to keep the pixel-art look from the mockup.

'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;   // 1024
const H = canvas.height;  // 576

// ---------------------------------------------------------------------------
// Tunables
// ---------------------------------------------------------------------------

const U = 16;                 // boxer sprite grid unit
const FLOOR_Y = 470;          // where the boxers' feet sit
const RING_LEFT = 130;
const RING_RIGHT = W - 130;
const ROUND_SECONDS = 60;
const ROUNDS_TO_WIN = 2;      // best of 3
const MAX_HP = 100;
const MOVE_SPEED = 230;       // px/s
const JAB = { damage: 5, reach: 150, duration: 0.24, cooldown: 0.12, active: [0.07, 0.15] };
const HOOK = { damage: 11, reach: 132, duration: 0.38, cooldown: 0.26, active: [0.14, 0.24] };
const BLOCK_FACTOR = 0.2;     // damage multiplier while blocking
const HIT_STUN = 0.32;
const KNOCKBACK = 30;
const GETUP_HP = 35;          // hp restored when a boxer beats the count

const PALETTE = {
  bgTop: '#171526',
  bgCrowdDot: '#3c3854',
  bgBannerDot1: '#4a1420',
  bgBannerDot2: '#2a2536',
  ropeRed: '#c8231b',
  ropeWhite: '#e9e2cf',
  post: '#121016',
  floor: '#4d5b6b',
  floorDark: '#3e4b59',
  hudBarBg: '#2b2836',
  hudBarFill: '#cc2418',
  hudPipOff: '#38343f',
  hudPipOn: '#e0b83c',
  hudText: '#ded9e8',
};

const P1_STYLE = {
  skin: '#e2a878', hair: '#2a2118', glove: '#c0281e',
  trunks: '#e8c040', shoe: '#241f1a', eye: '#1c150f',
};
const P2_STYLE = {
  skin: '#b07a4e', hair: '#1d1712', glove: '#2a3fa8',
  trunks: '#9a9a9a', shoe: '#241f1a', eye: '#140f0a',
};

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

const P1_KEYS = { left: 'a', right: 'd', block: 's', jab: 'f', hook: 'g' };
const P2_KEYS = { left: 'arrowleft', right: 'arrowright', block: 'arrowdown', jab: 'k', hook: 'l' };

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
// Boxers
// ---------------------------------------------------------------------------

function makeBoxer(x, facing, style, keymap, isAI) {
  return {
    x, facing, style, keymap, isAI,
    hp: MAX_HP,
    state: 'idle',        // idle | punch | block | hit | down
    punch: null,          // JAB or HOOK while punching
    punchT: 0,
    punchLanded: false,
    cooldown: 0,
    stunT: 0,
    flashT: 0,
    knockdowns: 0,
    roundDamage: 0,       // damage dealt this round (for decisions)
    ai: { timer: 0, move: 0, wantPunch: null, blockT: 0 },
  };
}

let p1, p2;

function resetBoxersForRound() {
  p1.x = W / 2 - 240; p2.x = W / 2 + 240;
  for (const b of [p1, p2]) {
    b.state = 'idle'; b.punch = null; b.punchT = 0; b.cooldown = 0;
    b.stunT = 0; b.flashT = 0; b.roundDamage = 0;
    b.hp = Math.min(MAX_HP, b.hp + 35);
  }
}

// ---------------------------------------------------------------------------
// Game state machine
// ---------------------------------------------------------------------------

const game = {
  scene: 'title',   // title | intro | fight | count | roundEnd | matchEnd
  twoPlayer: false,
  round: 1,
  pips: [null, null, null],   // per-round result: 'p1' | 'p2' | 'draw'
  wins: { p1: 0, p2: 0 },
  timeLeft: ROUND_SECONDS,
  sceneT: 0,
  message: '',
  subMessage: '',
  count: 0,           // knockdown count
  downed: null,       // boxer on the canvas
  matchWinner: null,
};

function startMatch(twoPlayer) {
  game.twoPlayer = twoPlayer;
  game.round = 1;
  game.pips = [null, null, null];
  game.wins = { p1: 0, p2: 0 };
  game.matchWinner = null;
  p1 = makeBoxer(W / 2 - 240, 1, P1_STYLE, P1_KEYS, false);
  p2 = makeBoxer(W / 2 + 240, -1, P2_STYLE, P2_KEYS, !twoPlayer);
  p1.hp = MAX_HP; p2.hp = MAX_HP;
  startRound();
}

function startRound() {
  resetBoxersForRound();
  game.timeLeft = ROUND_SECONDS;
  game.scene = 'intro';
  game.sceneT = 0;
  game.message = `ROUND ${game.round}`;
  game.subMessage = '';
  sfx.bell();
}

function handleMenuKey(key) {
  if (game.scene === 'title') {
    if (key === '1') startMatch(false);
    if (key === '2') startMatch(true);
  } else if (game.scene === 'matchEnd' && game.sceneT > 1.5) {
    if (key === 'enter' || key === ' ') { game.scene = 'title'; game.sceneT = 0; }
  }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

function opponentOf(b) { return b === p1 ? p2 : p1; }

function boxerIntent(b) {
  // Returns { move: -1|0|1, block, jab, hook } from keys or AI.
  if (!b.isAI) {
    const k = b.keymap;
    return {
      move: (keys[k.right] ? 1 : 0) - (keys[k.left] ? 1 : 0),
      block: !!keys[k.block],
      jab: !!keys[k.jab],
      hook: !!keys[k.hook],
    };
  }
  const foe = opponentOf(b);
  const dist = Math.abs(foe.x - b.x);
  const ai = b.ai;
  ai.timer -= dt;
  ai.blockT -= dt;
  if (ai.timer <= 0) {
    ai.timer = 0.18 + Math.random() * 0.2;
    ai.wantPunch = null;
    if (dist > JAB.reach - 10) {
      ai.move = Math.sign(foe.x - b.x);
      if (Math.random() < 0.12) ai.move = 0;
    } else {
      const r = Math.random();
      if (foe.state === 'punch' && Math.random() < 0.45) {
        ai.blockT = 0.35; ai.move = 0;
      } else if (r < 0.42) {
        ai.wantPunch = Math.random() < 0.65 ? 'jab' : 'hook';
        ai.move = 0;
      } else if (r < 0.62) {
        ai.move = -Math.sign(foe.x - b.x); // back off
      } else {
        ai.move = 0;
      }
    }
  }
  return {
    move: ai.move,
    block: ai.blockT > 0,
    jab: ai.wantPunch === 'jab',
    hook: ai.wantPunch === 'hook',
  };
}

function tryLandPunch(b) {
  const foe = opponentOf(b);
  const dist = Math.abs(foe.x - b.x);
  if (dist > b.punch.reach || foe.state === 'down') { return; }
  b.punchLanded = true;
  let dmg = b.punch.damage;
  if (foe.state === 'block') {
    dmg = Math.max(1, Math.round(dmg * BLOCK_FACTOR));
    sfx.blocked();
  } else {
    foe.state = 'hit';
    foe.stunT = HIT_STUN;
    foe.flashT = 0.12;
    sfx.hit();
  }
  foe.hp = Math.max(0, foe.hp - dmg);
  b.roundDamage += dmg;
  foe.x += b.facing * KNOCKBACK;
  foe.x = Math.max(RING_LEFT, Math.min(RING_RIGHT, foe.x));
  if (foe.hp <= 0) knockDown(foe);
}

function knockDown(b) {
  b.state = 'down';
  b.knockdowns++;
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

  // idle / block: free to act
  b.state = intent.block ? 'block' : 'idle';

  if (b.state === 'idle' && intent.move !== 0) {
    b.x += intent.move * MOVE_SPEED * dt;
    b.x = Math.max(RING_LEFT, Math.min(RING_RIGHT, b.x));
    // don't walk through the opponent
    const foe = opponentOf(b);
    const minGap = 4.5 * U;
    if (Math.abs(foe.x - b.x) < minGap) {
      b.x = foe.x - Math.sign(foe.x - b.x) * minGap;
    }
  }

  if (b.state !== 'block' && b.cooldown <= 0 && (intent.jab || intent.hook)) {
    b.state = 'punch';
    b.punch = intent.hook ? HOOK : JAB;
    b.punchT = 0;
    b.punchLanded = false;
  }

  // always face the opponent
  b.facing = Math.sign(opponentOf(b).x - b.x) || b.facing;
}

function endRound() {
  sfx.bell();
  const idx = game.round - 1;
  let result;
  if (p1.hp > p2.hp) result = 'p1';
  else if (p2.hp > p1.hp) result = 'p2';
  else result = p1.roundDamage >= p2.roundDamage ? 'p1' : 'p2';
  game.pips[idx] = result;
  game.wins[result]++;
  game.scene = 'roundEnd';
  game.sceneT = 0;
  game.message = `ROUND ${game.round} — ${result === 'p1' ? 'RED' : 'BLUE'}`;
  game.subMessage = '';
}

function endMatch(winner, how) {
  game.matchWinner = winner;
  game.scene = 'matchEnd';
  game.sceneT = 0;
  game.message = `${winner === 'p1' ? 'RED' : 'BLUE'} WINS!`;
  game.subMessage = how;
  sfx.bell();
  setTimeout(sfx.bell, 350);
  setTimeout(sfx.bell, 700);
}

function update() {
  game.sceneT += dt;

  switch (game.scene) {
    case 'title':
      break;

    case 'intro':
      if (game.sceneT > 1.2 && game.message !== 'FIGHT!') {
        game.message = 'FIGHT!';
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
        // beat the count on the first two knockdowns
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
          game.pips[game.round - 1] = winner;
          game.wins[winner]++;
          endMatch(winner, 'BY KNOCKOUT');
        }
      }
      break;
    }

    case 'roundEnd':
      if (game.sceneT > 2.2) {
        if (game.wins.p1 >= ROUNDS_TO_WIN || game.wins.p2 >= ROUNDS_TO_WIN || game.round >= 3) {
          const winner = game.wins.p1 >= game.wins.p2 ? 'p1' : 'p2';
          endMatch(winner, 'BY DECISION');
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

function rect(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawBackground() {
  // Arena darkness
  rect(0, 0, W, 240, PALETTE.bgTop);

  // Banner dot pattern behind the HUD (dark maroon / slate checker)
  for (let x = 8; x < W; x += 24) {
    const c = (x / 24) % 2 === 0 ? PALETTE.bgBannerDot1 : PALETTE.bgBannerDot2;
    rect(x, 12, 12, 12, c);
    rect(x + 4, 32, 12, 12, (x / 24) % 2 === 0 ? PALETTE.bgBannerDot2 : PALETTE.bgBannerDot1);
  }
  // HUD backing strips so the bars read clearly over the pattern
  rect(16, 8, 380, 40, PALETTE.bgTop);
  rect(W - 396, 8, 380, 40, PALETTE.bgTop);
  rect(W / 2 - 90, 8, 180, 40, PALETTE.bgTop);

  // Crowd row of dots
  for (let x = 12; x < W; x += 26) {
    rect(x, 58, 12, 10, PALETTE.bgCrowdDot);
  }

  // Ring posts
  rect(14, 96, 18, 140, PALETTE.post);
  rect(W - 32, 96, 18, 140, PALETTE.post);

  // Ropes
  rect(32, 116, W - 64, 12, PALETTE.ropeRed);
  rect(32, 162, W - 64, 16, PALETTE.ropeWhite);
  rect(32, 210, W - 64, 12, PALETTE.ropeRed);

  // Ring floor
  rect(0, 236, W, H - 236, PALETTE.floor);
  rect(0, H - 22, W, 22, PALETTE.floorDark);
}

function drawHealthBar(x, hp, fromRight) {
  const bw = 344, bh = 22, y = 16;
  rect(x, y, bw, bh, PALETTE.hudBarBg);
  const fill = Math.round(bw * hp / MAX_HP);
  if (fromRight) rect(x + bw - fill, y, fill, bh, PALETTE.hudBarFill);
  else rect(x, y, fill, bh, PALETTE.hudBarFill);
}

function drawHud() {
  drawHealthBar(24, p1 ? p1.hp : MAX_HP, false);
  drawHealthBar(W - 24 - 344, p2 ? p2.hp : MAX_HP, true);

  // Round pips
  const pipW = 22, gap = 12;
  const startX = W / 2 - (3 * pipW + 2 * gap) / 2;
  for (let i = 0; i < 3; i++) {
    const x = startX + i * (pipW + gap);
    let c = PALETTE.hudPipOff;
    if (game.pips[i] === 'p1') c = P1_STYLE.glove;
    else if (game.pips[i] === 'p2') c = P2_STYLE.glove;
    else if (i === game.round - 1 && game.scene !== 'title') c = PALETTE.hudPipOn;
    rect(x, 16, pipW, pipW, c);
  }

  // Timer
  const t = Math.max(0, Math.ceil(game.timeLeft));
  const mm = Math.floor(t / 60);
  const ss = (t % 60).toString().padStart(2, '0');
  ctx.fillStyle = PALETTE.hudText;
  ctx.font = 'bold 34px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${mm}:${ss}`, W / 2, 86);
}

// Draws one boxer. (x) is the sprite's center, feet at FLOOR_Y.
function drawBoxer(b) {
  const s = b.style;
  const f = b.facing;
  const flash = b.flashT > 0;
  const col = (c) => (flash ? '#ffffff' : c);
  const cx = b.x;
  const y = (u) => FLOOR_Y + u * U; // u is negative going up
  const lean = b.state === 'hit' ? -f * 6 : 0;

  if (b.state === 'down') {
    // Lying flat on the canvas
    const hx = cx - f * 4 * U;
    rect(cx - f * 2.5 * U, FLOOR_Y - U, 5 * U, 0.6 * U, 'rgba(0,0,0,0.25)');
    rect(hx - U, FLOOR_Y - 2 * U, 2 * U, 2 * U, col(s.skin));         // head
    rect(hx - U, FLOOR_Y - 2 * U, 2 * U, 0.5 * U, col(s.hair));
    rect(cx - f * 3 * U + (f < 0 ? -3 * U : 0), FLOOR_Y - 1.8 * U, 3 * U, 1.8 * U, col(s.skin)); // torso
    rect(cx + (f < 0 ? -2 * U : 0), FLOOR_Y - 1.8 * U, 2 * U, 1.8 * U, col(s.trunks));           // trunks
    rect(cx + f * 2 * U + (f < 0 ? -2.5 * U : 0), FLOOR_Y - 1.4 * U, 2.5 * U, 1.4 * U, col(s.skin)); // legs
    return;
  }

  // Shadow
  rect(cx - 2.5 * U, FLOOR_Y - 6, 5 * U, 8, 'rgba(0,0,0,0.25)');

  // Shoes
  rect(cx - 1.5 * U, y(-1), 3 * U, U, col(s.shoe));
  // Legs
  rect(cx - 1.5 * U, y(-3), U, 2 * U, col(s.skin));
  rect(cx + 0.5 * U, y(-3), U, 2 * U, col(s.skin));
  // Trunks
  rect(cx - 1.5 * U + lean * 0.3, y(-5), 3 * U, 2 * U, col(s.trunks));
  // Torso
  rect(cx - 1.5 * U + lean * 0.6, y(-7), 3 * U, 2 * U, col(s.skin));

  // Head
  const hx = cx + lean;
  rect(hx - 1.5 * U, y(-10), 3 * U, 2 * U, col(s.skin));
  rect(hx - 1.5 * U, y(-11), 3 * U, U, col(s.hair));
  // Eyes
  if (!flash) {
    rect(hx - 0.9 * U, y(-9.6), 0.4 * U, 0.4 * U, s.eye);
    rect(hx + 0.5 * U, y(-9.6), 0.4 * U, 0.4 * U, s.eye);
  }

  // Gloves
  const gw = 2 * U, gh = 2 * U;
  const restLeadX = cx + f * 1.5 * U;         // glove nearest the opponent
  const restRearX = cx - f * 3.5 * U;
  const gloveY = y(-8);

  if (b.state === 'punch') {
    const p = Math.sin(Math.PI * Math.min(1, b.punchT / b.punch.duration));
    const extend = p * (b.punch === HOOK ? 3.2 : 3.8) * U;
    rect(restLeadX + f * extend + (f < 0 ? -gw : 0), gloveY - 0.5 * U * p, gw, gh, col(s.glove));
    rect(restRearX + (f < 0 ? -gw : 0), gloveY, gw, gh, col(s.glove));
  } else if (b.state === 'block') {
    // gloves up in front of the face
    rect(hx - 1.9 * U, y(-10.3), gw, gh, col(s.glove));
    rect(hx - 0.1 * U, y(-10.3), gw, gh, col(s.glove));
  } else {
    rect(cx - 3.5 * U, gloveY, gw, gh, col(s.glove));
    rect(cx + 1.5 * U, gloveY, gw, gh, col(s.glove));
  }
}

function drawCenterText(text, size, yy, color = PALETTE.hudText) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, yy);
}

function drawOverlay() {
  switch (game.scene) {
    case 'title':
      rect(0, 0, W, H, 'rgba(13,12,22,0.55)');
      drawCenterText('GOLDEN GLOVES', 64, 200, PALETTE.hudPipOn);
      drawCenterText('BOXING', 64, 268, PALETTE.hudPipOn);
      drawCenterText('PRESS 1 — ONE PLAYER    PRESS 2 — TWO PLAYERS', 24, 340);
      drawCenterText('RED:  A/D move   S block   F jab   G hook', 18, 400, '#b9b3c9');
      drawCenterText('BLUE: ←/→ move   ↓ block   K jab   L hook', 18, 428, '#b9b3c9');
      break;
    case 'intro':
      drawCenterText(game.message, 56, 330);
      break;
    case 'count':
      if (game.count >= 1) drawCenterText(String(Math.min(10, game.count)), 72, 330, PALETTE.hudPipOn);
      break;
    case 'roundEnd':
      drawCenterText(game.message, 44, 330);
      break;
    case 'matchEnd':
      rect(0, 0, W, H, 'rgba(13,12,22,0.45)');
      drawCenterText(game.message, 60, 300, PALETTE.hudPipOn);
      drawCenterText(game.subMessage, 30, 350);
      if (game.sceneT > 1.5) drawCenterText('PRESS ENTER', 22, 420, '#b9b3c9');
      break;
  }
}

function draw() {
  drawBackground();
  drawHud();
  if (p1 && p2) {
    // draw the boxer further from a punch first so extended gloves overlap nicely
    drawBoxer(p1);
    drawBoxer(p2);
  }
  drawOverlay();
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

let dt = 0;
let lastTime = performance.now();

function frame(now) {
  dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  update();
  draw();
  requestAnimationFrame(frame);
}

// Idle boxers on the title screen
p1 = makeBoxer(W / 2 - 240, 1, P1_STYLE, P1_KEYS, false);
p2 = makeBoxer(W / 2 + 240, -1, P2_STYLE, P2_KEYS, true);

requestAnimationFrame(frame);
