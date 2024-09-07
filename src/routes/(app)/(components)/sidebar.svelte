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
					console.log('data: ', data);

					toast.error('', {
						description: `User not found! \n${data.error}`
					});
					return new Error(data.message);
				}

				userStore.setUserContributions(data);
				toast.success('', {
					description: `User found successfully 🚀`
				});
			})
			.catch((err) => {
				toast.error('', {
					description: `User not found! \n${err}`
				});
			})
			.finally(() => {
				username = '';
			});
	}

	const handleInput = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (e.key === 'Enter') {
			userStore.setUserName(target.value);
			getData();
		}
	};

	userStore.subscribe(async (value) => {
		console.log(' sidebar value: ', value);
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
	<Toaster />
</aside>
