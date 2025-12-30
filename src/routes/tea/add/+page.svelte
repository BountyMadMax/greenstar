<script lang="ts">
	import Layout from "$lib/components/Layout.svelte";
	import BackButton from "$lib/components/BackButton.svelte";
	import { Euro } from "@lucide/svelte";
	import db from "$lib/database";
	import type { Tea, Unsaved } from "$lib/models";
	import { goto } from "$app/navigation";

	let brewingTimeLow: null | number = $state(null);
	let brewingTimeHigh: null | number = $state(null);

	$effect(() => {
		if (!brewingTimeLow) {
		} else if (!brewingTimeHigh) {
			brewingTimeHigh = brewingTimeLow + 1;
		} else if (brewingTimeLow >= brewingTimeHigh) {
			brewingTimeHigh++;
		}
	});

	let brewingTemperatureLow: null | number = $state(null);
	let brewingTemperatureHigh: null | number = $state(null);

	$effect(() => {
		if (!brewingTemperatureLow) {
		} else if (!brewingTemperatureHigh) {
			brewingTemperatureHigh = brewingTemperatureLow + 1;
		} else if (brewingTemperatureLow >= brewingTemperatureHigh) {
			brewingTemperatureHigh++;
		}
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (event.target instanceof HTMLFormElement) {
			const formData = new FormData(
				event.target,
				event.submitter,
			);

			let name = formData.get("name");
			if (!name) {
				// ToDo: Error handling.
				return;
			}
			name = name.toString();

			const description =
				formData.get("description")?.toString() || "";

			const brewingTimeLow =
				Number(
					formData
						.get("brewing_time_low")
						?.toString(),
				) || null;
			const brewingTimeHigh =
				Number(
					formData
						.get("brewing_time_high")
						?.toString(),
				) || null;
			const brewingTemperatureLow =
				Number(
					formData
						.get("brewing_temperature_low")
						?.toString(),
				) || null;
			const brewingTemperatureHight =
				Number(
					formData
						.get("brewing_temperature_high")
						?.toString(),
				) || null;

			const teaGramPerCup =
				Number(
					formData
						.get("tea_gram_per_cup")
						?.toString(),
				) || null;
			const pricePer100Gram =
				Number(
					formData
						.get("price_per_100gram")
						?.toString(),
				) || null;

			const tea: Unsaved<Tea> = {
				name: name,
				description: description,
				rating: 0,
				countryOfOrigin: null,
				cityOfOrigin: null,
				productionCompany: null,
				buyCompany: null,
				brewingTimeLow: brewingTimeLow,
				brewingTimeHigh: brewingTimeHigh,
				brewingTemperatureLow: brewingTemperatureLow,
				brewingTemperatureHigh: brewingTemperatureHight,
				teaGramPerCup: teaGramPerCup,
				pricePer100gram: pricePer100Gram,
				reviews: [],
			};

			const result = await db.createTea(tea);

			if (result != false) {
				goto(`/tea/${result.id}`);
			}
		}
	}
</script>

{#snippet main()}
	<div class="grid gap-4 w-fit mx-auto py-4">
		<h1 class="h4">Add tea</h1>

		<form class="grid gap-4 w-fit" onsubmit={handleSubmit}>
			<fieldset>
				<label class="label">
					<span class="label-text">Name</span>
					<input
						name="name"
						class="input preset-filled-surface-100-900 w-fit"
						type="text"
						required
						size="45"
					/>
				</label>
			</fieldset>

			<fieldset>
				<label class="label">
					<span class="label-text"
						>Description</span
					>
					<textarea
						name="description"
						class="input preset-filled-surface-100-900 w-fit resize-none"
						cols="46"
						rows="4"
					></textarea>
				</label>
			</fieldset>

			<fieldset class="flex gap-4 w-fit">
				<label class="label">
					<span class="label-text"
						>Country of origin</span
					>
					<input
						name="country_of_origin"
						class="input preset-filled-surface-100-900 w-fit"
						type="text"
					/>
				</label>
				<label class="label">
					<span class="label-text"
						>City of origin</span
					>
					<input
						name="city_of_origin"
						class="input preset-filled-surface-100-900 w-fit"
						type="text"
					/>
				</label>
			</fieldset>

			<fieldset class="flex gap-4 w-fit">
				<label class="label">
					<span class="label-text"
						>Production Company</span
					>
					<input
						name="production_company"
						class="input preset-filled-surface-100-900 w-fit"
						type="text"
					/>
				</label>
				<label class="label">
					<span class="label-text"
						>Buy company</span
					>
					<input
						name="buy_company"
						class="input preset-filled-surface-100-900 w-fit"
						type="text"
					/>
				</label>
			</fieldset>

			<fieldset class="flex gap-4 w-fit">
				<label class="label">
					<span class="label-text"
						>Tea per cup in gram</span
					>
					<div
						class="input-group grid-cols-[1fr_auto]"
					>
						<input
							name="tea_gram_per_cup"
							class="ig-input preset-filled-surface-100-900 w-fit"
							type="text"
							placeholder="3"
							size="13"
						/>
						<div
							class="ig-cell preset-filled-surface-50-950"
						>
							gram
						</div>
					</div>
				</label>
				<label class="label">
					<span class="label-text"
						>Price per 100 gram</span
					>
					<div
						class="input-group grid-cols-[1fr_auto]"
					>
						<input
							name="price_per_100gram"
							class="ig-input preset-filled-surface-100-900 w-fit"
							type="text"
							size="15"
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
					<span class="label-text"
						>Brewing time low</span
					>
					<div
						class="input-group grid-cols-[1fr_auto]"
					>
						<input
							name="brewing_time_low"
							class="ig-input preset-filled-surface-100-900 w-31"
							bind:value={
								brewingTimeLow
							}
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
					<span class="label-text"
						>Brewing time high</span
					>
					<div
						class="input-group grid-cols-[1fr_auto]"
					>
						<input
							name="brewing_time_high"
							class="ig-input preset-filled-surface-100-900 w-31"
							bind:value={
								brewingTimeHigh
							}
							placeholder="3"
							min={brewingTimeLow}
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
					<span class="label-text"
						>Brewing temperature low</span
					>
					<div
						class="input-group grid-cols-[1fr_auto]"
					>
						<input
							name="brewing_temperature_low"
							class="ig-input preset-filled-surface-100-900 w-43"
							bind:value={
								brewingTemperatureLow
							}
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
					<span class="label-text"
						>Brewing temperature high</span
					>
					<div
						class="input-group grid-cols-[1fr_auto]"
					>
						<input
							name="brewing_temperature_high"
							class="ig-input preset-filled-surface-100-900 w-43"
							bind:value={
								brewingTemperatureHigh
							}
							placeholder="85"
							min={brewingTemperatureLow}
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
			<div class="flex align-middle justify-end">
				<button
					type="submit"
					class="btn preset-filled-primary-500 hover:preset-filled-primary-600-400 active:preset-filled-primary-600-400 btn-lg"
					>Add</button
				>
			</div>
		</form>
	</div>
{/snippet}

{#snippet footer()}
	<BackButton />
{/snippet}

<Layout {main} {footer} />
