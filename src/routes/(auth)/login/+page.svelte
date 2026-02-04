<script lang="ts">
	let email = '';
	let password = '';
	let loading = false;
	let errorMsg = '';

	async function handleLogin() {
		errorMsg = '';
		loading = true;

		try {
			const res = await fetch('/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (!res.ok) {
				const err = await res.text();
				throw new Error(err);
			}

			// login success
			// later we’ll redirect properly
			window.location.href = '/modes';
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-sm">
		<h1 class="mb-8 text-2xl font-medium text-gray-900">Login</h1>

		<form on:submit|preventDefault={handleLogin} class="space-y-4">
			<div>
				<input
					type="email"
					placeholder="Email"
					bind:value={email}
					required
					class="w-full border-b border-gray-300 bg-transparent px-1 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
				/>
			</div>

			<div>
				<input
					type="password"
					placeholder="Password"
					bind:value={password}
					required
					class="w-full border-b border-gray-300 bg-transparent px-1 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{loading ? 'Logging in...' : 'Login'}
			</button>

			{#if errorMsg}
				<p class="text-sm text-red-600">
					{errorMsg}
				</p>
			{/if}
		</form>
	</div>
</div>
