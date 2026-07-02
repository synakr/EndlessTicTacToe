<script lang="ts">
  import { onMount } from 'svelte';
  import AuthLayout from '$lib/components/AuthLayout.svelte';

  let gameMode: 'MULTI' | 'AI' | 'DEVICE' = 'MULTI';
  let boardSize: 3 | 4 | 5 = 3;
  let tieBreaker: 3 | 4 | 5 = 3;

  let loading = false;
  let errorMsg = '';

let heroBox: HTMLDivElement | null = null;
let formBox: HTMLDivElement | null = null;
let switchBox: HTMLDivElement | null = null;

  const butterflies = Array.from({ length: 8 }, (_, i) => i);

  type SkeletonItem = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotate: number;
    spin: number;
    popped: boolean;
  };

  let skeletons: SkeletonItem[] = [];

  const rand = (min: number, max: number) => min + Math.random() * (max - min);
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// function getNoFlyZone() {
//   const rects = [heroBox, formBox, switchBox]
//     .filter(Boolean)
//     .map((el) => el!.getBoundingClientRect());

//   if (!rects.length) return null;

//   return {
//     left: Math.min(...rects.map((r) => r.left)) - 24,
//     top: Math.min(...rects.map((r) => r.top)) - 24,
//     right: Math.max(...rects.map((r) => r.right)) + 24,
//     bottom: Math.max(...rects.map((r) => r.bottom)) + 24
//   };
// }

  function createSkeletons(width: number, height: number): SkeletonItem[] {
    const base = width < 640 ? 120 : 220;

    const seeds = [
      { x: width * 0.03, y: height * 0.12, vx: 0.42, vy: 0.22, size: 1.05, rotate: -8, spin: 0.03 },
      { x: width * 0.80, y: height * 0.16, vx: -0.36, vy: 0.25, size: 1.0, rotate: 10, spin: -0.02 },
      { x: width * 0.05, y: height * 0.56, vx: 0.34, vy: -0.18, size: 0.92, rotate: 7, spin: 0.025 },
      { x: width * 0.82, y: height * 0.62, vx: -0.38, vy: -0.20, size: 0.98, rotate: -10, spin: -0.03 },
      { x: width * 0.18, y: height * 0.80, vx: 0.28, vy: -0.16, size: 0.82, rotate: 4, spin: 0.02 }
    ];

    return seeds.map((s) => {
      const box = base * s.size;

      return {
        x: clamp(s.x, 0, Math.max(0, width - box - 8)),
        y: clamp(s.y, 0, Math.max(0, height - box - 8)),
        vx: s.vx * (Math.random() > 0.5 ? 1 : -1),
        vy: s.vy * (Math.random() > 0.5 ? 1 : -1),
        size: s.size,
        rotate: s.rotate,
        spin: s.spin * (Math.random() > 0.5 ? 1 : -1),
        popped: false
      };
    });
  }

