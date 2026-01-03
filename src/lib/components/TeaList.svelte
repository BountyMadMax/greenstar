<script lang="ts">
	import type { Saved, Tea } from "$lib/models";
	import {
		Coffee,
		Euro,
		Star,
		StarHalf,
		Thermometer,
		Timer,
	} from "@lucide/svelte";
	import { RatingGroup } from "@skeletonlabs/skeleton-svelte";
	import Badge from "./Badge.svelte";

	let { list }: { list: Array<Saved<Tea>> } = $props();
</script>

<ul class="w-full">
	{#each list as tea, index}
		<li
			class="card w-full preset-filled-surface-100-900 hover:preset-filled-surface-200-800 active:preset-filled-surface-200-800 {index >
			0
				? 'mt-2'
				: ''}"
		>
			<a href={`/tea/${tea.id}`} class="p-4 grid gap-4">
				<div class="flex items-center">
					<h3 class="h3 mr-auto font-bold">
						{tea.name}
					</h3>

					<RatingGroup
						count={5}
						defaultValue={tea.rating || 0}
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
				{#if tea.description}
					<p>
						{tea.description}
					</p>
				{/if}

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
				</div>
			</a>
		</li>
	{/each}
</ul>
