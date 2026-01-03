<script lang="ts">
	import type { Icon } from "@lucide/svelte";
	import type { Snippet } from "svelte";
	const props:
		| {
				icon: never;
				valueFirst: never;
				valueSecond: never;
				unit: Snippet;
				values: Snippet;
				defaultValue?: string;
		  }
		| {
				icon?: typeof Icon;
				valueFirst: string | number | null;
				valueSecond?: string | number | null;
				unit: string;
				values?: never;
				defaultValue?: string;
		  } = $props();

	let defaultValue = $derived(props.defaultValue ?? "?");
</script>

<div class="flex">
	<div
		class="flex gap-2 p-2 rounded-s preset-filled-surface-100-900 border-2 border-surface-950"
	>
		{#if props.values === undefined}
			{#if props.icon}
				{@const Icon = props.icon}
				<span>
					<Icon />
				</span>
			{/if}
			<span class="flex gap-2">
				<span>
					{props.valueFirst ?? defaultValue}
				</span>
				{#if props.valueSecond !== undefined}
					<span>-</span>

					<span
						>{props.valueSecond ??
							defaultValue}</span
					>
				{/if}
			</span>
		{:else}
			{@render props.values()}
		{/if}
	</div>

	<div
		class="p-2 rounded-e preset-filled-surface-50-950 flex items-center"
	>
		{#if typeof props.unit == "string"}
			{props.unit}
		{:else}
			{@render props.unit()}
		{/if}
	</div>
</div>
