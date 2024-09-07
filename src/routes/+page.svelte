<script>
	import { onMount } from 'svelte';
	import * as Resizable from '../lib/components/ui/resizable/index.ts';

	let username = 'cihat';
	const endpoint = '/github';
	async function getData() {
		console.log(username);
		fetch(endpoint)
			.then((res) => res.json())
			.then((data) => console.log(data))
			.catch((err) => console.log(err));
	}

	onMount(() => {
		getData();
	});
</script>

<main>
	<Resizable.PaneGroup direction="horizontal" class="!h-screen border">
		<Resizable.Pane defaultSize={25}>
			<div class="flex h-full items-center justify-center p-6">
				<span class="font-semibold">Sidebar</span>
			</div>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={75}>
			<div class="flex h-full items-center justify-center p-6">
				<span class="font-semibold">Content</span>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</main>
