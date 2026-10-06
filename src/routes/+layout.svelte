<script>
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';

	$: lang = $page.params.lang || 'en';

	/** @param {string} newLang */
	function changeLang(newLang) {
		if (typeof window !== 'undefined') {
			window.location.href = `/${newLang}`;
		}
	}
</script>

<header>
	<nav class="navbar">
		<div class="nav-container">
			<div class="logo">
				<a href="/{lang}">
					<strong>Eschenbach</strong> Studio
				</a>
			</div>
			<ul class="nav-menu">
				<li>
					<a href="/{lang}" class={$page.url.pathname === `/${lang}` ? 'active' : ''}>
						{t(lang, 'nav.home')}
					</a>
				</li>
				<li>
					<a href="/{lang}#services" class={$page.url.pathname.includes('services') ? 'active' : ''}>
						{t(lang, 'nav.services')}
					</a>
				</li>
				<li>
					<a href="/{lang}/contact" class={$page.url.pathname.includes('contact') ? 'active' : ''}>
						{t(lang, 'nav.contact')}
					</a>
				</li>
			</ul>
			<div class="lang-switcher">
				<button
					on:click={() => changeLang('en')}
					class={lang === 'en' ? 'active' : ''}
					title="English"
				>
					EN
				</button>
				<button
					on:click={() => changeLang('nl')}
					class={lang === 'nl' ? 'active' : ''}
					title="Nederlands"
				>
					NL
				</button>
				<button
					on:click={() => changeLang('de')}
					class={lang === 'de' ? 'active' : ''}
					title="Deutsch"
				>
					DE
				</button>
			</div>
		</div>
	</nav>
</header>

<slot />

<footer>
	<p>{t(lang, 'footer.text')}</p>
</footer>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		color: #333;
		line-height: 1.6;
		background: #fafafa;
	}

	header {
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.navbar {
		padding: 1rem 2rem;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo a {
		text-decoration: none;
		color: #1b3c53;
		font-size: 1.3rem;
		font-weight: 700;
	}

	.nav-menu {
		display: flex;
		list-style: none;
		gap: 2rem;
		flex: 1;
		justify-content: center;
	}

	.nav-menu a {
		text-decoration: none;
		color: #555;
		font-weight: 500;
		transition: color 0.3s ease;
		position: relative;
	}

	.nav-menu a:hover,
	.nav-menu a.active {
		color: #234c6a;
	}

	.nav-menu a.active::after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 0;
		right: 0;
		height: 2px;
		background: #456882;
	}

	.lang-switcher {
		display: flex;
		gap: 0.5rem;
	}

	.lang-switcher button {
		background: #f0f0f0;
		border: none;
		padding: 0.5rem 0.8rem;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		color: #666;
		transition: all 0.3s ease;
		font-size: 0.85rem;
	}

	.lang-switcher button:hover {
		background: #e0e0e0;
	}

	.lang-switcher button.active {
		background: #234c6a;
		color: white;
	}

	footer {
		background: #1b3c53;
		color: #d2c1b6;
		text-align: center;
		padding: 2rem;
		margin-top: 4rem;
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.nav-container {
			flex-wrap: wrap;
			gap: 1rem;
		}

		.nav-menu {
			order: 3;
			width: 100%;
			justify-content: space-around;
			gap: 1rem;
		}

		.logo {
			flex: 1;
		}

		.lang-switcher {
			flex: 1;
			justify-content: flex-end;
		}
	}
</style>
