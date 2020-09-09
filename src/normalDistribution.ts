import { getMean, getStdev } from "./math";

const normalDistribution = (nums: number[]) => {
  const mean = getMean(nums);
  const std = getStdev("population", nums);

  const getZValue = (n: number) => {
    return (n - mean) / std;
  };

  return {
    getZScore: getZValue,
  };
};

export default normalDistribution;
