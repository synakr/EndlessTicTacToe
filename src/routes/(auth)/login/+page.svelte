<script lang="ts">
	import AuthLayout from '$lib/components/AuthLayout.svelte';

	let email = '';
	let password = '';
	let loading = false;
	let errorMsg = '';

	async function handleLogin() {
		loading = true;
		errorMsg = '';

		const res = await fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (res.ok) window.location.href = '/dashboard';
		else errorMsg = await res.text();

		loading = false;
	}
</script>

<AuthLayout>
	<span slot="title">Login</span>

	<form on:submit|preventDefault={handleLogin} class="space-y-3">
		<input class="auth-input" type="email" placeholder="Email" bind:value={email} required />
		<input
			class="auth-input"
			type="password"
			placeholder="Password"
			bind:value={password}
			required
		/>

		<button class="auth-btn" disabled={loading}>
			{loading ? 'Logging in...' : 'Login'}
		</button>

		{#if errorMsg}
			<p class="text-sm text-red-300">{errorMsg}</p>
		{/if}
	</form>

	<div slot="switch">
		Don’t have account?
		<a href="/signup" class="underline">Signup</a>
	</div>
</AuthLayout>
