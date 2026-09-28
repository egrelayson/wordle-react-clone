# Wordle React Clone

This is a personal fork of a React + TypeScript Wordle clone, tuned to match the feel of the official game more closely while keeping the project lightweight and easy to run.

This fork focuses on the standard Wordle experience.

## What changed in this fork

- New York Times-style word lists are used for the pool of valid guesses and daily solutions
- Repeated-letter evaluation is handled correctly so tile colors match Wordle rules
- Layout and spacing were adjusted to mirror the real Wordle board and header more closely
- Tile flip and letter pop animations were added to recreate the official feel
- Keyboard states track correct, almost, and unused letters for more faithful gameplay feedback
- Styling was tightened to better match the official dark Wordle aesthetic and board proportions
- The game loop is centered around the standard rule set rather than the experimental special-mode branch

## Design notes

The visual direction of this fork is intentionally closer to the official Wordle than the original tutorial implementation.

- The board keeps a compact five-by-six grid with a dark neutral palette
- Guess tiles animate with a flip reveal to match the real game rhythm
- Entered letters use a subtle pop on first placement for a tactile feel
- The keyboard shares the same color logic as the board, helping the game feel consistent
- Header, spacing, and proportions were tuned to resemble the real Wordle layout more closely

## Local development

```bash
npm install
npm start
```

Then open the local app in your browser.

## Production build

```bash
npm run build
```

## Notes

This fork keeps the core Wordle clone and updates the feel, layout, and animation to better reflect the real game.
