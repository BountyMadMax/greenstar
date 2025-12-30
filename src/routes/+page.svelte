<script lang="ts">
	import TeaList from "../lib/components/TeaList.svelte";
	import Layout from "../lib/components/Layout.svelte";
	import { Plus } from "@lucide/svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

{#snippet main()}
	<div class="p-4">
		<TeaList list={data.tea} />
	</div>
{/snippet}

{#snippet footer()}
	<a
		href="/tea/add"
		aria-label="add tea"
		class="p-8 fixed bottom-4 right-4 preset-filled-primary-100-900 hover:preset-filled-primary-200-800 active:preset-filled-primary-200-800 block w-fit rounded-full"
	>
		<Plus size={48} />
	</a>
{/snippet}

<Layout {main} {footer} />
