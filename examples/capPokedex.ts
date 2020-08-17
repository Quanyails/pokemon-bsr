import { Dex, ModdedDex } from "@pkmn/dex";
import _ from "lodash";
import { SpeciesData } from "@pkmn/dex-types";

type SpeciesRecord = Record<string, SpeciesData>;

/**
 * If all of these Pokemon properties match on one of a Pokemon's formes,
 * we consider a Pokemon a duplicate of the base forme.
 */
const duplicateRelevantProperties: (keyof SpeciesData)[] = [
  "abilities",
  "baseStats",
  "types",
];

/**
 * Removes duplicates of the Pokemon (e.g., cosmetic formes).
 */
const filterDuplicates = (speciesRecord: SpeciesRecord) => {
  const filteredSpeciesRecord = {
    ...speciesRecord,
  };

  const speciesList = Object.values(speciesRecord);
  speciesList.forEach((pokemon) => {
    if (pokemon.otherFormes) {
      pokemon.otherFormes.forEach((formeName) => {
        const formeId = _.findKey(
          speciesRecord,
          (species) => species.name === formeName
        );
        if (
          _.isEqual(
            _.pick(pokemon, ...duplicateRelevantProperties),
            _.pick(speciesRecord[formeId!], ...duplicateRelevantProperties)
          )
        ) {
          delete filteredSpeciesRecord[formeId!];
        }
      });
    }
  });

  return filteredSpeciesRecord;
};

const filterEligible = (pokedex: ModdedDex, speciesRecord: SpeciesRecord) => {
  const filteredSpeciesRecord = {
    ...speciesRecord,
  };

  Object.entries(speciesRecord).forEach(([pokemonId, pokemon]) => {
    const species = pokedex.getSpecies(pokemon.name);
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
      ].includes(species.tier)
    ) {
      delete filteredSpeciesRecord[pokemonId];
    }
    if (species.isNonstandard && species.isNonstandard !== "CAP") {
      delete filteredSpeciesRecord[pokemonId];
    }
  });
  return filteredSpeciesRecord;
};

const filterEdgeCases = (speciesRecord: SpeciesRecord) => {
  const filteredSpeciesRecord = {
    ...speciesRecord,
  };

  Object.entries(filteredSpeciesRecord).forEach(([pokemonId, pokemon]) => {
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
      delete filteredSpeciesRecord[pokemonId];
    }
  });
  return filteredSpeciesRecord;
};

const getUsablePokemon = (
  pokedex: ModdedDex,
  speciesRecord: SpeciesRecord
): SpeciesRecord => {
  const deduplicated = filterDuplicates(speciesRecord);
  const eligible = filterEligible(pokedex, deduplicated);
  const noEdgeCases = filterEdgeCases(eligible);
  return noEdgeCases;
};

const pokedexData = Dex.loadData();
export default getUsablePokemon(Dex, pokedexData.Species);
