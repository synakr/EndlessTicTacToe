<script lang="ts">
	let gameMode = 'MULTI';
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
				body: JSON.stringify({
					gameMode,
					boardSize,
					tieBreaker
				})
			});

			if (!res.ok) throw new Error(await res.text());

			const { roomCode } = await res.json();

			// go to actual game
			window.location.href = `/game/${roomCode}`;
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : 'Failed to create game';
		} finally {
			loading = false;
		}
	}
</script>

<h2>Game Setup</h2>

<form on:submit|preventDefault={createGame}>
	<!-- Board Size -->
	<label for="mode">Game Mode</label>
	<select id="mode" bind:value={gameMode}>
	<option value="AI">COMPUTER</option>
	<option value="DEVICE">FRIEND</option>
	<option value="MULTI">MULTIPLAYER</option>
	</select>

	<!-- Board Size -->
	<label for="boardSize">Board Size</label>
	<select id="boardSize" bind:value={boardSize}>
	<option value={3}>3 x 3</option>
	<option value={4}>4 x 4</option>
	<option value={5}>5 x 5</option>
	</select>

	<!-- Win Condition -->
	<label for="tieBreaker">Tie Breaker</label>
	<select id="tieBreaker" bind:value={tieBreaker}>
	<option value={3}>Connect 3</option>
	<option value={4}>Connect 4</option>
	<option value={5}>Connect 5</option>
	</select>


	<button disabled={loading}>
		{loading ? 'Creating...' : 'Create Game'}
	</button>

	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		max-width: 320px;
	}

	.error {
		color: red;
	}
</style>
