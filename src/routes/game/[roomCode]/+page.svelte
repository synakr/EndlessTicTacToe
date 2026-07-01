<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase.client';

  export let data: any;

  let channel: any;
  const boardSize: number = data?.game?.boardSize ?? 3;

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

  const me = data?.game?.players?.find(
    (p: any) => p.userId === data?.game?.currentUserId
  );

  const mySymbol = me?.symbol ?? '?';

  $: playerX = data?.game?.players?.find((p: any) => p.symbol === 'X');
  $: playerO = data?.game?.players?.find((p: any) => p.symbol === 'O');

  let board: string[][] = buildBoard(data?.game?.moves ?? [], boardSize);
  let message = 'Game in progress';

  async function reloadGame() {
    const res = await fetch(`/api/game/${data.game.roomCode}?t=${Date.now()}`);
    if (!res.ok) return;

    const game = await res.json();

    data.game.currentTurn = game.currentTurn;
    data.game.status = game.status;
    data.game.players = game.players;
    data.game.moves = game.moves ?? [];

    if (game.status !== 'finished') {
      message = 'Game in progress';
    }

    board = buildBoard(game.moves ?? [], boardSize);
  }

  async function handleClick(r: number, c: number) {
    if (data.game.status === 'finished') return;

    const cell = r * boardSize + c;

    const res = await fetch(`/api/game/${data.game.roomCode}/move`, {
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
      message = '🏆 You Win!';
      data.game.status = 'finished';
    }
  }

  async function restart() {
    const res = await fetch(`/api/game/${data.game.roomCode}/restart`, {
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
    channel = supabase.channel(`game-${data.game.roomCode}`);

    channel.on('broadcast', { event: 'move-made' }, async (payload: any) => {
      await reloadGame();

      if (payload.payload.winner) {
        if (payload.payload.winner === mySymbol) {
          message = '🏆 You Win!';
        } else {
          message = '😢 Opponent Wins!';
        }
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

<div class="page">
  <img class="bg-image" src="/img/game-bg.png" alt="" aria-hidden="true" />
  <div class="bg-tint"></div>

  <main class="shell">
    <header class="topbar card">
      <div class="title-block">
        <p class="eyebrow">TIC-TAC-TOE ARENA</p>
        <h1>Room: {data.game.roomCode}</h1>
      </div>

      <div class="status-pill">{message}</div>
    </header>

    <section class="scoreboard card">
      <div class:active-turn={data.game.currentTurn === 'X'} class="score-item">
        <span class="score-name">
          {playerX?.user?.id === data.game.currentUserId ? '*' : ''}
          {playerX?.user?.username ?? 'Player X'} (X)
        </span>
        <span class="score-value">{playerX?.score ?? 0}</span>
      </div>

      <div class="score-divider">•</div>

      <div class:active-turn={data.game.currentTurn === 'O'} class="score-item">
        <span class="score-name">
          {playerO?.user?.id === data.game.currentUserId ? '*' : ''}
          {playerO?.user?.username ?? 'Player O'} (O)
        </span>
        <span class="score-value">{playerO?.score ?? 0}</span>
      </div>
    </section>

    <section class="board-area">
      <div class="board-card card">
        <div class="board" style={`--size:${boardSize};`}>
          {#each board as row, r}
            {#each row as cell, c}
              <button
                type="button"
                on:click={() => handleClick(r, c)}
                class="cell"
                aria-label={`Cell ${r + 1}, ${c + 1}`}
              >
                {cell}
              </button>
            {/each}
          {/each}
        </div>
      </div>
    </section>

    <section class="controls">
      <button type="button" on:click={restart} class="restart-btn">
        RESTART
      </button>
    </section>

    <footer class="footer card">
      Made with Love ♡ by Sayan
    </footer>
  </main>
</div>

<style>
  :global(html),
  :global(body),
  :global(#app) {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  :global(body) {
    overflow: hidden;
    color: #f5f1ff;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
    background: #07070a;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .page {
    position: relative;
    width: 100%;
    height: 100svh;
    overflow: hidden;
  }

  .bg-image {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    z-index: 0;
    pointer-events: none;
  }

  .bg-tint {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(
        180deg,
        rgba(6, 8, 18, 0.12) 0%,
        rgba(6, 8, 18, 0.16) 35%,
        rgba(6, 8, 18, 0.24) 100%
      );
  }

.shell {
  position: relative;
  z-index: 2;
  width: min(1280px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: clamp(6px, 1vh, 12px);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto auto;
  gap: clamp(4px, 0.7vh, 8px);
  min-height: 0;
}

.topbar {
  padding: clamp(8px, 1vh, 12px) clamp(12px, 1.4vw, 16px);
}

.scoreboard {
  padding: 10px 12px;
}

.board-area {
  min-height: 0;
  display: grid;
  place-items: center;
}

.board-card {
  width: min(94vw, calc(100svh - 240px), 560px);
  aspect-ratio: 1 / 1;
  padding: clamp(8px, 1vw, 12px);
}

.controls {
  margin-top: -2px;
}

.restart-btn {
  margin-top: 0;
}

.footer {
  padding: 8px 14px;
}

  .card {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.08)
    );
    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
    box-shadow:
      0 14px 36px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.16);
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.16),
      rgba(255, 255, 255, 0.04) 35%,
      transparent 70%
    );
  }

  .topbar {
    padding: clamp(10px, 1.2vh, 14px) clamp(14px, 1.6vw, 18px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .title-block {
    min-width: 0;
  }

  .eyebrow {
    margin: 0 0 4px;
    letter-spacing: 0.18em;
    font-size: 0.72rem;
    color: rgba(245, 241, 255, 0.75);
  }

  h1 {
    margin: 0;
    font-size: clamp(1.15rem, 2vw, 1.55rem);
    line-height: 1.1;
    color: #fffaf1;
    word-break: break-word;
  }

  .status-pill {
    padding: 9px 14px;
    border-radius: 999px;
    font-size: 0.92rem;
    color: #fffaf1;
    background: rgba(255, 255, 255, 0.10);
    border: 1px solid rgba(255, 255, 255, 0.14);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .scoreboard {
    padding: 12px 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }

  .score-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
    min-width: 0;
    color: rgba(245, 241, 255, 0.88);
  }

  .score-name {
    font-size: clamp(0.82rem, 1.3vw, 0.98rem);
    line-height: 1.2;
    word-break: break-word;
  }

  .score-value {
    font-size: clamp(1rem, 1.6vw, 1.2rem);
    font-weight: 800;
    color: #fffdf3;
  }

  .score-divider {
    color: rgba(245, 241, 255, 0.48);
    font-size: 1.2rem;
  }

  .active-turn .score-name,
  .active-turn .score-value {
    color: #ffffff;
    text-shadow: 0 0 10px rgba(199, 185, 255, 0.24);
  }

  .board-area {
    min-height: 0;
    display: grid;
    place-items: center;
  }

  .board-card {
    width: min(96vw, calc(100svh - 270px), 560px);
    aspect-ratio: 1 / 1;
    padding: clamp(8px, 1.2vw, 12px);
    display: grid;
    place-items: stretch;
  }

  .board {
    --size: 3;
    display: grid;
    grid-template-columns: repeat(var(--size), minmax(0, 1fr));
    gap: clamp(8px, 1.1vw, 12px);
    width: 100%;
    height: 100%;
  }

  .cell {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: clamp(14px, 1.6vw, 18px);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.13),
      rgba(255, 255, 255, 0.06)
    );
    backdrop-filter: blur(14px) saturate(150%);
    -webkit-backdrop-filter: blur(14px) saturate(150%);
    color: #fff8e8;
    font-size: clamp(1.9rem, 6.8vmin, 4rem);
    font-weight: 800;
    cursor: pointer;
    transition:
      transform 0.16s ease,
      background 0.16s ease,
      box-shadow 0.16s ease;
    -webkit-tap-highlight-color: transparent;
    font: inherit;
  }

  .cell::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 60%);
    pointer-events: none;
  }

  .cell:hover {
    transform: translateY(-1px);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.08)
    );
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.14);
  }

  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .restart-btn {
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    padding: 10px 18px;
    color: #fff8e8;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.14),
      rgba(255, 255, 255, 0.06)
    );
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);
    box-shadow:
      0 10px 26px rgba(0, 0, 0, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.16);
    cursor: pointer;
    font-weight: 700;
    letter-spacing: 0.08em;
    transition: transform 0.16s ease, background 0.16s ease;
    -webkit-tap-highlight-color: transparent;
    font: inherit;
  }

  .restart-btn:hover {
    transform: translateY(-1px);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.08)
    );
  }

  .footer {
    padding: 9px 14px;
    text-align: center;
    color: rgba(255, 255, 255, 0.88);
    border-radius: 999px;
    font-size: 0.9rem;
  }

@media (max-width: 640px) {
  .shell {
    width: 100%;
    padding: 6px;
    gap: 6px;
    grid-template-rows: auto auto minmax(0, 1fr) auto;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    padding: 8px 10px;
    gap: 6px;
    border-radius: 18px;
  }

  .eyebrow {
    display: none;
  }

  h1 {
    font-size: clamp(1rem, 4.8vw, 1.3rem);
  }

  .status-pill {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .scoreboard {
    padding: 8px 10px;
    gap: 10px;
    border-radius: 18px;
  }

  .score-divider {
    display: none;
  }

  .score-name {
    font-size: 0.78rem;
  }

  .score-value {
    font-size: 1rem;
  }

  .board-card {
    width: min(92vw, calc(100dvh - 215px), 410px);
    padding: 8px;
    border-radius: 18px;
  }

  .board {
    gap: 6px;
  }

  .cell {
    border-radius: 12px;
    font-size: clamp(1.7rem, 8.5vmin, 2.8rem);
  }

  .restart-btn {
    padding: 9px 16px;
    font-size: 0.95rem;
  }

  .footer {
    display: none;
  }
}
</style>