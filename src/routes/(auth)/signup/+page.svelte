<script lang="ts">
	import AuthLayout from '$lib/components/AuthLayout.svelte';

	let email = '';
	let password = '';
	let username = '';
	let loading = false;
	let errorMsg = '';

	async function handleSignup() {
		loading = true;
		errorMsg = '';

		const res = await fetch('/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, username })
		});

		if (res.ok) window.location.href = '/modes';
		else errorMsg = await res.text();

		loading = false;
	}
</script>

<AuthLayout>
	<span slot="title">Signup</span>

	<form on:submit|preventDefault={handleSignup} class="space-y-3">
		<input class="auth-input" placeholder="Username" bind:value={username} required />
		<input class="auth-input" type="email" placeholder="Email" bind:value={email} required />
		<input
			class="auth-input"
			type="password"
			placeholder="Password"
			bind:value={password}
			required
		/>

		<button class="auth-btn" disabled={loading}>
			{loading ? 'Creating...' : 'Signup'}
		</button>

		{#if errorMsg}
			<p class="text-sm text-red-300">{errorMsg}</p>
		{/if}
	</form>

	<div slot="switch">
		Already have account?
		<a href="/login" class="underline">Login</a>
	</div>
</AuthLayout>
