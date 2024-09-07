<script lang="ts">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { userStore } from '~/store';

	let canvas: HTMLCanvasElement;
	let isErr = false;

	userStore.subscribe((value) => {
		const unsubscribe = userStore.subscribe((value) => {
			const { userContributions, userName } = value;
			if (userName === '') {
				return toast.error("Chart couldn't be drawn!", {
					description: 'User contributions not found!'
				});
			}

			draw(userContributions);
		});

		return () => {
			unsubscribe();
		};
	});

	const draw = async (contributions) => {
		if (!canvas || !contributions) {
			isErr = true;
			return;
		}
		const { drawContributions } = await import('github-contributions-canvas');

		drawContributions(canvas, {
			data: contributions,
			username: userStore.getUserName(),
			themeName: 'standard',
			footerText: ''
		});
	};
</script>

<div class="no-scrollbar chart-wrapper flex min-h-screen justify-center overflow-auto">
	{#if isErr}
		<p class="text-red-500">Error occurred while drawing chart!</p>
	{/if}
	<canvas bind:this={canvas} />
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
