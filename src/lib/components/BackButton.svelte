<script lang="ts">
	import { ArrowLeft } from "@lucide/svelte";

	let { href = "/" }: { href?: string } = $props();
</script>

<a
	class="w-full px-4 py-8 block preset-filled-surface-100-900 hover:preset-filled-surface-200-800 active:preset-filled-surface-200-800"
	{href}
	aria-label="Back to tea list"
>
	<ArrowLeft />
</a>
