import { onDestroy } from 'svelte';
import { get } from 'svelte/store';
import { populationCount, populations, cities, totalCitiesCount } from '../../store'

import { calcDistance } from '../city-helpers'
import { pickOne, swap} from './helpers'
import { orderedCrossover, originalCrossover, ordinalOnePointCrossover, edgeRecombinationCrossover } from './crossovers'

const shuffle = ([...array]) => {
  return array.sort(() => Math.random() - 0.5);
}

const createIndiviual = () => {
  const cityOrder = Object.keys(get(cities)).map((v) => parseInt(v))
  return shuffle(cityOrder)
}

const createPopulations = () => {
  const individuals = [...Array(get(populationCount)).keys()].map(() => createIndiviual());
  populations.set(
    get(populations).map((population) => { 
      return {
        ...population,
        individuals: individuals,
      }
    })
  )
}

const evolvePopulation = (population) => {
  population.fitness = calculateFitness(population);
  population.fitness = normalizeFitness(population.fitness);
  population.individuals = nextGeneration(population);
  return population
}

const evolvePopulations = () => {
  populations.set(
    get(populations).map(
      (population) => evolvePopulation(population)
    )
  )
}

let livingInterval;

const live = (cb, interval) => {
  livingInterval = setInterval(cb, interval)
  onDestroy(() => clearInterval(livingInterval))
}

const stop = () => {
  clearInterval(livingInterval)
}

const calculateFitness = (population) => {
  let currentRecord = Infinity;

  return population.individuals.map((individual) => {
    var distance = calcDistance(individual);

    if (distance < population.recordDistance) {
      population.recordDistance = distance;
      population.distanceHistory.push(distance)
      population.bestEver = individual;
    }

    if (distance < currentRecord) {
      population.currentRecord = distance;
      population.currentBest = individual;
    }

    return 1 / (Math.pow(distance, 8) + 1);
  })
}

function normalizeFitness(allFitnessValues) {
  let sum = 0;
  
  for (let individualFitness of allFitnessValues) {
    sum += individualFitness
  }

  return allFitnessValues.map((fitness) => fitness / sum)
}

function nextGeneration(population) {
  return population.individuals.map((_i) => {
    const parentA = pickOne(population.individuals, population.fitness);
    const parentB = pickOne(population.individuals, population.fitness);
    let offspring = crossOver(population.crossoverType, parentA, parentB);
    mutate(offspring, 0.01);
    return offspring
  })
}

function crossOver(type, orderA, orderB) {
  //console.log(type, orderA, orderB)
  if (type === "original") {
    return originalCrossover(orderA, orderB)
  } else if (type === "ordinalOnePoint") {
    return ordinalOnePointCrossover(orderA, orderB)
  } else if (type === "orderedCrossover") {
		return orderedCrossover(orderA, orderB)
	} else if (type === "edgeRecombinationCrossover") {
		return edgeRecombinationCrossover(orderA, orderB)
  } else {
    console.log('Unknown crossover selected')
  }
}

function mutate(order, mutationRate) {
  const count = get(totalCitiesCount)
  for (var i = 0; i < count; i++) {
    if (Math.random() < mutationRate) {
      var indexA = Math.floor(Math.random() * order.length);
      var indexB = (indexA + 1) % count;
      swap(order, indexA, indexB);
    }
  }
}

export {
  live,
  stop,
  evolvePopulation,
  evolvePopulations,
  createPopulations as initializePopulations,
}
