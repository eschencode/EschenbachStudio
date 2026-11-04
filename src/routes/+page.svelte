<script>
	import { onMount } from 'svelte';
	import { PROFILE, PROJECTS, HUB_CATEGORIES } from '$lib/data/projects.js';

	const NAV_SECTIONS = [
		{ id: 'intro', num: '1.', label: 'Intro' },
		{ id: 'philosophy', num: '2.', label: 'Philosophy' },
		{ id: 'expertise', num: '3.', label: 'Expertise' },
		{ id: 'contact', num: '4.', label: 'Contact' }
	];

	const CAPABILITIES = [
		{
			number: '01',
			title: 'Full-Stack Web Applications',
			subtitle: 'End-to-End Product Engineering',
			description:
				'Architecting fast, resilient web platforms from database schema and real-time WebSocket layers to polished, accessible interfaces.',
			tags: ['SvelteKit', 'TypeScript', 'Node / Edge', 'Real-Time State', 'REST & WebSockets']
		},
		{
			number: '02',
			title: 'Modern Frontend & Interactive UI',
			subtitle: 'Design Engineering & Motion',
			description:
				'Translating complex data and brand narratives into fluid, tactile interfaces—where typography, motion, and performance reinforce each other.',
			tags: ['Svelte 5', 'Canvas 2D / WebGL', 'Scrollytelling', 'Design Systems', 'Fluid CSS']
		},
		{
			number: '03',
			title: 'Systems Rigor & Sustainable Tech',
			subtitle: 'Foundations Built from First Principles',
			description:
				'Combining low-level systems discipline (C/C++, custom servers, Alpine Linux) with lean, responsible digital architecture that minimizes bloat.',
			tags: ['Docker & Alpine', 'Cloudflare Workers', 'C / C++ Foundations', 'Lean Architecture', 'OAuth2']
		}
	];

	let scrollY = $state(0);
	let innerHeight = $state(900);
	let activeSectionId = $state('intro');

	let hoveredLogo = $state(/** @type {string} */ ('none'));
	let scrollLogo = $state(/** @type {string} */ ('none'));

	/** @type {HTMLElement | null} */
	let chapter42El = $state(null);
	/** @type {HTMLElement | null} */
	let chapterUmEl = $state(null);
	/** @type {HTMLElement | null} */
	let expertiseStageEl = $state(null);
	/** @type {HTMLElement | null} */
	let highlightedWorkEl = $state(null);

	let artStageProgress = $state(0);
	let artBlendOutProgress = $state(0);

	// Hover overrides scroll; otherwise scroll drives the active logo expansion
	let activeLogo = $derived(hoveredLogo !== 'none' ? hoveredLogo : scrollLogo);

	// 0 at top -> 1 as "Eschenbach Studio" + intro text scroll up onto the sticky hero image
	let heroIntroProgress = $derived.by(() => {
		const raw = (scrollY - innerHeight * 0.03) / (innerHeight * 0.52);
		return Math.min(1, Math.max(0, raw));
	});

	// Contact form state
	let senderName = $state('');
	let senderEmail = $state('');
	let projectScope = $state('');
	let formSubmitted = $state(false);

	/**
	 * @param {SubmitEvent} e
	 */
	function handleContactSubmit(e) {
		e.preventDefault();
		const subject = encodeURIComponent(
			`Project Inquiry — ${senderName || 'New Client'} via Eschenbach Studio`
		);
		const body = encodeURIComponent(
			`Hi Linus,\n\n${projectScope}\n\n—\nName: ${senderName}\nEmail: ${senderEmail}`
		);
		window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
		formSubmitted = true;
	}

	const featuredProjects = PROJECTS.filter((p) => p.featured).slice(0, 4);

	onMount(() => {
		const handleScrollAndResize = () => {
			innerHeight = window.innerHeight;
			const triggerLine = window.innerHeight * 0.42;
			for (let i = NAV_SECTIONS.length - 1; i >= 0; i--) {
				const el = document.getElementById(NAV_SECTIONS[i].id);
				if (el) {
					const rect = el.getBoundingClientRect();
					if (rect.top <= triggerLine) {
						activeSectionId = NAV_SECTIONS[i].id;
						break;
					}
				}
			}

			// Scroll-driven logo state in 2. Philosophy:
			// Both -> 42 when 42 chapter is centered -> UM when UM chapter is centered -> Both again
			if (chapter42El && chapterUmEl) {
				const rect42 = chapter42El.getBoundingClientRect();
				const rectUm = chapterUmEl.getBoundingClientRect();
				const center42 = rect42.top + rect42.height / 2;
				const centerUm = rectUm.top + rectUm.height / 2;

				const bandTop = window.innerHeight * 0.34;
				const bandBottom = window.innerHeight * 0.68;

				const in42Band = center42 >= bandTop && center42 <= bandBottom;
				const inUmBand = centerUm >= bandTop && centerUm <= bandBottom;

				if (in42Band && inUmBand) {
					const dist42 = Math.abs(center42 - window.innerHeight * 0.5);
					const distUm = Math.abs(centerUm - window.innerHeight * 0.5);
					scrollLogo = dist42 <= distUm ? '42' : 'um';
				} else if (in42Band) {
					scrollLogo = '42';
				} else if (inUmBand) {
					scrollLogo = 'um';
				} else {
					scrollLogo = 'none';
				}
			}

			// Scroll-driven progress for 3. Expertise (/images/art.jpeg stage):
			// 0 when the sticky picture reaches top (with right-aligned title underneath it),
			// -> 1 as the right-aligned title and expertise content scroll up onto /images/art.jpeg
			if (expertiseStageEl) {
				const rect = expertiseStageEl.getBoundingClientRect();
				const stickyTopPx = 32;
				const scrolledPastPin = stickyTopPx - rect.top;
				const raw = scrolledPastPin / (window.innerHeight * 0.48);
				artStageProgress = Math.min(1, Math.max(0, raw));
			}

			// Blend /images/art.jpeg completely out to pure #000000 black as we reach Highlighted Work
			if (highlightedWorkEl) {
				const hwRect = highlightedWorkEl.getBoundingClientRect();
				const fadeStart = window.innerHeight * 0.95;
				const fadeEnd = window.innerHeight * 0.52;
				const rawFade = (fadeStart - hwRect.top) / Math.max(1, fadeStart - fadeEnd);
				artBlendOutProgress = Math.min(1, Math.max(0, rawFade));
			}
		};

		handleScrollAndResize();
		window.addEventListener('scroll', handleScrollAndResize, { passive: true });
		window.addEventListener('resize', handleScrollAndResize);
		return () => {
			window.removeEventListener('scroll', handleScrollAndResize);
			window.removeEventListener('resize', handleScrollAndResize);
		};
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

<!-- Slim Far-Right Navigation Rail ('1.', '2.', '3.', '4.' + bar) that Expands to Full Labels on Hover -->
<nav class="side-nav" aria-label="Section navigation">
	<ul class="side-nav-list">
		{#each NAV_SECTIONS as sec}
			<li>
				<a
					href="#{sec.id}"
					class="side-nav-link"
					class:active={activeSectionId === sec.id}
				>
					<span class="side-nav-label">{sec.label}</span>
					<span class="side-nav-num">{sec.num}</span>
					<span class="side-nav-bar"></span>
				</a>
			</li>
		{/each}
	</ul>

	<a href="/archive" class="side-nav-archive" aria-label="Open Project Archive">
		<span class="side-nav-archive-label">Archive</span>
		<span class="side-nav-archive-icon">↗</span>
	</a>
</nav>

<!-- Pure Black Foreground Narrative Stream (Full Symmetric Immersion for Big Pictures) -->
<div class="narrative-stream">
	<!-- 1. INTRO: Sticky Un-Rounded Hero Picture + "Eschenbach Studio" under it rising onto the picture with bio -->
	<section class="hero-scroll-stage" id="intro">
		<div class="hero-stage-container">
			<!-- Sticky Sharp-Edged Hero Image -->
			<div class="hero-sticky-picture">
				<img
					src="/images/hero.webp"
					alt="Eschenbach Studio — Forest Artwork"
					class="hero-main-img"
					style="transform: scale({(1 + heroIntroProgress * 0.035).toFixed(4)});"
				/>
				<!-- Dark veil that deepens as the text scrolls up over the image -->
				<div
					class="hero-image-veil"
					style="opacity: {(heroIntroProgress * 0.76).toFixed(3)};"
				></div>
			</div>

			<!-- Text block that starts directly UNDER the image, and scrolls UP onto the image -->
			<div class="hero-rising-text">
				<div class="hero-title-row">
					<h1 class="hero-brand-title">Eschenbach Studio</h1>
					<span
						class="hero-scroll-hint"
						style="opacity: {Math.max(0, 1 - heroIntroProgress * 2.2).toFixed(2)};"
					>
						Scroll ↓
					</span>
				</div>

				<!-- Appears under Eschenbach Studio and glides onto the image with it -->
				<div
					class="hero-emerging-bio"
					style="opacity: {heroIntroProgress.toFixed(3)}; transform: translateY({(
						(1 - heroIntroProgress) *
						24
					).toFixed(1)}px);"
				>
					<p class="hero-overlay-prose">
						An independent software studio led by <strong>Linus Eschenbach</strong>—partnering with
						founders, teams, and visionaries to turn ambitious ideas and complex technical
						challenges into enduring digital products. <strong>Open for new collaborations.</strong>
					</p>

					<div class="hero-overlay-actions">
						<a href="#contact" class="btn-primary">
							<span>Start a Collaboration</span>
							<span>↓</span>
						</a>
						<a href="#expertise" class="btn-ghost">
							<span>Explore Expertise &amp; Work</span>
							<span>↓</span>
						</a>
						<a href="/archive" class="btn-ghost">
							<span>Open Project Archive</span>
							<span>↗</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 2. PHILOSOPHY: 42 Berlin -> Maastricht University + Scroll & Hover Diagonal Split Logo Square -->
	<section class="scroll-beat philosophy-beat" id="philosophy">
		<div class="beat-container">
			<div class="split-editorial">
				<div class="editorial-text">
					<div class="section-tag">2. Philosophy</div>
					<h2 class="section-heading">
						Forged in first principles. <em>Guided by sustainable impact.</em>
					</h2>

					<div
						class="philosophy-chapter"
						class:highlighted={activeLogo === '42'}
						bind:this={chapter42El}
					>
						<span class="chapter-meta">01 // 42 BERLIN — THE CRAFT</span>
						<p class="body-prose">
							My engineering foundation began at <strong>42 Berlin</strong>—an intensive,
							peer-driven environment with no teachers or shortcuts. Building UNIX shells, HTTP
							servers, and 3D engines from scratch in C and C++ taught me to understand software
							from the ground up: lean, resilient, and free of unnecessary abstraction.
						</p>
					</div>

					<div
						class="philosophy-chapter"
						class:highlighted={activeLogo === 'um'}
						bind:this={chapterUmEl}
					>
						<span class="chapter-meta">02 // MAASTRICHT UNIVERSITY — THE PURPOSE</span>
						<p class="body-prose">
							Now in <strong>Maastricht</strong>, I am expanding that technical rigor into a wider
							perspective—examining the real-world impact of digital systems and how we engineer
							<strong>responsible, sustainable technology</strong>. Great software shouldn’t just
							execute fast; it should respect human attention, endure over time, and serve a
							meaningful purpose.
						</p>
					</div>
				</div>

				<!-- Sticky Diagonal Split Logo Square (Top-Left to Bottom-Right Diagonal) -->
				<div class="logo-split-wrapper">
					<div
						class="logo-split-square"
						class:expand-42={activeLogo === '42'}
						class:expand-um={activeLogo === 'um'}
						onmouseleave={() => (hoveredLogo = 'none')}
						role="group"
						aria-label="42 Berlin and Maastricht University interactive emblem"
					>
						<!-- 42 Berlin Layer (Bottom-Left Triangle by default, Full Square when active) -->
						<div class="logo-layer layer-42">
							<img src="/images/42.jpg" alt="42 Berlin" />
							<div class="logo-caption caption-left">
								<span class="mono-label">42 BERLIN</span>
								<span>First-Principles Systems & Peer Engineering</span>
							</div>
						</div>

						<!-- Maastricht University Layer (Top-Right Triangle by default, Full Square when active) -->
						<div class="logo-layer layer-um">
							<img src="/images/um.jpeg" alt="Maastricht University" />
							<div class="logo-caption caption-right">
								<span class="mono-label">MAASTRICHT UNIVERSITY</span>
								<span>Responsible & Sustainable Technology</span>
							</div>
						</div>

						<!-- Diagonal Split Divider Line (from Top-Left 0,0 to Bottom-Right 100,100) -->
						<svg
							class="diagonal-divider-svg"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
							aria-hidden="true"
						>
							<line
								x1="0"
								y1="0"
								x2="100"
								y2="100"
								stroke="rgba(255, 255, 255, 0.35)"
								stroke-width="0.4"
							/>
						</svg>

						<!-- Invisible Diagonal Hover Trigger Zones -->
						<div
							class="hover-zone zone-bottom-left"
							onmouseenter={() => (hoveredLogo = '42')}
							onfocus={() => (hoveredLogo = '42')}
							role="button"
							tabindex="0"
							aria-label="Expand 42 Berlin logo"
						></div>
						<div
							class="hover-zone zone-top-right"
							onmouseenter={() => (hoveredLogo = 'um')}
							onfocus={() => (hoveredLogo = 'um')}
							role="button"
							tabindex="0"
							aria-label="Expand Maastricht University logo"
						></div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 3. EXPERTISE: Sticky Un-Rounded /images/art.jpeg + Right-Aligned Title Underneath Rising onto Image, Blending Out Completely at Highlighted Work -->
	<section class="hero-scroll-stage art-scroll-stage" id="expertise">
		<div class="hero-stage-container" bind:this={expertiseStageEl}>
			<!-- Sticky Sharp-Edged Studio Art Photograph (blends out to 0 opacity as Highlighted Work arrives) -->
			<div
				class="hero-sticky-picture art-sticky-picture"
				style="opacity: {(1 - artBlendOutProgress).toFixed(3)};"
			>
				<img
					src="/images/art.jpeg"
					alt="Eschenbach Studio — Forest Canvases in the Studio"
					class="hero-main-img"
					style="transform: scale({(1 + artStageProgress * 0.035).toFixed(4)});"
				/>
				<!-- Dark veil that deepens as the right-aligned title and expertise content scroll up onto the picture -->
				<div
					class="hero-image-veil"
					style="opacity: {Math.min(1, artStageProgress * 0.78 + artBlendOutProgress * 0.5).toFixed(
						3
					)};"
				></div>
			</div>

			<!-- Text block starting directly UNDER /images/art.jpeg with Title on the RIGHT side -->
			<div class="art-rising-content">
				<div class="art-title-row-right">
					<span
						class="hero-scroll-hint"
						style="opacity: {Math.max(0, 1 - artStageProgress * 2.2).toFixed(2)};"
					>
						↓ 3. Expertise
					</span>
					<div class="art-right-heading-group">
						<span class="art-kicker">3. Expertise &amp; Selected Work</span>
						<h2 class="hero-brand-title art-right-title">Craft &amp; Engineering</h2>
					</div>
				</div>

				<!-- Fades in beneath the right-aligned title and moves up over /images/art.jpeg -->
				<div
					class="art-emerging-body"
					style="opacity: {artStageProgress.toFixed(3)}; transform: translateY({(
						(1 - artStageProgress) *
						28
					).toFixed(1)}px);"
				>
					<div class="art-intro-lead">
						<p class="hero-overlay-prose art-right-prose">
							Independent engineering for ambitious digital products. Through
							<strong>Eschenbach Studio</strong>, I partner directly with founders, studios, and
							teams to take web applications from early concept to fast, production-ready reality.
						</p>
					</div>

					<div class="capabilities-grid">
						{#each CAPABILITIES as cap}
							<article class="capability-card art-overlay-card">
								<div class="cap-top">
									<span class="cap-roman">{cap.number}</span>
									<span class="cap-subtitle">{cap.subtitle}</span>
								</div>
								<h3 class="cap-title">{cap.title}</h3>
								<p class="cap-desc">{cap.description}</p>
								<ul class="cap-tags">
									{#each cap.tags as tag}
										<li>{tag}</li>
									{/each}
								</ul>
							</article>
						{/each}
					</div>

					<!-- Highlighted Projects + Option to Explore Full Archive (image is fully blended out to black here) -->
					<div class="selected-preview" bind:this={highlightedWorkEl}>
						<div class="selected-header">
							<div>
								<span class="section-tag">Highlighted Work</span>
								<h3 class="selected-title">Selected Projects</h3>
							</div>
							<a href="/archive" class="btn-primary">
								<span>Explore All {PROJECTS.length} Past Projects in Archive</span>
								<span>↗</span>
							</a>
						</div>

						<div class="selected-cards">
							{#each featuredProjects as proj}
								<a
									href={proj.githubUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="mini-project-card art-overlay-card"
								>
									<div class="mini-card-meta">
										<span class="mini-year">{proj.year}</span>
										<span class="mini-arrow">↗</span>
									</div>
									<h4>{proj.title}</h4>
									<p>{proj.summary}</p>
									<div class="mini-tech">
										{#each proj.tech.slice(0, 3) as t}
											<span>{t}</span>
										{/each}
									</div>
								</a>
							{/each}
						</div>

						<!-- Archive Constellation Banner inside Expertise -->
						<div class="archive-cta-strip">
							<div class="archive-cta-text">
								<h4>Interactive Project Constellation</h4>
								<p>
									Visualize all {PROJECTS.length} repositories grouped by discipline ({HUB_CATEGORIES.map(
										(h) => h.shortLabel
									).join(', ')}) in an interactive Obsidian-inspired graph space.
								</p>
							</div>
							<a href="/archive" class="btn-solid">
								<span>Enter Archive Space (/archive)</span>
								<span>→</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 4. CONTACT -->
	<section class="scroll-beat finale-beat" id="contact">
		<div class="beat-container">
			<div class="contact-sanctuary">
				<div class="contact-info">
					<div class="section-tag">4. Contact</div>
					<h2 class="section-heading">
						Let’s build something <em>enduring</em> together.
					</h2>
					<p class="body-prose">
						Available for freelance full-stack development, frontend architecture, and technical
						consulting through <strong>Eschenbach Studio</strong>.
					</p>

					<div class="direct-channels">
						<div class="channel-item">
							<span class="channel-label">Direct Electronic Mail</span>
							<a href="mailto:{PROFILE.email}" class="channel-value highlight-link">
								{PROFILE.email}
							</a>
						</div>

						<div class="channel-item">
							<span class="channel-label">GitHub & Open Source</span>
							<a
								href={PROFILE.github}
								target="_blank"
								rel="noopener noreferrer"
								class="channel-value"
							>
								github.com/eschencode ↗
							</a>
						</div>

						<div class="channel-item">
							<span class="channel-label">Practice</span>
							<span class="channel-value">
								{PROFILE.brand} · Sole Proprietorship ({PROFILE.name})
							</span>
						</div>
					</div>
				</div>

				<form class="contact-form" onsubmit={handleContactSubmit}>
					<div class="form-header">
						<span class="mono-label">DIRECT DISPATCH</span>
						<span class="status-pill">
							<span class="status-dot"></span>
							Accepting New Projects
						</span>
					</div>

					<label class="field">
						<span>Your Name</span>
						<input
							type="text"
							bind:value={senderName}
							placeholder="Ada Lovelace"
							required
						/>
					</label>

					<label class="field">
						<span>Your Email</span>
						<input
							type="email"
							bind:value={senderEmail}
							placeholder="ada@analytical-engine.org"
							required
						/>
					</label>

					<label class="field">
						<span>Project or Inquiry</span>
						<textarea
							rows="4"
							bind:value={projectScope}
							placeholder="Tell me a little about what you are building, your timeline, or how we might collaborate..."
							required
						></textarea>
					</label>

					<button type="submit" class="btn-submit">
						<span>Compose Dispatch to {PROFILE.email}</span>
						<span>↗</span>
					</button>

					{#if formSubmitted}
						<p class="form-feedback">
							Opening your mail client addressed to <strong>{PROFILE.email}</strong>. You can also copy
							the address directly above.
						</p>
					{/if}
				</form>
			</div>

			<footer class="site-footer">
				<div>
					<span>© {new Date().getFullYear()} {PROFILE.brand} — {PROFILE.name}</span>
				</div>
				<div class="footer-links">
					<a href="/archive">Project Archive</a>
					<a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
						GitHub ({PROFILE.githubHandle})
					</a>
					<a href="mailto:{PROFILE.email}">{PROFILE.email}</a>
				</div>
			</footer>
		</div>
	</section>
</div>

<style>
	/* Slim Far-Right Rail ('1.', '2.', '3.', '4.' + bar) that Expands to Full Labels on Hover */
	.side-nav {
		position: fixed;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 50;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1.15rem;
		padding: 0.85rem 0.55rem;
		background: transparent;
		border: 1px solid transparent;
		transition:
			background 0.28s ease,
			border-color 0.28s ease,
			padding 0.28s ease,
			backdrop-filter 0.28s ease;
	}

	.side-nav:hover,
	.side-nav:focus-within {
		background: rgba(0, 0, 0, 0.86);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border-color: rgba(255, 255, 255, 0.16);
		padding: 1.1rem 0.95rem;
	}

	.side-nav-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		width: 100%;
	}

	.side-nav-link {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 0.4);
		transition: color 0.22s ease;
	}

	.side-nav-link:hover {
		color: rgba(255, 255, 255, 0.88);
	}

	.side-nav-link.active {
		color: #ffffff;
		font-weight: 500;
	}

	/* Collapsed by default; slides open on .side-nav hover */
	.side-nav-label,
	.side-nav-archive-label {
		max-width: 0;
		opacity: 0;
		overflow: hidden;
		white-space: nowrap;
		transform: translateX(6px);
		transition:
			max-width 0.32s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.24s ease,
			transform 0.28s ease,
			margin-right 0.28s ease;
	}

	.side-nav:hover .side-nav-label,
	.side-nav:focus-within .side-nav-label,
	.side-nav:hover .side-nav-archive-label,
	.side-nav:focus-within .side-nav-archive-label {
		max-width: 110px;
		opacity: 1;
		transform: translateX(0);
		margin-right: 0.2rem;
	}

	.side-nav-num {
		font-size: 0.72rem;
		opacity: 0.78;
	}

	.side-nav-link.active .side-nav-num {
		opacity: 1;
	}

	.side-nav-bar {
		width: 8px;
		height: 1px;
		background: rgba(255, 255, 255, 0.26);
		transition: all 0.3s ease;
	}

	.side-nav-link.active .side-nav-bar {
		width: 16px;
		height: 2px;
		background: #ffffff;
	}

	.side-nav-archive {
		display: inline-flex;
		align-items: center;
		padding-top: 0.75rem;
		border-top: 1px solid rgba(255, 255, 255, 0.16);
		width: 100%;
		justify-content: flex-end;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.65);
		transition: color 0.2s ease;
	}

	.side-nav-archive:hover {
		color: #ffffff;
	}

	.side-nav-archive-icon {
		font-size: 0.82rem;
		line-height: 1;
	}

	/* Foreground Narrative Stream on Pure Black (Full Symmetric Width) */
	.narrative-stream {
		position: relative;
		z-index: 10;
		background: #000000;
	}

	/* 1. INTRO & 3. EXPERTISE: Full-Width Symmetric Sticky Picture + Rising Title & Content */
	.hero-scroll-stage {
		position: relative;
		padding: 2rem 3.75rem 5rem;
		background: #000000;
	}

	.art-scroll-stage {
		padding-top: 1rem;
		padding-bottom: 7rem;
	}

	.hero-stage-container {
		width: min(1360px, 100%);
		margin: 0 auto;
		position: relative;
	}

	.hero-sticky-picture {
		position: sticky;
		top: 2rem;
		width: 100%;
		height: calc(100vh - 8.5rem);
		border-radius: 0;
		overflow: hidden;
		background: #000000;
		z-index: 1;
	}

	.art-sticky-picture {
		will-change: opacity;
		pointer-events: none;
	}

	.hero-main-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		will-change: transform;
	}

	.hero-image-veil {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(0, 0, 0, 0.35) 0%,
			rgba(0, 0, 0, 0.78) 55%,
			rgba(0, 0, 0, 0.96) 100%
		);
		pointer-events: none;
	}

	.hero-rising-text {
		position: relative;
		z-index: 5;
		margin-top: 1.35rem;
		padding: 0 2rem 24vh;
		max-width: 960px;
	}

	.hero-title-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.hero-brand-title {
		font-family: var(--font-serif);
		font-weight: 300;
		font-size: clamp(2.75rem, 5.6vw, 4.85rem);
		line-height: 1;
		letter-spacing: -0.02em;
		color: #ffffff;
		text-shadow: 0 10px 35px rgba(0, 0, 0, 0.9);
	}

	.hero-scroll-hint {
		font-family: var(--font-mono);
		font-size: 0.76rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-sage);
		white-space: nowrap;
	}

	.hero-emerging-bio {
		will-change: opacity, transform;
	}

	.hero-overlay-prose {
		font-family: var(--font-serif);
		font-weight: 300;
		font-size: clamp(1.55rem, 2.85vw, 2.55rem);
		line-height: 1.38;
		color: #ffffff;
		max-width: 35ch;
		margin-bottom: 2.25rem;
		text-shadow: 0 8px 32px rgba(0, 0, 0, 0.95);
	}

	.hero-overlay-prose strong {
		font-weight: 500;
		color: #ffffff;
	}

	.hero-overlay-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	/* 3. Expertise Rising Stage (/images/art.jpeg with Right-Aligned Title) */
	.art-rising-content {
		position: relative;
		z-index: 5;
		margin-top: 1.35rem;
		padding: 0 2rem 8vh;
	}

	.art-title-row-right {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.art-right-heading-group {
		margin-left: auto;
		text-align: right;
	}

	.art-kicker {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-sage);
		margin-bottom: 0.45rem;
	}

	.art-right-title {
		text-align: right;
	}

	.art-emerging-body {
		will-change: opacity, transform;
	}

	.art-intro-lead {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 4rem;
	}

	.art-right-prose {
		text-align: right;
		max-width: 38ch;
		margin-bottom: 0;
	}

	/* Scroll Sections (Symmetric 3.75rem side padding keeps slim rail clear of all reading text) */
	.scroll-beat {
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding: 6rem 3.75rem;
		background: #000000;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.beat-container {
		width: min(1220px, 100%);
		margin: 0 auto;
	}

	.section-heading em {
		font-style: italic;
		font-weight: 300;
		color: var(--text-mist);
	}

	.body-prose strong {
		color: #ffffff;
		font-weight: 500;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1.5rem;
		background: #ffffff;
		border: 1px solid #ffffff;
		color: #000000;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		transition: all 0.25s ease;
	}

	.btn-primary:hover {
		background: transparent;
		color: #ffffff;
	}

	.btn-ghost {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.9rem 1.4rem;
		background: rgba(0, 0, 0, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: #ffffff;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		transition: all 0.25s ease;
	}

	.btn-ghost:hover {
		border-color: #ffffff;
		background: rgba(255, 255, 255, 0.1);
	}

	.btn-solid {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.65rem;
		background: #ffffff;
		color: #000000;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		white-space: nowrap;
		transition: all 0.25s ease;
	}

	.btn-solid:hover {
		background: var(--text-mist);
	}

	/* 2. Philosophy Split Editorial & Scroll-Driven Diagonal 42 / UM Square
	   Tightened bottom spacing so /images/art.jpeg follows closely after */
	.philosophy-beat {
		padding: 7rem 3.75rem 2.5rem;
	}

	.split-editorial {
		display: grid;
		grid-template-columns: 1.08fr 0.92fr;
		gap: 4.5rem;
		align-items: start;
	}

	.editorial-text {
		padding: 1rem 0 2rem;
	}

	.section-tag {
		font-family: var(--font-mono);
		font-size: 0.76rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-sage);
		margin-bottom: 1rem;
	}

	.section-heading {
		font-family: var(--font-serif);
		font-weight: 300;
		font-size: clamp(2.25rem, 4.2vw, 3.6rem);
		line-height: 1.1;
		color: #ffffff;
		margin-bottom: 4.5rem;
	}

	.philosophy-chapter {
		padding: 1.75rem 0 1.75rem 1.5rem;
		border-left: 1px solid rgba(255, 255, 255, 0.16);
		margin-bottom: 6.5rem;
		opacity: 0.52;
		transition:
			border-color 0.4s ease,
			transform 0.4s ease,
			opacity 0.4s ease;
	}

	.philosophy-chapter:last-child {
		margin-bottom: 1rem;
	}

	.philosophy-chapter.highlighted {
		border-left: 2px solid #ffffff;
		transform: translateX(8px);
		opacity: 1;
	}

	.chapter-meta {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		color: var(--text-sage);
		margin-bottom: 0.65rem;
		transition: color 0.3s ease;
	}

	.philosophy-chapter.highlighted .chapter-meta {
		color: #ffffff;
	}

	.body-prose {
		font-size: 1.06rem;
		line-height: 1.8;
		color: var(--text-mist);
		margin-bottom: 0;
	}

	/* Sticky Diagonal Split Square for 42.jpg & um.jpeg */
	.logo-split-wrapper {
		position: sticky;
		top: calc(50vh - 230px);
		display: flex;
		justify-content: center;
	}

	.logo-split-square {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;
		max-width: 460px;
		background: #000000;
		border: 1px solid rgba(255, 255, 255, 0.2);
		overflow: hidden;
	}

	.logo-layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		transition:
			clip-path 0.62s cubic-bezier(0.22, 1, 0.36, 1),
			filter 0.45s ease;
		will-change: clip-path;
	}

	.logo-layer img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* Default Diagonal Split from Top-Left (0,0) to Bottom-Right (100%,100%) */
	.layer-42 {
		clip-path: polygon(0 0, 0 0, 100% 100%, 0 100%);
		z-index: 2;
	}

	.layer-um {
		clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%);
		z-index: 2;
	}

	/* When 42 is active (via scroll center or hover): 42 expands to 100% of the square */
	.logo-split-square.expand-42 .layer-42 {
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
		z-index: 4;
	}

	.logo-split-square.expand-42 .layer-um {
		clip-path: polygon(100% 0, 100% 0, 100% 0, 100% 0);
	}

	.logo-split-square.expand-42 .layer-42 img {
		transform: scale(1.03);
	}

	/* When UM is active (via scroll center or hover): UM expands to 100% of the square */
	.logo-split-square.expand-um .layer-um {
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
		z-index: 4;
	}

	.logo-split-square.expand-um .layer-42 {
		clip-path: polygon(0 100%, 0 100%, 0 100%, 0 100%);
	}

	.logo-split-square.expand-um .layer-um img {
		transform: scale(1.03);
	}

	/* Diagonal Split Divider Line (0,0 -> 100,100) */
	.diagonal-divider-svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 5;
		pointer-events: none;
		transition: opacity 0.35s ease;
	}

	.logo-split-square.expand-42 .diagonal-divider-svg,
	.logo-split-square.expand-um .diagonal-divider-svg {
		opacity: 0;
	}

	/* Bottom Captions inside each expanded square */
	.logo-caption {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1.5rem 1.35rem 1.15rem;
		background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.9) 100%);
		font-size: 0.82rem;
		color: var(--text-mist);
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.35s ease,
			transform 0.35s ease;
		pointer-events: none;
	}

	.logo-split-square.expand-42 .caption-left,
	.logo-split-square.expand-um .caption-right {
		opacity: 1;
		transform: translateY(0);
	}

	/* Diagonal Triangle Hover Hit-Zones (matching 0,0 -> 100,100 diagonal) */
	.hover-zone {
		position: absolute;
		inset: 0;
		z-index: 10;
		cursor: pointer;
		outline: none;
	}

	.zone-bottom-left {
		clip-path: polygon(0 0, 100% 100%, 0 100%);
	}

	.zone-top-right {
		clip-path: polygon(0 0, 100% 0, 100% 100%);
	}

	.mono-label {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.15em;
		color: #ffffff;
		margin-bottom: 0.25rem;
	}

	/* 3. Expertise & Capabilities Grid (Overlaying /images/art.jpeg) */
	.capabilities-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-bottom: 5.5rem;
	}

	.capability-card {
		background: rgba(5, 5, 5, 0.84);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.18);
		padding: 2.25rem 1.85rem;
		display: flex;
		flex-direction: column;
		transition:
			border-color 0.25s ease,
			background 0.25s ease;
	}

	.capability-card:hover {
		border-color: rgba(255, 255, 255, 0.55);
		background: rgba(10, 10, 10, 0.92);
	}

	.cap-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.25rem;
		padding-bottom: 0.85rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.cap-roman {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: #ffffff;
	}

	.cap-subtitle {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--text-sage);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.cap-title {
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: 1.65rem;
		line-height: 1.2;
		color: #ffffff;
		margin-bottom: 0.9rem;
	}

	.cap-desc {
		font-size: 0.92rem;
		line-height: 1.68;
		color: var(--text-mist);
		margin-bottom: 1.5rem;
		flex: 1;
	}

	.cap-tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.cap-tags li {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		padding: 0.25rem 0.6rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: var(--text-mist);
	}

	/* Selected Works + Archive Option inside Expertise */
	.selected-preview {
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		padding-top: 3.5rem;
	}

	.selected-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.selected-title {
		font-family: var(--font-serif);
		font-weight: 300;
		font-size: 2.2rem;
		color: #ffffff;
	}

	.selected-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.25rem;
		margin-bottom: 2.5rem;
	}

	.mini-project-card {
		background: rgba(5, 5, 5, 0.88);
		border: 1px solid rgba(255, 255, 255, 0.18);
		padding: 1.4rem;
		display: flex;
		flex-direction: column;
		transition: all 0.25s ease;
	}

	.mini-project-card:hover {
		border-color: #ffffff;
		background: rgba(14, 14, 14, 0.96);
		transform: translateY(-3px);
	}

	.mini-card-meta {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-sage);
		margin-bottom: 0.65rem;
	}

	.mini-arrow {
		color: #ffffff;
	}

	.mini-project-card h4 {
		font-family: var(--font-serif);
		font-size: 1.35rem;
		font-weight: 400;
		color: #ffffff;
		margin-bottom: 0.5rem;
	}

	.mini-project-card p {
		font-size: 0.82rem;
		line-height: 1.55;
		color: var(--text-mist);
		margin-bottom: 1.1rem;
		flex: 1;
	}

	.mini-tech {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.mini-tech span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--text-sage);
	}

	.archive-cta-strip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		padding: 2.25rem 2.5rem;
		background: #070707;
		border: 1px solid rgba(255, 255, 255, 0.24);
	}

	.archive-cta-text h4 {
		font-family: var(--font-serif);
		font-size: 1.65rem;
		font-weight: 300;
		color: #ffffff;
		margin-bottom: 0.35rem;
	}

	.archive-cta-text p {
		font-size: 0.92rem;
		color: var(--text-mist);
		max-width: 62ch;
	}

	/* 4. Contact Section */
	.finale-beat {
		flex-direction: column;
		padding-bottom: 3rem;
	}

	.contact-sanctuary {
		display: grid;
		grid-template-columns: 1fr 1.05fr;
		gap: 4rem;
		align-items: start;
		padding: 1rem 0 4rem;
	}

	.direct-channels {
		margin-top: 2.25rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding-top: 1.75rem;
		border-top: 1px solid rgba(255, 255, 255, 0.14);
	}

	.channel-item {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.channel-label {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--text-sage);
	}

	.channel-value {
		font-size: 1rem;
		color: #ffffff;
	}

	.highlight-link {
		color: #ffffff;
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
		background: #050505;
		border: 1px solid rgba(255, 255, 255, 0.16);
		padding: 2.25rem;
	}

	.form-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.35rem;
	}

	.status-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 0.25rem 0.65rem;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #ffffff;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.field span {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-sage);
	}

	.field input,
	.field textarea {
		background: #000000;
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 0.85rem 1rem;
		color: #ffffff;
		font-family: var(--font-sans);
		font-size: 0.92rem;
		transition: border-color 0.2s ease;
	}

	.field input:focus,
	.field textarea:focus {
		outline: none;
		border-color: #ffffff;
	}

	.btn-submit {
		margin-top: 0.4rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.35rem;
		background: #ffffff;
		color: #000000;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: uppercase;
		border: none;
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.btn-submit:hover {
		background: var(--text-mist);
	}

	.form-feedback {
		font-size: 0.82rem;
		color: var(--text-mist);
		margin-top: 0.25rem;
	}

	/* Footer */
	.site-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.14);
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--text-sage);
	}

	.footer-links {
		display: flex;
		gap: 1.5rem;
	}

	.footer-links a:hover {
		color: #ffffff;
	}

	@media (max-width: 1024px) {
		.side-nav {
			right: 0.4rem;
		}

		.hero-scroll-stage,
		.scroll-beat,
		.philosophy-beat {
			padding-left: 2.75rem;
			padding-right: 2.75rem;
		}

		.split-editorial,
		.capabilities-grid,
		.selected-cards,
		.contact-sanctuary {
			grid-template-columns: 1fr;
		}

		.logo-split-wrapper {
			position: relative;
			top: 0;
		}

		.editorial-text {
			padding-bottom: 2rem;
		}

		.philosophy-chapter {
			margin-bottom: 3rem;
		}

		.archive-cta-strip {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	@media (max-width: 720px) {
		.side-nav {
			display: none;
		}

		.hero-scroll-stage,
		.scroll-beat,
		.philosophy-beat {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.hero-rising-text,
		.art-rising-content {
			padding: 0 0.75rem 18vh;
		}
	}
</style>
