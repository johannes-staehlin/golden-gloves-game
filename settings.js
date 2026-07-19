'use strict';

// ---------------------------------------------------------------------------
// Game settings — edit here, not in game.js
// ---------------------------------------------------------------------------

const ROUND_SECONDS  = 30;
const ROUNDS_TO_WIN  = 2;       // first to this many rounds wins (best of 3)
const MAX_HP         = 100;
const MOVE_SPEED     = 70;      // px/s
const PUNCH          = { damage: 6, reach: 44, duration: 0.26, cooldown: 0.16, active: [0.08, 0.16] };
const BLOCK_FACTOR   = 0.2;     // damage multiplier when blocked
const HIT_STUN       = 0.4;    // seconds attacker's foe is frozen after clean hit
const KNOCKBACK      = 8;       // pixels pushed back on clean hit
const GETUP_HP       = 35;      // HP restored when getting up from a knockdown

// AI behaviour
const AI = {
  skill:           1.0,    // CPU skill multiplier: 0.5 = easy, 1.0 = normal, 2.0 = hard
  reactionTime:    0.14,   // base seconds between AI decisions (lower = faster)
  reactionJitter:  0.14,   // random extra wait per decision
  approachHesitate:0.08,   // chance to pause while closing distance
  blockChance:     0.55,   // chance to block (vs duck) when opponent punches
  duckDuration:    0.32,   // how long duck is held
  blockDuration:   0.38,   // how long block is held
  punchChance:     0.50,   // base chance to throw a punch when in range
  circleChance:    0.22,   // chance to step away instead of punching
  chaseAfterHit:   0.35,   // chance to immediately close in after landing a punch
  counterChance:   0.40,   // extra punch chance right after opponent whiffs
};

// Crowd atmosphere
const CROWD = {
  flashRate: 0.02,  // camera flashes per frame (lower = rarer)
};

// Ring geometry (virtual 320x180 pixels — don't change unless you redo the art)
const FLOOR      = 152;
const RING_LEFT  = 36;
const RING_RIGHT = 284;
const MIN_GAP    = 26;
