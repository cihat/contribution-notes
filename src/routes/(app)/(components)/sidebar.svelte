<script lang="ts">
	import { userStore } from '~/store';
	import { Input } from '$lib/components/ui/input/';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Button } from '$lib/components/ui/button';
	import { Status, type State } from '~/types';
	import { onDestroy } from 'svelte';

	let username: string = '';
	let store: State;
	const unsubscribe = userStore.subscribe((value) => (store = value));

	async function getData() {
		if (!username) {
			toast.error('Please enter a GitHub username');
			return;
		}

		userStore.setUserName(username);
		userStore.setStatus({
			type: Status.Loading,
			message: 'Loading...'
		});

		const endpoint = `/github?username=${username}`;
		fetch(endpoint)
			.then(async (res) => await res.json())
			.then((data) => {
				if (data.error) {
					toast.error('User not found', { description: data.error });
					userStore.setStatus({
						type: Status.Error,
						message: data.error.split('.: ')[0] ?? 'User not found'
					});
				} else {
					userStore.setUserContributions(data);
				}
			})
			.catch((err) => {
				toast.error('User not found!', { description: err });
				userStore.setStatus({
					type: Status.Error,
					message: err
				});
			})
			.finally(() => {
				username = '';
			});
	}

	const handleInput = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (e.key === 'Enter' && target.value) {
			username = target.value;
			getData();
		}
	};

	let inputText = '';

	onDestroy(() => {
		unsubscribe();
	});
</script>

<aside
	class="sticky top-0 flex h-auto flex-col space-y-2 bg-white p-2 pt-4 md:h-screen md:flex-row md:space-x-2 md:space-y-0"
>
	<Input
		type="text"
		placeholder="Github Username..."
		bind:value={username}
		on:keydown={handleInput}
		class="flex-grow"
	/>
	<Button variant="outline" on:click={getData} class="w-full md:w-auto">
		{store.status.type === Status.Loading ? 'Loading...' : 'Contributions 🚀.'}
	</Button>
	<Toaster />
</aside>
