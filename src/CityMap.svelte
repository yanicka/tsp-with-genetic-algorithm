<script>
import { onMount } from 'svelte';
import { populations, cities } from "./store";

import { drawCity, drawIndividual } from './lib/city-helpers';

export let key;
export let width;
export let height;

let canvas, ctx;
let currentPopulations = [];

const unsubscribe = populations.subscribe(value => {
  currentPopulations = value;
  if (ctx !== undefined) {
    drawPopulation()
  }
});

const drawPopulation = () => {
  // Clear canvas for redrawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let city of $cities) {
    drawCity(ctx, city)
  }
  
  for(let population of currentPopulations) {
    if (population[key] !== undefined) {
      drawIndividual(ctx, population[key], population.color)
    }   
  }
}

onMount(() => {
  ctx = canvas.getContext('2d');
})

</script>

<canvas bind:this={canvas} width={width} height={height}/>