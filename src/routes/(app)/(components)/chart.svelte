<script lang="ts">
	import { toast } from 'svelte-sonner';
	import ContributionsCanvas from './ContributionsCanvas/contributions-canvas.svelte';
	import { userStore } from '~/store';
	import { Status, TabEntryEnum, type State } from '~/types';
	import RetentionChart from './retention-chart.svelte';

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

	let retentionData = {
		chart: { type: 'areaspline', inverted: true },
		title: { text: 'Code Retention Over Time', align: 'left' },
		xAxis: { categories: [] },
		yAxis: { title: { text: 'Contributions' } },
		series: [],
		tooltip: {
			shared: true,
			headerFormat: '<table>'
		}
	};

	$: {
		if ($userStore.status.type === Status.Success) {
			if ($userStore.requestType === TabEntryEnum.Contributions) {
				options = {
					data: $userStore.userContributions,
					username: $userStore.userName,
					themeName: 'standard',
					footerText: 'GitHub Contributions Chart'
				};
			} else {
				retentionData = {
					chart: { type: 'areaspline', inverted: true },
					title: { text: 'Code Retention Over Time', align: 'left' },
					xAxis: { categories: $userStore.repoData?.map((item) => item.name) },
					yAxis: { title: { text: 'Contributions' } },
					series: $userStore.repoData.map((item) => ({
						name: item.name,
						data: [...item.data]
					})),
					tooltip: {
						shared: true,
						headerFormat: '<table>'
					}
				};
				toast.info(`Showing first 100 commits for ${$userStore.userName}/${$userStore.repoName}`);
			}
		}
	}
</script>

<div class="no-scrollbar chart-wrapper flex min-h-screen justify-center overflow-auto">
	{#if $userStore.status.type === Status.Success && options}
		{#if $userStore.requestType === TabEntryEnum.Contributions}
			<ContributionsCanvas {options} />
		{:else}
			<RetentionChart />
		{/if}
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
