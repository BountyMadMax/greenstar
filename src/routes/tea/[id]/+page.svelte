<script lang="ts">
	import type { PageProps } from "./$types";
	import Layout from "$lib/components/Layout.svelte";
	import ReviewList from "$lib/components/ReviewList.svelte";
	import BackButton from "$lib/components/BackButton.svelte";
	import { RatingGroup } from "@skeletonlabs/skeleton-svelte";
	import {
		Coffee,
		Euro,
		Star,
		StarHalf,
		Thermometer,
		Timer,
	} from "@lucide/svelte";

	let { data }: PageProps = $props();

	let tea = $state(data.tea);

	$effect(() => {
		tea = data.tea;
	});
</script>

{#snippet main()}
	<div class="grid gap-4 p-4">
		<div class="flex justify-between flex-wrap">
			<h1 class="h1">{tea.name}</h1>

			<RatingGroup count={5} value={tea.rating} disabled>
				<RatingGroup.Control>
					<RatingGroup.Context>
						{#snippet children(ratingGroup)}
							{#snippet empty()}
								<Star
									size={48}
								/>
							{/snippet}

							{#snippet half()}
								<StarHalf
									size={48}
									fill="currentColor"
								/>
							{/snippet}

							{#snippet full()}
								<Star
									size={48}
									fill="currentColor"
								/>
							{/snippet}

							{#each ratingGroup().items as index (index)}
								<RatingGroup.Item
									{index}
									{empty}
									{half}
									{full}
								/>
							{/each}
						{/snippet}
					</RatingGroup.Context>
				</RatingGroup.Control>
				<RatingGroup.HiddenInput />
			</RatingGroup>
		</div>
		<div class="grid gap-2">
			<p>
				{tea.description}
			</p>

			<div>
				<div>
					<span>{tea.countryOfOrigin?.name}</span>
					<span>{tea.cityOfOrigin?.name}</span>
				</div>

				<div>
					<span
						>{tea.productionCompany
							?.name}</span
					>
					<span>{tea.buyCompany?.name}</span>
				</div>
			</div>

			<div class="flex gap-4 items-center flex-wrap">
				<div class="flex">
					<div
						class="flex gap-2 p-2 rounded-s preset-filled-surface-100-900"
					>
						<span> <Timer /> </span>
						<span class="flex gap-2">
							<span
								>{tea.brewingTimeLow}</span
							>
							<span>-</span>
							<span
								>{tea.brewingTimeHigh}</span
							>
						</span>
					</div>
					<div
						class="p-2 rounded-e preset-filled-surface-50-950"
					>
						Minutes
					</div>
				</div>
				<div class="flex">
					<div
						class="flex gap-2 p-2 rounded-s preset-filled-surface-100-900"
					>
						<span> <Thermometer /> </span>
						<span class="flex gap-2">
							<span
								>{tea.brewingTemperatureLow}</span
							>
							<span>-</span>
							<span
								>{tea.brewingTemperatureHigh}</span
							>
						</span>
					</div>
					<div
						class="p-2 rounded-e preset-filled-surface-50-950"
					>
						<span>°C</span>
					</div>
				</div>

				<div class="flex">
					<div
						class="flex gap-2 p-2 rounded-s preset-filled-surface-100-900"
					>
						<span> <Coffee /> </span>
						<span>{tea.teaGramPerCup}</span>
					</div>
					<div
						class="p-2 rounded-e preset-filled-surface-50-950"
					>
						<span>Gram</span>
					</div>
				</div>
				<div class="flex">
					<div
						class="flex gap-2 p-2 rounded-s preset-filled-surface-100-900"
					>
						<span class="flex items-center"
							>{tea.pricePer100gram}
							<Euro size={16} /></span
						>
					</div>
					<div
						class="p-2 rounded-e preset-filled-surface-50-950"
					>
						<span>100 gr.</span>
					</div>
				</div>
			</div>
		</div>
		<div>
			<ReviewList bind:tea />
		</div>
	</div>
{/snippet}

{#snippet footer()}
	<BackButton />
{/snippet}

<Layout {main} {footer} />
