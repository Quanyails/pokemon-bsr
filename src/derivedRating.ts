import { SpecificRating } from "./rating";
import normalDistribution from "./normalDistribution";

export interface DerivedRating {
  /** offensive/defensive bias */
  odb: number;
  /** physical/special bias */
  psb: number;
  /** overall rating */
  or: number;
}

type SpecificDerivedRating<
  K extends "absolute" | "normalized"
> = DerivedRating & {
  kind: K;
};

export const getDerivedRatingCalculator = (
  ratings: SpecificRating<"normalized">[]
) => {
  const getDerivedRating = ({
    ps,
    pt,
    ss,
    st,
  }: SpecificRating<"normalized">): SpecificDerivedRating<"absolute"> => {
    return {
      odb: Math.max(ps, ss) - Math.max(pt, st),
      psb: ps - ss + pt - st,
      or: ps + pt + ss + st,
      kind: "absolute",
    };
  };

  const METAGAME_DERIVED_RATINGS = ratings.map((rating) => {
    return getDerivedRating(rating);
  });
  const odbDistribution = normalDistribution(
    "sample",
    METAGAME_DERIVED_RATINGS.map((absoluteRating) => absoluteRating.odb)
  );
  const psbDistribution = normalDistribution(
    "sample",
    METAGAME_DERIVED_RATINGS.map((absoluteRating) => absoluteRating.psb)
  );
  const orDistribution = normalDistribution(
    "sample",
    METAGAME_DERIVED_RATINGS.map((absoluteRating) => absoluteRating.or)
  );

  const getNormalizedDerivedRating = (
    rating: SpecificRating<"normalized">
  ): SpecificDerivedRating<"normalized"> => {
    const { odb, psb, or } = getDerivedRating(rating);

    return {
      odb: odbDistribution.getZScore(odb),
      psb: psbDistribution.getZScore(psb),
      or: orDistribution.getZScore(or),
      kind: "normalized",
    };
  };

  return {
    getDerivedRating: (
      rating: SpecificRating<"normalized">
    ): SpecificDerivedRating<"normalized"> => {
      return getNormalizedDerivedRating({
        ...rating,
      });
    },
  };
};
