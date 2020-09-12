import capPokedex from "./capPokedex";
import { bsrCalculator } from "../src/bsr";

const pokedex = capPokedex;

const dumpPokemonStats = () => {
  Object.values(pokedex).forEach((pokemon) => {
    const {
      baseStats: { hp, atk, def, spa, spd, spe },
      name,
    } = pokemon;

    console.log([name, hp, atk, def, spa, spd, spe].join(","));
  });
};

const dumpPokemonBsrs = () => {
  const metagame = bsrCalculator({
    statsList: Object.values(pokedex).map((pokemon) => pokemon.baseStats),
  });

  Object.values(pokedex).forEach((pokemon) => {
    const { baseStats, name } = pokemon;

    const { ps, pt, ss, st, or } = metagame.getBsr(baseStats);

    console.log([name, ps, pt, ss, st, or].join(","));
  });
};

const getBsr = () => {
  const metagame = bsrCalculator({
    statsList: Object.values(pokedex).map((pokemon) => pokemon.baseStats),
  });

  const stats = {
    hp: 100,
    atk: 100,
    def: 100,
    spa: 100,
    spd: 100,
    spe: 100,
  };

  console.log("Base stats:", stats);
  console.log("Magic BSR rating:", metagame.getMagicBsr(stats));
  console.log("Modern BSR rating:", metagame.getBsr(stats));
};

const main = () => {
  dumpPokemonStats();
  dumpPokemonBsrs();
  getBsr();
};

main();
