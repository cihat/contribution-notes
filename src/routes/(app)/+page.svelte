<script lang="ts">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import Sidebar from './(components)/sidebar.svelte';
	import { userStore } from '~/store';
</script>

<main>
	<Resizable.PaneGroup direction="horizontal" class="!h-screen border">
		<Resizable.Pane defaultSize={25} minSize={20} maxSize={30}>
			<Sidebar />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={75}>
			<div class="flex h-full items-center justify-center p-6">
				<span class="font-semibold">Content</span>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</main>
