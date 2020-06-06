<script>
  import { onMount, onDestroy } from "svelte";
  import Chart from "chart.js";

  import { populations } from "./store";

  let canvas;
  let chart;

  let currentPopulations = [];

  let run = 0;

  const updateChart = () => {
    chart.data.labels.push(run);
    run++;
    chart.update();
  };

  const getGraphData = () => {
    return {
      labels: [],
      datasets: currentPopulations.map(population => {
        return {
          label: population.crossoverType,
          borderColor: population.color,
          data: population.distanceHistory
        };
      })
    };
  };
  const unsubscribe = populations.subscribe(value => {
    currentPopulations = value;
    if (chart !== undefined) {
      updateChart();
    }
  });

  onMount(() => {
    chart = new Chart(canvas, {
      type: "line",
      data: getGraphData()
    });
  });

  onDestroy(unsubscribe);
</script>

<style type="text/scss">

</style>

<canvas bind:this={canvas} style="max-width: 30vw;" />
