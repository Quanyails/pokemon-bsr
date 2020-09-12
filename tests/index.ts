import assert from "assert";
import { bsrCalculator } from "../src/bsr";
import { getMean, getStdev } from "../src/math";

const stat50 = {
  hp: 50,
  atk: 50,
  def: 50,
  spa: 50,
  spd: 50,
  spe: 50,
};

const stat100 = {
  hp: 100,
  atk: 100,
  def: 100,
  spa: 100,
  spd: 100,
  spe: 100,
};

const stat150 = {
  hp: 150,
  atk: 150,
  def: 150,
  spa: 150,
  spd: 150,
  spe: 150,
};

const metagame = bsrCalculator({ statsList: [stat50, stat100, stat150] });

const assertAlmostEqual = (n: number, expected: number) => {
  assert(Math.abs(n - expected) < 0.0001);
};

const bsrs = [stat50, stat100, stat150].map((stats) => metagame.getBsr(stats));

(["ps", "pt", "ss", "st"] as const).forEach((prop) => {
  assertAlmostEqual(getMean(bsrs.map((bsr) => bsr[prop])), 100);
  assertAlmostEqual(
    getStdev(
      "sample",
      bsrs.map((bsr) => bsr[prop])
    ),
    50
  );
});

assertAlmostEqual(getMean(bsrs.map((bsr) => bsr.or)), 200);
assertAlmostEqual(
  getStdev(
    "sample",
    bsrs.map((bsr) => bsr.or)
  ),
  100
);

assert.deepStrictEqual(metagame.getBsr(stat100), {
  ps: 87.58756110439037,
  pt: 94.25169723940951,
  ss: 87.58756110439037,
  st: 94.25169723940951,
  odb: -57.014012386727764,
  psb: NaN,
  or: 181.80816393000578,
});

assert.deepStrictEqual(metagame.getMagicBsr(stat100), {
  ps: 143.09022282138488,
  pt: 173.82265295250247,
  ss: 144.88782091085676,
  st: 171.14754382033064,
  odb: -4.960483858343559,
  psb: 0.12828628675592701,
  or: 352.6734418779172,
});
