import assert from "assert";
import { getMetagame } from "../src/metagame";

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

const metagame = getMetagame({ statsList: [stat50, stat100, stat150] });

assert.deepStrictEqual(metagame.getBsr(stat100), {
  ps: 87.0225476716987,
  pt: 92.95979567476067,
  ss: 87.0225476716987,
  st: 92.95979567476067,
  odb: -5.937248003061978,
  psb: 0,
  or: 179.98234334645937,
});
