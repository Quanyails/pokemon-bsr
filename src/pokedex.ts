// Interface for Pokemon Showdown's Pokedex format.

export type PokemonColor =
  | "Black"
  | "Blue"
  | "Brown"
  | "Gray"
  | "Green"
  | "Pink"
  | "Purple"
  | "Red"
  | "White"
  | "Yellow";

export type PokemonEggGroup =
  | "Amorphous"
  | "Bug"
  | "Ditto"
  | "Dragon"
  | "Fairy"
  | "Flying"
  | "Field"
  | "Grass"
  | "Human-Like"
  | "Mineral"
  | "Monster"
  | "Undiscovered"
  | "Water 1"
  | "Water 2"
  | "Water 3";

export type PokemonType =
  | "Bird" // MissingNo.
  | "Bug"
  | "Dragon"
  | "Dark"
  | "Electric"
  | "Fairy"
  | "Fighting"
  | "Fire"
  | "Flying"
  | "Ghost"
  | "Grass"
  | "Ground"
  | "Ice"
  | "Normal"
  | "Poison"
  | "Psychic"
  | "Rock"
  | "Steel"
  | "Water";

export interface PokemonStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface Pokemon {
  abilities: Partial<Record<"0" | "1" | "H" | "S", string>>;
  baseStats: PokemonStats;
  color: PokemonColor;
  eggGroups: PokemonEggGroup[];
  heightm: number;
  name: string;
  num: number;
  types: PokemonType[];
  weightkg: number;

  baseForme?: string;
  baseSpecies?: string;
  battleOnly?: string | string[];
  canGigantamax?: string;
  canHatch?: true;
  cannotDynamax?: true;
  changesFrom?: string;
  cosmeticFormes?: string[];
  forme?: string;
  formeOrder?: string[];
  evoCondition?: string;
  evoItem?: string;
  evoLevel?: number;
  evoMove?: string;
  evos?: string[];
  evoType?: string;
  gen?: number;
  genderRatio?: {
    F: number;
    M: number;
  };
  gender?: "F" | "M" | "N";
  inheritsFrom?: string;
  isNonstandard?:
    | "CAP"
    | "Custom"
    | "Gigantamax"
    | "LGPE"
    | "Past"
    | "Unobtainable";
  maxHP?: 1;
  otherFormes?: string[];
  prevo?: string;
  requiredAbility?: string;
  requiredMove?: string;
  requiredItem?: string;
  requiredItems?: string[];
  tier?: string;
  unreleasedHidden?: true;
}

export type Pokedex = Record<string, Pokemon>;
