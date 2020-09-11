import type { StatsTable } from "@pkmn/dex";
import normalDistribution from "./normalDistribution";

type Stats = StatsTable;

type SpecificStats<K extends "effective" | "raw"> = Stats & {
  kind: K;
};

/**
 * The four value that make up a Pokemon's rating.
 */
interface Rating {
  /** physical sweepiness */
  ps: number;
  /** physical tankiness */
  pt: number;
  /** special sweepiness */
  ss: number;
  /** special tankiness */
  st: number;
}

type SpecificRating<K extends "absolute" | "normalized"> = Rating & {
  kind: K;
};

/**
 * The base stat rating of the Pokemon.
 */
interface Bsr {
  /** physical sweepiness */
  ps: number;
  /** physical tankiness */
  pt: number;
  /** special sweepiness */
  ss: number;
  /** special tankiness */
  st: number;
  /** offensive/defensive bias */
  odb: number;
  /** physical/special bias */
  psb: number;
  /** overall rating */
  or: number;
}

type SpecificBsr<K extends "normalized" | "pretty"> = Bsr & {
  kind: K;
};

export interface Metagame {
  getBsr: (stats: Stats) => Bsr;
  getMagicBsr: (stats: Stats) => Bsr;
}

// Since we normalize ratings in finding BSR, this scaling factor cancels out.
// See Page 6 of X-Act's PDF for explanation.
// In practice, this value is used make the values for tankiness nice-looking.
// In Gen. IV, this was 35.
// In Gen. V, this was 1.
const prettinessFactor = 1;

/**
 * Gen. IV magic formula decompiled from X-Act's BSR Java applet.
 *
 * The logic for the calculator can be found in the file FindStatsHandler.class.
 * Decompiling the file was done by opening it in IntelliJ 2019.
 *
 * THIS FORMULA IS FOR REFERENCE PURPOSES ONLY.
 * The math in this module is derived from Gen. IV,
 * but getEffectiveStats() is derived from the most recent Pokemon generation,
 * so the numbers that will be outputted will not be standardized correctly.
 */
const getMagicBsr = ({
  hp: eHP,
  atk: eAtk,
  def: eDef,
  spa: eSpa,
  spd: eSpD,
  spe: eSpe,
}: SpecificStats<"effective">): SpecificBsr<"pretty"> => {
  const pt = (eHP * eDef) / 417.5187 - 18.9256;
  const st = (eHP * eSpD) / 434.8833 - 13.9044;
  const ps =
    (eAtk * (eAtk * eSpe + 415.0)) /
      (1.855522 * (eAtk * (1.0 - eSpe) + 415.0)) -
    4.36533;
  const ss =
    (eSpa * (eSpa * eSpe + 415.0)) /
      (1.947004 * (eSpa * (1.0 - eSpe) + 415.0)) +
    4.36062;
  const odb = (Math.max(ps, ss) - Math.max(pt, st)) / 6.243721 - 0.326255;
  const psb = (pt - st + (ps - ss)) / 6.840256;
  const rating = (pt + st + ps + ss) / 1.525794 - 62.1586;

  return {
    pt,
    st,
    ps,
    ss,
    odb,
    psb,
    or: rating,
    kind: "pretty",
  };
};

