<script lang="ts">
	import Layout from "$lib/components/Layout.svelte";
	import BackButton from "$lib/components/BackButton.svelte";
	import { Cross, Euro, Save, X } from "@lucide/svelte";
	import db from "$lib/database";
	import type { Tea, Unsaved } from "$lib/models";
	import { goto } from "$app/navigation";
	import TeaForm from "$lib/components/TeaForm.svelte";
	import { Navigation } from "@skeletonlabs/skeleton-svelte";

	let tea: Unsaved<Tea> = $state({
		name: "",
		description: null,
		rating: 0,
		countryOfOrigin: null,
		cityOfOrigin: null,
		productionCompany: null,
		buyCompany: null,
		brewingTimeLow: null,
		brewingTimeHigh: null,
		brewingTemperatureLow: null,
		brewingTemperatureHigh: null,
		teaGramPerCup: null,
		pricePer100gram: null,
		reviews: [],
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

			const countryOfOriginValue =
				formData.get("country_of_origin");
			tea.countryOfOrigin = countryOfOriginValue
				? (
						await db.loadCountryByName(
							countryOfOriginValue.toString(),
						)
					)[0] || null
				: null;

			tea.name = name;
			tea.description = description;
			tea.rating = 0;
			tea.cityOfOrigin = null;
			tea.productionCompany = null;
			tea.buyCompany = null;
			tea.brewingTimeLow = brewingTimeLow;
			tea.brewingTimeHigh = brewingTimeHigh;
			tea.brewingTemperatureLow = brewingTemperatureLow;
			tea.brewingTemperatureHigh = brewingTemperatureHight;
			tea.teaGramPerCup = teaGramPerCup;
			tea.pricePer100gram = pricePer100Gram;
			tea.reviews = [];

			const result = await db.createTea(tea);

			if (result != false) {
				goto(`/tea/${result.id}`);
			}
		}
	}

	function submitForm(): void {
		const form = document.getElementById("tea-form");

		if (form instanceof HTMLFormElement) form.requestSubmit();
	}
</script>

{#snippet main()}
	<div class="grid gap-4 w-fit mx-auto py-4">
		<h1 class="h4">Add tea</h1>

		<TeaForm bind:tea {handleSubmit} id="tea-form" />
	</div>
{/snippet}

{#snippet footer()}
	<Navigation layout="bar">
		<Navigation.Menu class="grid grid-cols-2 gap-2">
			<Navigation.TriggerAnchor
				href="/"
				class="preset-filled-warning-100-900"
			>
				<X />
				<Navigation.TriggerText
					class="font-bold text-xs"
					>Cancel</Navigation.TriggerText
				>
			</Navigation.TriggerAnchor>
			<Navigation.Trigger
				class="preset-filled-primary-100-900"
				onclick={submitForm}
			>
				<Save />
				<Navigation.TriggerText
					class="font-bold text-xs"
					>Save</Navigation.TriggerText
				>
			</Navigation.Trigger>
		</Navigation.Menu>
	</Navigation>
{/snippet}

<Layout {main} {footer} />
