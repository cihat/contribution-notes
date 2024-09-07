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

	onMount(() => {});

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

<div>
	<div class="mx-0 my-auto flex flex-grow items-center justify-center overscroll-y-auto">
		{#if isErr}
			<p class="text-red-500">Error occurred while drawing chart!</p>
		{/if}
		<canvas bind:this={canvas} />
	</div>
</div>
