<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase.client';

  export let data: any;

  const game = data.game;

  let channel: any;
  const boardSize: number = data?.game?.boardSize ?? 3;
  const gameBaseUrl = `/api/game/${game.roomCode}`;

  function buildBoard(moves: any[] = [], size: number) {
    const nextBoard: string[][] = Array.from({ length: size }, () =>
      Array(size).fill('')
    );

    for (const move of moves) {
      const row = Math.floor(move.cell / size);
      const col = move.cell % size;

      if (nextBoard[row] && typeof nextBoard[row][col] !== 'undefined') {
        nextBoard[row][col] = move.symbol;
      }
    }

    return nextBoard;
  }

  function getPlayer(symbol: 'X' | 'O') {
    return game?.players?.find((player: any) => player.symbol === symbol);
  }

  function getPlayerName(player: any, fallback: string) {
    return `${player?.user?.id === game.currentUserId ? '*' : ''}${
      player?.user?.username ?? fallback
    }`;
  }

  function applyGameState(nextGame: any) {
    game.currentTurn = nextGame.currentTurn;
    game.status = nextGame.status;
    game.players = nextGame.players;
    game.moves = nextGame.moves ?? [];

    board = buildBoard(game.moves, boardSize);

    if (nextGame.status !== 'finished') {
      message = 'Game in progress';
    }
  }

  function setWinnerMessage(winner: string) {
    message = winner === mySymbol ? '🏆 You Win!' : '😢 Opponent Wins!';
  }

  const mySymbol =
    game?.players?.find((player: any) => player.userId === game.currentUserId)?.symbol ?? '?';

  $: playerX = getPlayer('X');
  $: playerO = getPlayer('O');

  let board: string[][] = buildBoard(game?.moves ?? [], boardSize);
  let message = 'Game in progress';

  let showBackground = false;

  async function reloadGame() {
    const res = await fetch(`${gameBaseUrl}?t=${Date.now()}`);
    if (!res.ok) return;

    applyGameState(await res.json());
  }

  async function handleClick(r: number, c: number) {
    if (data.game.status === 'finished') return;

    const cell = r * boardSize + c;

    const res = await fetch(`${gameBaseUrl}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cell })
    });

    const result = await res.json();
    if (!res.ok) return;

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
      setWinnerMessage(result.winner);
      game.status = 'finished';
    }
  }

  async function restart() {
    const res = await fetch(`${gameBaseUrl}/restart`, {
      method: 'POST'
    });

    const result = await res.json();
    if (!res.ok) return;

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

  onMount(() => {
    channel = supabase.channel(`game-${game.roomCode}`);

    channel.on('broadcast', { event: 'move-made' }, async (payload: any) => {
      await reloadGame();

      if (payload.payload.winner) {
        setWinnerMessage(payload.payload.winner);
      }
    });

    channel.on('broadcast', { event: 'game-restarted' }, async () => {
      await reloadGame();
      message = 'Game in progress';
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  });
</script>

<svelte:head>
  <title>Tic Tac Toe Arena</title>
</svelte:head>

<div class="relative min-h-dvh overflow-hidden text-[#f5f1ff] [font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
  {#if showBackground}
    <img class="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover object-center" src="/img/game-bg.png" alt="" aria-hidden="true" />
  {/if}

  <div class="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(180deg,rgba(6,8,18,0.12)_0%,rgba(6,8,18,0.18)_40%,rgba(6,8,18,0.28)_100%)]"></div>

  <main class="relative z-[2] mx-auto grid h-dvh w-full max-w-[1180px] min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-[clamp(4px,0.7vh,8px)] px-[clamp(6px,1vh,12px)] py-[clamp(6px,1vh,12px)] overflow-hidden">
    <section class="relative overflow-hidden rounded-[22px] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] px-3 py-[10px] shadow-[0_14px_36px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-[18px] saturate-[160%] sm:px-4">
      <div class="flex items-center justify-between gap-2">

        <!-- Left -->
        <div class="flex min-w-0 flex-1 items-center gap-2">

          <div
            class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#a777ff]/20 bg-[linear-gradient(180deg,rgba(130,91,255,0.28),rgba(130,91,255,0.12))] text-lg font-extrabold text-[#a777ff] md:h-12 md:w-12 md:text-2xl"
          >
            #
          </div>

          <div class="min-w-0 flex-1">

            <div class="text-[10px] uppercase tracking-wider text-white/60 md:text-xs">
              Room
            </div>

            <h1
              class="truncate text-lg font-black leading-none text-white sm:text-xl md:text-3xl"
            >
              {game.roomCode}
            </h1>

          </div>

        </div>

        <!-- Right -->
        <div class="flex shrink-0 items-center gap-1.5">

          <div
            class="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[11px] text-white md:px-3 md:py-1.5 md:text-sm"
          >
            <span
              class="h-2 w-2 shrink-0 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,.7)] animate-pulse"
            ></span>

            <span class=" sm:inline">
              {message}
            </span>
          </div>

          <button
            type="button"
            on:click={restart}
            aria-label="Restart"
            class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
          >
            ↻
          </button>

          <button
            type="button"
            on:click={() => (showBackground = !showBackground)}
            aria-label="Toggle background"
            class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
          >
            {showBackground ? '🌙' : '☀️'}
          </button>

        </div>

      </div>

      <div class="mt-[10px] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[14px] sm:gap-3 md:gap-[14px] max-[640px]:flex max-[640px]:items-center max-[640px]:justify-between max-[640px]:gap-[6px]">
        <div class={`flex min-w-0 items-center gap-[12px] rounded-[22px] border border-white/10 bg-white/[0.035] p-[12px_16px] transition-[border-color,background,box-shadow] duration-200 max-[640px]:flex-1 max-[640px]:gap-2 max-[640px]:rounded-[14px] max-[640px]:p-2 ${game.currentTurn === 'X' ? 'border-[#825bff] bg-[rgba(130,91,255,0.12)] shadow-[inset_0_0_0_1px_rgba(130,91,255,0.55),0_0_18px_rgba(130,91,255,0.28),0_0_42px_rgba(130,91,255,0.18)]' : ''}`}>
          <div class="grid h-8.5 w-8.5 shrink-0 place-items-center rounded-full bg-[rgba(183,94,119,.12)] text-[1.2rem] font-extrabold text-[#B75E77] sm:h-[38px] sm:w-[38px] sm:text-[1.35rem] md:h-[44px] md:w-[44px] md:text-[1.7rem]">
            ✕
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 text-[0.88rem] font-bold text-white sm:text-[0.95rem] md:text-[1.05rem] max-[640px]:block max-[640px]:overflow-hidden max-[640px]:whitespace-nowrap max-[640px]:text-ellipsis max-[640px]:text-[0.78rem]">
              {getPlayerName(playerX, 'Player X')} (X)

              {#if playerX?.user?.id === game.currentUserId}
                <span class="ml-2 inline-flex rounded-full bg-[#6c45ff] px-[8px] py-[2px] text-[0.68rem] font-bold text-white sm:px-[10px] sm:py-[4px] sm:text-[0.78rem] max-[640px]:hidden">
                  You
                </span>
              {/if}
            </div>
          </div>

          <div class="text-[1.4rem] font-extrabold leading-none text-white sm:text-[1.7rem] md:text-[2.7rem]">
            {playerX?.score ?? 0}
          </div>
        </div>

        <div class="relative grid h-[26px] w-[26px] place-items-center rounded-full border border-white/8 bg-white/[0.04] text-[0.62rem] font-bold text-white/75 sm:h-[28px] sm:w-[28px] sm:text-[0.65rem] md:h-[54px] md:w-[54px] md:text-[0.75rem] max-[640px]:h-[26px] max-[640px]:w-[26px] max-[640px]:before:hidden max-[640px]:after:hidden md:before:absolute md:before:right-full md:before:mr-2 md:before:top-1/2 md:before:h-[2px] md:before:w-[22px] md:before:-translate-y-1/2 md:before:bg-white/12 md:after:absolute md:after:left-full md:after:ml-2 md:after:top-1/2 md:after:h-[2px] md:after:w-[22px] md:after:-translate-y-1/2 md:after:bg-white/12">
          VS
        </div>

        <div class={`flex min-w-0 items-center gap-[12px] rounded-[22px] border border-white/10 bg-white/[0.035] p-[12px_16px] transition-[border-color,background,box-shadow] duration-200 max-[640px]:flex-1 max-[640px]:gap-2 max-[640px]:rounded-[14px] max-[640px]:p-2 ${game.currentTurn === 'O' ? 'border-[#825bff] bg-[rgba(130,91,255,0.12)] shadow-[inset_0_0_0_1px_rgba(130,91,255,0.55),0_0_18px_rgba(130,91,255,0.28),0_0_42px_rgba(130,91,255,0.18)]' : ''}`}>
          <div class="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[rgba(176,215,255,.12)] text-[1.2rem] font-extrabold text-[#B0D7FF] sm:h-[38px] sm:w-[38px] sm:text-[1.35rem] md:h-[44px] md:w-[44px] md:text-[1.7rem]">
            ◯
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 text-[0.88rem] font-bold text-white sm:text-[0.95rem] md:text-[1.05rem] max-[640px]:block max-[640px]:overflow-hidden max-[640px]:whitespace-nowrap max-[640px]:text-ellipsis max-[640px]:text-[0.78rem]">
              {getPlayerName(playerO, 'Player O')} (O)

              {#if playerO?.user?.id === game.currentUserId}
                <span class="ml-2 inline-flex rounded-full bg-[#6c45ff] px-[8px] py-[2px] text-[0.68rem] font-bold text-white sm:px-[10px] sm:py-[4px] sm:text-[0.78rem] max-[640px]:hidden">
                  You
                </span>
              {/if}
            </div>
          </div>

          <div class="text-[1.4rem] font-extrabold leading-none text-white sm:text-[1.7rem] md:text-[2.7rem]">
            {playerO?.score ?? 0}
          </div>
        </div>
      </div>
    </section>

    <section class="flex min-h-0 items-center justify-center">

  <div
    class="w-full max-w-[min(94vw,94dvh,calc(100svh-210px),560px)]
           rounded-[28px]
           border border-white/15
           bg-white/[0.07]
           p-3
           shadow-[0_20px_60px_rgba(0,0,0,.35)]
           backdrop-blur-2xl
           max-[640px]:max-w-[min(94vw,calc(100dvh-250px),420px)]
           max-[640px]:rounded-3xl
           max-[640px]:p-2.5">

    <div
      class="grid h-full w-full gap-2"
      style={`grid-template-columns:repeat(${boardSize},minmax(0,1fr));grid-auto-rows:minmax(0,1fr);`}
    >

      {#each board as row, r}
        {#each row as cell, c}

          <button
            type="button"
            on:click={() => handleClick(r, c)}
            aria-label={`Cell ${r + 1}, ${c + 1}`}
            class={`
              group
              relative
              aspect-square
              overflow-hidden
              rounded-2xl
              border
              transition-all
              duration-200
              active:scale-95

              ${
                cell === ''
                  ? `
                    border-white/10
                    bg-white/[0.05]
                    hover:-translate-y-0.5
                    hover:border-white/20
                    hover:bg-white/[0.08]
                    hover:shadow-[0_0_25px_rgba(255,255,255,.06)]
                  `
                  : ''
              }

              ${
                cell === 'X'
                  ? `
                    border-[#B75E77]/70
                    bg-gradient-to-br
                    from-[#d57a97]
                    to-[#9b4962]
                    shadow-[0_12px_28px_rgba(183,94,119,.35)]
                  `
                  : ''
              }

              ${
                cell === 'O'
                  ? `
                    border-[#B0D7FF]/70
                    bg-gradient-to-br
                    from-[#c7e5ff]
                    to-[#7fb9ff]
                    shadow-[0_12px_28px_rgba(176,215,255,.35)]
                  `
                  : ''
              }
            `}
          >

            <span
              class="relative z-10 text-[clamp(2.5rem,10vmin,5rem)] font-black leading-none text-white transition-transform duration-200 group-hover:scale-105"
            >
              {cell === 'X' ? '✕' : cell === 'O' ? '◯' : ''}
            </span>

            <span
              class="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,.14),transparent_65%)]"
            ></span>

          </button>

        {/each}
      {/each}

    </div>

  </div>

</section>
  </main>
</div>

<style>
  :global(html),
  :global(body),
  :global(#app) {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    overflow: hidden;
    overscroll-behavior: none;
  }

  @keyframes pulse-dot {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    }

    70% {
      transform: scale(1.2);
      box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
    }

    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }
</style>