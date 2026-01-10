<script lang="ts">
	let {
		header,
		main,
		footer,
	}: { header?: any; main: any; footer?: any } = $props();
</script>

<div
	class="h-screen grid {header && footer
		? 'grid-rows-[auto_auto_1fr_auto_auto]'
		: header
			? 'grid-rows-[auto_auto_1fr_auto]'
			: footer
				? 'grid-rows-[auto_1fr_auto_auto]'
				: 'grid-rows-[auto_1fr_auto]'}"
>
	<div class="h-8 w-full"></div>

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

	<div class="h-4 w-full preset-filled-surface-100-900"></div>
</div>
