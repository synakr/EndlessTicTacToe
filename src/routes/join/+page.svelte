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

<div class="page">
  <div class="stars"></div>
  <div class="nebula nebula-1"></div>
  <div class="nebula nebula-2"></div>
  <div class="nebula nebula-3"></div>

  <div class="butterfly-field" aria-hidden="true">
    {#each butterflies as i}
      <span class="butterfly b{i + 1}"></span>
    {/each}
  </div>

  <div class="page-shell">
    <AuthLayout>
      <div slot="title" class="hero">
        <p class="eyebrow">Endless Tic Tac Toe</p>
        <h1>Join Game</h1>
        <p class="subtext">
          Enter your room code and jump straight into the battle.
        </p>
      </div>

      <div class="form-card">
        <form class="setup-form" on:submit|preventDefault={joinRoom}>
          <div class="field-group">
            <label for="room">Room Code</label>

            <input
              id="room"
              bind:value={roomCode}
              type="text"
              maxlength="8"
              placeholder="Enter Room Code"
              class="input"
            />
          </div>

          <button class="cta">
            Join Game
          </button>

          {#if errorMsg}
            <p class="error">{errorMsg}</p>
          {/if}
        </form>
      </div>

      <div slot="switch" class="switch-row">
        <a href="/dashboard">Create New Game</a>
      </div>
    </AuthLayout>
  </div>
</div>

<style>
.page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1.5rem;
}

.page-shell {
  width: 100%;
  max-width: 380px;
  z-index: 2;
}

/* ---------- Glass Card ---------- */

.form-card {
  position: relative;
  overflow: hidden;

  padding: 1.4rem;

  background: rgba(255,255,255,.08);
  backdrop-filter: blur(26px) saturate(180%);
  -webkit-backdrop-filter: blur(26px) saturate(180%);

  border: 1px solid rgba(255,255,255,.18);
  border-radius: 20px;

  box-shadow:
    0 20px 45px rgba(0,0,0,.28),
    inset 0 1px 0 rgba(255,255,255,.22);
}

/* shiny reflection */
.form-card::before {
  content: "";
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,.28),
      transparent 30%,
      transparent 70%,
      rgba(255,255,255,.08)
    );

  pointer-events: none;
}

/* ---------- Form ---------- */

.setup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  gap: .45rem;
}

label {
  color: rgba(255,255,255,.85);
  font-weight: 600;
  letter-spacing: .05em;
}

.hero {
  text-align: center;
  margin-bottom: 1.2rem;
}

.hero h1 {
  margin: .2rem 0;
  font-size: 2rem;
  line-height: 1.1;
}

.eyebrow {
  margin: 0;
  font-size: .8rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.subtext {
  margin: .4rem auto 0;
  font-size: .9rem;
  max-width: 280px;
  opacity: .8;
}

.input,
.cta {
  height: 48px;
  padding: 0 1rem;
  font-size: .95rem;
} 

.switch-row {
  margin-top: 1rem;
  text-align: center;
}

/* ---------- Glass Input ---------- */

.input {
  width: 100%;
  padding: 15px 18px;

  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.16);

  background: rgba(255,255,255,.08);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);

  color: white;
  text-align: center;

  text-transform: uppercase;
  letter-spacing: .2em;

  outline: none;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.18),
    inset 0 -1px 0 rgba(255,255,255,.04),
    0 12px 24px rgba(0,0,0,.18);

  transition: .25s ease;
}

.input::placeholder {
  color: rgba(255,255,255,.45);
}

.input:hover,
.input:focus {
  background: rgba(255,255,255,.12);
  border-color: rgba(255,255,255,.28);

  transform: translateY(-2px);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.25),
    0 18px 35px rgba(0,0,0,.25),
    0 0 18px rgba(120,170,255,.18);
}

/* ---------- Glass Button ---------- */

.cta {
  position: relative;
  overflow: hidden;

  padding: 15px;

  border: 1px solid rgba(255,255,255,.22);
  border-radius: 16px;

  color: white;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: .08em;

  cursor: pointer;

  background: rgba(255,255,255,.1);
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.22),
    0 18px 35px rgba(0,0,0,.22);

  transition: .25s ease;
}

.cta::before {
  content: "";
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      120deg,
      rgba(255,255,255,.35),
      transparent 35%
    );

  opacity: .7;
}

.cta:hover {
  transform: translateY(-3px);

  background: rgba(255,255,255,.15);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.28),
    0 25px 45px rgba(0,0,0,.28),
    0 0 25px rgba(130,170,255,.22);
}

.cta:active {
  transform: translateY(0);
}

/* ---------- Text ---------- */

.hero h1 {
  color: white;
  text-shadow: 0 0 25px rgba(255,255,255,.18);
}

.subtext,
.eyebrow,
.switch-row a {
  color: rgba(255,255,255,.75);
}

.switch-row a:hover {
  color: white;
}

.error {
  color: #ffb8c5;
  text-align: center;
  margin-top: .3rem;
}
</style>