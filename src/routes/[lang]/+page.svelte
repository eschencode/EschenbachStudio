<script>
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';

	$: lang = $page.params.lang || 'en';
</script>

<svelte:head>
	<title>{t(lang, 'home.title')}</title>
	<meta name="description" content={t(lang, 'home.description')} />
</svelte:head>

<div class="hero">
	<div class="hero-content">
		<h1>{t(lang, 'home.headline')}</h1>
		<p class="subtitle">{t(lang, 'home.subtitle')}</p>
	</div>
</div>

<section id="services" class="services">
	<div class="container">
		<h2>{t(lang, 'services.title')}</h2>
		<div class="services-grid">
			<div class="service-card">
				<h3>🌐 {t(lang, 'services.websites')}</h3>
				<p>{t(lang, 'services.websites_desc')}</p>
			</div>
			<div class="service-card">
				<h3>☁️ {t(lang, 'services.infrastructure')}</h3>
				<p>{t(lang, 'services.infrastructure_desc')}</p>
			</div>
			<div class="service-card">
				<h3>⚙️ {t(lang, 'services.automation')}</h3>
				<p>{t(lang, 'services.automation_desc')}</p>
			</div>
			<div class="service-card">
				<h3>💼 {t(lang, 'services.consulting')}</h3>
				<p>{t(lang, 'services.consulting_desc')}</p>
			</div>
		</div>
	</div>
</section>

<section class="cta">
	<div class="container">
		<h2>{t(lang, 'cta.title')}</h2>
		<p>{t(lang, 'cta.description')}</p>
		<a href="/{lang}/contact" class="btn btn-primary">{t(lang, 'cta.button')}</a>
	</div>
</section>

<style>
	.hero {
		background: linear-gradient(135deg, #1b3c53 0%, #234c6a 100%);
		color: #f5f5f5;
		padding: 6rem 2rem;
		text-align: center;
		min-height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-content {
		max-width: 600px;
	}

	.hero h1 {
		font-size: 3rem;
		margin: 0 0 1rem 0;
		font-weight: 700;
		line-height: 1.2;
	}

	.subtitle {
		font-size: 1.3rem;
		color: #d2c1b6;
		margin: 0;
		font-weight: 300;
	}

	.services {
		padding: 4rem 2rem;
		background: #f9f9f9;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
	}

	.services h2 {
		text-align: center;
		color: #1b3c53;
		margin-bottom: 3rem;
		font-size: 2rem;
	}

	.services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.service-card {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		border-left: 4px solid #456882;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		transition: transform 0.3s ease;
	}

	.service-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.service-card h3 {
		color: #234c6a;
		margin: 0 0 1rem 0;
		font-size: 1.3rem;
	}

	.service-card p {
		color: #555;
		margin: 0;
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.cta {
		padding: 4rem 2rem;
		background: #234c6a;
		color: #f5f5f5;
		text-align: center;
	}

	.cta h2 {
		margin: 0 0 1rem 0;
		font-size: 2rem;
	}

	.cta p {
		margin: 0 0 2rem 0;
		font-size: 1.1rem;
		color: #d2c1b6;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.btn {
		display: inline-block;
		padding: 0.75rem 2rem;
		border-radius: 4px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border: none;
		cursor: pointer;
		font-size: 1rem;
	}

	.btn-primary {
		background: #456882;
		color: #f5f5f5;
	}

	.btn-primary:hover {
		background: #d2c1b6;
		color: #1b3c53;
	}

	@media (max-width: 768px) {
		.hero h1 {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.services h2 {
			font-size: 1.5rem;
		}

		.cta h2 {
			font-size: 1.5rem;
		}
	}
</style>
