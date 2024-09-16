<script lang="ts">
	import { onMount } from 'svelte';
	import { drawContributions } from './utils';
	import type { Options } from '~/types';

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
		width: 100%;
		max-width: 676px;
	}
</style>
