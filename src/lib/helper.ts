import type { Option, Review } from '$lib/models';

/**
 * Calculates the rating of a tea using the reviews. Always rounds to the next full or 0.5 number.
 */
export function calcRating(reviews: Array<Option<Review>>): number {
	const rawRating = reviews.reduce((rating, review) => rating + review.rating, 0) / reviews.length;
	return Math.ceil(rawRating * 2) / 2;
}
