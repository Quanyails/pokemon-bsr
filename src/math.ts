// Util math functions

export const getMean = (nums: number[]) =>
  nums.reduce((acc, num) => acc + num, 0) / nums.length;

/**
 * Gets stdev or stdevp, depending on the type provided.
 *
 * Personal reference:
 * @see https://mathworld.wolfram.com/StandardDeviation.html
 * @see https://en.wikipedia.org/wiki/Bessel%27s_correction
 */
export const getStdev = (type: "population" | "sample", nums: number[]) => {
  const correctingFactor =
    type === "population" ? 1 : nums.length / (nums.length - 1);
  const mean = getMean(nums);
  const variance =
    (nums
      .map((number) => (number - mean) ** 2)
      .reduce((acc, num) => acc + num, 0) /
      nums.length) *
    correctingFactor;

  return Math.sqrt(variance);
};
