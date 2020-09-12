import normalDistribution from "./normalDistribution";
import { SpecificStats } from "./effectiveStats";

/**
 * The four value that make up a Pokemon's rating.
 */
export interface Rating {
  /** physical sweepiness */
  ps: number;
  /** physical tankiness */
  pt: number;
  /** special sweepiness */
  ss: number;
  /** special tankiness */
  st: number;
}

export type SpecificRating<K extends "absolute" | "normalized"> = Rating & {
  kind: K;
};

// Since we normalize ratings in finding BSR, this scaling factor cancels out.
// See Page 6 of X-Act's PDF for explanation.
// In practice, this value is used make the values for tankiness nice-looking.
// In Gen. IV, this was 35.
// In Gen. V, this was 1.
const prettinessFactor = 1;

export const getRatingCalculator = ({
  effectiveStatsList,
  expectedAttack,
  expectedTurnsToKo,
}: {
  effectiveStatsList: SpecificStats<"effective">[];
  expectedAttack: number;
  expectedTurnsToKo: number;
}) => {
  // effective attack is calculated using same formula as getEffectiveStats() below.
  const expectedEffectiveAttack = expectedAttack * 2 + 36;
  const metagameStalliness = expectedEffectiveAttack * expectedTurnsToKo;

  const getSweepiness = (eAtk: number, eSpe: number) => {
    return (
      (eAtk * (eAtk * eSpe + metagameStalliness)) /
      (eAtk * (1 - eSpe) + metagameStalliness)
    );
  };

  const getTankiness = (eHp: number, eDef: number) => {
    return (eHp * eDef) / prettinessFactor;
  };

  const getAbsoluteRating = ({
    hp: eHp,
    atk: eAtk,
    def: eDef,
    spa: eSpa,
    spd: eSpd,
    spe: eSpe,
  }: SpecificStats<"effective">): SpecificRating<"absolute"> => {
    return {
      ps: getSweepiness(eAtk, eSpe),
      pt: getTankiness(eHp, eDef),
      ss: getSweepiness(eSpa, eSpe),
      st: getTankiness(eHp, eSpd),
      kind: "absolute",
    };
  };

  const METAGAME_RATINGS = effectiveStatsList.map((effectiveStats) =>
    getAbsoluteRating(effectiveStats)
  );

  const psList = METAGAME_RATINGS.map((rawRating) => rawRating.ps);
  const ptList = METAGAME_RATINGS.map((rawRating) => rawRating.pt);
  const ssList = METAGAME_RATINGS.map((rawRating) => rawRating.ss);
  const stList = METAGAME_RATINGS.map((rawRating) => rawRating.st);

  // We currently use the sample stdev for BSRs,
  // but we could use population stdev to calculate normalization constants.
  const psDistribution = normalDistribution("sample", psList);
  const ptDistribution = normalDistribution("sample", ptList);
  const ssDistribution = normalDistribution("sample", ssList);
  const stDistribution = normalDistribution("sample", stList);

  /**
   * Returns the normalized (relative) rating of the Pokemon's stats,
   * where each number represents the # of standard deviations from the norm.
   */
  const getNormalizedRating = (
    stats: SpecificStats<"effective">
  ): SpecificRating<"normalized"> => {
    const rating = getAbsoluteRating(stats);

    return {
      ps: psDistribution.getZScore(rating.ps),
      pt: ptDistribution.getZScore(rating.pt),
      ss: ssDistribution.getZScore(rating.ss),
      st: stDistribution.getZScore(rating.st),
      kind: "normalized",
    };
  };

  return {
    getRating: (
      stats: SpecificStats<"effective">
    ): SpecificRating<"normalized"> => {
      return getNormalizedRating(stats);
    },
  };
};
