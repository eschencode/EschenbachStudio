<script>
	import '../app.css';

	let { children } = $props();
</script>

<div class="site-shell">
	<main>
		{@render children()}
	</main>
</div>

<style>
	.site-shell {
		position: relative;
		min-height: 100vh;
		background: #000000;
	}
</style>
