<script lang="ts">
  export let data;

  const boardSize: number = data.game.boardSize || 3;

  let board: string[][] = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(''));

  let message = "Whose the winner?";

  function handleClick(r: number, c: number) {
    if (board[r][c] === '') {
      board[r][c] = 'X';
      board = board;
    }
  }

  function restart() {
    board = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(''));
    message = "Whose the winner?";
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
