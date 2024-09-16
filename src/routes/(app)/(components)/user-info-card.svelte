<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Status, TabEntryEnum } from '~/types';
	import { toast } from 'svelte-sonner';
	import { userStore } from '~/store';

	export let props: {
		title: string;
		description: string;
		type: TabEntryEnum;
	} = {
		title: '',
		description: '',
		type: TabEntryEnum.Contributions
	};
	let userConfig = {
		username: '',
		repoName: ''
	};

	async function getData() {
		if (!userConfig.username) {
			toast.error('Please enter a GitHub username');
			return;
		}

		userStore.setUserName(userConfig.username);
		userStore.setRepoName(userConfig.repoName);
		userStore.setStatus({
			type: Status.Loading,
			message: 'Loading...'
		});
		let endpoint = '';

		if (props.type === TabEntryEnum.RepoRetention) {
			endpoint = `/github?username=${$userStore.userName}&repo=${$userStore.repoName}`;
			userStore.setRequestType(TabEntryEnum.RepoRetention);
		} else {
			endpoint = `/github?username=${$userStore.userName}`;
			userStore.setRequestType(TabEntryEnum.Contributions);
		}

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
					userStore.setStatus({
						type: Status.Success,
						message: 'User found'
					});
					if (props.type === TabEntryEnum.RepoRetention) {
						userStore.setRepoData(data);
					} else {
						userStore.setUserContributions(data);
					}
				}
			})
			.catch((err) => {
				toast.error('User not found!', { description: err });
				userStore.setStatus({
					type: Status.Error,
					message: err
				});
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

<Card.Root class="min-w-[200px]">
	<Card.Header>
		<Card.Title>{props.title}</Card.Title>
		<Card.Description>{props.description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="name">Github Username</Label>
					<Input
						id="name"
						placeholder="Your Github username"
						on:keydown={handleInput}
						bind:value={userConfig.username}
					/>
				</div>
				{#if props.title === TabEntryEnum.RepoRetention}
					<div class="flex flex-col space-y-1.5">
						<Label for="framework">Repo Name?</Label>
						<Input
							id="framework"
							placeholder="Name of your repo"
							on:keydown={handleInput}
							bind:value={userConfig.repoName}
						/>
					</div>
				{/if}
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button class="ml-auto" on:click={getData}>
			{$userStore.repoName.length > 0 ? TabEntryEnum.RepoRetention : TabEntryEnum.Contributions} Chart
			🚀
		</Button>
	</Card.Footer>
</Card.Root>
