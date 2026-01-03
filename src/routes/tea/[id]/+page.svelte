<script lang="ts">
	import type { PageProps } from "./$types";
	import Layout from "$lib/components/Layout.svelte";
	import ReviewList from "$lib/components/ReviewList.svelte";
	import {
		Dialog,
		Navigation,
		Portal,
		RatingGroup,
	} from "@skeletonlabs/skeleton-svelte";
	import {
		Coffee,
		Euro,
		List,
		Pencil,
		Save,
		Star,
		StarHalf,
		Thermometer,
		Timer,
		Trash,
		X,
	} from "@lucide/svelte";
	import Badge from "$lib/components/Badge.svelte";
	import TeaForm from "$lib/components/TeaForm.svelte";
	import db from "$lib/database.svelte";
	import { goto } from "$app/navigation";

	let { data }: PageProps = $props();

	let tea = $derived(data.tea);

	$effect(() => {
		tea = data.tea;
	});

	let createReview = $state(false);
	let editReview: false | number = $state(false);
	let showConfirmDeleteReviewDialog = $state(false);
	let editTea = $state(false);
	let showConfirmDeleteTeaDialog = $state(false);

	function submitReviewForm(): void {
		const form = document.getElementById("review-form");

		if (form instanceof HTMLFormElement) form.requestSubmit();
	}

	async function handleRevertReview(): Promise<void> {
		if (typeof editReview == "number" && tea.reviews[editReview]) {
			const loadedReview = await db.loadReviewById(
				tea.reviews[editReview].id,
			);
			if (loadedReview)
				tea.reviews[editReview] = loadedReview;
		}

		editReview = false;
	}

	async function deleteReview(): Promise<void> {
		if (typeof editReview == "number" && tea.reviews[editReview]) {
			const reviewDeleted = await db.deleteReview(
				tea.reviews[editReview],
			);

			if (reviewDeleted)
				tea.reviews = await db.loadReviewsByTeaId(
					tea.id,
				);
		}

		showConfirmDeleteReviewDialog = false;
	}

	function submitTeaForm(): void {
		const form = document.getElementById("tea-form");

		if (form instanceof HTMLFormElement) form.requestSubmit();
	}

	async function handleUpdateTea(event: SubmitEvent): Promise<void> {
		event.preventDefault();

		if (event.target instanceof HTMLFormElement) {
			const formData = new FormData(
				event.target,
				event.submitter,
			);

			const countryOfOriginValue =
				formData.get("country_of_origin");
			tea.countryOfOrigin = countryOfOriginValue
				? (
						await db.loadCountryByName(
							countryOfOriginValue.toString(),
						)
					)[0] || { name: countryOfOriginValue }
				: null;
			const cityOfOriginValue =
				formData.get("city_of_origin");
			tea.cityOfOrigin = cityOfOriginValue
				? (
						await db.loadCityByName(
							cityOfOriginValue.toString(),
						)
					)[0] || { name: cityOfOriginValue }
				: null;
			const productionCompanyValue =
				formData.get("production_company");
			tea.productionCompany = productionCompanyValue
				? (
						await db.loadCompanyByName(
							productionCompanyValue.toString(),
						)
					)[0] || { name: productionCompanyValue }
				: null;
			const buyCompanyValue = formData.get("buy_company");
			tea.buyCompany = buyCompanyValue
				? (
						await db.loadCompanyByName(
							buyCompanyValue.toString(),
						)
					)[0] || { name: buyCompanyValue }
				: null;
		}

		await db.updateTea(tea);

		editTea = false;
	}

	async function handleRevertTea(): Promise<void> {
		const loadedTea = await db.loadTeaById(tea.id);

		if (loadedTea) tea = loadedTea;

		editTea = false;
	}

	async function deleteTea(): Promise<void> {
		const teaDeleted = await db.deleteTea(tea);

		showConfirmDeleteTeaDialog = false;

		if (teaDeleted) goto("/");
	}
</script>

