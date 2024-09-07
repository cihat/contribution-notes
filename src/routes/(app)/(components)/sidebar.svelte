<script lang="ts">
	import { userStore } from '~/store';
	import { Input } from '$lib/components/ui/input/';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Button } from '$lib/components/ui/button';
	import { Status } from '~/types';

	let username: string = '';
	const store = $userStore;

	async function getData() {
		userStore.setUserName(username);
		userStore.setStatus(Status.Loading);

		const endpoint = `/github?username=${store.userName}`;
		fetch(`${endpoint}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					toast.error('User not found', { description: data.error });
					userStore.setStatus(Status.Error);
					return new Error(data.message);
				}

				userStore.setUserContributions(data);
				userStore.setStatus(Status.Success);
				toast.success('User found successfully 🚀', {
					description: "User's contributions are fetched successfully!"
				});
			})
			.catch((err) => {
				toast.error('User not found!', { description: err });
				userStore.setStatus(Status.Error);
			})
			.finally(() => {
				username = '';
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
	$: store.status === Status.Loading
		? (inputText = 'Loading...')
		: (inputText = 'Contributions 🚀.');
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
