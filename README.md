# About

This directory contains code needed to calculate Base Stat Rating,
a metric used to evaluate how good a Pokemon's base stats are in a metagame.

For more information on BSR, refer to the following URLs:

- [X-Act's apps](https://www.smogon.com/forums/threads/restoring-x-acts-apps.3490377/)
- [Gen. IV BSR v1](https://www.smogon.com/smog/issue6/base_stats)
- [Gen. IV CAP BSR v1](https://www.smogon.com/cap/articles/stat_ratings)
- [Gen. IV BSR v2](https://www.smogon.com/forums/threads/base-stats-ratings-version-2-0.64133/)
- [Gen. V BSR](https://www.smogon.com/forums/threads/base-stat-ratings-v3-0.86197/)
- [Gen. VI CAP BSR](https://www.smogon.com/forums/threads/xy-bsr-calculator-movepool-builder.3490726/)
- [Gen. VII CAP BSR](https://www.smogon.com/forums/threads/cap-bsr-calculator-for-ultra-sun-ultra-moon.3614219/)
- [Gen. VIII CAP BSR](https://www.smogon.com/forums/threads/cap-bsr-calculator-repository.3662398/)
- [Useful post on the meaning of some formula constants](https://www.smogon.com/forums/threads/xy-bsr-calculator-movepool-builder.3490726/#post-6982072)

# How to run

1. Install [Node.js 13.2.0 or up](https://nodejs.org/en/) for ES6 module support.
1. Clone [Pokemon Showdown's Pokedex](https://play.pokemonshowdown.com/data/pokedex.js) into `data/pokedex.ts`:
   ```shell script
   curl https://play.pokemonshowdown.com/data/pokedex.ts > data/pokedex.ts
   ```
1. Replace the following lines in `data/pokedex.ts`:
   ```diff
   -export.BattlePokedex =
   +import { Pokedex } from "../src/pokedex";
   +
   +// eslint-disable-next-line import/prefer-default-export
   +export const BattlePokedex: Pokedex = {
   ```
1. Run `npm prepare`.
1. To run examples of how to use this library, run `npm run examples`.

Thanks to the following resources for helping with setup!

- [Step by step: Building and publishing an NPM Typescript package.](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)
- [Node ES Modules with TypeScript](https://github.com/Urigo/typescript-node-es-modules-example)
