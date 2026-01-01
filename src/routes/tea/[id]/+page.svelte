<script lang="ts">
	import type { PageProps } from "./$types";
	import Layout from "$lib/components/Layout.svelte";
	import ReviewList from "$lib/components/ReviewList.svelte";
	import BackButton from "$lib/components/BackButton.svelte";
	import { Navigation, RatingGroup } from "@skeletonlabs/skeleton-svelte";
	import {
		Coffee,
		Euro,
		List,
		Save,
		Star,
		StarHalf,
		Thermometer,
		Timer,
		X,
	} from "@lucide/svelte";
	import Badge from "$lib/components/Badge.svelte";

	let { data }: PageProps = $props();

	let tea = $state(data.tea);

	$effect(() => {
		tea = data.tea;
	});

	let createReview = $state(false);

	function submitReviewForm(): void {
		const form = document.getElementById("review-form");

		if (form instanceof HTMLFormElement) form.requestSubmit();
	}
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
				<Badge
					valueFirst={tea.brewingTimeLow}
					valueSecond={tea.brewingTimeHigh}
					icon={Timer}
					unit="Minutes"
				/>
				<Badge
					valueFirst={tea.brewingTemperatureLow}
					valueSecond={tea.brewingTemperatureHigh}
					icon={Thermometer}
					unit="°C"
				/>
				<Badge
					valueFirst={tea.teaGramPerCup}
					icon={Coffee}
					unit="Gram"
				/>
				<Badge
					valueFirst={tea.pricePer100gram}
					icon={Euro}
					unit="100 gr."
				/>
			</div>
		</div>
		<div>
			<ReviewList
				bind:tea
				bind:createReview
				formId="review-form"
			/>
		</div>
	</div>
{/snippet}

{#snippet footer()}
	<Navigation layout="bar">
		<Navigation.Menu class="grid grid-cols-2 gap-2">
			{#if createReview}
				<Navigation.Trigger
					class="preset-filled-warning-100-900"
					onclick={() => (createReview = false)}
				>
					<X />
					<Navigation.TriggerText
						class="font-bold text-xs"
					>
						Cancel
					</Navigation.TriggerText>
				</Navigation.Trigger>
				<Navigation.Trigger
					class="preset-filled-primary-100-900"
					onclick={submitReviewForm}
				>
					<Save />
					<Navigation.TriggerText
						class="font-bold text-xs"
					>
						Save
					</Navigation.TriggerText>
				</Navigation.Trigger>
			{:else}
				<Navigation.TriggerAnchor
					href="/"
					class="preset-filled-surface-100-900"
				>
					<List />
					<Navigation.TriggerText
						class="font-bold text-xs"
						>List</Navigation.TriggerText
					>
				</Navigation.TriggerAnchor>
				<Navigation.Trigger
					class="preset-filled-primary-100-900"
					onclick={() => (createReview = true)}
				>
					<Star />
					<Navigation.TriggerText
						class="font-bold text-xs"
						>Create</Navigation.TriggerText
					>
				</Navigation.Trigger>
			{/if}
		</Navigation.Menu>
	</Navigation>
{/snippet}

<Layout {main} {footer} />
