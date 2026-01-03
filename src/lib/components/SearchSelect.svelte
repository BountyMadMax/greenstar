<script lang="ts">
	import type {
		City,
		Company,
		Country,
		Option,
		Saved,
	} from "$lib/models";
	import {
		Combobox,
		Portal,
		useListCollection,
		type ComboboxRootProps,
	} from "@skeletonlabs/skeleton-svelte";
	import db from "$lib/database.svelte";

	type ModelMap = {
		Country: Country;
		City: City;
		Company: Company;
	};

	let {
		name,
		label,
		modelType,
		value = $bindable(),
	}: {
		name: string;
		label: string;
		modelType: keyof ModelMap;
		value: string | null;
	} = $props();

	let queryResults: Array<Option<ModelMap[typeof modelType]>> = $state(
		[],
	);
	let collection = $derived(
		useListCollection({
			items: queryResults,
			itemToString: (item) => item.name,
			itemToValue: (item) => item.name,
		}),
	);

	function search(): Promise<Array<Saved<Country | City | Company>>> {
		if (modelType == "Country") {
			return db.loadCountryByName(value || "", {
				operator: "matches",
			});
		} else if (modelType == "City") {
			return db.loadCityByName(value || "", {
				operator: "matches",
			});
		} else if (modelType == "Company") {
			return db.loadCompanyByName(value || "", {
				operator: "matches",
			});
		} else {
			return new Promise((r) => r([]));
		}
	}

	const onOpenChange = async () => {
		queryResults = await search();
	};

	const onInputValueChange: ComboboxRootProps["onInputValueChange"] =
		async (event) => {
			value = event.inputValue;
			queryResults = await search();
			if (
				!queryResults.some(
					(result) => result.name == value,
				)
			)
				queryResults.push({ name: event.inputValue });
		};
</script>

<Combobox
	class="max-w-md"
	{collection}
	{onOpenChange}
	{onInputValueChange}
	defaultInputValue={value || undefined}
	{name}
	multiple={false}
	closeOnSelect={true}
	inputBehavior="autohighlight"
>
	<Combobox.Label>{label}</Combobox.Label>
	<Combobox.Control>
		<Combobox.Input class="preset-filled-surface-100-900" />
		<Combobox.Trigger />
	</Combobox.Control>
	<Combobox.ClearTrigger>Clear</Combobox.ClearTrigger>
	<Portal>
		<Combobox.Positioner>
			<Combobox.Content>
				{#each queryResults as item (item.id)}
					<Combobox.Item {item}>
						<Combobox.ItemText
							>{item.name}</Combobox.ItemText
						>
						<Combobox.ItemIndicator />
					</Combobox.Item>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>
