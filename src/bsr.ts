import { getRatingCalculator, Rating } from './rating';
import { DerivedRating, getDerivedRatingCalculator } from './derivedRating';
import { Stats } from './metagame';
import { getEffectiveStatsCalculator, SpecificStats } from './effectiveStats';

/**
 * The base stat rating of the Pokemon.
 */
type Bsr = Rating & DerivedRating;

type SpecificBsr<K extends 'normalized' | 'pretty'> = Bsr & {
  kind: K;
};

export interface BsrCalculator {
  getBsr: (stats: Stats) => Bsr;
  getMagicBsr: (stats: Stats) => Bsr;
}

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
}: SpecificStats<'effective'>): SpecificBsr<'pretty'> => {
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
    kind: 'pretty',
  };
};

export const bsrCalculator = ({
  expectedAttack = 120 + 1 / 3,
  expectedTurnsToKo = 1.5,
  statsList,
}: {
  expectedAttack?: number;
  expectedTurnsToKo?: number;
  statsList: Stats[];
}): BsrCalculator => {
  const effectiveStatsCalculator = getEffectiveStatsCalculator({ statsList });
  const effectiveStatsList = statsList.map(stats =>
    effectiveStatsCalculator.getEffectiveStats({
      ...stats,
      kind: 'raw',
    })
  );

  const ratingCalculator = getRatingCalculator({
    expectedAttack,
    expectedTurnsToKo,
    effectiveStatsList,
  });
  const ratings = effectiveStatsList.map(effectiveStats =>
    ratingCalculator.getRating(effectiveStats)
  );

  const derivedRatingCalculator = getDerivedRatingCalculator(ratings);

  const getNormalizedBsr = (stats: Stats): SpecificBsr<'normalized'> => {
    const effectiveStats = effectiveStatsCalculator.getEffectiveStats({
      ...stats,
      kind: 'raw',
    });
    const rating = ratingCalculator.getRating(effectiveStats);
    return {
      ...rating,
      ...derivedRatingCalculator.getDerivedRating(rating),
      kind: 'normalized',
    };
  };

  const getPrettyBsr = (stats: SpecificStats<'raw'>): SpecificBsr<'pretty'> => {
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
      kind: 'pretty',
    };
  };

  return {
    getBsr: (stats: Stats): Bsr => {
      const { kind, ...bsr } = getPrettyBsr({
        ...stats,
        kind: 'raw',
      });
      return bsr;
    },
    getMagicBsr: (stats: Stats): Bsr => {
      const effectiveStats = effectiveStatsCalculator.getEffectiveStats({
        ...stats,
        kind: 'raw',
      });

      const { kind, ...bsr } = getMagicBsr(effectiveStats);
      return bsr;
    },
  };
};
