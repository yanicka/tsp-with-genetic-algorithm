<script>
	import { onMount, onDestroy } from 'svelte';
	import { cities, totalCitiesCount, populations } from './store';

	import { initializePopulations, live, evolvePopulations, stop } from './lib/genetic-algorithms';
	import { generateCities } from './lib/city-helpers';

	import PerformanceChart from './PerformanceChart.svelte'
	import CityMap from './CityMap.svelte'
	import Button from './components/Button.svelte'

	let speed = 2
	let width = 500
	let height = 300


	onMount(() => {		
		$cities = generateCities($totalCitiesCount, { width, height })
		initializePopulations();
	})
</script>

<style lang="scss">

.what {
	display: flex;
	flex-direction: column;
	width: 30vw;
	max-width: 30vw;
	height: 100vh;
	background-color: #fff;
	box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.15);

}

canvas {
	padding: 20px;
	border: 5px solid #313131;
}

</style>

<aside class="what">
	<h1 class="p-4 text-lg">Genetic Algorithms</h1>
	<nav>
		<Button label="Start" on:click="{() => live(() => evolvePopulations(), speed * 100) }"/>
		<Button label="Stop" on:click="{() => stop()}"/>
		<!--
		<Button label="Reset" />
		-->
	</nav>

	<!--
	<input type=range bind:value={speed} min=1 max=50>
	-->
	
	{width}:{height}

	Current Records:

	<ul>
	{#each $populations as population}
		<li>{population.crossoverType}:&nbsp;{population.recordDistance}</li>
	{/each}
	</ul>



	<hr/>

	<PerformanceChart/>
</aside>

<main>
	<CityMap key="bestEver" width={width} height={height} />
	<CityMap key="currentBest" width={width} height={height} />
</main>
