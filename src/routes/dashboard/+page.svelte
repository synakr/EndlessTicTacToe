<script>
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase.client";

  export let data;

  async function handleLogout() {
    await supabase.auth.signOut();
    await goto("/login");
  }

  const profile = data.profile ?? {};
  const stats = data.stats ?? {};

  $: joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "Unknown";

  $: completionRate =
    stats.totalGames > 0 ? Math.round((stats.finished / stats.totalGames) * 100) : 0;

  $: initials =
    (profile.username ?? profile.email ?? "P")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
</script>

<svelte:head>
  <title>Player Dashboard</title>
</svelte:head>

<div class="relative min-h-[100dvh] overflow-hidden bg-slate-950 text-slate-50">
  <div class="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,#090f1d_0%,#050816_55%,#02040a_100%)]"></div>
  <div class="pointer-events-none fixed inset-0 opacity-70 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.18)_0,transparent_1px),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.14)_0,transparent_1px),radial-gradient(circle_at_40%_70%,rgba(255,255,255,0.12)_0,transparent_1px),radial-gradient(circle_at_65%_15%,rgba(120,140,255,0.18),transparent_22%),radial-gradient(circle_at_25%_85%,rgba(93,242,194,0.1),transparent_20%)] bg-[length:320px_320px,420px_420px,280px_280px,auto,auto]"></div>
  <div class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0_55%,rgba(0,0,0,0.28)_100%)]"></div>

  <main class="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col gap-3 overflow-hidden px-3 py-3 sm:px-4 sm:py-4 lg:gap-4">
    <section class="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
      <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div class="min-w-0">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-indigo-200/90 sm:text-xs">
            Tic-Tac-Toe Arena
          </p>

          <h1 class="mt-1 text-[clamp(1.4rem,4vw,3rem)] font-bold leading-[0.95] text-white">
            Player Dashboard
          </h1>

          <p class="mt-2 max-w-xl text-[0.8rem] leading-6 text-white/70 sm:text-sm lg:text-base">
            Track your profile, monitor your match stats, and jump into a new game in one click.
          </p>
        </div>

        <div class="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.72rem] font-medium text-white/90 backdrop-blur-xl sm:px-4 sm:text-sm">
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,.8)]"></span>
          <span>Ready to play</span>
        </div>
      </div>
    </section>

    <section class="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.15fr_0.95fr]">
      <div class="min-h-0 rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
        <div class="flex h-full min-h-0 flex-col">
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-300 to-emerald-300 text-base font-extrabold tracking-wider text-slate-900 shadow-lg sm:h-16 sm:w-16 sm:text-lg">
              {initials}
            </div>

            <div class="min-w-0">
              <h2 class="truncate text-[clamp(1.15rem,2.6vw,1.75rem)] font-bold text-white">
                {profile.username ?? "Not set"}
              </h2>
              <p class="truncate text-[0.8rem] text-white/60 sm:text-sm">
                {profile.email ?? "No email found"}
              </p>
            </div>
          </div>

          <div class="my-4 h-px shrink-0 bg-white/10"></div>

          <div class="grid min-h-0 flex-1 grid-cols-2 gap-3">
            <div class="flex min-h-0 flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:p-4">
              <span class="text-[0.68rem] uppercase tracking-wide text-white/60 sm:text-xs">
                Joined
              </span>

              <strong class="mt-2 block text-[clamp(1rem,2.1vw,1.25rem)] font-semibold text-white">
                {joinedDate}
              </strong>
            </div>

            <div class="flex min-h-0 flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:p-4">
              <span class="text-[0.68rem] uppercase tracking-wide text-white/60 sm:text-xs">
                Completion Rate
              </span>

              <strong class="mt-2 block text-[clamp(1rem,2.1vw,1.25rem)] font-semibold text-white">
                {completionRate}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div class="grid min-h-0 gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-2">
        <div class="flex min-h-0 flex-col justify-between rounded-[1.75rem] border border-white/15 bg-white/10 p-4 backdrop-blur-2xl sm:p-5">
          <span class="text-[0.8rem] text-white/60 sm:text-sm">
            Total Games
          </span>

          <strong class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-none text-white">
            {stats.totalGames ?? 0}
          </strong>
        </div>

        <div class="flex min-h-0 flex-col justify-between rounded-[1.75rem] border border-white/15 bg-white/10 p-4 backdrop-blur-2xl sm:p-5">
          <span class="text-[0.8rem] text-white/60 sm:text-sm">
            Finished Games
          </span>

          <strong class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-none text-white">
            {stats.finished ?? 0}
          </strong>
        </div>

        <div class="col-span-2 flex min-h-0 flex-col justify-between rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-emerald-400/10 to-transparent p-4 backdrop-blur-2xl sm:col-span-3 sm:p-5 lg:col-span-2">
          <span class="text-[0.8rem] text-white/60 sm:text-sm">
            Win Progress
          </span>

          <strong class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-none text-emerald-300">
            {completionRate}%
          </strong>
        </div>
      </div>
    </section>

    <section class="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
      <div class="flex h-full min-h-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="min-w-0">
          <h3 class="text-[clamp(1.05rem,2.4vw,1.5rem)] font-bold text-white">
            Start a new match
          </h3>

          <p class="mt-2 text-[0.8rem] text-white/65 sm:text-sm">
            Choose a mode and get into the game instantly.
          </p>
        </div>

        <div class="grid w-full gap-2 sm:grid-cols-3 lg:max-w-136">
          <a
            href="/modes"
            class="rounded-2xl bg-linear-to-br from-indigo-300 to-emerald-300 px-4 py-2.5 text-center text-[0.8rem] font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:px-5 sm:text-sm"
          >
            Create Game
          </a>

          <a
            href="/join"
            class="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-[0.8rem] font-semibold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10 sm:px-5 sm:text-sm"
          >
            Join Game
          </a>

          <button
            type="button"
            on:click={handleLogout}
            class="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-[0.8rem] font-semibold text-red-200 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-red-500/20 sm:px-5 sm:text-sm"
          >
            Logout
          </button>
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

  :global(body) {
    overflow: hidden;
  }
</style>