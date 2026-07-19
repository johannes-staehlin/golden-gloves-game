// Shared boxer sprites for the 320x180 art (previews + game).
// initBoxers(R, P) binds the sprites to a page's rect/pixel helpers and
// returns the palettes plus drawMan/drawWoman.
// Poses: 'guard' | 'punch' | 'block' | 'duck' | 'hit' | 'down'.

'use strict';

function initBoxers(R, P) {
  const GOLD = '#c99a3f';

  const MAN = {
    skin: '#d89860', skinHi: '#eab27c', skinShad: '#a86e40',
    hair: '#1e1712', beard: '#241a12', tattoo: '#4e5866',
    trunk: '#1c1c20', trunkHi: '#34343a', trunkShad: '#101012',
    glove: '#cc2222', gloveHi: '#ee5544', gloveShad: '#8a1414',
  };
  const WOMAN = {
    skin: '#f0c098', skinHi: '#f8d8b8', skinShad: '#c89060',
    hair: '#b08a50', hairHi: '#d0ac6c', hairShad: '#7c5c30',   // light brown, sun-kissed
    bra: '#141418', braHi: '#26262e',
    leg: '#17171b', legHi: '#2c2c34', legShad: '#101014',
    glove: '#2244cc', gloveHi: '#4466ee', gloveShad: '#141c8a',
  };

  // Fully shaded glove: wrist cuff with laces, sheen, knuckle seam, thumb.
  function drawGlove(M, dx, y, s, c) {
    M(dx - 2, y + 2, 2, s - 4, c.gloveShad);
    M(dx - 2, y + 3, 1, 1, '#e8e8e8');
    M(dx - 2, y + 5, 1, 1, '#e8e8e8');
    M(dx, y, s, s, c.glove);
    M(dx, y, s, 1, c.gloveHi);
    M(dx + 1, y + 1, 3, 3, c.gloveHi);
    M(dx + s - 2, y + 1, 1, s - 4, c.gloveShad);
    M(dx + s - 4, y + s - 3, 4, 2, c.gloveShad);
    M(dx, y + s - 1, s, 1, c.gloveShad);
  }

  function sweat(M, dx, y) {
    M(dx, y, 1, 1, '#bfe8ff');
    M(dx + 3, y - 2, 1, 1, '#bfe8ff');
  }

  // Bearded, tattooed male boxer (~74px standing). dir = +1 faces right.
  function drawMan(bx, by, dir, c, pose = 'guard') {
    const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
    const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

    if (pose === 'down') {
      // flat on his back, head away from the opponent
      M(-26, by - 3, 46, 3, 'rgba(0,0,0,0)');
      M(8, by - 7, 13, 4, c.skinShad);               // legs stacked
      M(19, by - 9, 6, 6, '#202024');                // shoes up
      M(-2, by - 9, 11, 7, c.trunk);
      M(-2, by - 9, 11, 1, GOLD);
      M(-14, by - 9, 13, 7, c.skin);                 // torso
      M(-14, by - 9, 13, 2, c.skinHi);
      Px(-8, by - 8, c.tattoo); Px(-11, by - 7, c.tattoo);
      M(-6, by - 12, 8, 3, c.skinShad);              // arm across chest
      drawGlove(M, 1, by - 15, 8, c);
      M(-22, by - 11, 8, 8, c.skin);                 // head
      M(-25, by - 11, 4, 8, c.hair);
      M(-17, by - 6, 4, 3, c.beard);
      M(-18, by - 8, 3, 1, '#241408');               // closed eyes
      sweat(M, -24, by - 15);
      return;
    }

    if (pose === 'duck') {
      // crouch: knees bent, torso tucked, gloves shielding
      M(-16, by - 2, 34, 4, 'rgba(0,0,0,0)');
      M(-13, by - 4, 9, 4, '#202024');
      M(-12, by - 3, 7, 1, '#3a3a40');
      M(-13, by - 1, 9, 1, '#0c0c0c');
      M(4, by - 4, 10, 4, '#202024');
      M(5, by - 3, 7, 1, '#3a3a40');
      M(4, by - 1, 10, 1, '#0c0c0c');
      M(-11, by - 20, 5, 16, c.skinShad);            // shins
      M(5, by - 20, 5, 16, c.skin);
      M(5, by - 20, 2, 16, c.skinHi);
      M(-10, by - 32, 17, 12, c.trunk);              // trunks sunk low
      M(-10, by - 32, 17, 2, GOLD);
      M(-10, by - 30, 2, 10, c.trunkShad);
      M(-7, by - 44, 15, 12, c.skin);                // torso leaning in
      M(-7, by - 44, 3, 12, c.skinShad);
      M(4, by - 44, 4, 11, c.skinHi);
      Px(2, by - 43, c.tattoo); Px(4, by - 42, c.tattoo);
      M(2, by - 46, 5, 3, c.skinShad);               // neck tucked
      M(2, by - 56, 11, 11, c.skin);                 // head forward
      M(1, by - 58, 12, 3, c.hair);
      M(1, by - 55, 3, 7, c.hair);
      M(9, by - 52, 3, 2, c.hair);                   // brow
      M(9, by - 50, 3, 2, '#ffffff');
      Px(11, by - 50, '#241408');
      M(12, by - 48, 2, 2, c.skinShad);              // nose
      M(7, by - 47, 7, 3, c.beard);
      M(10, by - 49, 3, 2, c.beard);
      M(-9, by - 42, 4, 8, c.skinShad);              // rear deltoid
      M(-8, by - 40, 2, 2, c.tattoo);
      drawGlove(M, -1, by - 45, 9, c);               // gloves shielding
      drawGlove(M, 10, by - 51, 9, c);
      return;
    }

    const lean = pose === 'punch' ? 2 : pose === 'hit' ? -3 : 0;

    M(-16, by - 2, 34, 4, 'rgba(0,0,0,0.4)');

    // legs + shoes
    M(-11, by - 28, 6, 13, c.skinShad);
    M(-11, by - 16, 5, 12, c.skinShad);
    M(-13, by - 4, 9, 4, '#202024');
    M(-12, by - 3, 7, 1, '#3a3a40');
    M(-13, by - 1, 9, 1, '#0c0c0c');
    M(4, by - 28, 6, 13, c.skin);
    M(4, by - 28, 2, 13, c.skinHi);
    M(5, by - 16, 5, 12, c.skin);
    M(5, by - 16, 2, 12, c.skinHi);
    Px(6, by - 29, c.skinShad);
    M(4, by - 4, 10, 4, '#202024');
    M(5, by - 3, 7, 1, '#3a3a40');
    M(4, by - 1, 10, 1, '#0c0c0c');

    // trunks
    M(-9 + lean, by - 42, 17, 15, c.trunk);
    M(-9 + lean, by - 42, 17, 2, GOLD);
    M(-2 + lean, by - 40, 5, 1, '#d8d8d8');
    M(4 + lean, by - 40, 2, 12, c.trunkHi);
    M(-1 + lean, by - 33, 2, 6, c.trunkShad);
    M(-9 + lean, by - 40, 2, 13, c.trunkShad);
    M(-6 + lean, by - 31, 1, 4, c.trunkShad);

    // torso
    M(-8 + lean, by - 58, 16, 16, c.skin);
    M(-8 + lean, by - 58, 3, 16, c.skinShad);
    M(3 + lean, by - 58, 5, 15, c.skinHi);
    M(0 + lean, by - 57, 5, 1, c.skinShad);
    M(-1 + lean, by - 51, 6, 1, c.skinShad);
    Px(4 + lean, by - 53, c.skinShad);
    for (let i = 0; i < 3; i++) {
      Px(-1 + lean, by - 48 + i * 3, c.skinShad);
      Px(1 + lean, by - 47 + i * 3, c.skinShad);
    }
    // chest piece + rib tattoos
    for (const [tx, ty] of [[1, 57], [3, 56], [0, 55], [2, 54], [4, 55], [2, 52], [5, 53]]) {
      Px(tx + lean, by - ty, c.tattoo);
    }
    M(-4 + lean, by - 49, 1, 2, c.tattoo);
    M(-3 + lean, by - 46, 1, 2, c.tattoo);
    M(-5 + lean, by - 44, 1, 2, c.tattoo);
    M(-2 + lean, by - 44, 1, 2, c.tattoo);
    M(-7 + lean, by - 56, 2, 2, c.tattoo);           // trap / upper back
    M(-6 + lean, by - 52, 2, 1, c.tattoo);           // shoulder blade

    // neck + head
    M(-2 + lean, by - 61, 6, 4, c.skinShad);
    M(-4 + lean, by - 72, 11, 12, c.skin);
    M(-5 + lean, by - 74, 12, 4, c.hair);
    M(-5 + lean, by - 70, 3, 5, c.hair);
    M(3 + lean, by - 68, 4, 2, c.hair);
    M(4 + lean, by - 66, 3, 2, '#ffffff');
    Px(6 + lean, by - 66, '#241408');
    M(7 + lean, by - 64, 2, 3, c.skinShad);
    M(1 + lean, by - 63, 8, 3, c.beard);
    M(5 + lean, by - 65, 3, 2, c.beard);
    Px(3 + lean, by - 62, '#3a2c22');
    Px(6 + lean, by - 61, '#3a2c22');
    Px(5 + lean, by - 62, '#8a5a4a');
    M(-2 + lean, by - 67, 2, 3, c.skinShad);
    if (pose === 'hit') sweat(M, -4 + lean, by - 77);

    // rear arm
    if (pose === 'hit') {
      M(-12 + lean, by - 58, 5, 10, c.skinShad);
      M(-10 + lean, by - 55, 2, 2, c.tattoo);
      drawGlove(M, -2 + lean, by - 52, 9, c);        // guard dropped
    } else {
      M(-12 + lean, by - 58, 5, 10, c.skinShad);
      M(-9 + lean, by - 51, 10, 5, c.skinShad);
      for (const [tx, ty] of [[-11, 56], [-10, 53], [-12, 51], [-8, 50], [-6, 49], [-9, 55], [-4, 50]]) {
        M(tx + lean, by - ty, 2, 2, c.tattoo);
      }
      drawGlove(M, 3 + lean, by - 62, 9, c);         // glove by the chin
    }

    // lead arm
    if (pose === 'punch') {
      M(5 + lean, by - 57, 8, 5, c.skin);
      M(12 + lean, by - 56, 7, 4, c.skinHi);
      Px(6 + lean, by - 56, c.tattoo);
      Px(8 + lean, by - 55, c.tattoo);
      Px(7 + lean, by - 54, c.tattoo);
      drawGlove(M, 19 + lean, by - 59, 9, c);
    } else if (pose === 'block') {
      M(5, by - 62, 4, 7, c.skin);                   // forearm raised
      M(6, by - 67, 4, 6, c.skinHi);
      drawGlove(M, 5, by - 71, 9, c);                // glove covering the face
    } else if (pose === 'hit') {
      M(3 + lean, by - 54, 6, 4, c.skin);
      drawGlove(M, 9 + lean, by - 52, 9, c);         // arm drooping
    } else {
      M(5, by - 56, 6, 5, c.skin);
      M(10, by - 54, 5, 5, c.skinHi);
      Px(6, by - 55, c.tattoo);
      Px(8, by - 54, c.tattoo);
      Px(7, by - 53, c.tattoo);
      drawGlove(M, 14, by - 58, 9, c);
    }
  }

  // Female boxer with a light-brown braid (~68px standing). dir = +1 faces right.
  function drawWoman(bx, by, dir, c, pose = 'guard') {
    const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
    const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

    if (pose === 'down') {
      M(-24, by - 3, 42, 3, 'rgba(0,0,0,0)');
      M(8, by - 6, 12, 3, c.leg);                    // legs stacked
      M(19, by - 8, 5, 5, '#e8e8e8');                // sneakers up
      M(-2, by - 8, 11, 6, c.leg);                   // hips
      M(-2, by - 8, 11, 1, c.legHi);
      M(-5, by - 8, 4, 6, c.skin);                   // midriff
      M(-13, by - 9, 9, 7, c.bra);                   // bra
      M(-8, by - 12, 8, 3, c.skinShad);              // arm across
      drawGlove(M, -2, by - 14, 7, c);
      M(-21, by - 10, 8, 8, c.skin);                 // head
      M(-26, by - 10, 6, 8, c.hair);                 // hair spread on the mat
      M(-21, by - 12, 8, 3, c.hairHi);
      M(-17, by - 7, 3, 1, '#4a3420');               // closed eyes
      sweat(M, -24, by - 15);
      return;
    }

    if (pose === 'duck') {
      // crouched: knees bent, torso leaning in, both gloves up by the face
      M(-14, by - 2, 30, 4, 'rgba(0,0,0,0)');
      M(-11, by - 3, 8, 3, '#d8d8d8');
      M(-11, by - 1, 8, 1, '#909090');
      M(3, by - 3, 9, 3, '#e8e8e8');
      M(3, by - 1, 9, 1, '#909090');
      M(-9, by - 20, 5, 17, c.legShad);
      M(3, by - 20, 5, 17, c.leg);
      M(3, by - 20, 2, 17, c.legHi);
      M(-9, by - 27, 15, 8, c.leg);
      M(-9, by - 27, 15, 2, c.legHi);
      Px(2, by - 25, GOLD);
      M(-4, by - 36, 10, 10, c.skin);
      M(-4, by - 36, 2, 10, c.skinShad);
      M(3, by - 36, 2, 10, c.skinHi);
      M(-4, by - 43, 11, 8, c.bra);
      M(3, by - 42, 2, 6, c.braHi);
      M(-6, by - 40, 4, 6, c.skinShad);
      M(1, by - 46, 5, 3, c.skinShad);
      M(0, by - 56, 9, 11, c.skin);
      M(-1, by - 58, 10, 3, c.hairHi);
      M(-2, by - 56, 3, 9, c.hair);
      M(-3, by - 48, 3, 12, c.hair);
      Px(-2, by - 44, c.hairShad); Px(-2, by - 40, c.hairShad);
      M(5, by - 53, 3, 1, c.hairShad);
      M(5, by - 52, 3, 2, '#ffffff');
      Px(7, by - 52, '#3a5a7a');
      M(8, by - 50, 1, 2, c.skinShad);
      M(6, by - 48, 3, 1, '#c06858');
      drawGlove(M, -1, by - 46, 8, c);
      drawGlove(M, 9, by - 49, 8, c);
      return;
    }

    const lean = pose === 'punch' ? 2 : pose === 'hit' ? -3 : 0;

    M(-14, by - 2, 30, 4, 'rgba(0,0,0,0.4)');

    // sneakers
    M(-11, by - 3, 8, 3, '#d8d8d8');
    M(-11, by - 1, 8, 1, '#909090');
    M(3, by - 3, 9, 3, '#e8e8e8');
    M(3, by - 1, 9, 1, '#909090');

    // black leggings
    M(-9, by - 30, 5, 27, c.legShad);
    M(3, by - 30, 5, 27, c.leg);
    M(3, by - 30, 2, 27, c.legHi);
    Px(4, by - 16, c.legHi);
    M(-8, by - 36, 15, 7, c.leg);
    M(-8, by - 36, 15, 2, c.legHi);
    Px(3, by - 34, GOLD);

    // bare midriff (slimmer waist than hips/chest)
    M(-5 + lean, by - 46, 10, 10, c.skin);
    M(-5 + lean, by - 46, 2, 10, c.skinShad);
    M(2 + lean, by - 46, 3, 10, c.skinHi);
    Px(0 + lean, by - 42, c.skinShad);
    Px(0 + lean, by - 39, c.skinShad);
    Px(1 + lean, by - 38, c.skinShad);

    // sports bra
    M(-6 + lean, by - 53, 12, 7, c.bra);
    M(2 + lean, by - 52, 2, 5, c.braHi);
    M(-5 + lean, by - 56, 2, 4, c.bra);
    M(3 + lean, by - 56, 2, 4, c.bra);

    // neck + head
    M(-1 + lean, by - 56, 4, 3, c.skinShad);
    M(-3 + lean, by - 66, 9, 11, c.skin);
    M(-3 + lean, by - 68, 8, 1, c.hairHi);              // crown top (narrower = rounded)
    M(-4 + lean, by - 67, 10, 2, c.hairHi);             // crown lower
    M(-5 + lean, by - 66, 3, 9, c.hair);               // back of head
    M(-6 + lean, by - 58, 3, 16, c.hair);              // braid down the back
    Px(-5 + lean, by - 54, c.hairShad); Px(-5 + lean, by - 49, c.hairShad); Px(-5 + lean, by - 44, c.hairShad);
    M(3 + lean, by - 63, 2, 1, c.skinShad);             // brow (softer, narrower)
    M(3 + lean, by - 61, 3, 2, '#ffffff');             // eye
    Px(5 + lean, by - 61, '#3a5a7a');
    M(6 + lean, by - 59, 1, 2, c.skinShad);            // nose
    Px(2 + lean, by - 58, '#c06858');                  // smile: raised back corner
    M(3 + lean, by - 57, 3, 1, '#c06858');             // smiling mouth
    Px(6 + lean, by - 58, '#c06858');                  // raised front corner
    M(-1 + lean, by - 61, 2, 3, c.skinShad);           // ear
    Px(0 + lean, by - 58, GOLD);                       // earring
    if (pose === 'hit') sweat(M, -3 + lean, by - 71);

    // rear arm
    if (pose === 'hit') {
      M(-8 + lean, by - 52, 4, 8, c.skinShad);
      drawGlove(M, -2 + lean, by - 47, 8, c);          // guard dropped
    } else {
      M(-8 + lean, by - 52, 4, 8, c.skinShad);
      M(-5 + lean, by - 47, 8, 4, c.skinShad);
      drawGlove(M, 3 + lean, by - 56, 8, c);           // glove by the chin
    }

    // lead arm
    if (pose === 'punch') {
      M(4 + lean, by - 51, 6, 4, c.skin);
      M(9 + lean, by - 50, 6, 4, c.skinHi);
      drawGlove(M, 17 + lean, by - 53, 8, c);
    } else if (pose === 'block') {
      M(4, by - 56, 4, 6, c.skin);                     // forearm raised
      M(5, by - 61, 3, 6, c.skinHi);
      drawGlove(M, 4, by - 65, 8, c);                  // glove covering the face
    } else if (pose === 'hit') {
      M(3 + lean, by - 48, 5, 4, c.skin);
      drawGlove(M, 8 + lean, by - 46, 8, c);           // arm drooping
    } else {
      M(4, by - 50, 5, 4, c.skin);
      M(8, by - 48, 4, 4, c.skinHi);
      drawGlove(M, 12, by - 52, 8, c);
    }
  }

  // -------------------------------------------------------------------------
  // Heavy old man: tall, wide belly, white short hair, white tank top
  // -------------------------------------------------------------------------
  const HEAVY_MAN = {
    skin: '#d4a07a', skinHi: '#e8c49a', skinShad: '#a06840',
    hair: '#e8e8e8', hairShad: '#b0b0b0',
    tank: '#f0f0f0', tankHi: '#ffffff', tankShad: '#b8b8b8',
    trunk: '#1c1c20', trunkHi: '#34343a', trunkShad: '#101012',
    glove: '#cc2222', gloveHi: '#ee5544', gloveShad: '#8a1414',
  };

  function drawHeavyMan(bx, by, dir, c, pose = 'guard') {
    const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
    const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

    if (pose === 'down') {
      M(8, by - 8, 18, 5, c.skinShad);
      M(24, by - 10, 7, 7, '#202024');
      M(-3, by - 10, 13, 8, c.trunk);
      M(-3, by - 10, 13, 1, GOLD);
      M(-18, by - 10, 16, 8, c.tank);
      M(-18, by - 10, 16, 2, c.tankHi);
      M(-8, by - 14, 9, 4, c.skinShad);
      drawGlove(M, 1, by - 17, 9, c);
      M(-26, by - 12, 12, 9, c.skin);
      M(-29, by - 12, 4, 9, c.hair);
      M(-22, by - 8, 5, 3, c.hairShad);
      sweat(M, -28, by - 17);
      return;
    }

    if (pose === 'duck') {
      M(-15, by - 4, 12, 4, '#202024');
      M(-14, by - 3, 10, 1, '#3a3a40');
      M(-15, by - 1, 12, 1, '#0c0c0c');
      M(4, by - 4, 13, 4, '#202024');
      M(5, by - 3, 10, 1, '#3a3a40');
      M(4, by - 1, 13, 1, '#0c0c0c');
      M(-14, by - 24, 9, 20, c.skinShad);
      M(5, by - 24, 9, 20, c.skin);
      M(5, by - 24, 3, 20, c.skinHi);
      M(-13, by - 38, 23, 15, c.trunk);
      M(-13, by - 38, 23, 2, GOLD);
      M(-13, by - 36, 2, 13, c.trunkShad);
      M(-10, by - 53, 22, 15, c.tank);
      M(-10, by - 53, 5, 15, c.tankShad);
      M(6, by - 53, 6, 14, c.tankHi);
      M(-5, by - 55, 4, 3, c.skinShad);
      M(-4, by - 67, 16, 14, c.skin);
      M(-5, by - 70, 17, 5, c.hair);
      M(-5, by - 66, 5, 10, c.hair);
      // eye + iris in duck pose
      M(7, by - 63, 5, 2, '#ffffff');
      Px(11, by - 63, '#241408');
      M(12, by - 61, 3, 3, c.skinShad);
      M(-11, by - 51, 6, 12, c.skinShad);
      drawGlove(M, -2, by - 53, 9, c);
      drawGlove(M, 10, by - 60, 9, c);
      return;
    }

    const lean = pose === 'punch' ? 2 : pose === 'hit' ? -3 : 0;

    M(-20, by - 2, 42, 4, 'rgba(0,0,0,0.4)');

    // big shoes
    M(-14, by - 4, 12, 4, '#202024');
    M(-13, by - 3, 10, 1, '#3a3a40');
    M(-14, by - 1, 12, 1, '#0c0c0c');
    M(4, by - 4, 13, 4, '#202024');
    M(5, by - 3, 10, 1, '#3a3a40');
    M(4, by - 1, 13, 1, '#0c0c0c');

    // very thick legs
    M(-14, by - 32, 10, 28, c.skinShad);
    M(4, by - 32, 10, 28, c.skin);
    M(4, by - 32, 3, 28, c.skinHi);

    // wide trunks
    M(-12 + lean, by - 46, 26, 15, c.trunk);
    M(-12 + lean, by - 46, 26, 2, GOLD);
    M(8 + lean, by - 44, 2, 12, c.trunkHi);
    M(-12 + lean, by - 44, 2, 13, c.trunkShad);

    // big belly + tank top
    M(-11 + lean, by - 65, 24, 19, c.tank);
    M(-11 + lean, by - 65, 5, 19, c.tankShad);
    M(7 + lean, by - 65, 6, 18, c.tankHi);
    M(-12 + lean, by - 53, 2, 6, c.tankShad);
    M(10 + lean, by - 53, 2, 6, c.tankShad);
    M(-10 + lean, by - 66, 4, 2, c.tank);
    M(6 + lean, by - 66, 4, 2, c.tank);

    // neck + big head
    M(-2 + lean, by - 69, 8, 5, c.skinShad);
    M(-6 + lean, by - 82, 16, 14, c.skin);
    M(-6 + lean, by - 82, 5, 14, c.skinShad);
    M(6 + lean, by - 82, 4, 12, c.skinHi);
    M(-7 + lean, by - 84, 17, 5, c.hair);
    M(-7 + lean, by - 80, 4, 6, c.hair);
    M(6 + lean, by - 80, 5, 4, c.hair);
    M(-6 + lean, by - 79, 2, 2, c.hairShad);
    M(4 + lean, by - 75, 3, 1, '#888');
    M(4 + lean, by - 74, 3, 2, '#ffffff');
    Px(6 + lean, by - 74, '#241408');
    M(8 + lean, by - 72, 4, 5, c.skinShad);
    M(2 + lean, by - 71, 8, 2, c.skinShad);
    Px(2 + lean, by - 70, c.skinShad);
    M(-4 + lean, by - 75, 2, 5, c.skinShad);
    if (pose === 'hit') sweat(M, -6 + lean, by - 87);

    // rear arm
    if (pose === 'hit') {
      M(-16 + lean, by - 66, 8, 14, c.skinShad);
      drawGlove(M, -2 + lean, by - 59, 9, c);
    } else {
      M(-16 + lean, by - 66, 8, 14, c.skinShad);
      M(-11 + lean, by - 57, 14, 7, c.skinShad);
      drawGlove(M, 3 + lean, by - 70, 9, c);
    }

    // lead arm
    if (pose === 'punch') {
      M(7 + lean, by - 65, 10, 7, c.skin);
      M(15 + lean, by - 64, 9, 6, c.skinHi);
      drawGlove(M, 23 + lean, by - 67, 9, c);
    } else if (pose === 'block') {
      M(5, by - 70, 6, 9, c.skin);
      M(6, by - 76, 6, 8, c.skinHi);
      drawGlove(M, 5, by - 82, 9, c);
    } else if (pose === 'hit') {
      M(5 + lean, by - 62, 8, 6, c.skin);
      drawGlove(M, 12 + lean, by - 60, 9, c);
    } else {
      M(7, by - 64, 8, 7, c.skin);
      M(13, by - 62, 7, 7, c.skinHi);
      drawGlove(M, 18, by - 66, 9, c);
    }
  }

  // -------------------------------------------------------------------------
  // Heavy woman: wide build, large sports bra, pants to mid-shin, mixed hair
  // -------------------------------------------------------------------------
  const HEAVY_WOMAN = {
    skin: '#f0b888', skinHi: '#fcd4aa', skinShad: '#c07848',
    hair: '#b08a50', hairHi: '#c8a86a', hairShad: '#6a4a20',
    hairGrey: '#c0b8a8',
    bra: '#cc2255', braHi: '#ee4477',
    pants: '#1a2a4a', pantsHi: '#2a3e6a', pantsShad: '#0e1a30',
    glove: '#2244cc', gloveHi: '#4466ee', gloveShad: '#141c8a',
  };

  function drawHeavyWoman(bx, by, dir, c, pose = 'guard') {
    const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
    const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

    if (pose === 'down') {
      M(8, by - 7, 15, 4, c.pants);
      M(22, by - 9, 6, 6, '#d8d8d8');
      M(-2, by - 9, 13, 7, c.pants);
      M(-2, by - 9, 13, 1, c.pantsHi);
      M(-7, by - 9, 6, 7, c.skin);
      M(-14, by - 10, 9, 8, c.bra);
      M(-10, by - 13, 10, 4, c.skinShad);
      drawGlove(M, -2, by - 15, 8, c);
      M(-23, by - 11, 11, 9, c.skin);
      M(-28, by - 11, 6, 9, c.hair);
      M(-23, by - 13, 11, 3, c.hairHi);
      M(-19, by - 8, 4, 1, '#4a3420');
      sweat(M, -27, by - 17);
      return;
    }

    if (pose === 'duck') {
      M(-13, by - 3, 11, 3, '#d8d8d8');
      M(-13, by - 1, 11, 1, '#909090');
      M(3, by - 3, 12, 3, '#e8e8e8');
      M(3, by - 1, 12, 1, '#909090');
      M(-11, by - 5, 9, 2, c.skin);
      M(3, by - 5, 10, 2, c.skin);
      M(-12, by - 26, 9, 21, c.pantsShad);
      M(3, by - 26, 9, 21, c.pants);
      M(3, by - 26, 3, 21, c.pantsHi);
      M(-11, by - 33, 20, 8, c.pants);
      M(-11, by - 33, 20, 2, c.pantsHi);
      M(-6, by - 40, 16, 5, c.skin);
      M(-8, by - 51, 19, 11, c.bra);
      M(5, by - 50, 3, 9, c.braHi);
      M(-7, by - 54, 3, 4, c.bra);
      M(6, by - 54, 3, 4, c.bra);
      M(1, by - 54, 5, 3, c.skinShad);
      M(-3, by - 65, 13, 13, c.skin);
      M(-4, by - 68, 14, 4, c.hairHi);
      M(-5, by - 66, 5, 11, c.hair);
      M(-4, by - 65, 1, 6, c.hairGrey);
      Px(-4, by - 60, c.hairShad);
      M(5, by - 61, 3, 2, '#ffffff');
      Px(7, by - 61, '#3a5a7a');
      M(8, by - 59, 1, 2, c.skinShad);
      M(5, by - 57, 4, 1, '#9a5848');
      drawGlove(M, -1, by - 52, 8, c);
      drawGlove(M, 9, by - 57, 8, c);
      return;
    }

    const lean = pose === 'punch' ? 2 : pose === 'hit' ? -3 : 0;

    M(-16, by - 2, 34, 4, 'rgba(0,0,0,0.4)');

    // sneakers
    M(-13, by - 3, 10, 3, '#d8d8d8');
    M(-13, by - 1, 10, 1, '#909090');
    M(3, by - 3, 12, 3, '#e8e8e8');
    M(3, by - 1, 12, 1, '#909090');

    // ankle skin gap
    M(-11, by - 5, 9, 2, c.skin);
    M(3, by - 5, 10, 2, c.skin);

    // wide pants
    M(-12, by - 34, 9, 29, c.pantsShad);
    M(3, by - 34, 9, 29, c.pants);
    M(3, by - 34, 3, 29, c.pantsHi);
    M(-11, by - 40, 21, 7, c.pants);
    M(-11, by - 40, 21, 2, c.pantsHi);

    // bare midriff
    M(-8 + lean, by - 50, 18, 7, c.skin);
    M(-8 + lean, by - 50, 3, 7, c.skinShad);
    M(6 + lean, by - 50, 4, 7, c.skinHi);
    Px(1 + lean, by - 46, c.skinShad);
    Px(2 + lean, by - 45, c.skinShad);

    // wide sports bra
    M(-9 + lean, by - 59, 19, 9, c.bra);
    M(5 + lean, by - 58, 4, 7, c.braHi);
    M(-8 + lean, by - 62, 3, 4, c.bra);
    M(6 + lean, by - 62, 3, 4, c.bra);

    // neck + wide head
    M(-1 + lean, by - 63, 6, 4, c.skinShad);
    M(-5 + lean, by - 74, 13, 12, c.skin);
    M(-5 + lean, by - 74, 4, 12, c.skinShad);
    M(4 + lean, by - 74, 4, 10, c.skinHi);

    // hair with grey streaks
    M(-6 + lean, by - 77, 14, 5, c.hairHi);
    M(-6 + lean, by - 75, 5, 11, c.hair);
    M(-7 + lean, by - 67, 3, 12, c.hair);
    M(-6 + lean, by - 76, 1, 7, c.hairGrey);
    M(-4 + lean, by - 77, 1, 4, c.hairGrey);
    Px(-6 + lean, by - 61, c.hairShad);
    Px(-6 + lean, by - 56, c.hairShad);

    // face: determined
    M(3 + lean, by - 70, 3, 1, '#888');
    Px(3 + lean, by - 69, c.skinShad);
    M(3 + lean, by - 68, 3, 2, '#ffffff');
    Px(5 + lean, by - 68, '#3a5a7a');
    M(7 + lean, by - 66, 1, 2, c.skinShad);
    M(2 + lean, by - 64, 5, 1, '#9a5848');
    M(-3 + lean, by - 68, 2, 3, c.skinShad);
    Px(-2 + lean, by - 65, GOLD);
    if (pose === 'hit') sweat(M, -5 + lean, by - 79);

    // rear arm
    if (pose === 'hit') {
      M(-11 + lean, by - 59, 6, 11, c.skinShad);
      drawGlove(M, -2 + lean, by - 53, 8, c);
    } else {
      M(-11 + lean, by - 59, 6, 11, c.skinShad);
      M(-8 + lean, by - 53, 11, 6, c.skinShad);
      drawGlove(M, 3 + lean, by - 63, 8, c);
    }

    // lead arm
    if (pose === 'punch') {
      M(6 + lean, by - 57, 8, 6, c.skin);
      M(13 + lean, by - 56, 8, 6, c.skinHi);
      drawGlove(M, 21 + lean, by - 60, 8, c);
    } else if (pose === 'block') {
      M(4, by - 62, 6, 8, c.skin);
      M(5, by - 68, 5, 8, c.skinHi);
      drawGlove(M, 4, by - 72, 8, c);
    } else if (pose === 'hit') {
      M(5 + lean, by - 54, 7, 6, c.skin);
      drawGlove(M, 10 + lean, by - 53, 8, c);
    } else {
      M(6, by - 56, 7, 6, c.skin);
      M(11, by - 54, 6, 6, c.skinHi);
      drawGlove(M, 15, by - 59, 8, c);
    }
  }

  return { MAN, WOMAN, drawMan, drawWoman, HEAVY_MAN, HEAVY_WOMAN, drawHeavyMan, drawHeavyWoman };
}
