<script>
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase.client"; // adjust path if needed

  async function handleLogout() {
    await supabase.auth.signOut();
    await goto("/login");
  }

export let data;

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

<div class="page">
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Tic-Tac-Toe Arena</p>
      <h1>Player Dashboard</h1>
      <p class="subtext">
        Track your profile, monitor your match stats, and jump into a new game in one click.
      </p>
    </div>

    <div class="hero-badge">
      <span class="badge-dot"></span>
      <span>Ready to play</span>
    </div>
  </section>

  <section class="grid">
    <div class="card profile-card">
      <div class="profile-top">
        <div class="avatar">{initials}</div>

        <div class="profile-info">
          <h2>{profile.username ?? "Not set"}</h2>
          <p class="muted">{profile.email ?? "No email found"}</p>
        </div>
      </div>

      <div class="divider"></div>

      <div class="profile-meta">
        <div class="meta-box">
          <span class="label">Joined</span>
          <strong>{joinedDate}</strong>
        </div>

        <div class="meta-box">
          <span class="label">Completion Rate</span>
          <strong>{completionRate}%</strong>
        </div>
      </div>
    </div>

    <div class="stats-panel">
      <div class="card stat-card">
        <span class="stat-label">Total Games</span>
        <strong class="stat-value">{stats.totalGames ?? 0}</strong>
      </div>

      <div class="card stat-card">
        <span class="stat-label">Finished Games</span>
        <strong class="stat-value">{stats.finished ?? 0}</strong>
      </div>

      <div class="card stat-card accent">
        <span class="stat-label">Win Progress</span>
        <strong class="stat-value">{completionRate}%</strong>
      </div>
    </div>
  </section>

  <section class="card actions-card">
    <div class="actions-copy">
      <h3>Start a new match</h3>
      <p>Choose a mode and get into the game instantly.</p>
    </div>

    <div class="actions">
      <a href="/modes" class="btn primary">Create Game</a>
  <a href="/join" class="btn secondary">Join Game</a>
  <button class="btn logout" on:click={handleLogout}>Logout</button>
      <!-- <a href="/modes" class="btn primary">Create Game</a>
      <a href="/join" class="btn secondary">Join Game</a> -->
    </div>
  </section>
</div>

<style>
:global(body) {
  margin: 0;
  min-height: 100vh;
  color: #f5f7fb;
  position: relative;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.18) 0 1px, transparent 1.5px),
    radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.14) 0 1px, transparent 1.5px),
    radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.12) 0 1px, transparent 1.5px),
    radial-gradient(circle at 65% 15%, rgba(120, 140, 255, 0.18), transparent 22%),
    radial-gradient(circle at 25% 85%, rgba(93, 242, 194, 0.10), transparent 20%),
    linear-gradient(180deg, #090f1d 0%, #050816 55%, #02040a 100%);
  background-size: 320px 320px, 420px 420px, 280px 280px, auto, auto, auto;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

:global(body)::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 10% 15%, rgba(255, 255, 255, 0.9) 0 0.8px, transparent 1px),
    radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.7) 0 0.8px, transparent 1px),
    radial-gradient(circle at 55% 25%, rgba(255, 255, 255, 0.85) 0 0.8px, transparent 1px),
    radial-gradient(circle at 75% 60%, rgba(255, 255, 255, 0.75) 0 0.8px, transparent 1px),
    radial-gradient(circle at 90% 20%, rgba(255, 255, 255, 0.8) 0 0.8px, transparent 1px),
    radial-gradient(circle at 20% 75%, rgba(255, 255, 255, 0.65) 0 0.8px, transparent 1px);
  background-size: 250px 250px, 320px 320px, 380px 380px, 420px 420px, 280px 280px, 360px 360px;
  opacity: 0.65;
}

:global(body)::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, transparent 0 55%, rgba(0, 0, 0, 0.28) 100%);
}

  .page {
    width: min(1120px, calc(100% - 32px));
    margin: 0 auto;
    padding: 24px 0 40px;
  }

  .hero {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }

  .hero-copy {
    min-width: 0;
  }

  .eyebrow {
    margin: 0 0 8px;
    font-size: 0.78rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #8ea4ff;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.2rem);
    line-height: 1.05;
  }

  .subtext {
    margin: 10px 0 0;
    max-width: 58ch;
    color: rgba(245, 247, 251, 0.72);
    line-height: 1.6;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    color: rgba(245, 247, 251, 0.9);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .badge-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #39d98a;
    box-shadow: 0 0 0 6px rgba(57, 217, 138, 0.14);
  }

  .grid {
    display: grid;
    grid-template-columns: 1.15fr 0.95fr;
    gap: 16px;
    margin-bottom: 16px;
  }

.card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.14),
    rgba(255, 255, 255, 0.06)
  );
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.16),
    rgba(255, 255, 255, 0.05) 35%,
    transparent 70%
  );
  pointer-events: none;
}

.card > * {
  position: relative;
  z-index: 1;
}

