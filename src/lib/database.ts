import Database from '@tauri-apps/plugin-sql';
import { type Tea, type Company, type Country, type City, type Saved, type Unsaved, isSaved, isTea, isSavedTeaArray, isDatabaseTea, isCountry, isCity, isCompany, isDatabaseTeaArray, type DatabaseTea, type Review, isDatabaseReviewArray, type DatabaseReview } from '$lib/models';

export default {
	DATABASE: 'greenstar.db',

	getDatabase(): Promise<Database> {
		return Database.load(`sqlite:${this.DATABASE}`);
	},

	/**
	 * Loads the tea by the given id.
	 */
	async loadTeaById(id: number, { db, closeDatabase = true }: { db?: Database, closeDatabase?: boolean } = {}): Promise<Saved<Tea> | null> {
		db = db ?? await this.getDatabase();

		let query = await db.select(
			'SELECT * FROM teas WHERE id = $1',
			[id]
		);

		if (Array.isArray(query) && query.length == 1 && isDatabaseTea(query[0])) {
			const tea = this.databaseTeaToSavedTea(query[0]);

			if (closeDatabase) db.close();
			return tea;
		} else {
			if (closeDatabase) db.close();
			return null;
		}
	},

	async databaseTeaToSavedTea(tea: DatabaseTea, { db }: { db?: Database } = {}): Promise<Saved<Tea>> {
		return {
			id: tea.id,
			name: tea.name,
			description: tea.description,
			rating: tea.rating || 0,
			countryOfOrigin: tea.country_of_origin_id ? await this.loadCountryById(tea.country_of_origin_id, { db: db, closeDatabase: false }) : null,
			cityOfOrigin: tea.city_of_origin_id ? await this.loadCityById(tea.city_of_origin_id, { db, closeDatabase: false }) : null,
			productionCompany: tea.production_company_id ? await this.loadCompanyById(tea.production_company_id, { db, closeDatabase: false }) : null,
			buyCompany: tea.buy_company_id ? await this.loadCompanyById(tea.buy_company_id, { db, closeDatabase: false }) : null,
			brewingTimeLow: tea.brewing_time_low,
			brewingTimeHigh: tea.brewing_time_high,
			teaGramPerCup: tea.tea_gram_per_cup,
			brewingTemperatureLow: tea.brewing_temperature_low,
			brewingTemperatureHigh: tea.brewing_temperature_high,
			pricePer100gram: tea.price_per_100gram,
			reviews: await this.loadReviewsByTeaId(tea.id, { db, closeDatabase: false }),
		}
	},

	async loadCountryById(id: number, { db, closeDatabase = true }: { db?: Database, closeDatabase?: boolean } = {}): Promise<Saved<Country> | null> {
		db = db ?? await this.getDatabase();

		let query = await db.select('SELECT * FROM countries WHERE id = $1', [id]);

		if (closeDatabase) db.close();
		if (Array.isArray(query) && query.length == 1 && isCountry(query[0]) && isSaved(query[0])) {
			return query[0];
		} else {
			return null;
		}
	},

	async loadCityById(id: number, { db, closeDatabase = true }: { db?: Database, closeDatabase?: boolean } = {}): Promise<Saved<City> | null> {
		db = db ?? await this.getDatabase();

		let query = await db.select('SELECT * FROM cities WHERE id = $1', [id]);

		if (closeDatabase) db.close();
		if (Array.isArray(query) && query.length == 1 && isCity(query[0]) && isSaved(query[0])) {
			return query[0];
		} else {
			return null;
		}
	},

	async loadCompanyById(id: number, { db, closeDatabase = true }: { db?: Database, closeDatabase?: boolean } = {}): Promise<Saved<Company> | null> {
		db = db ?? await this.getDatabase();

		let query = await db.select('SELECT * FROM companies WHERE id = $1', [id]);

		if (closeDatabase) db.close();
		if (Array.isArray(query) && query.length == 1 && isCompany(query[0]) && isSaved(query[0])) {
			return query[0];
		} else {
			return null;
		}
	},

	/**
	 * Loads all the tea.
	 */
	async loadTea(): Promise<Array<Saved<Tea>>> {
		const db = await this.getDatabase();

		let query = await db.select(
			'SELECT * FROM teas',
		);


		if (isDatabaseTeaArray(query)) {
			const tea = await Promise.all(query.map((tea) => this.databaseTeaToSavedTea(tea, { db })));
			db.close();
			return tea;
		} else {
			db.close();
			return [];
		}
	},

	async loadReviewsByTeaId(teaId: number, { db, closeDatabase = true }: { db?: Database, closeDatabase?: boolean } = {}): Promise<Array<Saved<Review>>> {
		db = db ?? await this.getDatabase();

		let query = await db.select('SELECT * FROM reviews WHERE tea_id = $1', [teaId]);

		if (closeDatabase) db.close();
		if (Array.isArray(query) && isDatabaseReviewArray(query)) {
			return Promise.all(query.map((review) => this.databaseReviewToSavedReview(review)));
		} else {
			return [];
		}
	},

	async databaseReviewToSavedReview(review: DatabaseReview): Promise<Saved<Review>> {
		return {
			id: review.id,
			username: review.username,
			rating: review.rating,
			review: review.review,
			createdAt: new Date(review.created_at),
			teaId: review.tea_id
		};
	},

	async saveTea(tea: Saved<Tea>): Promise<boolean> {
		const db = await this.getDatabase();

		let query = await db.execute(
			'UPDATE teas SET name=$1, description=$2, rating=$3, brewing_time_low=$4, brewing_time_high=$5, tea_gram_per_cup=$6, brewing_temperature_low=$7, brewing_temperature_high=$8, price_per_100gram=$9 WHERE id=$10',
			[tea.name, tea.description, tea.rating, tea.brewingTimeLow, tea.brewingTimeHigh, tea.teaGramPerCup, tea.brewingTemperatureLow, tea.brewingTemperatureHigh, tea.pricePer100gram, tea.id]
		);
		db.close();

		return query.rowsAffected == 1;
	},

	async createTea(tea: Unsaved<Tea>): Promise<Saved<Tea> | false> {
		const db = await this.getDatabase();

		let query = await db.execute(
			'INSERT into teas (name, description, rating, brewing_time_low, brewing_time_high, tea_gram_per_cup, brewing_temperature_low, brewing_temperature_high, price_per_100gram) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
			[tea.name, tea.description, tea.rating, tea.brewingTimeLow, tea.brewingTimeHigh, tea.teaGramPerCup, tea.brewingTemperatureLow, tea.brewingTemperatureHigh, tea.pricePer100gram]
		);
		db.close();

		if (typeof query.lastInsertId == 'number') {
			const savedTea: Saved<Tea> = {
				...tea,
				id: query.lastInsertId
			};

			return savedTea;
		} else {
			return false;
		}
	},

	async createReview(review: Unsaved<Review>): Promise<Saved<Review> | false> {
		const db = await this.getDatabase();

		if (!review.createdAt) review.createdAt = new Date();

		let query = await db.execute(
			'INSERT into reviews (username, rating, review, tea_id, created_at) VALUES ($1, $2, $3, $4, $5)',
			[review.username, review.rating, review.review, review.teaId, review.createdAt]
		);

		db.close();

		if (typeof query.lastInsertId == 'number') {
			const savedReview: Saved<Review> = {
				...review,
				id: query.lastInsertId
			};

			return savedReview;
		} else {
			return false;
		}
	}
}

