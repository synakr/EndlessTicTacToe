<script lang="ts">
  import { goto } from '$app/navigation';
  import AuthLayout from '$lib/components/AuthLayout.svelte';

  let roomCode = '';
  let errorMsg = '';

  const butterflies = Array.from({ length: 8 }, (_, i) => i);

  async function joinRoom() {
    const code = roomCode.trim().toUpperCase();

    if (!code) {
      errorMsg = 'Please enter room code';
      return;
    }

    if (!/^[A-Z0-9]{4,8}$/.test(code)) {
      errorMsg = 'Invalid room code format';
      return;
    }

    const res = await fetch('/api/game/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomCode: code
      })
    });

    const result = await res.json();

    if (!res.ok) {
      errorMsg = result.error ?? 'Failed to join room';
      return;
    }

    goto(`/game/${code}`);
  }
</script>

<svelte:head>
  <title>Join Game</title>
</svelte:head>

<div class="page relative flex min-h-screen items-center justify-center overflow-hidden p-6">

  <div class="stars"></div>
  <div class="nebula nebula-1"></div>
  <div class="nebula nebula-2"></div>
  <div class="nebula nebula-3"></div>

  <div class="butterfly-field" aria-hidden="true">
    {#each butterflies as i}
      <span class="butterfly b{i + 1}"></span>
    {/each}
  </div>

  <div class="relative z-10 w-full max-w-95">

    <AuthLayout>

      <div slot="title" class="mb-5 text-center">

        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Tic Tac Toe Arena
        </p>

        <h1 class="mt-1 text-4xl font-bold text-white">
          Join Game
        </h1>

        <p class="mx-auto mt-2 max-w-70 text-sm text-white/70">
          Enter your room code and jump straight into the battle.
        </p>

      </div>

      <div
        class="
          relative overflow-hidden
          rounded-3xl
          border border-white/20
          bg-white/10
          p-6
          shadow-2xl
          backdrop-blur-3xl
        "
      >

        <form
          class="flex flex-col gap-4"
          on:submit|preventDefault={joinRoom}
        >

          <div class="flex flex-col gap-2">

            <label
              for="room"
              class="text-sm font-semibold tracking-wide text-white/80"
            >
              Room Code
            </label>

            <input
              id="room"
              bind:value={roomCode}
              type="text"
              maxlength="8"
              placeholder="Enter Room Code"
              class="
                h-12
                rounded-2xl
                border
                border-white/15
                bg-white/10
                px-4
                text-center
                text-sm
                uppercase
                tracking-[0.2em]
                text-white
                outline-none
                backdrop-blur-xl
                transition
                placeholder:text-white/40
                hover:bg-white/15
                focus:border-white/30
                focus:bg-white/15
              "
            />

          </div>

          <button
            class="
              h-12
              rounded-2xl
              border
              border-white/20
              bg-white/10
              font-semibold
              tracking-wider
              text-white
              backdrop-blur-xl
              transition
              hover:-translate-y-0.5
              hover:bg-white/15
            "
          >
            Join Game
          </button>

          {#if errorMsg}
            <p class="text-center text-sm text-rose-300">
              {errorMsg}
            </p>
          {/if}

        </form>

      </div>

      <div slot="switch" class="mt-4 text-center">
        <a
          href="/dashboard"
          class="text-white/70 transition hover:text-white"
        >
          Create New Game
        </a>
      </div>

    </AuthLayout>

  </div>
</div>
