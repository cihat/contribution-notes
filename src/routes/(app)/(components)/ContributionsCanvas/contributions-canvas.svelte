<script lang="ts">
	import { onMount } from 'svelte';
	import { drawContributions } from './utils';

	type Options = {
		data: any;
		username: string;
		themeName: string;
		footerText: string;
	};

	export let options: Options = {
		data: null,
		username: '',
		themeName: 'standard',
		footerText: 'GitHub Contributions Chart'
	};

	let canvas: HTMLCanvasElement;

	onMount(() => {
		if (canvas && options.data) {
			drawContributions(canvas, options);
		}
	});

	$: {
		if (canvas && options.data) {
			drawContributions(canvas, options);
		}
	}
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		height: min-content;

		@media (max-width: 1280px) {
			width: 100%;
		}
	}
</style>
