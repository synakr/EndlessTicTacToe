<script lang="ts">
	import AuthLayout from '$lib/components/AuthLayout.svelte';

	let gameMode: 'MULTI' | 'AI' | 'DEVICE' = 'MULTI';
	let boardSize: 3 | 4 | 5 = 3;
	let tieBreaker: 3 | 4 | 5 = 3;

	let loading = false;
	let errorMsg = '';

	async function createGame() {
		errorMsg = '';
		loading = true;

		try {
			const res = await fetch('/api/game/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ gameMode, boardSize, tieBreaker })
			});

			if (!res.ok) throw new Error(await res.text());

			const { roomCode } = await res.json();
			window.location.href = `/game/${roomCode}`;
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : 'Failed to create game';
		} finally {
			loading = false;
		}
	}
</script>

<AuthLayout>
	<span slot="title">Game Setup</span>

	<form on:submit|preventDefault={createGame} class="space-y-3">
		<label for="mode" class="text-sm">Game Mode</label>
		<select id="mode" bind:value={gameMode} class="auth-input">
			<option value="AI">Computer</option>
			<option value="DEVICE">Friend</option>
			<option value="MULTI">Multiplayer</option>
		</select>

		<label for="board" class="text-sm">Board Size</label>
		<select id="board" bind:value={boardSize} class="auth-input">
			<option value={3}>3 x 3</option>
			<option value={4}>4 x 4</option>
			<option value={5}>5 x 5</option>
		</select>

		<label for="win" class="text-sm">Win Length</label>
		<select id="win" bind:value={tieBreaker} class="auth-input">
			<option value={3}>Connect 3</option>
			<option value={4}>Connect 4</option>
			<option value={5}>Connect 5</option>
		</select>


		<button class="auth-btn" disabled={loading}>
			{loading ? 'Creating...' : 'Create Game'}
		</button>

		{#if errorMsg}
			<p class="text-red-300 text-sm">{errorMsg}</p>
		{/if}
	</form>

	<div slot="switch">
		<a href="/join" class="underline">Join with Room Code</a>
	</div>
</AuthLayout>
