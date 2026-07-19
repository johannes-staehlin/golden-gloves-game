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
  // Fat old man: tall, wide belly, white short hair, white tank top
  // -------------------------------------------------------------------------
  const FAT_MAN = {
    skin: '#d4a07a', skinHi: '#e8c49a', skinShad: '#a06840',
    hair: '#e8e8e8', hairShad: '#b0b0b0',
    tank: '#f0f0f0', tankHi: '#ffffff', tankShad: '#b8b8b8',
    trunk: '#1c1c20', trunkHi: '#34343a', trunkShad: '#101012',
    glove: '#cc2222', gloveHi: '#ee5544', gloveShad: '#8a1414',
  };

  function drawFatMan(bx, by, dir, c, pose = 'guard') {
    const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
    const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

    if (pose === 'down') {
      M(-28, by - 3, 50, 3, 'rgba(0,0,0,0)');
      M(8, by - 8, 16, 5, c.skinShad);               // thick legs
      M(22, by - 10, 7, 7, '#202024');                // shoes
      M(-3, by - 10, 13, 8, c.trunk);                // trunks
      M(-3, by - 10, 13, 1, GOLD);
      M(-16, by - 10, 14, 8, c.tank);                // tank top
      M(-16, by - 10, 14, 2, c.tankHi);
      M(-8, by - 14, 9, 4, c.skinShad);              // arm
      drawGlove(M, 1, by - 17, 9, c);
      M(-24, by - 12, 10, 9, c.skin);                // big head
      M(-27, by - 12, 4, 9, c.hair);
      M(-20, by - 8, 5, 3, c.hairShad);              // closed eyes
      sweat(M, -26, by - 17);
      return;
    }

    if (pose === 'duck') {
      M(-18, by - 2, 38, 4, 'rgba(0,0,0,0)');
      M(-15, by - 4, 11, 4, '#202024');              // left shoe
      M(-14, by - 3, 9, 1, '#3a3a40');
      M(-15, by - 1, 11, 1, '#0c0c0c');
      M(4, by - 4, 12, 4, '#202024');                // right shoe
      M(5, by - 3, 9, 1, '#3a3a40');
      M(4, by - 1, 12, 1, '#0c0c0c');
      M(-13, by - 22, 7, 18, c.skinShad);            // thick shins
      M(5, by - 22, 7, 18, c.skin);
      M(5, by - 22, 2, 18, c.skinHi);
      M(-12, by - 36, 20, 14, c.trunk);              // trunks
      M(-12, by - 36, 20, 2, GOLD);
      M(-12, by - 34, 2, 12, c.trunkShad);
      M(-9, by - 50, 19, 14, c.tank);                // tank top tucked forward
      M(-9, by - 50, 4, 14, c.tankShad);
      M(5, by - 50, 5, 13, c.tankHi);
      M(-5, by - 52, 4, 3, c.skinShad);              // neck tucked
      M(-4, by - 64, 14, 13, c.skin);                // big head forward
      M(-5, by - 67, 15, 4, c.hair);
      M(-5, by - 63, 4, 9, c.hair);
      M(6, by - 60, 5, 2, '#ffffff');
      Px(10, by - 60, '#241408');
      M(11, by - 58, 3, 3, c.skinShad);
      M(-10, by - 48, 5, 10, c.skinShad);            // rear arm
      M(-9, by - 45, 2, 2, c.skinShad);
      drawGlove(M, -2, by - 50, 9, c);
      drawGlove(M, 10, by - 57, 9, c);
      return;
    }

    const lean = pose === 'punch' ? 2 : pose === 'hit' ? -3 : 0;

    M(-18, by - 2, 38, 4, 'rgba(0,0,0,0.4)');

    // big feet / shoes
    M(-13, by - 4, 11, 4, '#202024');
    M(-12, by - 3, 9, 1, '#3a3a40');
    M(-13, by - 1, 11, 1, '#0c0c0c');
    M(4, by - 4, 12, 4, '#202024');
    M(5, by - 3, 9, 1, '#3a3a40');
    M(4, by - 1, 12, 1, '#0c0c0c');

    // thick legs / shins
    M(-13, by - 30, 8, 26, c.skinShad);
    M(4, by - 30, 8, 26, c.skin);
    M(4, by - 30, 3, 26, c.skinHi);

    // trunks (wide)
    M(-11 + lean, by - 44, 22, 15, c.trunk);
    M(-11 + lean, by - 44, 22, 2, GOLD);
    M(6 + lean, by - 42, 2, 12, c.trunkHi);
    M(-11 + lean, by - 42, 2, 13, c.trunkShad);
    M(-1 + lean, by - 35, 2, 6, c.trunkShad);

    // big belly + tank top
    M(-10 + lean, by - 62, 20, 18, c.tank);          // tank top covers torso
    M(-10 + lean, by - 62, 4, 18, c.tankShad);
    M(5 + lean, by - 62, 5, 17, c.tankHi);
    // belly bulge below tank
    M(-10 + lean, by - 52, 20, 8, c.tank);
    M(-11 + lean, by - 50, 2, 5, c.tankShad);        // side bulge shadow
    M(9 + lean, by - 50, 2, 5, c.tankShad);
    // tank top straps / shoulders
    M(-9 + lean, by - 63, 4, 2, c.tank);
    M(4 + lean, by - 63, 4, 2, c.tank);

    // neck + big head
    M(-2 + lean, by - 66, 7, 5, c.skinShad);
    M(-5 + lean, by - 78, 14, 13, c.skin);           // wide head
    M(-5 + lean, by - 78, 4, 13, c.skinShad);        // cheek shadow
    M(5 + lean, by - 78, 4, 11, c.skinHi);
    // short white hair
    M(-6 + lean, by - 80, 15, 4, c.hair);
    M(-6 + lean, by - 76, 3, 5, c.hair);
    M(5 + lean, by - 76, 4, 3, c.hair);
    M(-5 + lean, by - 75, 2, 2, c.hairShad);
    // face: old man — small eyes, big nose, frown
    M(4 + lean, by - 72, 3, 1, '#888');              // brow (thick)
    M(4 + lean, by - 71, 3, 2, '#ffffff');           // eye white
    Px(6 + lean, by - 71, '#241408');                // pupil
    M(8 + lean, by - 69, 3, 4, c.skinShad);         // big nose
    M(2 + lean, by - 68, 7, 2, c.skinShad);         // frown / mouth
    Px(2 + lean, by - 67, c.skinShad);
    M(-3 + lean, by - 72, 2, 4, c.skinShad);        // ear
    if (pose === 'hit') sweat(M, -5 + lean, by - 83);

    // rear arm (fat upper arm)
    if (pose === 'hit') {
      M(-14 + lean, by - 63, 7, 12, c.skinShad);
      drawGlove(M, -2 + lean, by - 57, 9, c);
    } else {
      M(-14 + lean, by - 63, 7, 12, c.skinShad);
      M(-10 + lean, by - 55, 12, 6, c.skinShad);
      drawGlove(M, 3 + lean, by - 67, 9, c);
    }

    // lead arm
    if (pose === 'punch') {
      M(6 + lean, by - 62, 9, 6, c.skin);
      M(14 + lean, by - 61, 8, 5, c.skinHi);
      drawGlove(M, 21 + lean, by - 64, 9, c);
    } else if (pose === 'block') {
      M(5, by - 67, 5, 8, c.skin);
      M(6, by - 73, 5, 7, c.skinHi);
      drawGlove(M, 5, by - 78, 9, c);
    } else if (pose === 'hit') {
      M(4 + lean, by - 59, 7, 5, c.skin);
      drawGlove(M, 10 + lean, by - 57, 9, c);
    } else {
      M(6, by - 61, 7, 6, c.skin);
      M(11, by - 59, 6, 6, c.skinHi);
      drawGlove(M, 16, by - 63, 9, c);
    }
  }

  // -------------------------------------------------------------------------
  // Fat woman: wide build, large sports bra, pants to mid-shin, mixed hair
  // -------------------------------------------------------------------------
  const FAT_WOMAN = {
    skin: '#f0b888', skinHi: '#fcd4aa', skinShad: '#c07848',
    hair: '#b08a50', hairHi: '#c8a86a', hairShad: '#6a4a20',
    hairGrey: '#c0b8a8',
    bra: '#cc2255', braHi: '#ee4477',
    pants: '#1a2a4a', pantsHi: '#2a3e6a', pantsShad: '#0e1a30',
    glove: '#2244cc', gloveHi: '#4466ee', gloveShad: '#141c8a',
  };

  function drawFatWoman(bx, by, dir, c, pose = 'guard') {
    const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
    const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

    if (pose === 'down') {
      M(-26, by - 3, 46, 3, 'rgba(0,0,0,0)');
      M(8, by - 7, 14, 4, c.pants);
      M(21, by - 9, 6, 6, '#d8d8d8');               // sneakers up
      M(-2, by - 9, 12, 7, c.pants);
      M(-2, by - 9, 12, 1, c.pantsHi);
      M(-7, by - 9, 6, 7, c.skin);                  // skin gap above shoes
      M(-13, by - 10, 8, 8, c.bra);
      M(-9, by - 13, 9, 4, c.skinShad);
      drawGlove(M, -2, by - 15, 8, c);
      M(-22, by - 11, 10, 9, c.skin);
      M(-27, by - 11, 6, 9, c.hair);
      M(-22, by - 13, 10, 3, c.hairHi);
      Px(-2, by - 44, c.hairShad);
      M(-18, by - 8, 4, 1, '#4a3420');
      sweat(M, -26, by - 17);
      return;
    }

    if (pose === 'duck') {
      M(-16, by - 2, 34, 4, 'rgba(0,0,0,0)');
      M(-13, by - 3, 10, 3, '#d8d8d8');
      M(-13, by - 1, 10, 1, '#909090');
      M(3, by - 3, 11, 3, '#e8e8e8');
      M(3, by - 1, 11, 1, '#909090');
      // skin gap (ankle)
      M(-11, by - 6, 8, 2, c.skin);
      M(3, by - 6, 9, 2, c.skin);
      // thick legs
      M(-11, by - 24, 7, 18, c.pantsShad);
      M(3, by - 24, 7, 18, c.pants);
      M(3, by - 24, 2, 18, c.pantsHi);
      M(-10, by - 31, 17, 8, c.pants);
      M(-10, by - 31, 17, 2, c.pantsHi);
      // midriff strip visible
      M(-5, by - 38, 14, 4, c.skin);
      // wide bra
      M(-7, by - 48, 17, 10, c.bra);
      M(4, by - 47, 3, 8, c.braHi);
      M(-6, by - 51, 3, 4, c.bra);
      M(5, by - 51, 3, 4, c.bra);
      M(1, by - 51, 5, 3, c.skinShad);              // neck
      M(-2, by - 62, 12, 12, c.skin);               // head
      M(-3, by - 65, 13, 3, c.hairHi);
      M(-4, by - 63, 4, 10, c.hair);
      Px(-3, by - 57, c.hairShad);
      // grey streaks
      M(-3, by - 62, 1, 5, c.hairGrey);
      M(5, by - 58, 2, 1, c.hairShad);
      M(5, by - 57, 3, 2, '#ffffff');
      Px(7, by - 57, '#3a5a7a');
      M(8, by - 55, 1, 2, c.skinShad);
      M(5, by - 53, 4, 1, '#c06858');
      drawGlove(M, -1, by - 50, 8, c);
      drawGlove(M, 9, by - 54, 8, c);
      return;
    }

    const lean = pose === 'punch' ? 2 : pose === 'hit' ? -3 : 0;

    M(-16, by - 2, 34, 4, 'rgba(0,0,0,0.4)');

    // sneakers
    M(-13, by - 3, 10, 3, '#d8d8d8');
    M(-13, by - 1, 10, 1, '#909090');
    M(3, by - 3, 11, 3, '#e8e8e8');
    M(3, by - 1, 11, 1, '#909090');

    // ankle skin gap (2px before pants start)
    M(-11, by - 5, 8, 2, c.skin);
    M(3, by - 5, 9, 2, c.skin);

    // wide pants (stop short of shoes — ankle skin visible above)
    M(-11, by - 32, 7, 27, c.pantsShad);
    M(3, by - 32, 7, 27, c.pants);
    M(3, by - 32, 2, 27, c.pantsHi);
    M(-10, by - 38, 18, 7, c.pants);
    M(-10, by - 38, 18, 2, c.pantsHi);

    // bare midriff strip (just a thin band)
    M(-7 + lean, by - 48, 16, 6, c.skin);
    M(-7 + lean, by - 48, 2, 6, c.skinShad);
    M(5 + lean, by - 48, 4, 6, c.skinHi);
    Px(1 + lean, by - 44, c.skinShad);
    Px(2 + lean, by - 43, c.skinShad);

    // wide sports bra
    M(-8 + lean, by - 56, 17, 8, c.bra);
    M(4 + lean, by - 55, 3, 6, c.braHi);
    M(-7 + lean, by - 59, 3, 4, c.bra);             // straps
    M(5 + lean, by - 59, 3, 4, c.bra);

    // neck + wide head
    M(-1 + lean, by - 60, 5, 4, c.skinShad);
    M(-4 + lean, by - 71, 12, 12, c.skin);
    M(-4 + lean, by - 71, 3, 12, c.skinShad);
    M(4 + lean, by - 71, 3, 10, c.skinHi);

    // hair: messy bun / short with grey streaks
    M(-5 + lean, by - 74, 13, 5, c.hairHi);         // top of head
    M(-5 + lean, by - 72, 4, 10, c.hair);            // back
    M(-6 + lean, by - 64, 3, 12, c.hair);            // behind ear
    // grey streaks
    M(-5 + lean, by - 73, 1, 6, c.hairGrey);
    M(-3 + lean, by - 74, 1, 3, c.hairGrey);
    Px(-5 + lean, by - 58, c.hairShad);
    Px(-5 + lean, by - 53, c.hairShad);
    // face: determined expression (different from original woman's smile)
    M(3 + lean, by - 67, 3, 1, '#888');              // brow (furrowed)
    Px(3 + lean, by - 66, c.skinShad);               // furrowed brow line
    M(3 + lean, by - 65, 3, 2, '#ffffff');           // eye
    Px(5 + lean, by - 65, '#3a5a7a');
    M(7 + lean, by - 63, 1, 2, c.skinShad);         // nose
    M(2 + lean, by - 61, 5, 1, '#9a5848');          // straight mouth (not smiling)
    M(-2 + lean, by - 65, 2, 3, c.skinShad);        // ear
    Px(-1 + lean, by - 62, GOLD);                   // earring
    if (pose === 'hit') sweat(M, -4 + lean, by - 76);

    // rear arm (fat)
    if (pose === 'hit') {
      M(-10 + lean, by - 56, 5, 10, c.skinShad);
      drawGlove(M, -2 + lean, by - 50, 8, c);
    } else {
      M(-10 + lean, by - 56, 5, 10, c.skinShad);
      M(-7 + lean, by - 50, 10, 5, c.skinShad);
      drawGlove(M, 3 + lean, by - 60, 8, c);
    }

    // lead arm
    if (pose === 'punch') {
      M(5 + lean, by - 54, 7, 5, c.skin);
      M(11 + lean, by - 53, 7, 5, c.skinHi);
      drawGlove(M, 19 + lean, by - 57, 8, c);
    } else if (pose === 'block') {
      M(4, by - 59, 5, 7, c.skin);
      M(5, by - 65, 4, 7, c.skinHi);
      drawGlove(M, 4, by - 69, 8, c);
    } else if (pose === 'hit') {
      M(4 + lean, by - 51, 6, 5, c.skin);
      drawGlove(M, 9 + lean, by - 50, 8, c);
    } else {
      M(5, by - 53, 6, 5, c.skin);
      M(10, by - 51, 5, 5, c.skinHi);
      drawGlove(M, 14, by - 56, 8, c);
    }
  }

  return { MAN, WOMAN, drawMan, drawWoman, FAT_MAN, FAT_WOMAN, drawFatMan, drawFatWoman };
}
