import { get } from 'svelte/store'
import { totalCitiesCount, cities } from '../../store'

import { calcDistance } from '../city-helpers'

function pickOne(list, prob) {
  var index = 0;
  var r = Math.random();

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

const calcFitnessForOffspring = (offspring) => {
  let d = calcDistance(offspring)
  return 1 / (Math.pow(d, 8) + 1)
}

function generateBitMask() {
  const randomHex = (len) => {
    var maxlen = 8,
      min = Math.pow(16, Math.min(len, maxlen) - 1),
      max = Math.pow(16, Math.min(len, maxlen)) - 1,
      n = Math.floor(Math.random() * (max - min + 1)) + min,
      r = n.toString(16);
    while (r.length < len) {
      r = r + randHex(len - maxlen);
    }
    return r;
  }

  const hex = randomHex(Math.ceil(get(totalCitiesCount) / 4))
  return parseInt(hex, 16).toString(2).padStart(8, '0').split('').map((value) => parseInt(value))
}

function getCanonicalOrder() {
  return [...Array(get(totalCitiesCount)).keys()];
}

function swap(array, i, j) {
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

export {
  swap,
  pickOne,
  generateBitMask,
  getCanonicalOrder,
  calcFitnessForOffspring,
}