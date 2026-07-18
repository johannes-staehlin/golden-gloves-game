# Golden Gloves Boxing

A retro pixel-art boxing game for the browser. No dependencies, no build step —
just open `index.html` (or serve the folder with any static file server).

![Gameplay: two pixel boxers facing off in the ring](https://img.shields.io/badge/HTML5-canvas-orange)

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

Everything lives in three files:

- `index.html` — page shell and canvas
- `style.css` — letterboxing and pixelated scaling
- `game.js` — game loop, boxer logic, AI, rendering, and WebAudio sound effects

The stage is a fixed 1024×576 canvas; sprites are chunky rects on a 16px grid.
