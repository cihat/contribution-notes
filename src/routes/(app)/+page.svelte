<script lang="ts">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import Sidebar from './(components)/sidebar.svelte';
	import { userStore } from '~/store';
	import Chart from './(components)/chart.svelte';
</script>

<Resizable.PaneGroup direction="horizontal" class="flex">
	<Resizable.Pane defaultSize={25} minSize={15} maxSize={30}>
		<Sidebar />
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={50} minSize={50} maxSize={50}>
		<Chart />
	</Resizable.Pane>
</Resizable.PaneGroup>
