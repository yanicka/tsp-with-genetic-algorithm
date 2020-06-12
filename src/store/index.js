import { writable, readable } from 'svelte/store';

export const totalCitiesCount = readable(15);
export let cities = writable([]);

const maxRuns = 1000
export const runs = readable(maxRuns)
export const runCounter = writable(maxRuns)

export const populationCount = readable(1000);
export let populations = writable([
	/*
  {
    crossoverType: 'original',
    color: '#8C1C13',
    fitness: [],
    bestEver: undefined,
    currentBest: undefined,
    recordDistance: Infinity,
    distanceHistory: [],
    currentRecord: Infinity,
    individuals: [],
  },*/
  {
    crossoverType: 'ordinalOnePoint',
    color: '#E2EF70',
    fitness: [],
    bestEver: undefined,
    currentBest: undefined,
    recordDistance: Infinity,
    distanceHistory: Array(maxRuns),
    currentRecord: Infinity,
    individuals: []
  },
  {
    crossoverType: 'orderedCrossover',
    color: '#008080',
    fitness: [],
    bestEver: undefined,
    currentBest: undefined,
    recordDistance: Infinity,
    distanceHistory: Array(maxRuns),
    currentRecord: Infinity,
    individuals: []
	},
	{
    crossoverType: 'edgeRecombinationCrossover',
    color: '#CCF5AC',
    fitness: [],
    bestEver: undefined,
    currentBest: undefined,
    recordDistance: Infinity,
    distanceHistory: Array(maxRuns),
    currentRecord: Infinity,
    individuals: []
	},
]);
