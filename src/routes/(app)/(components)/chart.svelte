<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { userStore } from '~/store';
	import { Status, type State } from '~/types';

	let canvas: HTMLCanvasElement;
	let store: State;

	const unsubscribe = userStore.subscribe(async (value) => {
		store = value;
		if (store.status === Status.Success && canvas && store.userContributions) {
			const options = {
				data: store.userContributions,
				username: store.userName,
				themeName: 'standard',
				footerText: 'GitHub Contributions Chart'
			};
			const { drawContributions } = await import('~/canvas');
			drawContributions(canvas, options);
		} else if (store.status === Status.Error) {
			toast.error("Chart couldn't be drawn!", {
				description: 'User contributions not found!'
			});
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="no-scrollbar chart-wrapper flex min-h-screen justify-center overflow-auto">
	<div class="absolute top-40 z-40 flex md:top-2">
		{#if store.status === Status.Loading}
			<div class="flex items-center justify-center">
				<p class="text-center align-middle text-xl font-bold text-blue-500">Loading chart...</p>
			</div>
		{:else if store.status === Status.Idle}
			<div class="items center flex items-center justify-center">
				<p class="text-center align-middle text-xl font-bold text-orange-500">
					Search for a user to draw chart!
				</p>
			</div>
		{:else if store.status === Status.Error}
			<div class="flex items-center justify-center">
				<p class="text-center align-middle text-xl text-red-400">
					Error occurred while drawing chart! 😢
				</p>
			</div>
		{/if}
	</div>

	<canvas bind:this={canvas} id="contributions-canvas" />
</div>

<style>
	.chart-wrapper {
		background-color: #f5f5f5;
		height: 100vh;
		margin: 20 auto 0;
	}
	canvas {
		height: min-content;

		@media (max-width: 640px) {
			width: 100%;
		}
	}
</style>
