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
	class="min-h-screen bg-cover bg-center flex flex-col p-2"
	style="background-image: url('/bg1.png')"
>
	{@render children()}
</div>