.profile-card {
  padding: 20px;
  border-radius: 24px;
}

.meta-box,
.stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.10),
    rgba(255, 255, 255, 0.04)
  );
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
}

.meta-box::before,
.stat-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.16),
    transparent 55%
  );
  pointer-events: none;
}

.meta-box > *,
.stat-card > * {
  position: relative;
  z-index: 1;
}

@media (max-width: 640px) {
  .page {
    width: 100%;
    padding: 14px 12px 24px;
    box-sizing: border-box;
  }

  .card {
    border-radius: 20px;
  }

  .profile-card {
    padding: 16px;
    border-radius: 20px;
  }

  .meta-box,
  .stat-card {
    border-radius: 16px;
  }

  .actions-card {
    padding: 16px;
    border-radius: 20px;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    min-width: 0;
  }
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.04) 35%,
    transparent 70%
  );
  pointer-events: none;
}

.card > * {
  position: relative;
  z-index: 1;
}

  .profile-card {
    padding: 20px;
  }

  .profile-top {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: 0.06em;
    color: #08111f;
    background: linear-gradient(135deg, #8ea4ff, #5df2c2);
    box-shadow: 0 10px 24px rgba(93, 242, 194, 0.18);
    flex: 0 0 auto;
  }

  .profile-info {
    min-width: 0;
  }

  h2 {
    margin: 0;
    font-size: 1.35rem;
    word-break: break-word;
  }

  .muted {
    margin: 6px 0 0;
    color: rgba(245, 247, 251, 0.68);
    word-break: break-word;
  }

  .divider {
    height: 1px;
    margin: 18px 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  }

  .profile-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

.meta-box,
.stat-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.10),
    rgba(255, 255, 255, 0.04)
  );
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}

  .label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.82rem;
    color: rgba(245, 247, 251, 0.56);
  }

.profile-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.meta-box {
  position: relative;
  overflow: hidden;
  min-height: 96px;
  padding: 16px 14px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.10),
    rgba(255, 255, 255, 0.04)
  );
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
}

.meta-box::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 55%);
  pointer-events: none;
}

.meta-box > * {
  position: relative;
  z-index: 1;
}

.label {
  display: block;
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.2;
  color: rgba(245, 247, 251, 0.72);
}

.meta-box strong {
  display: block;
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.25;
  color: #f5f7fb;
  word-break: break-word;
}

@media (max-width: 640px) {
  .profile-meta {
    grid-template-columns: 1fr;
  }

  .meta-box {
    min-height: 88px;
    padding: 14px 12px;
    border-radius: 16px;
  }

  .label {
    font-size: 0.78rem;
  }

  .meta-box strong {
    font-size: 1rem;
  }
}

  .stats-panel {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

.stat-card {
  min-height: 126px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(10, 16, 29, 0.38);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

  .stat-card.accent {
    background:
      radial-gradient(circle at top right, rgba(93, 242, 194, 0.14), transparent 38%),
      rgba(10, 16, 29, 0.78);
  }

  .stat-label {
    color: rgba(245, 247, 251, 0.66);
    font-size: 0.9rem;
  }

  .stat-value {
    font-size: 2rem;
    line-height: 1;
  }

  .actions-card {
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .actions-copy h3 {
    margin: 0;
    font-size: 1.15rem;
  }

  .actions-copy p {
    margin: 6px 0 0;
    color: rgba(245, 247, 251, 0.68);
  }

  .actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .btn {
    min-width: 140px;
    padding: 12px 16px;
    border-radius: 14px;
    text-align: center;
    text-decoration: none;
    font-weight: 700;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      background 0.18s ease,
      border-color 0.18s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .primary {
    color: #08111f;
    background: linear-gradient(135deg, #8ea4ff, #5df2c2);
    box-shadow: 0 12px 30px rgba(93, 242, 194, 0.16);
  }

  .secondary {
    color: #f5f7fb;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .secondary:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .stats-panel {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .actions-card {
      flex-direction: column;
      align-items: stretch;
    }

    .actions {
      justify-content: stretch;
    }

    .btn {
      flex: 1;
    }
  }

@media (max-width: 640px) {
  .page {
    width: 100%;
    padding: 14px 12px 24px;
    box-sizing: border-box;
  }

  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .card {
    border-radius: 18px;
  }

  .profile-card,
  .actions-card {
    padding: 14px;
  }

  .avatar {
    width: 52px;
    height: 52px;
    border-radius: 14px;
  }

  .profile-top {
    align-items: flex-start;
    gap: 12px;
  }

  .profile-meta,
  .stats-panel {
    grid-template-columns: 1fr;
  }

  .meta-box,
  .stat-card {
    border-radius: 14px;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    min-width: 0;
  }
.logout {
  color: #f5f7fb;
  background: rgba(255, 80, 80, 0.12);
  border: 1px solid rgba(255, 120, 120, 0.25);
  cursor: pointer;
  font: inherit;
}

.logout:hover {
  background: rgba(255, 80, 80, 0.2);
}

}
</style>