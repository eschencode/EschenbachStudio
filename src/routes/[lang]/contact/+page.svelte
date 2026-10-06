<script>
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';

	$: lang = $page.params.lang || 'en';

	let email = '';
	let message = '';
	let submitted = false;

	async function handleSubmit(e) {
		e.preventDefault();

		// For now, just show success. In production, connect to an email service.
		// Example: send to a serverless function or email API
		submitted = true;
		email = '';
		message = '';

		setTimeout(() => {
			submitted = false;
		}, 5000);
	}
</script>

<svelte:head>
	<title>{t(lang, 'contact.title')} - Eschenbach Studio</title>
	<meta name="description" content={t(lang, 'contact.description')} />
</svelte:head>

<div class="contact-hero">
	<div class="hero-content">
		<h1>{t(lang, 'contact.title')}</h1>
		<p>{t(lang, 'contact.description')}</p>
	</div>
</div>

<section class="contact-section">
	<div class="container">
		<div class="contact-box">
			<form on:submit={handleSubmit}>
				<div class="form-group">
					<label for="email">{t(lang, 'contact.email_label')}</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder={t(lang, 'contact.email_placeholder')}
						required
					/>
				</div>

				<div class="form-group">
					<label for="message">{t(lang, 'contact.message_label')}</label>
					<textarea
						id="message"
						bind:value={message}
						placeholder={t(lang, 'contact.message_placeholder')}
						rows="6"
						required
					></textarea>
				</div>

				<button type="submit" class="btn btn-primary">
					{t(lang, 'contact.submit')}
				</button>
			</form>

			{#if submitted}
				<div class="success-message">
					<p>✓ {lang === 'en' ? 'Thanks for reaching out!' : lang === 'nl' ? 'Bedankt voor je bericht!' : 'Vielen Dank für deine Nachricht!'}</p>
				</div>
			{/if}

			<div class="contact-info">
				<p style="margin-top: 2rem; color: #666; font-size: 0.95rem;">
					{lang === 'en'
						? 'Or email directly:'
						: lang === 'nl'
							? 'Of stuur rechtstreeks een e-mail:'
							: 'Oder sende uns direkt eine E-Mail:'}
				</p>
				<p style="color: #234c6a; font-weight: 600;">hello@eschenbach-studio.com</p>
			</div>
		</div>
	</div>
</section>

<style>
	.contact-hero {
		background: linear-gradient(135deg, #1b3c53 0%, #234c6a 100%);
		color: #f5f5f5;
		padding: 4rem 2rem;
		text-align: center;
		min-height: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-content {
		max-width: 600px;
	}

	.contact-hero h1 {
		font-size: 2.5rem;
		margin: 0 0 1rem 0;
		font-weight: 700;
	}

	.contact-hero p {
		font-size: 1.1rem;
		color: #d2c1b6;
		margin: 0;
	}

	.contact-section {
		padding: 4rem 2rem;
		background: #fafafa;
		min-height: 500px;
	}

	.container {
		max-width: 600px;
		margin: 0 auto;
	}

	.contact-box {
		background: white;
		padding: 3rem;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #1b3c53;
		font-weight: 600;
		font-size: 0.95rem;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-family: inherit;
		font-size: 1rem;
		transition: border-color 0.3s ease;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #456882;
		box-shadow: 0 0 0 3px rgba(69, 104, 130, 0.1);
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
		width: 100%;
		text-align: center;
	}

	.btn-primary {
		background: #456882;
		color: #f5f5f5;
	}

	.btn-primary:hover {
		background: #234c6a;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(69, 104, 130, 0.2);
	}

	.success-message {
		margin-top: 1.5rem;
		padding: 1rem;
		background: #e8f5e9;
		border-left: 4px solid #4caf50;
		border-radius: 4px;
		color: #2e7d32;
	}

	.contact-info {
		text-align: center;
	}

	@media (max-width: 768px) {
		.contact-box {
			padding: 2rem;
		}

		.contact-hero h1 {
			font-size: 1.8rem;
		}
	}
</style>
