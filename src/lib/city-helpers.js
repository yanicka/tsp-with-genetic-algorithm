import { get } from 'svelte/store'
import { cities } from '../store'

const generateCity = ({ width, height }) => {
  return {
    x: Math.round(Math.random() * width),
    y: Math.round(Math.random() * height)
  }
}
const generateCities = (amount, constrains) => {
  return Array.from({ length: amount }, () => generateCity(constrains))
}
const generateRandomColor = () => {
  return '#' + Math.random().toString(16).slice(-6)
}
const drawCity = (ctx, city) => {
  ctx.beginPath();
  ctx.fillStyle = '#000'; // generateRandomColor();
  ctx.arc(city.x, city.y, 7.5, 0, 2 * Math.PI);
  ctx.fill();
}
const connectCities = (ctx, from, to, color = generateRandomColor()) => {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.lineWidth = 5;
  ctx.stroke();
}

const drawIndividual = (ctx, individual, color = generateRandomColor()) => {
const allCities = get(cities)
for (let i = 0; i < individual.length - 1; i++) {
    let from = individual[i];
    let to = individual[i + 1];
    connectCities(ctx, allCities[from], allCities[to], color)
  }
}

const distanceBetween = (from, to) => {
  return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
}

function calcDistance(individual) {
  const allCities = get(cities)
  let sum = 0;
  for (let i = 0; i < individual.length - 1; i++) {
    let from = individual[i];
    let to = individual[i+1];
    const d = distanceBetween(allCities[from], allCities[to]);
    sum += d;
  }
  return sum;
}

export {
  drawCity,
  calcDistance,
  generateCity,
  connectCities,
  generateCities,
  drawIndividual,
}