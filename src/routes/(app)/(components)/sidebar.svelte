<script lang="ts">
	import { userStore } from '~/store';
	import { Input } from '$lib/components/ui/input/';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';

	let username: string = '';

	async function getData() {
		const endpoint = `/github?username=${userStore.getUserName()}`;
		fetch(`${endpoint}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					toast.error('User not found', { description: data.error });
					return new Error(data.message);
				}

				userStore.setUserContributions(data);
				toast.success('User found successfully 🚀', {
					description: "User's contributions are fetched successfully!"
				});
			})
			.catch((err) => {
				toast.error('User not found!', {
					description: err
				});
			})
			.finally(() => {
				username = '';
			});
	}

	const handleInput = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (e.key === 'Enter' && target.value) {
			userStore.setUserName(target.value);
			getData();
		}
	};
</script>

<aside class="sticky top-0 h-screen p-2 pt-4">
	<Input
		type="text"
		placeholder="Github Username..."
		bind:value={username}
		on:keydown={handleInput}
		class="m-auto"
	/>
	<Toaster />
</aside>
