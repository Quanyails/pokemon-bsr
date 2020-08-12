import isEqual from "lodash.isequal";
import pick from "lodash.pick";
import { Pokedex, Pokemon } from "../src/pokedex";
import { BattlePokedex } from "../data/pokedex";

/**
 * Creates a copy of the Pokedex with small errors corrected.
 */
const fixPokedexData = (pokedex: Pokedex) => {
  // Other Mega Pokemon are listed as past-gen-only, but Mega Crucibelle is not.
  return {
    ...pokedex,
    crucibellemega: {
      ...pokedex.crucibellemega,
      isNonstandard: "Past" as const,
      tier: "Illegal",
    },
  };
};

/**
 * If all of these Pokemon properties match on one of a Pokemon's formes,
 * we consider a Pokemon a duplicate of the base forme.
 */
const duplicateRelevantProperties: (keyof Pokemon)[] = [
  "abilities",
  "baseStats",
  "types",
];

/**
 * Removes duplicates of the Pokemon (e.g., cosmetic formes).
 */
const filterDuplicates = (pokedex: Pokedex) => {
  const filteredPokedex = {
    ...pokedex,
  };

  Object.entries(pokedex).forEach(([, pokemon]) => {
    const otherFormeIds: string[] = [];

    if (pokemon.otherFormes) {
      pokemon.otherFormes.forEach((formeId) => {
        otherFormeIds.push(formeId);
      });
    }

    otherFormeIds.forEach((formeId) => {
      const forme = pokedex[formeId];

      if (
        isEqual(
          pick(pokemon, ...duplicateRelevantProperties),
          pick(forme, ...duplicateRelevantProperties)
        )
      ) {
        delete filteredPokedex[formeId];
      }
    });
  });

  return filteredPokedex;
};

const filterEligible = (pokedex: Pokedex) => {
  const filteredPokedex = {
    ...pokedex,
  };

  Object.entries(pokedex).forEach(([pokemonId, pokemon]) => {
    if (
      [
        // no tier specified usually refers to in-battle forme changes
        undefined,
        "Illegal",
        // "LC",
        // "LC Uber",
        // "NFE",
        // "Uber",
        // "(Uber)",
        "Unreleased",
      ].includes(pokemon.tier)
    ) {
      delete filteredPokedex[pokemonId];
    }
    if (pokemon.isNonstandard && pokemon.isNonstandard !== "CAP") {
      delete filteredPokedex[pokemonId];
    }
  });
  return filteredPokedex;
};

const filterEdgeCases = (pokedex: Pokedex) => {
  const filteredPokedex = {
    ...pokedex,
  };

  Object.entries(filteredPokedex).forEach(([pokemonId, pokemon]) => {
    if (
      [
        // Formes of formes have weird logic
        // "Darmanitan-Galar-Zen",
        // Was filtered out in past-gen BSR calculators--could include again
        "Meowstic-F",
        // Only difference is that they can use Pikashunium Z, an old-gen item
        "Pikachu-Original",
        "Pikachu-Hoenn",
        "Pikachu-Sinnoh",
        "Pikachu-Unova",
        "Pikachu-Kalos",
        "Pikachu-Alola",
        "Pikachu-Partner",
        // Abilities have different names but same effect
        "Toxtricity-Low-Key",
        // Prevents excessive weighting
        "Silvally-Bug",
        "Silvally-Dark",
        "Silvally-Dragon",
        "Silvally-Electric",
        "Silvally-Fairy",
        "Silvally-Fighting",
        "Silvally-Fire",
        "Silvally-Flying",
        "Silvally-Ghost",
        "Silvally-Grass",
        "Silvally-Ground",
        "Silvally-Ice",
        "Silvally-Poison",
        "Silvally-Psychic",
        "Silvally-Rock",
        "Silvally-Steel",
        "Silvally-Water",
        // Should have been filtered by past-gen filter
        "Crucibelle-Mega",
      ].includes(pokemon.name)
    ) {
      delete filteredPokedex[pokemonId];
    }
  });
  return filteredPokedex;
};

const getUsablePokemon = (pokedex: Pokedex) => {
  const fixedPokedex = fixPokedexData(pokedex);
  const deduplicatedPokedex = filterDuplicates(fixedPokedex);
  const eligiblePokedex = filterEligible(deduplicatedPokedex);
  const noEdgeCasesPokedex = filterEdgeCases(eligiblePokedex);
  return noEdgeCasesPokedex;
};

export default getUsablePokemon(BattlePokedex);
