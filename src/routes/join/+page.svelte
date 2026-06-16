<script lang="ts">
  import { goto } from '$app/navigation';

  let roomCode = '';
  let errorMsg = '';

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

<h2 class="text-center text-2xl text-[#EAE8FF] font-bold my-4">
  Join Game
</h2>

<div class="flex justify-center">
  <form
    on:submit|preventDefault={joinRoom}
    class="flex flex-col gap-3 max-w-[320px] w-full"
  >
    <input
      type="text"
      placeholder="Enter Room Code"
      bind:value={roomCode}
      class="p-2 rounded bg-[#023e8a4D] text-white text-center uppercase"
    />

    <button
      class="text-[#FFF8E8] bg-[#EAE8FF4D] py-2 rounded-full border border-[#023e8a4D]"
    >
      Join
    </button>

    {#if errorMsg}
      <p class="text-red-400 text-center">{errorMsg}</p>
    {/if}
  </form>
</div>
