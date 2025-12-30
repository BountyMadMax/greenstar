<script lang="ts">
	import type { Saved, Tea } from "$lib/models";
	import { Star, StarHalf } from "@lucide/svelte";
	import { RatingGroup } from "@skeletonlabs/skeleton-svelte";

	let { list }: { list: Array<Saved<Tea>> } = $props();
</script>

<ul class="w-full">
	{#each list as item, index}
		<li
			class="card w-full preset-filled-surface-100-900 hover:preset-filled-surface-200-800 active:preset-filled-surface-200-800 {index >
			0
				? 'mt-2'
				: ''}"
		>
			<a href={`/tea/${item.id}`} class="p-4 block">
				<div class="flex items-center">
					<h4 class="h4 mr-auto">{item.name}</h4>

					<RatingGroup
						count={5}
						defaultValue={item.rating || 0}
						disabled={true}
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
					</RatingGroup>
				</div>
				<p>
					{item.description}
				</p>
			</a>
		</li>
	{/each}
</ul>