function nudgeSkeleton(index: number, event: MouseEvent) {
  const target = event.currentTarget as HTMLElement | null;
  const rect = target?.getBoundingClientRect();

  const clickX = event.clientX;
  const clickY = event.clientY;

  const centerX = rect ? rect.left + rect.width / 2 : clickX;
  const centerY = rect ? rect.top + rect.height / 2 : clickY;

  const dx = centerX - clickX;
  const dy = centerY - clickY;
  const dist = Math.hypot(dx, dy) || 1;

  const pushX = (dx / dist) * 2.5;
  const pushY = (dy / dist) * 2.5;

  skeletons = skeletons.map((s, i) => {
    if (i !== index) return s;

    return {
      ...s,
      x: s.x + (dx / dist) * 45 + rand(-12, 12),
      y: s.y + (dy / dist) * 45 + rand(-12, 12),
      vx: s.vx + pushX + rand(-0.4, 0.4),
      vy: s.vy + pushY + rand(-0.4, 0.4),
      rotate: s.rotate + rand(-18, 18),
      spin: s.spin + rand(-0.06, 0.06),
      popped: true
    };
  });

  window.setTimeout(() => {
    skeletons = skeletons.map((s, i) => (i === index ? { ...s, popped: false } : s));
  }, 220);
}
  async function createGame() {
    errorMsg = '';
    loading = true;

    try {
      const res = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameMode, boardSize, tieBreaker })
      });

      if (!res.ok) throw new Error(await res.text());

      const { roomCode } = await res.json();
      window.location.href = `/game/${roomCode}`;
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Failed to create game';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    skeletons = createSkeletons(window.innerWidth, window.innerHeight);

    const handleResize = () => {
      skeletons = createSkeletons(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - last) / 16.6667, 2);
      last = now;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const base = width < 640 ? 120 : 220;

      skeletons = skeletons.map((s) => {
        const box = base * s.size;
        const maxX = Math.max(0, width - box - 8);
        const maxY = Math.max(0, height - box - 8);

        let x = s.x + s.vx * dt;
        let y = s.y + s.vy * dt;
        let vx = s.vx;
        let vy = s.vy;
        let rotate = s.rotate + s.spin * dt;

        if (x <= 0 || x >= maxX) {
          vx = -vx;
          x = clamp(x, 0, maxX);
          rotate += 6;
        }

        if (y <= 0 || y >= maxY) {
          vy = -vy;
          y = clamp(y, 0, maxY);
          rotate -= 4;
        }

// const zone = getNoFlyZone();

// if (zone) {
//   const cx = x + box / 2;
//   const cy = y + box / 2;

//   const inside =
//     cx > zone.left &&
//     cx < zone.right &&
//     cy > zone.top &&
//     cy < zone.bottom;

//   if (inside) {
//     const distLeft = Math.abs(cx - zone.left);
//     const distRight = Math.abs(zone.right - cx);
//     const distTop = Math.abs(cy - zone.top);
//     const distBottom = Math.abs(zone.bottom - cy);

//     const nearest = Math.min(distLeft, distRight, distTop, distBottom);

//     if (nearest === distLeft) {
//       x = zone.left - box - 12;
//       vx = -Math.abs(vx);
//     } else if (nearest === distRight) {
//       x = zone.right + 12;
//       vx = Math.abs(vx);
//     } else if (nearest === distTop) {
//       y = zone.top - box - 12;
//       vy = -Math.abs(vy);
//     } else {
//       y = zone.bottom + 12;
//       vy = Math.abs(vy);
//     }
//   }
// }

        return { ...s, x, y, vx, vy, rotate };
      });

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<svelte:head>
  <title>Game Setup</title>
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

  <div class="skeleton-field" aria-hidden="true">
    {#each skeletons as s, i}
      <button
        type="button"
        class:pop={s.popped}
        class="skeleton-wrap"
        style={`top:${s.y}px; left:${s.x}px; transform: scale(${s.size}) rotate(${s.rotate}deg);`}
on:click={(e) => nudgeSkeleton(i, e)}
        aria-label="Floating skeleton decoration"
      >
        <span class="skeleton-glow"></span>
        <img src="/img/skeleton.png" alt="" class="skeleton-img" />
      </button>
    {/each}
  </div>

  <div class="page-shell">
    <AuthLayout>
<div class="hero" slot="title" bind:this={heroBox}>
          <p class="eyebrow">Endless Tic Tac Toe</p>
        <h1>Game Setup</h1>
        <p class="subtext">
          Build your arena, pick the board, and jump into a polished multiplayer battle.
        </p>
      </div>

<div class="form-card" bind:this={formBox}>
          <form on:submit|preventDefault={createGame} class="setup-form">
          <div class="field-group">
            <label for="mode">Game Mode</label>
            <div class="select-wrap">
              <select id="mode" bind:value={gameMode} class="select">
                <option value="AI">Computer</option>
                <option value="DEVICE">Friend</option>
                <option value="MULTI">Multiplayer</option>
              </select>
            </div>
          </div>

          <div class="field-group">
            <label for="board">Board Size</label>
            <div class="select-wrap">
              <select id="board" bind:value={boardSize} class="select">
                <option value={3}>3 × 3</option>
                <option value={4}>4 × 4</option>
                <option value={5}>5 × 5</option>
              </select>
            </div>
          </div>

          <div class="field-group">
            <label for="win">Win Length</label>
            <div class="select-wrap">
              <select id="win" bind:value={tieBreaker} class="select">
                <option value={3}>Connect 3</option>
                <option value={4}>Connect 4</option>
                <option value={5}>Connect 5</option>
              </select>
            </div>
          </div>

          <button class="cta" disabled={loading}>
            {loading ? 'Creating...' : 'Create Game'}
          </button>

          {#if errorMsg}
            <p class="error">{errorMsg}</p>
          {/if}
        </form>
      </div>

<div slot="switch" class="switch-row" bind:this={switchBox}>
          <a href="/join">Join with Room Code</a>
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

.butterfly-field,
.skeleton-field {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.skeleton-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
  outline: none;
  touch-action: manipulation;
  transform-origin: center center;
  will-change: transform, top, left;
  z-index: 1;
}
  .butterfly {
    position: absolute;
    width: 26px;
    height: 18px;
    transform-style: preserve-3d;
    filter: drop-shadow(0 10px 12px rgba(0, 0, 0, 0.25));
    animation: flutter 10s linear infinite;
    opacity: 0.92;
  }

  .butterfly::before,
  .butterfly::after {
    content: "";
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    border-radius: 100% 0 100% 0;
    background:
      radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.85), transparent 28%),
      linear-gradient(145deg, rgba(255, 200, 242, 0.95), rgba(140, 120, 255, 0.72));
    transform-origin: center right;
    box-shadow:
      inset 0 0 12px rgba(255, 255, 255, 0.18),
      0 0 18px rgba(255, 120, 200, 0.14);
  }

  .butterfly::after {
    left: 50%;
    transform-origin: center left;
    border-radius: 0 100% 0 100%;
  }

  .butterfly {
    transform: translate3d(0, 0, 20px);
    animation-name: flutter, drift;
    animation-duration: 1.1s, 14s;
    animation-timing-function: ease-in-out, linear;
    animation-iteration-count: infinite, infinite;
  }

  .butterfly.b1 { top: 16%; left: 12%; animation-delay: 0s, 0s; }
  .butterfly.b2 { top: 22%; left: 74%; animation-delay: .3s, 1s; }
  .butterfly.b3 { top: 38%; left: 18%; animation-delay: .6s, 2s; }
  .butterfly.b4 { top: 48%; left: 86%; animation-delay: .2s, 3s; }
  .butterfly.b5 { top: 64%; left: 10%; animation-delay: .8s, 4s; }
  .butterfly.b6 { top: 72%; left: 66%; animation-delay: .1s, 5s; }
  .butterfly.b7 { top: 80%; left: 28%; animation-delay: .5s, 6s; }
  .butterfly.b8 { top: 12%; left: 48%; animation-delay: .4s, 1.5s; }

