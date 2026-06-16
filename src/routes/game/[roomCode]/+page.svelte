
<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase.client';

  export let data;
  let channel: any;

  const boardSize: number = data.game.boardSize || 3;

  const me = data.game.players.find(
    (p: any) => p.userId === data.game.currentUserId
  );

  const mySymbol = me?.symbol ?? '?';

  $: playerX = data.game.players.find(
    (p: any) => p.symbol === 'X'
  );

  $: playerO = data.game.players.find(
    (p: any) => p.symbol === 'O'
  );

  let board: string[][] = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(''));

  for (let i = 0; i < data.game.moves.length; i++) {
    const move = data.game.moves[i];

    const row = Math.floor(move.cell / boardSize);
    const col = move.cell % boardSize;

    board[row][col] = move.symbol;
  }

  let message = 'Game in progress';

  async function handleClick(r: number, c: number) {
    if (data.game.status === 'finished') {
      return;
    }

    const cell = r * boardSize + c;

    const res = await fetch(
      `/api/game/${data.game.roomCode}/move`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cell })
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return;
    }

    await reloadGame();

    await channel.send({
      type: 'broadcast',
      event: 'move-made',
      payload: {
        roomCode: data.game.roomCode,
        cell,
        winner: result.winner ?? null
      }
    });


    if (result.winner) {
      message = '🏆 You Win!';
      data.game.status = 'finished';
    }
  }

  async function reloadGame() {
    const res = await fetch(
      `/api/game/${data.game.roomCode}?t=${Date.now()}`
    );

    if (!res.ok) return;

    const game = await res.json();

    data.game.currentTurn = game.currentTurn;
    data.game.status = game.status;
    data.game.players = game.players;

    if (game.status !== 'finished') {
      message = 'Game in progress';
    }

    const newBoard = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(''));

    for (let i = 0; i < game.moves.length; i++) {
      const move = game.moves[i];

      const row = Math.floor(move.cell / boardSize);
      const col = move.cell % boardSize;

      newBoard[row][col] = move.symbol;
    }

    board = newBoard;
  }

  onMount(() => {
    channel = supabase.channel(`game-${data.game.roomCode}`);

    channel.on(
      'broadcast',
      { event: 'move-made' },
      async (payload: any) => {

        await reloadGame();

        if (payload.payload.winner) {
          if (payload.payload.winner === mySymbol) {
            message = '🏆 You Win!';
          } else {
            message = '😢 Opponent Wins!';
          }
        }
      }
    );

    channel.on(
      'broadcast',
      { event: 'game-restarted' },
      async (payload: any) => {

        await reloadGame();

        message = 'Game in progress';
      }
    );

    channel.subscribe((status : string) => {
    });

    return () => {
      supabase.removeChannel(channel);
    };
  });

  async function restart() {
    const res = await fetch(
      `/api/game/${data.game.roomCode}/restart`,
      {
        method: 'POST'
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return;
    }

    await reloadGame();

    await channel.send({
      type: 'broadcast',
      event: 'game-restarted',
      payload: {
        roomCode: data.game.roomCode
      }
    });

    message = 'Game in progress';
  }
</script>

<!-- ✅ Background wraps whole page -->
<div>

  <h1 class="text-center text-3xl text-[#EAE8FF] font-bold my-2">
    TIC TAC TOE ARENA
  </h1>

  <h3 class="text-center text-[#EAE8FF] mb-2">
    Room: {data.game.roomCode}
  </h3>

  <!-- <h3 class="text-center text-[#EAE8FF]">
    You are: {mySymbol}
  </h3>

  <h3 class="text-center text-[#EAE8FF] mb-4">
    Current Turn: {data.game.currentTurn}
  </h3> -->

  <!-- ScoreBoard -->

  <div class="flex justify-center gap-8 mb-2 text-[#EAE8FF] font-semibold">

    <div
      class:border-b-2={data.game.currentTurn === 'X'}
      class:pb-1={data.game.currentTurn === 'X'}
    >
      {playerX?.user?.id === data.game.currentUserId ? '*' : ''}
      {playerX?.user?.username ?? 'Player X'}
      (X)
      : {playerX?.score ?? 0}
    </div>

    <span>|</span>

    <div
      class:border-b-2={data.game.currentTurn === 'O'}
      class:pb-1={data.game.currentTurn === 'O'}
    >
      {playerO?.user?.id === data.game.currentUserId ? '*' : ''}
      {playerO?.user?.username ?? 'Player O'}
      (O)
      : {playerO?.score ?? 0}
    </div>

  </div>

  <!-- Gaming Area -->
  <div class="flex justify-center">
    <div class="flex flex-col w-[min(95vmin,500px)] aspect-square rounded-xl">
      {#each board as row, r}
        <div class="flex flex-1">
          {#each row as cell, c}
            <button
              type="button"
              on:click={() => handleClick(r, c)}
              class="
                flex-1 flex justify-center items-center
                border border-[#FFF8E8]
                rounded-2xl
                bg-[#023e8a4D]
                text-[6vmin] text-[#FFF8E8]
                cursor-pointer
                hover:bg-[#023e8a6D]
                transition
              "
            >
              {cell}
            </button>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <!-- Result Area -->
  <div class="flex flex-col items-center mt-4 gap-2">
    <h3 class="text-[#EAE8FF]">{message}</h3>

    <button
      on:click={restart}
      class="
        text-[#FFF8E8]
        bg-[#EAE8FF4D]
        px-4 py-1
        rounded-full
        border border-[#023e8a4D]
        hover:bg-[#EAE8FF6D]
      "
    >
      RESTART
    </button>
  </div>

  <footer class="text-center text-white bg-[#D6C3AE4D] rounded-full mt-4">
    Made with Love ♡ by Sayan
  </footer>

</div>
