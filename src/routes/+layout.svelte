<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Background wraps whole page -->
<div
	class="flex min-h-screen flex-col bg-cover bg-center p-2"
	style="background-color: black"
>
	{@render children()}
</div>
