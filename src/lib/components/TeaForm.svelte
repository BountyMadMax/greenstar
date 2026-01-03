<script lang="ts">
	import type { Option, Tea } from "$lib/models";
	import { Euro } from "@lucide/svelte";
	import type { Snippet } from "svelte";
	import SearchSelect from "$lib/components/SearchSelect.svelte";

	const {
		tea = $bindable(),
		actions,
		handleSubmit,
		id,
	}: {
		tea: Option<Tea>;
		actions?: Snippet;
		handleSubmit: (event: SubmitEvent) => void;
		id?: string;
	} = $props();

	function handleBrewingTemperatureLowChange() {
		if (!tea.brewingTemperatureLow) {
		} else if (
			!tea.brewingTemperatureHigh ||
			tea.brewingTemperatureLow >= tea.brewingTemperatureHigh
		) {
			tea.brewingTemperatureHigh =
				tea.brewingTemperatureLow + 1;
		}
	}

	function handleBrewingTimeLowChange() {
		if (!tea.brewingTimeLow) {
		} else if (
			!tea.brewingTimeHigh ||
			tea.brewingTimeLow >= tea.brewingTimeHigh
		) {
			tea.brewingTimeHigh = tea.brewingTimeLow + 1;
		}
	}

	let countryOfOrigin = $derived(tea.countryOfOrigin?.name || "");
	let cityOfOrigin = $derived(tea.cityOfOrigin?.name || "");
	let productionCompany = $derived(tea.productionCompany?.name || "");
	let buyCompany = $derived(tea.buyCompany?.name || "");
</script>

<form class="grid gap-4 w-fit" onsubmit={handleSubmit} {id}>
	<fieldset>
		<label class="label">
			<span class="label-text">Name</span>
			<input
				name="name"
				class="input preset-filled-surface-100-900 w-fit"
				type="text"
				bind:value={tea.name}
				required
				size="45"
			/>
		</label>
	</fieldset>

	<fieldset>
		<label class="label">
			<span class="label-text">Description</span>
			<textarea
				name="description"
				class="input preset-filled-surface-100-900 w-fit resize-none"
				bind:value={tea.description}
				cols="46"
				rows="4"
			></textarea>
		</label>
	</fieldset>

	<fieldset class="flex gap-4 w-fit">
		<SearchSelect
			name="country_of_origin"
			label="Country of origin"
			modelType="Country"
			bind:value={countryOfOrigin}
		/>
		<SearchSelect
			name="city_of_origin"
			label="City of origin"
			modelType="City"
			bind:value={cityOfOrigin}
		/>
	</fieldset>

	<fieldset class="flex gap-4 w-fit">
		<SearchSelect
			name="production_company"
			label="Production company"
			modelType="Company"
			bind:value={productionCompany}
		/>
		<SearchSelect
			name="buy_company"
			label="Buy company"
			modelType="Company"
			bind:value={buyCompany}
		/>
	</fieldset>

	<fieldset class="flex gap-4 w-fit">
		<label class="label">
			<span class="label-text">Tea per cup in gram</span>
			<div class="input-group grid-cols-[1fr_auto]">
				<input
					name="tea_gram_per_cup"
					class="ig-input preset-filled-surface-100-900 w-29"
					bind:value={tea.teaGramPerCup}
					type="number"
					placeholder="3"
				/>
				<div
					class="ig-cell preset-filled-surface-50-950"
				>
					gram
				</div>
			</div>
		</label>
		<label class="label">
			<span class="label-text">Price per 100 gram</span>
			<div class="input-group grid-cols-[1fr_auto]">
				<input
					name="price_per_100gram"
					class="ig-input preset-filled-surface-100-900 w-33"
					bind:value={tea.pricePer100gram}
					type="number"
				/>
				<div
					class="ig-cell preset-filled-surface-50-950"
				>
					<Euro size={18} />
				</div>
			</div>
		</label>
	</fieldset>

	<fieldset class="flex gap-4 w-fit">
		<label class="label">
			<span class="label-text">Brewing time low</span>
			<div class="input-group grid-cols-[1fr_auto]">
				<input
					name="brewing_time_low"
					class="ig-input preset-filled-surface-100-900 w-31"
					bind:value={tea.brewingTimeLow}
					onchange={handleBrewingTimeLowChange}
					placeholder="2"
					min="1"
					max="255"
					type="number"
				/>
				<div
					class="ig-cell preset-filled-surface-50-950"
				>
					minute(s)
				</div>
			</div>
		</label>
		<div class="self-center mt-4">-</div>
		<label class="label">
			<span class="label-text">Brewing time high</span>
			<div class="input-group grid-cols-[1fr_auto]">
				<input
					name="brewing_time_high"
					class="ig-input preset-filled-surface-100-900 w-31"
					bind:value={tea.brewingTimeHigh}
					placeholder="3"
					min={tea.brewingTimeLow}
					max="255"
					type="number"
				/>
				<div
					class="ig-cell preset-filled-surface-50-950"
				>
					minute(s)
				</div>
			</div>
		</label>
	</fieldset>

	<fieldset class="flex gap-4 w-fit">
		<label class="label">
			<span class="label-text">Brewing temperature low</span>
			<div class="input-group grid-cols-[1fr_auto]">
				<input
					name="brewing_temperature_low"
					class="ig-input preset-filled-surface-100-900 w-43"
					bind:value={tea.brewingTemperatureLow}
					onchange={handleBrewingTemperatureLowChange}
					placeholder="75"
					min="1"
					max="255"
					type="number"
				/>
				<div
					class="ig-cell preset-filled-surface-50-950"
				>
					°C
				</div>
			</div>
		</label>
		<div class="self-center mt-4">-</div>
		<label class="label">
			<span class="label-text">Brewing temperature high</span>
			<div class="input-group grid-cols-[1fr_auto]">
				<input
					name="brewing_temperature_high"
					class="ig-input preset-filled-surface-100-900 w-43"
					bind:value={tea.brewingTemperatureHigh}
					placeholder="85"
					min={tea.brewingTemperatureLow}
					max="255"
					type="number"
				/>
				<div
					class="ig-cell preset-filled-surface-50-950"
				>
					°C
				</div>
			</div>
		</label>
	</fieldset>
	{#if actions}
		<div class="flex align-middle justify-end">
			{@render actions()}
		</div>
	{/if}
</form>
