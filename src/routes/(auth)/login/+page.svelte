<script lang="ts">
  import AuthLayout from '$lib/components/AuthLayout.svelte';

  let email = '';
  let password = '';
  let loading = false;
  let errorMsg = '';

  async function handleLogin() {
    loading = true;
    errorMsg = '';

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        window.location.href = '/dashboard';
      } else {
        errorMsg = await res.text();
      }
    } catch {
      errorMsg = 'Something went wrong. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<div class="page">
  <div class="stars"></div>
  <div class="nebula nebula-1"></div>
  <div class="nebula nebula-2"></div>
  <div class="nebula nebula-3"></div>

  <div class="page-shell">
    <AuthLayout>
      <div class="hero" slot="title">
        <p class="eyebrow">Tic Tac Toe Arena</p>
        <h1>Welcome Back</h1>
        <p class="subtext">
          Log in and jump back into your arena with the same calm glassy style.
        </p>
      </div>

      <div class="form-card">
        <form on:submit|preventDefault={handleLogin} class="login-form">
          <div class="field-group">
            <label for="email">Email</label>
            <input
              id="email"
              class="auth-input"
              type="email"
              placeholder="Email"
              bind:value={email}
              required
              autocomplete="email"
            />
          </div>

          <div class="field-group">
            <label for="password">Password</label>
            <input
              id="password"
              class="auth-input"
              type="password"
              placeholder="Password"
              bind:value={password}
              required
              autocomplete="current-password"
            />
          </div>

          <button class="auth-btn" disabled={loading} type="submit">
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {#if errorMsg}
            <p class="error">{errorMsg}</p>
          {/if}
        </form>
      </div>

      <div slot="switch" class="switch-row">
        Don’t have account?
        <a href="/signup" class="switch-link">Signup</a>
      </div>
    </AuthLayout>
  </div>
</div>

<style>
  :global(html),
  :global(body),
  :global(#app) {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    overflow: hidden;
    color: #f7f4ff;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
    background:
      radial-gradient(circle at top, rgba(138, 108, 255, 0.14), transparent 26%),
      linear-gradient(180deg, #02030a 0%, #050816 48%, #090818 100%);
  }

  .page {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    perspective: 1400px;
  }

  .page-shell {
    position: relative;
    z-index: 3;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .hero,
  .form-card,
  .switch-row {
    pointer-events: auto;
  }

  .stars {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      radial-gradient(circle at 12% 14%, rgba(255, 255, 255, 0.9) 0 1px, transparent 1.6px),
      radial-gradient(circle at 35% 22%, rgba(255, 255, 255, 0.7) 0 1px, transparent 1.6px),
      radial-gradient(circle at 58% 8%, rgba(255, 255, 255, 0.85) 0 1px, transparent 1.6px),
      radial-gradient(circle at 81% 18%, rgba(255, 255, 255, 0.7) 0 1px, transparent 1.6px),
      radial-gradient(circle at 18% 40%, rgba(255, 255, 255, 0.55) 0 1px, transparent 1.6px),
      radial-gradient(circle at 47% 30%, rgba(255, 255, 255, 0.7) 0 1px, transparent 1.6px),
      radial-gradient(circle at 74% 34%, rgba(255, 255, 255, 0.55) 0 1px, transparent 1.6px),
      radial-gradient(circle at 90% 44%, rgba(255, 255, 255, 0.78) 0 1px, transparent 1.6px),
      radial-gradient(circle at 22% 68%, rgba(255, 255, 255, 0.65) 0 1px, transparent 1.6px),
      radial-gradient(circle at 51% 62%, rgba(255, 255, 255, 0.8) 0 1px, transparent 1.6px),
      radial-gradient(circle at 78% 73%, rgba(255, 255, 255, 0.6) 0 1px, transparent 1.6px),
      radial-gradient(circle at 92% 82%, rgba(255, 255, 255, 0.8) 0 1px, transparent 1.6px);
    opacity: 0.55;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
  }

  .nebula {
    position: fixed;
    inset: auto;
    z-index: 0;
    pointer-events: none;
    filter: blur(26px);
    opacity: 0.7;
  }

  .nebula-1 {
    top: -8%;
    left: 10%;
    width: 22rem;
    height: 22rem;
    background: radial-gradient(circle, rgba(116, 98, 255, 0.24), transparent 68%);
  }

  .nebula-2 {
    top: 18%;
    right: 8%;
    width: 18rem;
    height: 18rem;
    background: radial-gradient(circle, rgba(255, 122, 179, 0.16), transparent 70%);
  }

  .nebula-3 {
    bottom: -8%;
    left: 28%;
    width: 24rem;
    height: 24rem;
    background: radial-gradient(circle, rgba(106, 231, 203, 0.12), transparent 70%);
  }

  .hero {
    position: relative;
    z-index: 4;
    width: min(520px, calc(100vw - 24px));
    margin: 5vh auto 0;
    padding: 20px 20px 18px;
    border-radius: 26px;
    background:
      linear-gradient(180deg, rgba(13, 28, 73, 0.92), rgba(8, 18, 44, 0.94));
    border: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow:
      0 28px 60px rgba(0, 0, 0, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    text-align: center;
  }

  .hero::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 26px;
    background:
      radial-gradient(circle at top left, rgba(116, 98, 255, 0.20), transparent 28%),
      radial-gradient(circle at top right, rgba(255, 255, 255, 0.08), transparent 20%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 45%);
    pointer-events: none;
  }

  .eyebrow {
    margin: 0 0 8px;
    color: #a9b8ff;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.76rem;
    font-weight: 700;
  }

  .hero h1 {
    margin: 0;
    font-size: clamp(1.7rem, 4vw, 2.5rem);
    line-height: 1.05;
    text-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  }

  .subtext {
    margin: 10px auto 0;
    max-width: 44ch;
    color: rgba(245, 247, 255, 0.76);
    line-height: 1.55;
    font-size: 0.95rem;
  }

  .form-card {
    position: relative;
    z-index: 4;
    width: min(520px, calc(100vw - 24px));
    margin: 12px auto 0;
    padding: 20px 20px 18px;
    border-radius: 26px;
    background:
      linear-gradient(180deg, rgba(8, 23, 54, 0.92), rgba(5, 14, 36, 0.96));
    border: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow:
      0 28px 60px rgba(0, 0, 0, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .form-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 26px;
    background:
      radial-gradient(circle at top, rgba(142, 154, 255, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 40%);
    pointer-events: none;
  }

  .login-form {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 12px;
  }

  .field-group {
    display: grid;
    gap: 7px;
  }

  .field-group label {
    color: rgba(247, 244, 255, 0.9);
    font-size: 0.92rem;
    font-weight: 600;
  }

  .auth-input {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    outline: none;
    color: #f7f4ff;
    background:
      linear-gradient(180deg, rgba(24, 52, 113, 0.92), rgba(17, 40, 90, 0.92));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 10px 20px rgba(0, 0, 0, 0.14);
    font-size: 1rem;
    transition:
      transform 0.16s ease,
      border-color 0.16s ease,
      box-shadow 0.16s ease;
  }

  .auth-input::placeholder {
    color: rgba(247, 244, 255, 0.62);
  }

  .auth-input:hover,
  .auth-input:focus {
    border-color: rgba(177, 188, 255, 0.42);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 14px 26px rgba(0, 0, 0, 0.18);
    transform: translateY(-1px);
  }

  .auth-btn {
    margin-top: 4px;
    width: 100%;
    height: 50px;
    border: 0;
    border-radius: 14px;
    background: linear-gradient(135deg, #ffffff 0%, #f4f0ff 100%);
    color: #11162b;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow:
      0 14px 28px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transition:
      transform 0.16s ease,
      box-shadow 0.16s ease,
      filter 0.16s ease,
      opacity 0.16s ease;
  }

  .auth-btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
  }

  .auth-btn:disabled {
    cursor: not-allowed;
    opacity: 0.75;
    transform: none;
  }

  .error {
    margin: 0;
    padding: 8px 10px;
    border-radius: 10px;
    background: rgba(255, 96, 96, 0.12);
    color: #ffbcc0;
    border: 1px solid rgba(255, 120, 120, 0.18);
    font-size: 0.92rem;
  }

  .switch-row {
    text-align: center;
    color: rgba(247, 244, 255, 0.82);
    font-size: 0.95rem;
  }

  .switch-link {
    margin-left: 6px;
    color: #ffffff;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding-bottom: 2px;
  }

  .switch-link:hover {
    opacity: 0.82;
  }

  @media (max-width: 640px) {
    .hero,
    .form-card {
      width: calc(100vw - 18px);
    }

    .hero {
      margin-top: 3.2vh;
      padding: 16px 14px 14px;
      border-radius: 22px;
    }

    .form-card {
      padding: 16px 14px 14px;
      border-radius: 22px;
    }

    .hero h1 {
      font-size: clamp(1.5rem, 7vw, 2rem);
    }

    .subtext {
      font-size: 0.9rem;
    }

    .auth-input {
      height: 46px;
      border-radius: 12px;
      font-size: 0.96rem;
    }

    .auth-btn {
      height: 48px;
      border-radius: 12px;
    }
  }
</style>