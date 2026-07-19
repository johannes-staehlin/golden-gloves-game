# Golden Gloves Bruchsal — Boxing

A retro pixel-art boxing game for the browser, styled after the Golden Gloves
Bruchsal gym: black-and-gold ring, club crest on the mat, and two fighters —
a bearded, tattooed man in the red gloves and a boxer with a light-brown
braid in the blue gloves. No dependencies, no build step — just open
`index.html` (or serve the folder with any static file server).

## How to play

Open `index.html` in a browser, then:

- **Press 1** — one player (Red) vs. the computer (Blue)
- **Press 2** — two players on one keyboard

| Action | Red (P1) | Blue (P2) |
| ------ | -------- | --------- |
| Move   | A / D    | ← / →     |
| Block  | W        | ↑         |
| Duck   | S        | ↓         |
| Punch  | F        | K         |

## Rules

- Best of 3 rounds, 60 seconds each. First to win 2 rounds takes the match.
- Blocking cuts damage to 20%; ducking dodges a punch entirely but roots you
  in place. Damage is light, so fights go the distance unless someone gets
  cornered.
- When a boxer's health hits zero they're knocked down. They can beat the
  count twice (getting up with partial health) — the third knockdown is a KO.
- If the clock runs out, the round goes to the boxer with more health left.
  After 3 rounds without a KO, the match is decided on rounds won.

## Development

- `index.html` — page shell and canvas
- `style.css` — letterboxing and pixelated scaling
- `game.js` — game loop, fighter logic, AI, scene rendering, HUD, and
  WebAudio sound effects
- `art/boxers.js` — the two fighter sprites with all poses
  (guard/punch/block/duck/hit/down), shared between the game and the
  art previews
- `art/` — the standalone art-direction previews the look was iterated on
  (`final.html` is the reference scene)

Everything is drawn procedurally at a 320×180 internal resolution and scaled
3× to a 960×540 canvas with crisp pixels. The static scene (crowd, ring,
mat, crest) is prerendered once; fighters, HUD, and effects draw per frame.
