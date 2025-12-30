<script lang="ts">
	let {
		header,
		main,
		footer,
	}: { header?: any; main: any; footer?: any } = $props();
</script>

<div
	class="h-screen grid {header && footer
		? 'grid-rows-[auto_1fr_auto]'
		: header
			? 'grid-rows-[auto_1fr]'
			: footer
				? 'grid-rows-[1fr_auto]'
				: 'grid-rows-[1fr]'}"
>
	{#if header}
		<header>
			{@render header()}
		</header>
	{/if}

	<main class="overflow-auto">
		{@render main()}
	</main>

	{#if footer}
		<footer>
			{@render footer()}
		</footer>
	{/if}
</div>
