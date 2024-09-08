<script lang="ts">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import Sidebar from './(components)/sidebar.svelte';
	import { userStore } from '~/store';
	import Chart from './(components)/chart.svelte';
	import Note from './(components)/note.svelte';
	import { writable } from 'svelte/store';

	const isDesktop = writable(false);

	function updateIsDesktop() {
		isDesktop.set(window.innerWidth >= 768);
	}

	onMount(() => {
		updateIsDesktop();
		window.addEventListener('resize', updateIsDesktop);
		return () => window.removeEventListener('resize', updateIsDesktop);
	});
</script>

{#if $isDesktop}
	<Resizable.PaneGroup direction="horizontal" class="flex h-screen">
		<Resizable.Pane defaultSize={25} minSize={15} maxSize={30}>
			<Sidebar />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={50} minSize={35} maxSize={50} class="bg-white">
			<Chart />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={25} minSize={20} maxSize={60}>
			<Note />
		</Resizable.Pane>
	</Resizable.PaneGroup>
{:else}
	<div class="flex h-screen flex-col">
		<div class="flex-none bg-gray-100">
			<Sidebar />
		</div>
		<div class="flex-grow bg-white">
			<Chart />
		</div>
		<div class="flex-none bg-gray-100">
			<Note />
		</div>
	</div>
{/if}
