<script lang="ts">
	import { toast } from 'svelte-sonner';
	import ContributionsCanvas from './ContributionsCanvas/contributions-canvas.svelte';
	import { userStore } from '~/store';
	import { Status, type State } from '~/types';

	type Options = {
		data: any;
		username: string;
		themeName: string;
		footerText: string;
	};

	let options: Options = {
		data: null,
		username: '',
		themeName: 'standard',
		footerText: 'GitHub Contributions Chart'
	};

	$: {
		if ($userStore.status.type === Status.Success && $userStore.userContributions) {
			options = {
				data: $userStore.userContributions,
				username: $userStore.userName,
				themeName: 'standard',
				footerText: 'GitHub Contributions Chart'
			};
		}
	}
</script>

<div class="no-scrollbar chart-wrapper flex min-h-screen justify-center overflow-auto">
	{#if $userStore.status.type === Status.Success && options}
		<ContributionsCanvas {options} />
	{:else}
		<div
			class="absolute top-40 z-40 flex scroll-m-20 rounded-md border bg-white p-20 text-xl font-semibold tracking-tight md:top-20"
		>
			{#if $userStore.status.type === Status.Loading}
				<div class="flex items-center justify-center">
					<p class="text-center align-middle text-xl font-bold text-blue-500">Loading canvas...</p>
				</div>
			{:else if $userStore.status.type === Status.Idle}
				<div class="items center flex items-center justify-center">
					<p class="text-center align-middle text-xl font-bold text-orange-500">
						Search for a user to draw chart!
					</p>
				</div>
			{:else if $userStore.status.type === Status.Error}
				<div class="flex items-center justify-center">
					<p class="block text-center align-middle text-xl text-red-400">
						{$userStore.status.message}
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.chart-wrapper {
		background-color: #f5f5f5;
		height: 100vh;
		margin: 20 auto 0;
	}
</style>
