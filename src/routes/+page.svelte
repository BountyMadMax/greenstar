<script lang="ts">
	import TeaList from "../lib/components/TeaList.svelte";
	import Layout from "../lib/components/Layout.svelte";
	import { Plus } from "@lucide/svelte";
	import type { PageProps } from "./$types";
	import { Navigation } from "@skeletonlabs/skeleton-svelte";

	let { data }: PageProps = $props();
</script>

{#snippet main()}
	<div class="p-4">
		<TeaList list={data.tea} />
	</div>
{/snippet}

{#snippet footer()}
	<Navigation layout="bar">
		<Navigation.Menu class="grid grid-cols-1 gap-2">
			<Navigation.TriggerAnchor
				href="/tea/add"
				class="preset-filled-primary-100-900"
			>
				<Plus />
				<Navigation.TriggerText
					class="font-bold text-xs"
					>Add</Navigation.TriggerText
				>
			</Navigation.TriggerAnchor>
		</Navigation.Menu>
	</Navigation>
{/snippet}

<Layout {main} {footer} />
