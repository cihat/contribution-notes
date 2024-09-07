<script lang="ts">
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { userStore } from '~/store';
	import { Status, type State } from '~/types';

	let canvas: HTMLCanvasElement;
	let store: State;

	const unsubscribe = userStore.subscribe((value) => {
		store = value;
		if (store.status === Status.Success) {
			draw(store.userContributions);
		} else if (store.status === Status.Error) {
			toast.error("Chart couldn't be drawn!", {
				description: 'User contributions not found!'
			});
		}
	});

	onDestroy(() => {
		unsubscribe();
	});

	const draw = async (contributions: any) => {
		if (!canvas || !contributions) return;
		const { drawContributions } = await import('github-contributions-canvas');
		drawContributions(canvas, {
			data: contributions,
			username: store.userName,
			themeName: 'standard',
			footerText: ''
		});
	};
</script>

<div class="no-scrollbar chart-wrapper flex min-h-screen justify-center overflow-auto">
	{#if store.status === Status.Error}
		<div class="flex items-center justify-center">
			<p class="text-center align-middle text-4xl text-red-400 text-red-500">
				Error occurred while drawing chart! 😢
			</p>
		</div>
	{:else if store.status === Status.Loading}
		<div class="flex items-center justify-center">
			<p class="text-center align-middle text-4xl font-bold text-blue-500">Loading chart...</p>
		</div>
	{:else if store.status === Status.Success}
		<canvas bind:this={canvas} />
	{:else if store.status === Status.Idle}
		<div class="items center flex items-center justify-center">
			<p class="text-center align-middle text-4xl font-bold text-orange-500">
				Search for a user to draw chart!
			</p>
		</div>
	{/if}
</div>

<style>
	.chart-wrapper {
		background-color: #f5f5f5;
		height: 100vh;
		margin: 20 auto 0;
	}
	canvas {
		width: 100%;
		height: min-content;
	}
</style>
