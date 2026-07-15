<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const butterflies = Array.from({ length: 8 }, (_, i) => i);

	type ShootingStar = {
		id: number;
		x: number;
		y: number;
		angle: number;
	};

	let shootingStars = $state<ShootingStar[]>([]);

	function spawnShootingStar(e: MouseEvent) {
		const target = e.target as HTMLElement;

		// Don't spawn when interacting with UI elements.
		if (
			target.closest(
				'button, a, input, select, textarea, label, [role="button"]'
			)
		) {
			return;
		}

		const id = Date.now() + Math.random();

		shootingStars = [
			...shootingStars,
			{
				id,
				x: e.clientX,
				y: e.clientY,
				angle: -35 + Math.random() * 20
			}
		];

		setTimeout(() => {
			shootingStars = shootingStars.filter((s) => s.id !== id);
		}, 900);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:body on:click={spawnShootingStar} />

<div class="layout">
	<div class="stars"></div>

	<div class="nebula nebula-1"></div>
	<div class="nebula nebula-2"></div>
	<div class="nebula nebula-3"></div>

	<div class="butterfly-field" aria-hidden="true">
		{#each butterflies as i}
			<span class="butterfly b{i + 1}"></span>
		{/each}
	</div>

	<div class="shooting-field" aria-hidden="true">
		{#each shootingStars as star (star.id)}
			<div
				class="shooting-star"
				style={`left:${star.x}px; top:${star.y}px; --angle:${star.angle}deg;`}
			></div>
		{/each}
	</div>

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	:global(html),
	:global(body) {
		width: 100%;
		min-height: 100%;
		margin: 0;
	}

	:global(#app) {
		width: 100%;
		min-height: 100vh;
		overflow-x: hidden;
	}

	.layout {
		position: relative;
		min-height: 100vh;

		/* only hide horizontal overflow */
		overflow-x: hidden;
		overflow-y: visible;

		background:
			radial-gradient(circle at top, rgba(138, 108, 255, 0.14), transparent 26%),
			linear-gradient(180deg, #02030a 0%, #050816 48%, #090818 100%);
	}

	.content {
		position: relative;
		z-index: 3;
		min-height: inherit;
	}

	.stars {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;

		background-image:
			radial-gradient(circle at 12% 14%, rgba(255,255,255,.9) 0 1px, transparent 1.6px),
			radial-gradient(circle at 35% 22%, rgba(255,255,255,.7) 0 1px, transparent 1.6px),
			radial-gradient(circle at 58% 8%, rgba(255,255,255,.85) 0 1px, transparent 1.6px),
			radial-gradient(circle at 81% 18%, rgba(255,255,255,.7) 0 1px, transparent 1.6px),
			radial-gradient(circle at 18% 40%, rgba(255,255,255,.55) 0 1px, transparent 1.6px),
			radial-gradient(circle at 47% 30%, rgba(255,255,255,.7) 0 1px, transparent 1.6px),
			radial-gradient(circle at 74% 34%, rgba(255,255,255,.55) 0 1px, transparent 1.6px),
			radial-gradient(circle at 90% 44%, rgba(255,255,255,.78) 0 1px, transparent 1.6px),
			radial-gradient(circle at 22% 68%, rgba(255,255,255,.65) 0 1px, transparent 1.6px),
			radial-gradient(circle at 51% 62%, rgba(255,255,255,.8) 0 1px, transparent 1.6px),
			radial-gradient(circle at 78% 73%, rgba(255,255,255,.6) 0 1px, transparent 1.6px),
			radial-gradient(circle at 92% 82%, rgba(255,255,255,.8) 0 1px, transparent 1.6px);

		opacity: .55;
		filter: drop-shadow(0 0 8px rgba(255,255,255,.15));
	}

	.nebula {
		position: fixed;
		pointer-events: none;
		z-index: 0;
		filter: blur(26px);
		opacity: .7;
	}

	.nebula-1 {
		top: -8%;
		left: 10%;
		width: 22rem;
		height: 22rem;
		background: radial-gradient(circle, rgba(116,98,255,.24), transparent 68%);
	}

	.nebula-2 {
		top: 18%;
		right: 8%;
		width: 18rem;
		height: 18rem;
		background: radial-gradient(circle, rgba(255,122,179,.16), transparent 70%);
	}

	.nebula-3 {
		bottom: -8%;
		left: 28%;
		width: 24rem;
		height: 24rem;
		background: radial-gradient(circle, rgba(106,231,203,.12), transparent 70%);
	}

	.butterfly-field {
		position: fixed;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}

	.butterfly {
		position: absolute;
		width: 26px;
		height: 18px;
		transform-style: preserve-3d;
		filter: drop-shadow(0 10px 12px rgba(0,0,0,.25));
		opacity: .92;

		transform: translate3d(0,0,20px);

		animation-name: flutter, drift;
		animation-duration: 1.1s, 14s;
		animation-timing-function: ease-in-out, linear;
		animation-iteration-count: infinite;
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
			radial-gradient(circle at 35% 35%, rgba(255,255,255,.85), transparent 28%),
			linear-gradient(145deg, rgba(255,200,242,.95), rgba(140,120,255,.72));

		transform-origin: center right;

		box-shadow:
			inset 0 0 12px rgba(255,255,255,.18),
			0 0 18px rgba(255,120,200,.14);
	}

	.butterfly::after {
		left: 50%;
		transform-origin: center left;
		border-radius: 0 100% 0 100%;
	}

	.b1 { top: 16%; left: 12%; animation-delay: 0s,0s; }
	.b2 { top: 22%; left: 74%; animation-delay: .3s,1s; }
	.b3 { top: 38%; left: 18%; animation-delay: .6s,2s; }
	.b4 { top: 48%; left: 86%; animation-delay: .2s,3s; }
	.b5 { top: 64%; left: 10%; animation-delay: .8s,4s; }
	.b6 { top: 72%; left: 66%; animation-delay: .1s,5s; }
	.b7 { top: 80%; left: 28%; animation-delay: .5s,6s; }
	.b8 { top: 12%; left: 48%; animation-delay: .4s,1.5s; }

	.shooting-field {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 2;
	}

	.shooting-star {
		position: absolute;
		width: 140px;
		height: 2px;
		transform-origin: left center;

		background: linear-gradient(
			90deg,
			#ffffff 0%,
			rgba(255,255,255,.9) 10%,
			rgba(173,216,255,.6) 35%,
			transparent 100%
		);

		border-radius: 999px;

		filter:
			drop-shadow(0 0 6px white)
			drop-shadow(0 0 16px rgba(150,200,255,.9));

		animation: shoot .9s ease-out forwards;
	}

	.shooting-star::before {
		content: "";
		position: absolute;
		left: -3px;
		top: 50%;
		width: 8px;
		height: 8px;

		transform: translateY(-50%);
		border-radius: 50%;

		background: white;

		box-shadow:
			0 0 8px white,
			0 0 18px rgba(180,220,255,.9);
	}

	@keyframes shoot {
		0% {
			opacity: 1;
			transform:
				rotate(var(--angle))
				translateX(0)
				scaleX(.35);
		}

		15% {
			opacity: 1;
		}

		100% {
			opacity: 0;
			transform:
				rotate(var(--angle))
				translateX(-320px)
				scaleX(1);
		}
	}

	@keyframes flutter {
		0%,100% {
			transform: rotateZ(-8deg) scaleX(1);
		}
		50% {
			transform: rotateZ(8deg) scaleX(.86);
		}
	}

	@keyframes drift {
		0% { translate: 0 0; }
		25% { translate: 18px -10px; }
		50% { translate: 38px 8px; }
		75% { translate: 16px 18px; }
		100% { translate: 0 0; }
	}

	@media (max-width:640px) {
		.butterfly {
			width:20px;
			height:14px;
			opacity:.65;
		}

		.b1 { top:12%; left:8%; }
		.b2 { top:18%; left:78%; }
		.b3 { top:34%; left:14%; }
		.b4 { top:46%; left:86%; }
		.b5 { top:62%; left:10%; }
		.b6 { top:70%; left:68%; }
		.b7 { top:78%; left:24%; }
		.b8 { top:10%; left:48%; }
	}
</style>