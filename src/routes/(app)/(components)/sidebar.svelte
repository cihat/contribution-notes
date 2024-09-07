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
		userStore.setStatus(Status.Loading);

		const endpoint = `/github?username=${username}`;
		fetch(endpoint)
			.then(async (res) => await res.json())
			.then((data) => {
				if (data.error) {
					toast.error('User not found', { description: data.error });
					userStore.setStatus(Status.Error);
				} else {
					userStore.setUserContributions(data);
					userStore.setStatus(Status.Success);
					toast.success('User found successfully 🚀', {
						description: "User's contributions are fetched successfully!"
					});
				}
			})
			.catch((err) => {
				toast.error('User not found!', { description: err });
				userStore.setStatus(Status.Error);
			})
			.finally(() => {
				username = '';
				//FIX: here broken code
				userStore.setStatus(Status.Success);
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
	$: inputText = store.status === Status.Loading ? 'Loading...' : 'Contributions 🚀.';

	onDestroy(() => {
		unsubscribe();
	});
</script>

<aside class="sticky top-0 flex h-screen p-2 pt-4">
	<Input
		type="text"
		placeholder="Github Username..."
		bind:value={username}
		on:keydown={handleInput}
		class="mr-2"
	/>
	<Button variant="outline" on:click={getData}>{inputText}</Button>
	<Toaster />
</aside>