.skeleton-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
  outline: none;
  touch-action: manipulation;
  transform-origin: center center;
  will-change: transform, top, left;
  z-index: 6;
}

  .skeleton-wrap.pop .skeleton-img {
    animation: pop 220ms ease-out;
  }

  .skeleton-glow {
    position: absolute;
    inset: -18%;
    border-radius: 28px;
    background:
      radial-gradient(circle at center, rgba(255, 255, 255, 0.18), transparent 42%),
      radial-gradient(circle at center, rgba(160, 150, 255, 0.12), transparent 62%);
    filter: blur(10px);
    z-index: 0;
  }

  .skeleton-img {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: auto;
    user-select: none;
    pointer-events: none;
    opacity: 1;
    filter:
      brightness(1.85)
      saturate(1.6)
      contrast(1.06)
      drop-shadow(0 0 14px rgba(255, 255, 255, 0.12))
      drop-shadow(0 0 28px rgba(138, 108, 255, 0.22));
    mix-blend-mode: screen;
  }

  .hero {
    position: relative;
    z-index: 4;
    width: min(560px, calc(100vw - 28px));
    margin: 5vh auto 0;
    padding: 24px 22px 20px;
    border-radius: 28px;
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
    border-radius: 28px;
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
    font-size: clamp(1.9rem, 4.2vw, 2.8rem);
    line-height: 1.05;
    text-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  }

  .subtext {
    margin: 12px auto 0;
    max-width: 44ch;
    color: rgba(245, 247, 255, 0.76);
    line-height: 1.6;
    font-size: 0.98rem;
  }

  .form-card {
    position: relative;
    z-index: 4;
    width: min(560px, calc(100vw - 28px));
    margin: 14px auto 0;
    padding: 24px 22px 22px;
    border-radius: 28px;
    background:
      linear-gradient(180deg, rgba(8, 23, 54, 0.92), rgba(5, 14, 36, 0.96));
    border: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow:
      0 28px 60px rgba(0, 0, 0, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    transform: translateZ(0);
  }

  .form-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 28px;
    background:
      radial-gradient(circle at top, rgba(142, 154, 255, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 40%);
    pointer-events: none;
  }

  .setup-form {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 14px;
  }

  .field-group {
    display: grid;
    gap: 8px;
  }

  .field-group label {
    color: rgba(247, 244, 255, 0.9);
    font-size: 0.95rem;
    font-weight: 600;
  }

  .select-wrap {
    position: relative;
  }

  .select-wrap::after {
    content: "⌄";
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-58%);
    color: rgba(247, 244, 255, 0.72);
    pointer-events: none;
    font-size: 1rem;
  }

