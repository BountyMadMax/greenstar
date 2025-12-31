<script lang="ts">
	import type {
		City,
		Company,
		Country,
		Option,
		Saved,
	} from "$lib/models";
	import {
		Listbox,
		useListCollection,
	} from "@skeletonlabs/skeleton-svelte";
	import type { SelectionDetails } from "@zag-js/listbox";
	import db from "$lib/database";

	type ModelMap = {
		Country: Country;
		City: City;
		Company: Company;
	};

	let {
		name,
		modelType,
		value = $bindable(),
	}: {
		name: string;
		modelType: keyof ModelMap;
		value: string | null;
	} = $props();

	let hasFocus = $state(false);
	let queryResults: Array<Saved<ModelMap[typeof modelType]>> = $state([]);
	let collection = $derived(
		useListCollection({
			items: queryResults,
			itemToString: (item) => item.name,
			itemToValue: (item) => item.name,
		}),
	);

	async function search() {
		if (modelType == "Country") {
			queryResults = await db.loadCountryByName(value || "", {
				operator: "matches",
			});
		}
	}

	function onValueSelect(details: SelectionDetails) {
		value = details.value;
	}

	function handleBlur(event: FocusEvent) {
		const currentTarget = event.currentTarget as HTMLElement;

		if (
			!currentTarget.parentElement ||
			!currentTarget.parentElement.contains(
				event.relatedTarget as Node,
			)
		) {
			hasFocus = false;
		}
	}
</script>

<div class="grid relative">
	<input
		{name}
		bind:value
		oninput={search}
		onblur={handleBlur}
		onfocusin={() => (hasFocus = true)}
		class="input preset-filled-surface-100-900 w-fit"
		size="20"
		type="text"
	/>

	{#if queryResults.length > 0 && hasFocus}
		<Listbox
			class="w-full absolute top-8 z-10"
			{collection}
			onblur={handleBlur}
			value={value ? [value] : undefined}
			onSelect={onValueSelect}
			loopFocus={true}
		>
			<Listbox.Content>
				{#each collection.items as item (item.id)}
					<Listbox.Item {item}>
						<Listbox.ItemText
							>{item.name}</Listbox.ItemText
						>
						<Listbox.ItemIndicator />
					</Listbox.Item>
				{/each}
			</Listbox.Content>
		</Listbox>
	{/if}
</div>