{#snippet main()}
	{#if editTea}
		<div class="w-fit mx-auto py-4">
			<TeaForm
				bind:tea
				handleSubmit={handleUpdateTea}
				id="tea-form"
			/>
		</div>
	{:else}
		<div class="grid gap-4 p-4">
			<div class="flex justify-between flex-wrap">
				<h1 class="h1">{tea.name}</h1>

				<RatingGroup
					count={5}
					value={tea.rating}
					disabled
				>
					<RatingGroup.Control>
						<RatingGroup.Context>
							{#snippet children(
								ratingGroup,
							)}
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
						<span
							>{tea.countryOfOrigin
								?.name}</span
						>
						<span
							>{tea.cityOfOrigin
								?.name}</span
						>
					</div>

					<div>
						<span
							>{tea.productionCompany
								?.name}</span
						>
						<span
							>{tea.buyCompany
								?.name}</span
						>
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
					bind:editReview
					formId="review-form"
				/>
			</div>
		</div>
	{/if}

	<Dialog role="alertdialog" open={showConfirmDeleteTeaDialog}>
		<Portal>
			<Dialog.Backdrop
				class="fixed inset-0 z-50 bg-error-50-950/50"
			/>
			<Dialog.Positioner
				class="fixed inset-0 z-50 flex justify-center items-center"
			>
				<Dialog.Content
					class="card preset-filled-surface-500 w-md p-4 space-y-2 shadow-xl"
				>
					<Dialog.Title class="text-2xl font-bold"
						>Delete Tea</Dialog.Title
					>
					<Dialog.Description
						>Are you sure you want to delete
						the tea?</Dialog.Description
					>
					<div class="flex justify-between">
						<Dialog.CloseTrigger
							class="btn preset-filled-warning-100-900"
							onclick={() =>
								(showConfirmDeleteTeaDialog = false)}
							>No</Dialog.CloseTrigger
						>
						<Dialog.CloseTrigger
							class="btn preset-filled-error-50-950"
							onclick={deleteTea}
							>Yes</Dialog.CloseTrigger
						>
					</div>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog>

	<Dialog role="alertdialog" open={showConfirmDeleteReviewDialog}>
		<Portal>
			<Dialog.Backdrop
				class="fixed inset-0 z-50 bg-error-50-950/50"
			/>
			<Dialog.Positioner
				class="fixed inset-0 z-50 flex justify-center items-center"
			>
				<Dialog.Content
					class="card preset-filled-surface-500 w-md p-4 space-y-2 shadow-xl"
				>
					<Dialog.Title class="text-2xl font-bold"
						>Delete Review</Dialog.Title
					>
					<Dialog.Description
						>Are you sure you want to delete
						the review?</Dialog.Description
					>
					<div class="flex justify-between">
						<Dialog.CloseTrigger
							class="btn preset-filled-warning-100-900"
							onclick={() => {
								showConfirmDeleteReviewDialog = false;
								editReview = false;
							}}
							>No</Dialog.CloseTrigger
						>
						<Dialog.CloseTrigger
							class="btn preset-filled-error-50-950"
							onclick={deleteReview}
							>Yes</Dialog.CloseTrigger
						>
					</div>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog>
{/snippet}

{#snippet footer()}
	<Navigation layout="bar">
		<Navigation.Menu
			class="grid gap-2 {createReview
				? 'grid-cols-2'
				: 'grid-cols-3'}"
		>
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
			{:else if typeof editReview == "number"}
				<Navigation.Trigger
					class="preset-filled-warning-100-900"
					onclick={handleRevertReview}
				>
					<X />
					<Navigation.TriggerText
						class="font-bold text-xs"
					>
						Cancel
					</Navigation.TriggerText>
				</Navigation.Trigger>
				<Navigation.Trigger
					class="preset-filled-error-100-900"
					onclick={() =>
						(showConfirmDeleteReviewDialog = true)}
				>
					<Trash />
					<Navigation.TriggerText
						class="font-bold text-xs"
					>
						Delete
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
			{:else if editTea}
				<Navigation.Trigger
					class="preset-filled-warning-100-900"
					onclick={handleRevertTea}
				>
					<X />
					<Navigation.TriggerText
						class="font-bold text-xs"
					>
						Cancel
					</Navigation.TriggerText>
				</Navigation.Trigger>
				<Navigation.Trigger
					class="preset-filled-error-100-900"
					onclick={() =>
						(showConfirmDeleteTeaDialog = true)}
				>
					<Trash />
					<Navigation.TriggerText
						class="font-bold text-xs"
					>
						Delete
					</Navigation.TriggerText>
				</Navigation.Trigger>
				<Navigation.Trigger
					class="preset-filled-primary-100-900"
					onclick={submitTeaForm}
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
					class="preset-filled-warning-100-900"
					onclick={() => (editTea = true)}
				>
					<Pencil />
					<Navigation.TriggerText
						class="font-bold text-xs"
						>Edit</Navigation.TriggerText
					>
				</Navigation.Trigger>
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