export const getMetagame = ({
  expectedAttack = 132,
  expectedTurnsToKo = 1.5,
  statsList,
}: {
  expectedAttack?: number;
  expectedTurnsToKo?: number;
  statsList: Stats[];
}): Metagame => {
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

  /**
   * Given a set of base speeds, produces a mapping from all possible base speeds
   * to how many Pokemon you will outspeed or tie with.
   */
  const baseSpeedFrequencies: number[] = [];
  statsList
    .map((stat) => stat.spe)
    .forEach((baseSpeed) => {
      baseSpeedFrequencies[baseSpeed] =
        (baseSpeedFrequencies[baseSpeed] ?? 0) + 1;
    });

  const getBaseSpeedFactor = (spe: number) => {
    const outspedOrTied = baseSpeedFrequencies.filter(
      (_, baseSpeed) => baseSpeed <= spe
    );
    return (
      outspedOrTied.reduce((acc, freq) => acc + freq, 0) / statsList.length
    );
  };

  /**
   * @returns {Stats} The "real", or effective stats of the Pokemon, assuming:
   *  * level 100
   *  * perfect IVs
   *  * no EVs
   *  * neutral nature
   *
   *  HP derivation:
   *          floor((2 * base + iv + floor(ev / 4)) * (level / 100)) + level + 10 (original formula)
   *          floor((2 * base + 31 + 0) * 1 + 100 + 10
   *          floor(2 * base + 31) + 110
   *          2 * base + 31 + 110 (as base is always integer, floor(2 * base + 31) is always an integer)
   *          2 * base + 141
   *  Attack/Defense derivation:
   *      (floor((2 * base + iv + floor(ev / 4)) * (level / 100)) + 5) * nature (original formula)
   *      (floor((2 * base + 31 + 0) * 1) + 5) * 1
   *      floor(2 * base + 31) + 5
   *      2 * base + 31 + 5 (as base is always integer, floor(2 * base + 31) is always an integer)
   *      2 * base + 36
   *  Speed derivation:
   *      As the stat formula is monotonic, and only the larger of any two speeds
   *      determines turn priority, we can simply rank base speeds against each other to determine
   *      what effect they have against another Pokemon in battle.
   *      This is normalized to a number between 0 and 1.
   *
   * @see https://www.smogon.com/smog/issue6/base_stats
   */
  const getEffectiveStats = ({
    hp,
    atk,
    def,
    spa,
    spd,
    spe,
  }: SpecificStats<"raw">): SpecificStats<"effective"> => {
    return {
      hp: hp * 2 + 141, // personal note: / 8 to use normalized value according to sweeptank paper
      atk: atk * 2 + 36, // personal note: / 2 to use normalized value according to sweeptank paper
      def: def * 2 + 36, // personal note: / 2 to use normalized value according to sweeptank paper
      spa: spa * 2 + 36, // personal note: / 2 to use normalized value according to sweeptank paper
      spd: spd * 2 + 36, // personal note: / 2 to use normalized value according to sweeptank paper
      spe: getBaseSpeedFactor(spe),
      kind: "effective",
    };
  };

  const getAbsoluteRating = (
    stats: SpecificStats<"raw">
  ): SpecificRating<"absolute"> => {
    const {
      hp: eHp,
      atk: eAtk,
      def: eDef,
      spa: eSpa,
      spd: eSpd,
      spe: eSpe,
    } = getEffectiveStats(stats);
    return {
      ps: getSweepiness(eAtk, eSpe),
      pt: getTankiness(eHp, eDef),
      ss: getSweepiness(eSpa, eSpe),
      st: getTankiness(eHp, eSpd),
      kind: "absolute",
    };
  };

  const METAGAME_RATINGS = statsList.map((stats) =>
    getAbsoluteRating({
      ...stats,
      kind: "raw",
    })
  );

  const psList = METAGAME_RATINGS.map((rawRating) => rawRating.ps);
  const ptList = METAGAME_RATINGS.map((rawRating) => rawRating.pt);
  const ssList = METAGAME_RATINGS.map((rawRating) => rawRating.ss);
  const stList = METAGAME_RATINGS.map((rawRating) => rawRating.st);

  const psDistribution = normalDistribution(psList);
  const ptDistribution = normalDistribution(ptList);
  const ssDistribution = normalDistribution(ssList);
  const stDistribution = normalDistribution(stList);

  /**
   * Returns the normalized (relative) rating of the Pokemon's stats,
   * where each number represents the # of standard deviations from the norm.
   */
  const getNormalizedRating = (
    stats: SpecificStats<"raw">
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

  const METAGAME_ORS = statsList.map((stats) => {
    const { ps, pt, ss, st } = getNormalizedRating({
      ...stats,
      kind: "raw",
    });
    return ps + pt + ss + st;
  });
  const orDistribution = normalDistribution(METAGAME_ORS);

  const getNormalizedBsr = (
    stats: SpecificStats<"raw">
  ): SpecificBsr<"normalized"> => {
    const normalizedRatings = getNormalizedRating(stats);
    const { ps, pt, ss, st } = normalizedRatings;

    // The original implementation of ODB relies on pretty rating numbers,
    // which do not have mathematical meaning. We use the normalized ratings instead.
    return {
      ...normalizedRatings,
      // odb: Math.log(Math.max(ps, ss) / Math.max(pt, st)),
      odb: Math.max(ps, ss) - Math.max(pt, st),
      // psb: Math.log((ps * pt) / (ss * st)),
      psb: ps - ss + pt - st,
      or: orDistribution.getZScore(ps + pt + ss + st),
      kind: "normalized",
    };
  };

  const getPrettyBsr = (stats: SpecificStats<"raw">): SpecificBsr<"pretty"> => {
    const normalizedBsr = getNormalizedBsr(stats);

    return {
      // ps/pt/ss/st have a mean of 100 and SD of 50
      ps: 100 + normalizedBsr.ps * 50,
      pt: 100 + normalizedBsr.pt * 50,
      ss: 100 + normalizedBsr.ss * 50,
      st: 100 + normalizedBsr.st * 50,
      // leans have a mean of 0 and a SD of 50
      odb: normalizedBsr.odb * 50,
      psb: normalizedBsr.psb * 50,
      // rating has a mean of 200 and a SD of 100
      or: 200 + normalizedBsr.or * 100,
      kind: "pretty",
    };
  };

  return {
    getBsr: (stats: Stats): Bsr => {
      const { kind, ...bsr } = getPrettyBsr({
        ...stats,
        kind: "raw",
      });
      return bsr;
    },
    getMagicBsr: (stats: Stats): Bsr => {
      const { kind, ...bsr } = getMagicBsr(
        getEffectiveStats({
          ...stats,
          kind: "raw",
        })
      );
      return bsr;
    },
  };
};
