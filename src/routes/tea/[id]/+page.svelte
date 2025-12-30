<script lang="ts">
	import type { PageProps } from "./$types";
	import Layout from "$lib/components/Layout.svelte";
	import ReviewList from "$lib/components/ReviewList.svelte";
	import BackButton from "$lib/components/BackButton.svelte";
	import { RatingGroup } from "@skeletonlabs/skeleton-svelte";
	import { Star, StarHalf } from "@lucide/svelte";

	let { data }: PageProps = $props();

	let tea = $state(data.tea);

	$effect(() => {
		tea = data.tea;
	});
</script>

{#snippet main()}
	<div class="grid gap-4 p-4">
		<div class="flex justify-between">
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
		<div>
			<p>
				{tea.description}
			</p>
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
