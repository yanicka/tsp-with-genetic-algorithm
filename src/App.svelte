<script>
	import { onMount, onDestroy } from 'svelte';
	import { cities, totalCitiesCount, populations, runs, runCounter } from './store';

	import { initializePopulations, live, evolvePopulations, stop } from './lib/genetic-algorithms';
	import { generateCities } from './lib/city-helpers';

	import PerformanceChart from './PerformanceChart.svelte'
	import CityMap from './CityMap.svelte'
	import Button from './components/Button.svelte'

	let speed = 2
	let width = 700
	let height = 400

	const exportToCSV = () => {
		let dataRows = Array($runs + 5).fill([]) // Array($populations.length + 1)
		dataRows = dataRows.map((row, rowIndex) => {
			switch(rowIndex) {
				case 0: 
					// console.log(0x00000,['population', ...$populations.map((population) => population.crossoverType)])
					return ['crossOver', ...$populations.map((population) => population.crossoverType)]
				case 1:
					// console.log(0x00001, ['Best', ...$populations.map((population) => Math.min(...population.distanceHistory))])
					return ['Best', ...$populations.map((population) => Math.min(...population.distanceHistory).toString().replace('.', ','))]
				case 2:
					// console.log(0x00002,)
					return ['Median']
				case 3:
					// console.log(0x00003,)
					return ['Avg']
				case 4:
					// console.log(0x00004, ['Best Run', ...$populations.map((population) => population.distanceHistory.length - 1)])
					return ['Best Run', ...$populations.map((population) => population.distanceHistory.length - 1)]
				default:
					const runIndex = rowIndex - 5
					return [runIndex, ...$populations.map((population) => {
						if (runIndex < population.distanceHistory.length) {
							return population.distanceHistory[runIndex].toString().replace('.', ',')
						}
					})]
			}
		})

		console.log(dataRows[0].join(';'), dataRows[5].join(';'))
		
		let csvContent = "data:text/csv;charset=utf-8," 
    		+ dataRows.map(e => {console.log(typeof e, e); return e.join(";")}).join("\n");

		let encodedUri = encodeURI(csvContent);
		window.open(encodedUri);
	}

	const evolve = () => {
		if ($runCounter <= 0) {
			stop()
			exportToCSV()
		} else {
			evolvePopulations()
			runCounter.update(n => n - 1)
		}
	}
	
	const end = () => {
		 stop()
		 exportToCSV()
	}

	onMount(() => {		
		$cities = generateCities($totalCitiesCount, { width, height })
		initializePopulations();
	})
</script>

<style lang="scss" scoped>
	:global(*) {
		box-sizing: border-box;
	}
	
	:global(body) {
		display: flex;
		margin: 0;
		padding: 0;
	}


	.sidebar {
		display: flex;
		flex-direction: column;
		width: 30vw;
		max-width: 30vw;
		height: 100vh;
		background-color: #fff;
		box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.15);
		padding: 2rem;
		margin-right: 2rem;
	}
</style>

<aside class="sidebar">
	<h1>Genetic Algorithms</h1>
	<nav>
		<Button label="Start" on:click="{() => live(() => evolve(), speed * 100)}"/>
		<Button label="Stop & Export" on:click="{() => end()}"/>
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
