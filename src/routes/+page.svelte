<script lang="ts">
  import { onMount } from 'svelte';
  import { redirect } from '@sveltejs/kit';
  import type { PageServerLoad } from './dashboard/$types';

  let scrollY = 0;
  let isDayMode = false;
  let isMobile = false;

  const toggleDayNight = () => {
    isDayMode = !isDayMode;
  };

  onMount(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    isMobile = window.innerWidth < 768;

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
      throw redirect(302, '/dashboard');
    }

    return {};
  };
</script>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    overflow-x: hidden;
    padding-top: env(safe-area-inset-top);
  }

  img {
    pointer-events: none;
    user-select: none;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  h1,
  h2,
  p {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @keyframes xoSwap {
    0%, 45% {
      opacity: 1;
      transform: scale(1);
    }

    50%, 95% {
      opacity: 0;
      transform: scale(0.8);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .x-mark {
    animation: xoSwap 2s infinite;
  }

  .o-mark {
    animation: xoSwap 2s infinite;
    animation-delay: 1s;
  }

  .stars {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .stars::before {
    content: "";
    position: absolute;
    inset: 0;

    background-image:
      radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px),
      radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px),
      radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px);

    background-size:
      120px 120px,
      180px 180px,
      250px 250px;

    background-position:
      20px 40px,
      80px 120px,
      160px 60px;

    animation: twinkle 6s ease-in-out infinite;
  }

  @keyframes twinkle {
    0%, 100% {
      opacity: 0.4;
    }

    50% {
      opacity: 1;
    }
  }
</style>

<!-- HEADER -->

<header
  class="fixed top-0 left-0 w-full flex items-center justify-between z-[9999]
         px-3 sm:px-4 md:px-8 py-3 md:py-4 transition-all duration-500"
  style="background-color: {scrollY > 50
    ? (isDayMode
      ? 'rgba(255,255,255,0.9)'
      : 'rgba(0,0,0,0.85)')
    : 'transparent'};"
>
  <h2
    class="text-lg sm:text-xl md:text-3xl font-bold transition-colors duration-500"
    class:text-[#359381]="{!isDayMode}"
    class:text-[#2d7a6a]="{isDayMode}"
  >
    KunVerse
  </h2>

  <div class="flex items-center gap-3">
    <a
      href="https://github.com/synakr/EndlessTicTacToe"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View TicTacToe Arena source code on GitHub"
      class="inline-flex items-center justify-center hover:scale-110 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-8 h-8 text-[#359381]"
      >
        <path
          d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.36 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.33 4.79-4.56 5.05.36.32.68.94.68 1.89 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.22C22 6.58 17.52 2 12 2z"
        />
      </svg>
    </a>


    <button
      on:click={toggleDayNight}
      class="relative w-14 h-7 rounded-full transition-all duration-500"
      class:bg-[#1a2332]="{!isDayMode}"
      class:bg-[#87CEEB]="{isDayMode}"
      aria-label="Toggle day/night mode"
    >
      <span
        class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500"
        class:translate-x-7="{isDayMode}"
        class:bg-white="{!isDayMode}"
        class:bg-[#FDB813]="{isDayMode}"
      >
        {#if isDayMode}
          ☀️
        {:else}
          🌙
        {/if}
      </span>
    </button>
  </div>
</header>

<!-- HERO / PARALLAX -->

<section
  id="home"
  class="relative min-h-[100svh] flex justify-center items-center overflow-hidden transition-all duration-1000 bg-gradient-to-b"
  class:from-[#0a1929]="{!isDayMode}"
  class:to-[#1a2332]="{!isDayMode}"
  class:from-[#87CEEB]="{isDayMode}"
  class:to-[#B0E0E6]="{isDayMode}"
>

  {#if !isDayMode}
    <div class="stars"></div>
  {/if}

  <!-- Moon -->
  <img
    src="/img/moon.png"
    alt="Moon"
    class="absolute w-full h-auto object-cover transition-opacity duration-1000"
    class:opacity-30={!isDayMode}
    class:opacity-0={isDayMode}
    style="transform: translate3d(0, {scrollY * (isMobile ? 0.5 : 1.2)}px, 0);"
  />

  <!-- Sun -->

  <div
    class="absolute w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-full transition-all duration-1000"
    class:opacity-0={!isDayMode}
    class:opacity-80={isDayMode}
    style="
      background: radial-gradient(circle, #FDB813 0%, #FDB813 30%, rgba(253,184,19,0.3) 70%, transparent 100%);
      top: 12%;
      right: 8%;
      transform: translate3d(0, {scrollY * (isMobile ? 0.3 : 0.8)}px, 0);
      box-shadow: 0 0 60px 30px rgba(253,184,19,0.4);
    "
  ></div>

  <!-- Clouds & Birds -->

  <img
    src="/img/bird.png"
    alt="Bird"
    class="absolute w-full h-auto object-cover"
    style="transform: translate3d({scrollY * (isMobile ? -0.5 : -1.2)}px, 0, 0);"
  />

  <img
    src="/img/cloud1.png"
    alt="Cloud"
    class="absolute w-full h-auto object-cover opacity-70"
    style="transform: translate3d({scrollY * (isMobile ? 0.2 : 0.5)}px, 0, 0);"
  />

  <img
    src="/img/cloud2.png"
    alt="Cloud"
    class="absolute w-full h-auto object-cover opacity-70"
    style="transform: translate3d({scrollY * (isMobile ? 0.15 : 0.4)}px, 0, 0);"
  />

  <!-- Hills -->

  <img
    src="/img/hill3.png"
    alt="Hill"
    class="absolute w-full h-auto object-cover"
    style="transform: translate3d(
      {scrollY * (isMobile ? -0.5 : -1.2)}px,
      {scrollY * (isMobile ? 0.1 : 0.3)}px,
      0
    );"
  />

  <img
    src="/img/hill2.png"
    alt="Hill"
    class="absolute w-full h-auto object-cover"
  />

  <img
    src="/img/hill1.png"
    alt="Hill"
    class="absolute w-full h-auto object-cover"
  />

  <!-- HERO CONTENT -->

  <div
    class="absolute z-20 flex flex-col items-center gap-5 md:gap-8 text-center px-4 w-full max-w-4xl"
    style="transform: translate3d(0, {scrollY * 1.2}px, 0);"
  >
    <h1
      class="font-bold leading-tight"
      style="font-size: clamp(2.2rem, 9vw, 5rem); letter-spacing: clamp(0.05em, 0.8vw, 0.25em);"
      class:text-white="{!isDayMode}"
      class:text-[#1a2332]="{isDayMode}"
    >
      TIC TAC TOE <br />
      ARENA
    </h1>

    <p
      class="max-w-xl px-4 text-center text-sm font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,.35)] sm:text-base md:text-xl"
      class:text-white="{!isDayMode}"
      class:text-slate-900="{isDayMode}"
    >
      Challenge friends, climb the leaderboard, and keep playing forever.
    </p>

    <div class="flex w-full max-w-xs flex-col gap-3 px-4 sm:w-auto sm:max-w-none sm:flex-row">
      <a
        href="/dashboard"
        class="
          rounded-full
          border
          px-7
          py-3
          text-center
          font-semibold
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:scale-105
          backdrop-blur-xl

          {!isDayMode
            ? 'border-white/20 bg-white/10 text-white shadow-lg shadow-black/20 hover:bg-white/20'
            : 'border-black/10 bg-white/80 text-slate-900 shadow-lg shadow-slate-300/30 hover:bg-white'}
        "
      >
        Play
      </a>
    </div>
  </div>

  <!-- Foreground Plants -->

  <img
    src="/img/plant3.png"
    alt="Plants"
    class="absolute w-full"
    style="transform: translate3d(0, {scrollY * 0.3}px, 0);"
  />

  <img
    src="/img/plant2.png"
    alt="Plants"
    class="absolute w-full"
    style="transform: translate3d(0, {scrollY * 0.15}px, 0);"
  />

  <img
    src="/img/plant1.png"
    alt="Plants"
    class="absolute w-full"
    style="transform: translate3d(0, {scrollY * 0.05}px, 0);"
  />
</section>

<!-- SIMPLE CONTENT -->

<section
  class="py-20 md:py-24 px-6 transition-all duration-1000"
  class:bg-black={!isDayMode}
  class:bg-[#f7fbff]={isDayMode}
>
  <div class="max-w-5xl mx-auto text-center">

    <p
      class="uppercase tracking-[0.3em] text-sm mb-4"
      class:text-[#359381]={!isDayMode}
      class:text-[#2d7a6a]={isDayMode}
    >
      NOT YOUR REGULAR TIC-TAC-TOE
    </p>

    <h2
      class="text-4xl md:text-6xl font-bold mb-8 leading-tight"
      class:text-white={!isDayMode}
      class:text-[#1a2332]={isDayMode}
    >
      Think Less Like Tic-Tac-Toe.
      <br />
      Think More Like Chess.
    </h2>

    <p
      class="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto"
      class:text-gray-300={!isDayMode}
      class:text-gray-700={isDayMode}
    >
      In ordinary Tic-Tac-Toe, you only think about the current board.
      In TicTacToe Arena, you must think about the next board, the board after
      that, and the plans your opponent is building in the meantime.
    </p>

    <p
      class="mt-6 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto"
      class:text-gray-300={!isDayMode}
      class:text-gray-700={isDayMode}
    >
      Every move has consequences.
      Every piece has a lifespan.
      Every position evolves.
    </p>

    <p
      class="mt-6 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto"
      class:text-gray-300={!isDayMode}
      class:text-gray-700={isDayMode}
    >
      Keep track of move history.
      Predict which cells will become available next.
      Anticipate your opponent's plans before they become visible.
      Build strategies that survive multiple board transformations.
    </p>

    <div
      class="mt-12 p-8 rounded-3xl"
      class:bg-[#0f172a]={!isDayMode}
      class:bg-white={isDayMode}
    >
      <p
        class="text-2xl md:text-3xl font-bold"
        class:text-white={!isDayMode}
        class:text-[#1a2332]={isDayMode}
      >
        The best move isn't the one that wins now.
      </p>

      <p
        class="mt-3 text-xl md:text-2xl"
        class:text-[#359381]={!isDayMode}
        class:text-[#2d7a6a]={isDayMode}
      >
        It's the one that creates a win three turns later.
      </p>
    </div>

  </div>

  <div class="max-w-6xl mx-auto py-10">
    <div class="flex items-center gap-4">

      <div
        class="flex-1 h-px bg-gradient-to-r
        from-transparent to-[#359381]"
      ></div>

      <div
        class="relative w-8 h-8 flex items-center justify-center
        text-[#359381] font-bold text-2xl"
      >
        <span class="absolute x-mark">✕</span>
        <span class="absolute o-mark">◯</span>
      </div>

      <div
        class="flex-1 h-px bg-gradient-to-l
        from-transparent to-[#359381]"
      ></div>

    </div>
  </div>
</section>


<section
  class="py-20 md:py-24 px-6 transition-all duration-1000"
  class:bg-[#050505]={!isDayMode}
  class:bg-white={isDayMode}
>
  <div class="max-w-6xl mx-auto">

    <h2
      class="text-3xl md:text-5xl font-bold text-center mb-6"
      class:text-white={!isDayMode}
      class:text-[#1a2332]={isDayMode}
    >
      How It Works
    </h2>

    <p
      class="text-center max-w-3xl mx-auto mb-20 text-lg leading-relaxed"
      class:text-gray-300={!isDayMode}
      class:text-gray-700={isDayMode}
    >
      TicTacToe Arena starts like the game you already know.
      Then it evolves into something much deeper.
      <br /><br />
      Winning isn't about finding the best move right now.
      It's about predicting the board that will exist several turns later.
    </p>

    <!-- STEP 1 -->

    <div class="grid md:grid-cols-2 gap-10 items-center mb-24">

      <div>
        <h3
          class="text-2xl font-bold mb-4"
          class:text-white={!isDayMode}
          class:text-[#1a2332]={isDayMode}
        >
          Step 1: Play Like Normal Tic-Tac-Toe
        </h3>

        <p
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          Players take turns placing X and O on the board.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          At first, everything feels familiar.
          Create lines, block opponents, and look for winning opportunities.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          Just like classic Tic-Tac-Toe.
        </p>
      </div>

      <div
        class="font-mono text-3xl text-center p-8 rounded-3xl"
        class:bg-[#0f172a]={!isDayMode}
        class:bg-[#f3f7fb]={isDayMode}
        class:text-white={!isDayMode}
        class:text-[#1a2332]={isDayMode}
      >
        X _ _<br />
        _ O _<br />
        _ _ X
      </div>

    </div>

    <!-- STEP 2 -->

    <div class="grid md:grid-cols-2 gap-10 items-center mb-24">

      <div
        class="font-mono text-3xl text-center p-8 rounded-3xl order-2 md:order-1"
        class:bg-[#0f172a]={!isDayMode}
        class:bg-[#f3f7fb]={isDayMode}
        class:text-white={!isDayMode}
        class:text-[#1a2332]={isDayMode}
      >
        X O X<br />
        O X O<br />
        O X O
      </div>

      <div class="order-1 md:order-2">
        <h3
          class="text-2xl font-bold mb-4"
          class:text-white={!isDayMode}
          class:text-[#1a2332]={isDayMode}
        >
          Step 2: The Board Fills Up
        </h3>

        <p
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          In traditional Tic-Tac-Toe, this position ends the game.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          Nobody wins.
          Nobody loses.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          The board is full, so the game becomes a draw.
        </p>

        <p
          class="mt-4 font-semibold"
          class:text-white={!isDayMode}
          class:text-[#1a2332]={isDayMode}
        >
          But TicTacToe Arena doesn't allow dead boards.
        </p>
      </div>

    </div>

    <!-- STEP 3 -->

    <div class="grid md:grid-cols-2 gap-10 items-center mb-24">

      <div>
        <h3
          class="text-2xl font-bold mb-4"
          class:text-white={!isDayMode}
          class:text-[#1a2332]={isDayMode}
        >
          Step 3: Old Moves Disappear
        </h3>

        <p
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          Every room has a configurable Tie Breaker value.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          Suppose the Tie Breaker is set to 3.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          When the board becomes full, the oldest three moves disappear.
        </p>

        <p
          class="mt-4 font-semibold"
          class:text-white={!isDayMode}
          class:text-[#1a2332]={isDayMode}
        >
          New cells become available and the battle continues.
        </p>
      </div>

      <div
        class="font-mono text-3xl text-center p-8 rounded-3xl"
        class:bg-[#0f172a]={!isDayMode}
        class:bg-[#f3f7fb]={isDayMode}
        class:text-white={!isDayMode}
        class:text-[#1a2332]={isDayMode}
      >
        _ _ _<br />
        O X O<br />
        O X O
      </div>

    </div>

    <!-- STEP 4 -->

    <div class="grid md:grid-cols-2 gap-10 items-center mb-24">

      <div
        class="font-mono text-3xl text-center p-8 rounded-3xl order-2 md:order-1"
        class:bg-[#0f172a]={!isDayMode}
        class:bg-[#f3f7fb]={isDayMode}
        class:text-white={!isDayMode}
        class:text-[#1a2332]={isDayMode}
      >
        X X _<br />
        O X O<br />
        O X O
      </div>

      <div class="order-1 md:order-2">
        <h3
          class="text-2xl font-bold mb-4"
          class:text-white={!isDayMode}
          class:text-[#1a2332]={isDayMode}
        >
          Step 4: Think Beyond The Current Board
        </h3>

        <p
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          This is where the game changes.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          A good move isn't just one that helps now.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          You must consider:
        </p>

        <ul
          class="mt-4 space-y-2 list-disc ml-6"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          <li>Which cells will disappear next?</li>
          <li>Which threats will survive?</li>
          <li>What is my opponent planning?</li>
          <li>What will the board look like three turns later?</li>
        </ul>
      </div>

    </div>

    <!-- STEP 5 -->

    <div class="grid md:grid-cols-2 gap-10 items-center">

      <div>
        <h3
          class="text-2xl font-bold mb-4"
          class:text-white={!isDayMode}
          class:text-[#1a2332]={isDayMode}
        >
          Step 5: Play Chess, Not Tic-Tac-Toe
        </h3>

        <p
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          Strong players track move history.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          Great players predict future boards.
        </p>

        <p
          class="mt-4"
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          The best players understand both their own plans and their opponent's
          plans several turns in advance.
        </p>

        <p
          class="mt-4 font-semibold"
          class:text-white={!isDayMode}
          class:text-[#1a2332]={isDayMode}
        >
          That's why TicTacToe Arena feels less like Tic-Tac-Toe and more like Chess.
        </p>
      </div>

      <div
        class="rounded-3xl p-8 text-center"
        class:bg-[#0f172a]={!isDayMode}
        class:bg-[#f3f7fb]={isDayMode}
      >
        <div class="text-7xl mb-6">
          ♟️
        </div>

        <h4
          class="text-2xl font-bold mb-4"
          class:text-white={!isDayMode}
          class:text-[#1a2332]={isDayMode}
        >
          Predict. Adapt. Outplay.
        </h4>

        <p
          class:text-gray-300={!isDayMode}
          class:text-gray-700={isDayMode}
        >
          Simple to learn.
          <br />
          Difficult to master.
          <br />
          Impossible to solve.
        </p>
      </div>

    </div>

  </div>
</section>
<footer
  class="border-t py-12 px-6 transition-all duration-1000 text-white"
  class:border-gray-800={!isDayMode}
  class:border-gray-200={isDayMode}
>
  <div class="max-w-6xl mx-auto">

    <div class="grid md:grid-cols-3 gap-10">

      <!-- Brand -->

      <div>
        <h3 class="text-2xl font-bold mb-3">
          TicTacToe Arena
        </h3>

        <p class="leading-relaxed text-gray-300">
          Not your regular Tic-Tac-Toe.
          Think ahead, predict future boards,
          track move history and outplay your opponent.
        </p>

        <p class="leading-relaxed text-gray-400 mt-4">
          Curious how the project started?
          <br>
          <a
            href="https://synakr.github.io/EndlessTicTacToe/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#359381] hover:underline"
          >
            🎮 Try the original prototype (Classic Version) →
          </a>
        </p>
      </div>

      <!-- Open Source -->

      <div>
        <h4 class="font-semibold mb-4">
          Open Source
        </h4>

        <div class="flex flex-col gap-3">
          <a
            href="https://github.com/synakr/EndlessTicTacToe"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#359381] hover:text-[#4dc7ad] hover:underline transition"
          >
            ⭐ Star on GitHub
          </a>

          <a
            href="https://github.com/synakr/EndlessTicTacToe/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#359381] hover:text-[#4dc7ad] hover:underline transition"
          >
            🐛 Report Issues
          </a>

          <a
            href="https://github.com/synakr/EndlessTicTacToe/pulls"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#359381] hover:text-[#4dc7ad] hover:underline transition"
          >
            🤝 Contribute
          </a>

          <div class="flex flex-wrap gap-3 mt-2">
            <a
              href="https://github.com/synakr/EndlessTicTacToe"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:scale-105 transition duration-300"
            >
              <img
                src="https://img.shields.io/github/stars/synakr/EndlessTicTacToe?style=flat-square"
                alt="GitHub Stars"
              />
            </a>

            <a
              href="https://github.com/synakr/EndlessTicTacToe/fork"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:scale-105 transition duration-300"
            >
              <img
                src="https://img.shields.io/github/forks/synakr/EndlessTicTacToe?style=flat-square"
                alt="GitHub Forks"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- Connect -->

      <div>
        <h4 class="font-semibold mb-4">
          Connect
        </h4>

        <div class="flex flex-col gap-3">
          <a
            href="https://github.com/synakr"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#359381] hover:text-[#4dc7ad] hover:underline transition"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com/in/synakr"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#359381] hover:text-[#4dc7ad] hover:underline transition"
          >
            LinkedIn
          </a>

          <a
            href="mailto:EMAIL"
            class="text-[#359381] hover:text-[#4dc7ad] hover:underline transition"
          >
            Email
          </a>
        </div>
      </div>

    </div>

    <div
      class="my-10 border-t"
      class:border-gray-800={!isDayMode}
      class:border-gray-200={isDayMode}
    ></div>

    <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
      <p>
        Made with ❤️ by Sayan
      </p>

      <p>
        © {new Date().getFullYear()} TicTacToe Arena. All rights reserved.
      </p>
    </div>

  </div>
</footer>