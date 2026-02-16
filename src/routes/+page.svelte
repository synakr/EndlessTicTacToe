<script lang="ts">
  import { onMount } from 'svelte';

  let scrollY = 0;
  let isDayMode = false;

  const toggleDayNight = () => {
    isDayMode = !isDayMode;
  };

  onMount(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<style>
  /* Smooth transitions for all elements */
  :global(html) {
    scroll-behavior: smooth;
  }

  /* Optimize image rendering for parallax */
  img {
    pointer-events: none;
    user-select: none;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  /* Smooth text rendering */
  h2, p {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>

<!-- HEADER -->

<header
  class="fixed top-0 left-0 w-full flex items-center justify-between z-[9999]
         px-8 py-5 transition-all duration-500 ease-in-out"
  class:bg-black="{scrollY > 50 && !isDayMode}"
  class:bg-white="{scrollY > 50 && isDayMode}"
  class:backdrop-blur-md="{scrollY > 50}"
  class:shadow-lg="{scrollY > 50}"
  style="background-color: {scrollY > 50 ? (isDayMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)') : 'transparent'};"
>
  <div class="flex items-center">
    <h2 class="text-3xl mr-44 font-bold transition-all duration-500 hover:scale-105"
        class:text-[#359381]="{!isDayMode}"
        class:text-[#2d7a6a]="{isDayMode}">Logo</h2>

    <nav class="flex space-x-4">
      <a href="#home" class="px-4 py-1 rounded-full font-semibold text-white cursor-pointer 
                transition-all duration-500 hover:scale-105 hover:shadow-lg"
                class:bg-[#359381]="{!isDayMode}"
                class:bg-[#2d7a6a]="{isDayMode}">Home</a>

      <a href="#about" class="px-4 py-1 rounded-full font-semibold cursor-pointer 
                transition-all duration-500 hover:scale-105 hover:shadow-lg hover:text-white"
                class:text-[#359381]="{!isDayMode}"
                class:hover:bg-[#359381]="{!isDayMode}"
                class:text-[#2d7a6a]="{isDayMode}"
                class:hover:bg-[#2d7a6a]="{isDayMode}">
        About
      </a>

      <a href="#service" class="px-4 py-1 rounded-full font-semibold cursor-pointer 
                transition-all duration-500 hover:scale-105 hover:shadow-lg hover:text-white"
                class:text-[#359381]="{!isDayMode}"
                class:hover:bg-[#359381]="{!isDayMode}"
                class:text-[#2d7a6a]="{isDayMode}"
                class:hover:bg-[#2d7a6a]="{isDayMode}">
        Service
      </a>

      <a href="#contact" class="px-4 py-1 rounded-full font-semibold cursor-pointer 
                transition-all duration-500 hover:scale-105 hover:shadow-lg hover:text-white"
                class:text-[#359381]="{!isDayMode}"
                class:hover:bg-[#359381]="{!isDayMode}"
                class:text-[#2d7a6a]="{isDayMode}"
                class:hover:bg-[#2d7a6a]="{isDayMode}">
        Contact
      </a>
    </nav>
  </div>

  <!-- Day/Night Toggle -->
  <button 
    on:click={toggleDayNight}
    class="relative w-16 h-8 rounded-full transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#359381]"
    class:bg-[#1a2332]="{!isDayMode}"
    class:bg-[#87CEEB]="{isDayMode}"
    aria-label="Toggle day/night mode"
  >
    <span class="absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-xs"
          class:translate-x-8="{isDayMode}"
          class:bg-[#f0f0f0]="{!isDayMode}"
          class:bg-[#FDB813]="{isDayMode}">
      {#if isDayMode}
        ☀️
      {:else}
        🌙
      {/if}
    </span>
  </button>
</header>


<!-- PARALLAX -->

<section class="relative h-screen flex justify-center items-center overflow-hidden transition-all duration-1000"
         class:bg-gradient-to-b="{true}"
         class:from-[#0a1929]="{!isDayMode}"
         class:to-[#1a2332]="{!isDayMode}"
         class:from-[#87CEEB]="{isDayMode}"
         class:to-[#B0E0E6]="{isDayMode}">

  <!-- Night Mode: Moon -->
  <img src="/img/moon.png" alt="Moon in the night sky" 
       class="absolute w-full will-change-transform transition-opacity duration-1000"
       class:opacity-30="{!isDayMode}"
       class:opacity-0="{isDayMode}"
       style="transform: translate3d(0, {scrollY * 1.5}px, 0); opacity: {isDayMode ? 0 : Math.max(0, (1 - scrollY * 0.005) * 0.3)}" />

  <!-- Day Mode: Sun (simulated with bright glow) -->
  <div class="absolute w-48 h-48 rounded-full transition-all duration-1000 will-change-transform"
       class:opacity-0="{!isDayMode}"
       class:opacity-80="{isDayMode}"
       style="background: radial-gradient(circle, #FDB813 0%, #FDB813 30%, rgba(253, 184, 19, 0.3) 70%, transparent 100%); 
              top: 15%; right: 20%; transform: translate3d(0, {scrollY * 0.8}px, 0);
              box-shadow: 0 0 60px 30px rgba(253, 184, 19, 0.4);"></div>

  <img src="/img/bird.png" alt="Flying bird" class="absolute w-full will-change-transform transition-opacity duration-1000"
       style="transform: translate3d({scrollY * -1.5}px, 0, 0); opacity: {Math.max(0, 1 - scrollY * 0.005)}" />

  <img src="/img/cloud1.png" alt="Cloud layer 1" 
       class="absolute w-full will-change-transform transition-opacity duration-1000"
       class:opacity-60="{!isDayMode}"
       class:opacity-80="{isDayMode}"
       style="transform: translate3d({scrollY * 0.5}px, 0, 0); filter: {isDayMode ? 'brightness(1.3)' : 'brightness(1)'};" />

  <img src="/img/cloud2.png" alt="Cloud layer 2" 
       class="absolute w-full will-change-transform transition-opacity duration-1000"
       class:opacity-60="{!isDayMode}"
       class:opacity-80="{isDayMode}"
       style="transform: translate3d({scrollY * 0.5}px, 0, 0); filter: {isDayMode ? 'brightness(1.3)' : 'brightness(1)'};" />

  <img src="/img/cloud3.png" alt="Cloud layer 3" 
       class="absolute w-full will-change-transform transition-opacity duration-1000"
       class:opacity-60="{!isDayMode}"
       class:opacity-80="{isDayMode}"
       style="transform: translate3d(0, {scrollY * -0.5}px, 0); filter: {isDayMode ? 'brightness(1.3)' : 'brightness(1)'};" />

  <img src="/img/cloud4.png" alt="Cloud layer 4" 
       class="absolute w-full will-change-transform transition-opacity duration-1000"
       class:opacity-60="{!isDayMode}"
       class:opacity-80="{isDayMode}"
       style="transform: translate3d({scrollY * -0.5}px, 0, 0); filter: {isDayMode ? 'brightness(1.3)' : 'brightness(1)'};" />

  <img src="/img/fog1.png" alt="Fog layer" 
       class="absolute w-full will-change-transform transition-opacity duration-1000"
       class:opacity-20="{!isDayMode}"
       class:opacity-30="{isDayMode}"
       style="opacity: {Math.max(0, (1 - scrollY * 0.005) * (isDayMode ? 0.3 : 0.2))}; filter: {isDayMode ? 'brightness(1.5)' : 'brightness(1)'};" />

  <img src="/img/hill3.png" alt="Mountain hill background" 
       class="absolute w-full opacity-80 will-change-transform transition-all duration-1000"
       style="transform: translate3d({scrollY * -1.5}px, {scrollY * 0.5}px, 0); filter: {isDayMode ? 'brightness(1.2) saturate(1.1)' : 'brightness(1)'};" />

  <img src="/img/hill2.png" alt="Mountain hill midground" 
       class="absolute w-full opacity-80 will-change-transform transition-all duration-1000"
       style="opacity: {Math.max(0, 1 - scrollY * 0.003)}; filter: {isDayMode ? 'brightness(1.2) saturate(1.1)' : 'brightness(1)'};" />

  <img src="/img/hill1.png" alt="Mountain hill foreground" 
       class="absolute w-full opacity-80 will-change-transform transition-all duration-1000"
       style="opacity: {Math.max(0, 1 - scrollY * 0.003)}; filter: {isDayMode ? 'brightness(1.2) saturate(1.1)' : 'brightness(1)'};" />

  <h2
    class="absolute font-bold text-8xl tracking-[0.5cm] will-change-transform
           transition-all duration-1000 select-none"
    class:text-white="{!isDayMode}"
    class:text-[#1a2332]="{isDayMode}"
    class:drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]="{!isDayMode}"
    class:drop-shadow-[0_4px_12px_rgba(255,255,255,0.9)]="{isDayMode}"
    style="transform: translate3d(0, {scrollY * 3}px, 0);"
  >
    Himalayas
  </h2>

  <img src="/img/plant3.png" alt="Foreground plants" 
       class="absolute w-full will-change-transform transition-all duration-1000"
       style="transform: translate3d(0, {scrollY * 0.3}px, 0); filter: {isDayMode ? 'brightness(1.1) saturate(1.2)' : 'brightness(1)'};" />

  <img src="/img/plant2.png" alt="Midground plants" 
       class="absolute w-full will-change-transform transition-all duration-1000"
       style="transform: translate3d(0, {scrollY * 0.1}px, 0); filter: {isDayMode ? 'brightness(1.1) saturate(1.2)' : 'brightness(1)'};" />

  <img src="/img/plant1.png" alt="Nearest plants" 
       class="absolute w-full will-change-transform transition-all duration-1000"
       style="transform: translate3d(0, {scrollY * 0.05}px, 0); filter: {isDayMode ? 'brightness(1.1) saturate(1.2)' : 'brightness(1)'};" />

</section>

<!-- CONTENT -->

<section class="relative py-24 px-8 transition-all duration-1000"
         class:bg-gradient-to-b="{true}"
         class:from-black="{!isDayMode}"
         class:to-[#1a1a1a]="{!isDayMode}"
         class:from-[#f0f8ff]="{isDayMode}"
         class:to-[#e6f3ff]="{isDayMode}">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-5xl mb-12 font-bold leading-tight transition-colors duration-1000"
        class:text-white="{!isDayMode}"
        class:text-[#1a2332]="{isDayMode}">
      Discover the Majestic Beauty of the Himalayas
    </h2>

    <p class="text-lg font-light leading-relaxed mb-8 transition-colors duration-1000"
       class:text-gray-300="{!isDayMode}"
       class:text-gray-700="{isDayMode}">
      The Himalayas stand as Earth's most magnificent mountain range, stretching across five countries and housing some of the world's highest peaks. These ancient mountains have captivated explorers, mountaineers, and travelers for centuries with their breathtaking landscapes and spiritual significance.
    </p>

    <p class="text-lg font-light leading-relaxed mb-8 transition-colors duration-1000"
       class:text-gray-300="{!isDayMode}"
       class:text-gray-700="{isDayMode}">
      From the snow-capped summits that pierce the clouds to the lush valleys below, the Himalayan region offers an unparalleled diversity of ecosystems. The dramatic elevation changes create unique habitats that support an incredible array of wildlife and plant species found nowhere else on Earth.
    </p>

    <p class="text-lg font-light leading-relaxed mb-8 transition-colors duration-1000"
       class:text-gray-300="{!isDayMode}"
       class:text-gray-700="{isDayMode}">
      Local communities have thrived in these mountains for millennia, developing rich cultures deeply connected to the landscape. Their traditions, festivals, and way of life reflect a profound respect for nature and the mountains they call home.
    </p>

    <p class="text-lg font-light leading-relaxed transition-colors duration-1000"
       class:text-gray-300="{!isDayMode}"
       class:text-gray-700="{isDayMode}">
      Whether you're seeking adventure through trekking and climbing, spiritual enlightenment at ancient monasteries, or simply the peace found in pristine mountain wilderness, the Himalayas offer experiences that transform and inspire all who venture into their realm.
    </p>
  </div>
</section>
