// Shared boxer sprites for the 320x180 previews.
// initBoxers(R, P) binds the sprites to a page's rect/pixel helpers and
// returns the palettes plus drawMan/drawWoman (both take an optional pose).

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

  // Bearded, tattooed male boxer (~74px). pose: 'guard' | 'punch'.
  function drawMan(bx, by, dir, c, pose = 'guard') {
    const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
    const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);
    const lean = pose === 'punch' ? 2 : 0;             // upper body drives forward

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
    for (const [tx, ty] of [[1, 57], [3, 56], [0, 55], [2, 54], [4, 55]]) {
      Px(tx + lean, by - ty, c.tattoo);
    }
    M(-4 + lean, by - 49, 1, 2, c.tattoo);
    M(-3 + lean, by - 46, 1, 2, c.tattoo);
    M(-5 + lean, by - 44, 1, 2, c.tattoo);

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

    // rear arm — tattoo sleeve, glove guarding the chin
    M(-12 + lean, by - 58, 5, 10, c.skinShad);
    M(-9 + lean, by - 51, 10, 5, c.skinShad);
    for (const [tx, ty] of [[-11, 56], [-10, 53], [-12, 51], [-8, 50], [-6, 49], [-9, 55], [-4, 50]]) {
      M(tx + lean, by - ty, 2, 2, c.tattoo);
    }
    drawGlove(M, 3 + lean, by - 62, 9, c);

    // lead arm
    if (pose === 'punch') {
      M(5 + lean, by - 57, 8, 5, c.skin);
      M(12 + lean, by - 56, 7, 4, c.skinHi);
      drawGlove(M, 19 + lean, by - 59, 9, c);
    } else {
      M(5, by - 56, 6, 5, c.skin);
      M(10, by - 54, 5, 5, c.skinHi);
      drawGlove(M, 14, by - 58, 9, c);
    }
  }

  // Female boxer with a light-brown braid (~68px). pose: 'guard' | 'duck'.
  function drawWoman(bx, by, dir, c, pose = 'guard') {
    const M = (dx, y, w, h, col) => R(dir > 0 ? bx + dx : bx - dx - w, y, w, h, col);
    const Px = (dx, y, col) => P(dir > 0 ? bx + dx : bx - dx - 1, y, col);

    M(-14, by - 2, 30, 4, 'rgba(0,0,0,0.4)');

    // sneakers
    M(-11, by - 3, 8, 3, '#d8d8d8');
    M(-11, by - 1, 8, 1, '#909090');
    M(3, by - 3, 9, 3, '#e8e8e8');
    M(3, by - 1, 9, 1, '#909090');

    if (pose === 'duck') {
      // crouched: knees bent, torso leaning in, both gloves up by the face
      M(-9, by - 20, 5, 17, c.legShad);
      M(3, by - 20, 5, 17, c.leg);
      M(3, by - 20, 2, 17, c.legHi);
      M(-9, by - 27, 15, 8, c.leg);                    // hips, sunk low
      M(-9, by - 27, 15, 2, c.legHi);
      Px(2, by - 25, GOLD);
      M(-4, by - 36, 10, 10, c.skin);                  // midriff leaning forward
      M(-4, by - 36, 2, 10, c.skinShad);
      M(3, by - 36, 2, 10, c.skinHi);
      M(-4, by - 43, 11, 8, c.bra);
      M(3, by - 42, 2, 6, c.braHi);
      M(-6, by - 40, 4, 6, c.skinShad);                // rear shoulder
      M(1, by - 46, 5, 3, c.skinShad);                 // neck, tucked
      M(0, by - 56, 9, 11, c.skin);                    // head, forward
      M(-1, by - 58, 10, 3, c.hairHi);
      M(-2, by - 56, 3, 9, c.hair);
      M(-3, by - 48, 3, 12, c.hair);                   // braid
      Px(-2, by - 44, c.hairShad); Px(-2, by - 40, c.hairShad);
      M(5, by - 53, 3, 1, c.hairShad);                 // brow
      M(5, by - 52, 3, 2, '#ffffff');
      Px(7, by - 52, '#3a5a7a');
      M(8, by - 50, 1, 2, c.skinShad);
      M(6, by - 48, 3, 1, '#c06858');
      drawGlove(M, -1, by - 46, 8, c);                 // gloves tucked at the chin
      drawGlove(M, 9, by - 49, 8, c);
      return;
    }

    // standing legs: black leggings
    M(-9, by - 30, 5, 27, c.legShad);
    M(3, by - 30, 5, 27, c.leg);
    M(3, by - 30, 2, 27, c.legHi);
    Px(4, by - 16, c.legHi);
    M(-8, by - 36, 15, 7, c.leg);
    M(-8, by - 36, 15, 2, c.legHi);
    Px(3, by - 34, GOLD);

    // bare midriff (slimmer waist than hips/chest)
    M(-5, by - 46, 10, 10, c.skin);
    M(-5, by - 46, 2, 10, c.skinShad);
    M(2, by - 46, 3, 10, c.skinHi);
    Px(0, by - 42, c.skinShad);
    Px(0, by - 39, c.skinShad);
    Px(1, by - 38, c.skinShad);

    // sports bra
    M(-6, by - 53, 12, 7, c.bra);
    M(2, by - 52, 2, 5, c.braHi);
    M(-5, by - 56, 2, 4, c.bra);
    M(3, by - 56, 2, 4, c.bra);

    // neck + head
    M(-1, by - 56, 4, 3, c.skinShad);
    M(-3, by - 66, 9, 11, c.skin);
    M(-4, by - 68, 10, 3, c.hairHi);                   // crown
    M(-5, by - 66, 3, 9, c.hair);                      // back of head
    M(-6, by - 58, 3, 16, c.hair);                     // braid down the back
    Px(-5, by - 54, c.hairShad); Px(-5, by - 49, c.hairShad); Px(-5, by - 44, c.hairShad);
    M(2, by - 62, 3, 1, c.hairShad);                   // brow
    M(3, by - 61, 3, 2, '#ffffff');                    // eye
    Px(5, by - 61, '#3a5a7a');
    M(6, by - 59, 1, 2, c.skinShad);                   // nose
    M(3, by - 57, 3, 1, '#c06858');                    // smiling mouth
    Px(6, by - 58, '#c06858');                         // upturned corner
    M(-1, by - 61, 2, 3, c.skinShad);                  // ear
    Px(0, by - 58, GOLD);                              // earring

    // rear arm
    M(-8, by - 52, 4, 8, c.skinShad);
    M(-5, by - 47, 8, 4, c.skinShad);
    drawGlove(M, 3, by - 56, 8, c);

    // lead arm
    M(4, by - 50, 5, 4, c.skin);
    M(8, by - 48, 4, 4, c.skinHi);
    drawGlove(M, 12, by - 52, 8, c);
  }

  return { MAN, WOMAN, drawMan, drawWoman };
}
