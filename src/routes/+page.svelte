<script>
	import { onMount } from 'svelte';

	let username = 'cihat';
	const endpoint = '/github';
	async function getData() {
		console.log(username);
		fetch(endpoint, {
			// method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then((res) => res.json())
			.then((data) => console.log(data))
			.catch((err) => console.log(err));
	}

	onMount(() => {
		getData();
	});
</script>

<main>
</main>