.select {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  padding: 14px 16px;
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
.select {
  color-scheme: dark;
}

.select option {
  background: #11285a;
  color: #f7f4ff;
}

.select option:checked,
.select option:hover {
  background: #1f4fa6;
  color: #ffffff;
}
  .select:hover,
  .select:focus {
    border-color: rgba(177, 188, 255, 0.42);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 14px 26px rgba(0, 0, 0, 0.18);
  }

  .cta {
    margin-top: 4px;
    width: 100%;
    padding: 14px 16px;
    border: 0;
    border-radius: 14px;
    background:
      linear-gradient(135deg, #ffffff 0%, #f4f0ff 100%);
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
      filter 0.16s ease;
  }

  .cta:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
  }

  .cta:disabled {
    cursor: not-allowed;
    opacity: 0.75;
    transform: none;
  }

  .error {
    margin: 0;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255, 96, 96, 0.12);
    color: #ffbcc0;
    border: 1px solid rgba(255, 120, 120, 0.18);
    font-size: 0.92rem;
  }

  .switch-row {
    position: relative;
    z-index: 4;
    width: min(560px, calc(100vw - 28px));
    margin: 14px auto 0;
    text-align: center;
    color: rgba(247, 244, 255, 0.82);
  }

  .switch-row a {
    color: #ffffff;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding-bottom: 2px;
    transition: opacity 0.16s ease;
  }

  .switch-row a:hover {
    opacity: 0.82;
  }

  @keyframes flutter {
    0%,
    100% {
      transform: rotateZ(-8deg) scaleX(1);
    }
    50% {
      transform: rotateZ(8deg) scaleX(0.86);
    }
  }

  @keyframes drift {
    0% {
      translate: 0 0;
    }
    25% {
      translate: 18px -10px;
    }
    50% {
      translate: 38px 8px;
    }
    75% {
      translate: 16px 18px;
    }
    100% {
      translate: 0 0;
    }
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08) rotate(2deg);
    }
    100% {
      transform: scale(1);
    }
  }

  @media (max-width: 640px) {

    .hero {
      margin-top: 3.2vh;
      padding: 18px 16px 16px;
      border-radius: 22px;
    }

    .form-card {
      padding: 18px 16px;
      border-radius: 22px;
    }

    .hero h1 {
      font-size: clamp(1.6rem, 7vw, 2.2rem);
    }

    .subtext {
      font-size: 0.92rem;
    }

    .select {
      padding: 13px 14px;
      border-radius: 12px;
    }

    .cta {
      padding: 13px 14px;
    }

    .skeleton-wrap {
      width: 120px;
      filter:
        drop-shadow(0 22px 18px rgba(0, 0, 0, 0.24))
        drop-shadow(0 0 16px rgba(255, 255, 255, 0.08));
    }

    .skeleton-img {
      filter:
        brightness(2)
        saturate(1.7)
        contrast(1.08)
        drop-shadow(0 0 16px rgba(255, 255, 255, 0.14))
        drop-shadow(0 0 30px rgba(138, 108, 255, 0.24));
    }

    .butterfly {
      width: 20px;
      height: 14px;
      opacity: 0.65;
    }

    .butterfly.b1 { top: 12%; left: 8%; }
    .butterfly.b2 { top: 18%; left: 78%; }
    .butterfly.b3 { top: 34%; left: 14%; }
    .butterfly.b4 { top: 46%; left: 86%; }
    .butterfly.b5 { top: 62%; left: 10%; }
    .butterfly.b6 { top: 70%; left: 68%; }
    .butterfly.b7 { top: 78%; left: 24%; }
    .butterfly.b8 { top: 10%; left: 48%; }
  }
</style>