# Golden Gloves Bruchsal — The Game

A retro pixel-art boxing game for the browser, made in honour of
[Golden Gloves Bruchsal](https://www.golden-gloves-bruchsal.de/) — one of
Germany's traditional boxing clubs, founded in 1976.

Black-and-gold ring, club crest on the mat, crowd with camera flashes, and
two fighters: a bearded, tattooed man in red gloves and a braid-wearing boxer
in blue gloves. No dependencies, no build step — open `index.html` in any
modern browser.

---

## Controls

Navigate the start screen with **↑ / ↓** and **Enter**.

| Action | Red (P1) | Blue (P2) |
|--------|----------|-----------|
| Move   | A / D    | ← / →     |
| Duck   | S        | ↓         |
| Block  | W        | ↑         |
| Punch  | F        | L         |

---

## Rules

- **Best of 3 rounds.** First to win 2 rounds wins the match.
- **Blocking** cuts incoming damage to 20%. **Ducking** dodges a punch
  entirely but roots you in place.
- When a boxer's HP hits zero they're **knocked down**. The referee counts.
  They can get up twice (restoring partial HP); the **third knockdown is a KO**.
- How early a boxer can get up depends on how many times they've been down:
  1st KD: gets up at count 4 · 2nd KD: count 6 · 3rd KD: KO.
- When time runs out, the **round is scored**: HP minus a 35-point penalty
  per knockdown this round. Tiebreak: total damage dealt.
- After all rounds without a KO the match is decided **by decision**.

---

## Settings (`settings.js`)

All tunable values live in `settings.js` — edit there, not in `game.js`.

| Setting | Default | Description |
|---------|---------|-------------|
| `ROUND_SECONDS` | 30 | Round length in seconds |
| `ROUNDS_TO_WIN` | 2 | Rounds needed to win the match |
| `MAX_HP` | 100 | Starting HP per round |
| `MOVE_SPEED` | 70 | Movement speed (px/s) |
| `PUNCH.damage` | 4 | Damage per clean hit |
| `PUNCH.reach` | 44 | Punch range in virtual pixels |
| `BLOCK_FACTOR` | 0.2 | Damage multiplier when blocked |
| `HIT_STUN` | 0.4 | Seconds frozen after being hit |
| `KNOCKBACK` | 8 | Pixels pushed back on a clean hit |
| `GETUP_HP` | 35 | HP restored when getting up from a knockdown |
| `AI.skill` | 1.0 | CPU difficulty (0.5 = easy · 1.0 = normal · 2.0 = hard) |
| `CROWD.flashRate` | 0.02 | Camera flash frequency (per frame) |

---

## File structure

```
index.html        page shell and canvas
style.css         letterboxing and pixel-crisp scaling
settings.js       all tunables — round time, damage, AI, crowd
game.js           game loop, physics, AI, rendering, HUD, WebAudio SFX
art/boxers.js     fighter sprites — all poses for both boxers
make-favicon.js   generates favicon.png (run with: node make-favicon.js)
favicon.png       club crest favicon (64×64)
```

Everything renders at a **320×180 internal resolution**, scaled 3× to a
960×540 canvas with crisp nearest-neighbour pixels. The static background
(crowd, ring, mat, crest) is pre-rendered once at startup; fighters, HUD,
sparks, and crowd effects draw every frame.

---

## About Golden Gloves Bruchsal

Golden Gloves Bruchsal e.V. is a boxing club based in Bruchsal, Baden-Württemberg,
Germany. Visit the club website: **https://www.golden-gloves-bruchsal.de/**
