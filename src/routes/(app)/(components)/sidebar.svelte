<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { TabEntryEnum } from '~/types';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import UserInfoCard from './user-info-card.svelte';
	import type { Tabs as TabsType } from '~/types';

	const tabs: TabsType = {
		[TabEntryEnum.Contributions]: {
			title: 'Contributions',
			description: 'GitHub Contributions Chart',
			type: TabEntryEnum.Contributions
		},
		[TabEntryEnum.RepoRetention]: {
			title: 'Repo Retention',
			description: 'Repo Retention Chart',
			type: TabEntryEnum.RepoRetention
		}
	};

	const tabEntries = Object.entries(tabs) as [
		TabEntryEnum,
		{ title: string; description: string; type: TabEntryEnum }
	][];
</script>

<aside
	class="sticky top-0 h-auto  md:max-w-25vw space-y-2 bg-white p-2 pt-4 md:h-screen md:w-auto md:space-x-2 md:space-y-0"
>
	<Tabs.Root value={TabEntryEnum.Contributions}>
		<Tabs.List class="grid grid-cols-2 gap-2">
			{#each tabEntries as [tabKey, tab]}
				<Tabs.Trigger value={tabKey}>{tab.title}</Tabs.Trigger>
			{/each}
		</Tabs.List>

		{#each tabEntries as [tabKey, tab]}
			<Tabs.Content value={tabKey}>
				<UserInfoCard props={tab} />
			</Tabs.Content>
		{/each}
	</Tabs.Root>
	<Toaster />
</aside>
