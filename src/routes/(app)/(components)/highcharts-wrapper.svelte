<script>
	import Highcharts from 'highcharts';
	import { onMount, onDestroy, afterUpdate } from 'svelte';

	export let options = {};

	let chartElement;
	let chart;

	onMount(() => {
		createChart();
	});

	afterUpdate(() => {
		if (chart) {
			chart.update(options, true, true);
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});

	function createChart() {
		if (chartElement && !chart) {
			chart = Highcharts.chart(chartElement, options);
		}
	}
</script>

<div bind:this={chartElement}></div>
