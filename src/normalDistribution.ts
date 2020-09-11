import { getMean, getStdev } from "./math";

const normalDistribution = (type: "population" | "sample", nums: number[]) => {
  const mean = getMean(nums);
  const std = getStdev(type, nums);

  const getZValue = (n: number) => {
    return (n - mean) / std;
  };

  return {
    getZScore: getZValue,
  };
};

export default normalDistribution;
