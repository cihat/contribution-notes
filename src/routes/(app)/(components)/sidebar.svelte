<script lang="ts">
	import { userStore } from '~/store';
	import { Input } from '$lib/components/ui/input/';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	let username: string = '';
	const endpoint = '/github';

	async function getData() {
		fetch(endpoint)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				userStore.setUserContributions(data);
			})
			.catch((err) => {
				toast.success('Event has been created', {
					description: 'Sunday, December 03, 2023 at 9:00 AM',
					action: {
						label: 'Undo',
						onClick: () => console.info('Undo')
					}
				});
				toast.success('Event has been created', {
					description: 'Sunday, December 03, 2023 at 9:00 AM',
					action: {
						label: 'Undo',
						onClick: () => console.info('Undo')
					}
				});
				console.log(err);
			});
	}

	const handleInput = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (e.key === 'Enter') {
			userStore.setUserName(target.value);
			getData();
			username = '';
		}
	};

	userStore.subscribe(async (value) => {
		console.log('value', value);
	});
</script>

<aside>
	<div class="m-2">
		<Input
			type="text"
			placeholder="Github Username..."
			bind:value={username}
			on:keydown={handleInput}
		/>
	</div>
</aside>
