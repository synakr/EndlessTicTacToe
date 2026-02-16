<script lang="ts">
	import { onMount } from 'svelte';

	let scrollY = 0;

	onMount(() => {
		const update = () => {
			scrollY = window.scrollY;
			requestAnimationFrame(update);
		};
		update();
	});
</script>

<section class="relative flex h-screen items-center justify-center overflow-hidden">
	<!-- IMAGES -->

	<img
		src="/img/moon.png"
		class="absolute w-full opacity-30"
		style="transform: translateY({scrollY * 0.5}px)" alt="moon"
	/>

	<img
		src="/img/bird.png"
		class="absolute w-full"
		style="transform: translateX({scrollY * 0.4}px)" alt="bird"
	/>

	<img
		src="/img/cloud1.png"
		class="absolute w-full opacity-60"
		style="transform: translateX({scrollY * 0.25}px)" alt="cloud 1"
	/>

	<img
		src="/img/cloud2.png"
		class="absolute w-full opacity-60"
		style="transform: translateX({scrollY * -0.2}px)" alt="cloud 2"
	/>

	<img
		src="/img/cloud3.png"
		class="absolute w-full opacity-60"
		style="transform: translateX({scrollY * 0.15}px)" alt="cloud 3"		
	/>

	<img
		src="/img/cloud4.png"
		class="absolute w-full opacity-60"
		style="transform: translateX({scrollY * -0.1}px)" alt="clud 4"
	/>

	<img
		src="/img/fog1.png"
		class="absolute w-full opacity-20" 
		style="transform: translateY({scrollY * 0.2}px)" alt=""
	/>

	<img
		src="/img/hill3.png"
		class="absolute w-full opacity-80"
		style="transform: translateY({scrollY * 0.15}px)" alt=""
	/>

	<img
		src="/img/hill2.png"
		class="absolute w-full opacity-80"
		style="transform: translateY({scrollY * 0.1}px)" alt=""
	/>

	<img
		src="/img/hill1.png"
		class="absolute w-full opacity-80"
		style="transform: translateY({scrollY * 0.05}px)"
		alt="hill"
	/>

	<!-- TEXT -->

	<h2
		class="absolute text-8xl font-bold tracking-[0.5cm] text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]"
		style="transform: translateY({scrollY * 0.9}px)"
	>
		Himalayas
	</h2>

	<img
		src="/img/plant3.png"
		class="absolute w-full"
		style="transform: translateY({scrollY * -0.05}px)" alt=""
	/>

	<img
		src="/img/plant2.png"
		class="absolute w-full"
		style="transform: translateY({scrollY * -0.08}px)" alt=""
	/>

	<img
		src="/img/plant1.png"
		class="absolute w-full"
		style="transform: translateY({scrollY * -0.12}px)" alt=""
	/>
</section>
