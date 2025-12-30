/** Type wrapper for saved models. */
export type Saved<T> = T & { id: number };
/** Type wrapper for unsaved models. */
export type Unsaved<T> = T & { id?: never };
/** Type wrapper where the save status is unknown. */
export type Option<T> = Saved<T> | Unsaved<T>;

export interface DatabaseTea {
	id: number,
	name: string,
	description: string | null,
	rating: number | null,
	country_of_origin_id: null | number,
	city_of_origin_id: null | number,
	production_company_id: null | number,
	buy_company_id: null | number,
	brewing_time_low: null | number,
	brewing_time_high: null | number,
	tea_gram_per_cup: null | number,
	brewing_temperature_low: null | number,
	brewing_temperature_high: null | number,
	price_per_100gram: null | number,
}

export function isDatabaseTea(val: unknown): val is DatabaseTea {
	return typeof val == 'object' && val != null &&
		'id' in val && typeof val.id == 'number' &&
		'name' in val && typeof val.name == 'string' &&
		'description' in val && stringOrNull(val.description) &&
		'rating' in val && numberOrNull(val.rating) &&
		'country_of_origin_id' in val && numberOrNull(val.country_of_origin_id) &&
		'city_of_origin_id' in val && numberOrNull(val.city_of_origin_id) &&
		'production_company_id' in val && numberOrNull(val.production_company_id) &&
		'buy_company_id' in val && numberOrNull(val.buy_company_id) &&
		'brewing_time_low' in val && numberOrNull(val.brewing_time_low) &&
		'brewing_time_high' in val && numberOrNull(val.brewing_time_high) &&
		'tea_gram_per_cup' in val && numberOrNull(val.tea_gram_per_cup) &&
		'brewing_temperature_low' in val && numberOrNull(val.brewing_temperature_low) &&
		'brewing_temperature_high' in val && numberOrNull(val.brewing_temperature_high) &&
		'price_per_100gram' in val && numberOrNull(val.price_per_100gram)
}

export function isDatabaseTeaArray(val: unknown): val is Array<DatabaseTea> {
	return Array.isArray(val) && val.every(item => isDatabaseTea(item));
}

export interface DatabaseReview {
	id: number,
	tea_id: number,
	username: string;
	rating: number,
	review: string | null;
	created_at: string;
}

export function isDatabaseReview(val: unknown): val is DatabaseReview {
	return typeof val == 'object' && val != null &&
		'id' in val && typeof val.id == 'number' &&
		'tea_id' in val && typeof val.tea_id == 'number' &&
		'username' in val && typeof val.username == 'string' &&
		'rating' in val && typeof val.rating == 'number' &&
		'review' in val && stringOrNull(val.review) &&
		'created_at' in val && typeof val.created_at == 'string';
}

export function isDatabaseReviewArray(val: unknown): val is Array<DatabaseReview> {
	return Array.isArray(val) && val.every(item => isDatabaseReview(item));
}

/**
 * Type of tea.
 */
export interface Tea {
	name: string,
	description: string | null,
	rating: number,
	countryOfOrigin: Option<Country> | null;
	cityOfOrigin: Option<City> | null;
	productionCompany: Option<Company> | null;
	buyCompany: Option<Company> | null;
	brewingTimeLow: number | null;
	brewingTimeHigh: number | null;
	teaGramPerCup: number | null;
	brewingTemperatureLow: number | null;
	brewingTemperatureHigh: number | null;
	pricePer100gram: number | null;
	reviews: Review[];
}

/**
 * Company that produces or sells tea.
 */
export interface Company {
	name: string;
}

/**
 * Country where tea is from.
 */
export interface Country {
	name: string;
}

/**
 * City where tea is from.
 */
export interface City {
	name: string;
}

/**
 * Review of a tea. Used to create a rating of the tea.
 */
export interface Review {
	username: string;
	rating: number;
	review: string | null;
	teaId: number;
	createdAt?: Date;
}

export type Model = Tea | Company | Country | City | Review;

export function isSaved<T extends Model>(val: T): val is Saved<T> {
	return 'id' in val && typeof val.id == 'number';
}

export function isUnsaved<T extends Model>(val: T): val is Unsaved<T> {
	return !('id' in val);
}

export function stringOrNull(val: unknown): val is string | null {
	return typeof val == 'string' || val == null;
}

export function numberOrNull(val: unknown): val is number | null {
	return typeof val == 'number' || val == null;
}

export function isCompany(val: unknown): val is Option<Company> {
	return typeof val == 'object' && val != null &&
		'name' in val && typeof val.name == 'string'
}

export function isCountry(val: unknown): val is Option<Country> {
	return typeof val == 'object' && val != null &&
		'name' in val && typeof val.name == 'string'
}

export function isCity(val: unknown): val is Option<City> {
	return typeof val == 'object' && val != null &&
		'name' in val && typeof val.name == 'string'
}

export function isReview(val: unknown): val is Option<Review> {
	return typeof val == 'object' && val != null &&
		'username' in val && typeof val.username == 'string' &&
		'rating' in val && typeof val.rating == 'number' &&
		'review' in val && stringOrNull(val.review) &&
		'teaId' in val && typeof val.teaId == 'number';

}

export function isTea(val: unknown): val is Option<Tea> {
	return typeof val == 'object' && val != null &&
		'name' in val && typeof val.name == 'string' &&
		'description' in val && stringOrNull(val.description) &&
		'rating' in val && typeof val.rating == 'number' &&
		'countryOfOrigin' in val && (val.countryOfOrigin == null || isCountry(val.countryOfOrigin)) &&
		'cityOfOrigin' in val && (val.cityOfOrigin == null || isCity(val.cityOfOrigin)) &&
		'productionCompany' in val && (val.productionCompany == null || isCompany(val.productionCompany)) &&
		'buyCompany' in val && (val.buyCompany == null || isCompany(val.buyCompany)) &&
		'brewingTimeLow' in val && numberOrNull(val.brewingTimeLow) &&
		'brewingTimeHigh' in val && numberOrNull(val.brewingTimeHigh) &&
		'teaGramPerCup' in val && numberOrNull(val.teaGramPerCup) &&
		'brewingTemperatureLow' in val && numberOrNull(val.brewingTemperatureLow) &&
		'brewingTemperatureHigh' in val && numberOrNull(val.brewingTemperatureHigh) &&
		'pricePer100gram' in val && numberOrNull(val.pricePer100gram) &&
		'reviews' in val && Array.isArray(val.reviews);
}

export function isSavedTeaArray(val: unknown): val is Array<Saved<Tea>> {
	return Array.isArray(val) && val.every(item => isTea(item) && isSaved(item));
}

export function isReviewArray(val: unknown): val is Array<Option<Review>> {
	return Array.isArray(val) && val.every(item => isReview(item));
}
