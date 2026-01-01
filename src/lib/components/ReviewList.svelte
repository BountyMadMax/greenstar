<script lang="ts">
	import type { Review, Saved, Tea } from "$lib/models";
	import { Star, StarHalf } from "@lucide/svelte";
	import { RatingGroup } from "@skeletonlabs/skeleton-svelte";
	import db from "$lib/database";
	import { calcRating } from "$lib/helper";

	let {
		tea = $bindable(),
		createReview = $bindable(false),
		editReview = $bindable(false),
		showCreateBtn = false,
		showSaveBtn = false,
		formId,
	}: {
		tea: Saved<Tea>;
		createReview?: boolean;
		editReview?: boolean | number;
		showCreateBtn?: boolean;
		showSaveBtn?: boolean;
		formId?: string;
	} = $props();

	async function handleCreateReview(event: SubmitEvent) {
		event.preventDefault();

		if (event.target instanceof HTMLFormElement) {
			const formData = new FormData(
				event.target,
				event.submitter,
			);

			let username = formData.get("username")?.toString();
			if (!username) {
				// ToDo: Error handling.
				return;
			}

			let rating: undefined | string | number = formData
				.get("rating")
				?.toString();
			if (!rating) {
				//  ToDo: Error handling.
				return;
			}
			rating = Number(rating);

			let review = formData.get("review")?.toString() || null;

			const result = await db.createReview({
				username: username,
				rating: rating,
				review: review,
				teaId: tea.id,
			});

			if (result != false) {
				tea.reviews.push(result);
				tea.rating = calcRating(tea.reviews);

				await db.saveTea(tea);

				createReview = false;
			}
		}
	}

	async function handleEditReview(
		event: SubmitEvent,
		review: Saved<Review> | undefined,
	) {
		// Should not happen.
		if (!review) return;
		event.preventDefault();

		const result = await db.updateReview(review);

		if (result) {
			tea.rating = calcRating(tea.reviews);
			await db.saveTea(tea);
		}

		editReview = false;
	}
</script>

{#snippet reviewForm<R extends undefined | Saved<Review>>(
	submitCallback: (event: SubmitEvent, review: R | undefined) => void,
	review?: R,
)}
	<form
		class="grid gap-4 w-fit"
		id={formId}
		onsubmit={(event: SubmitEvent) => {
			submitCallback(event, review);
		}}
	>
		<fieldset class="flex gap-4">
			<label class="label">
				<span class="label-text"> Username </span>
				<input
					name="username"
					class="input preset-filled-surface-100-900"
					type="text"
					value={review?.username || ""}
					oninput={(event) => {
						if (review)
							review.username =
								event.currentTarget.value;
					}}
					required
				/>
			</label>
			<label class="label">
				<span class="label-text"> Rating </span>

				<RatingGroup
					count={5}
					defaultValue={review?.rating || 0}
					onValueChange={(d) => {
						if (review)
							review.rating = d.value;
					}}
					name="rating"
					required
				>
					<RatingGroup.Control>
						<RatingGroup.Context>
							{#snippet children(
								ratingGroup,
							)}
								{#snippet empty()}
									<Star
										size={36}
									/>
								{/snippet}

								{#snippet half()}
									<StarHalf
										size={36}
										fill="currentColor"
									/>
								{/snippet}

								{#snippet full()}
									<Star
										size={36}
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
			</label>
		</fieldset>
		<fieldset>
			<label class="label">
				<span class="label-text"> Review </span>
				<textarea
					name="review"
					class="input preset-filled-surface-100-900 resize-none"
					value={review?.review || ""}
					oninput={(event) => {
						if (review)
							review.review =
								event.currentTarget.value;
					}}
					rows="4"
					cols="30"
				></textarea>
			</label>
		</fieldset>
		{#if showSaveBtn}
			<div class="flex align-middle justify-end">
				<button
					type="submit"
					class="btn preset-filled-primary-500 hover:preset-filled-primary-600-400 active:preset-filled-primary-600-400 btn-lg"
				>
					Create
				</button>
			</div>
		{/if}
	</form>
{/snippet}

<div class="grid gap-4">
	<ul>
		{#each tea.reviews as review, index}
			<li id="review-{index}">
				{editReview}
				{#if typeof editReview == "number" && editReview === index}
					{@render reviewForm(
						handleEditReview,
						review,
					)}
				{:else}
					<button
						class="card block w-full p-2 rounded preset-filled-surface-100-900 {index >
						0
							? 'mt-4'
							: ''}"
						onclick={() =>
							(editReview = index)}
					>
						<div class="flex items-center">
							<h5
								class="h5 font-bold mr-auto"
							>
								{review.username}
							</h5>
							<RatingGroup
								count={5}
								defaultValue={review.rating}
								disabled={true}
							>
								<RatingGroup.Control
								>
									<RatingGroup.Context
									>
										{#snippet children(
											ratingGroup,
										)}
											{#each ratingGroup().items as index (index)}
												<RatingGroup.Item
													{index}
												/>
											{/each}
										{/snippet}
									</RatingGroup.Context>
								</RatingGroup.Control>
								<RatingGroup.HiddenInput
								/>
							</RatingGroup>
						</div>
						<div>
							<p>{review.review}</p>
						</div>
						<div
							class="flex justify-end text-sm"
						>
							{#if review.createdAt}
								{review.createdAt.toLocaleDateString()}
							{:else}
								-
							{/if}
						</div>
					</button>
				{/if}
			</li>
		{/each}
	</ul>

	<div>
		{#if createReview}
			{@render reviewForm(handleCreateReview)}
		{:else if showCreateBtn}
			<div class="flex justify-end">
				<button
					onclick={() => {
						createReview = true;
					}}
					type="submit"
					class="btn preset-filled-primary-500 hover:preset-filled-primary-600-400 active:preset-filled-primary-600-400 btn-lg"
					>Create review</button
				>
			</div>
		{/if}
	</div>
</div>
