import Database from '@tauri-apps/plugin-sql';
import { type Tea, type Company, type Country, type City, type Saved, type Unsaved, isSaved, isDatabaseTea, isCountry, isCity, isCompany, isDatabaseTeaArray, type DatabaseTea, type Review, isDatabaseReviewArray, type DatabaseReview, isSavedCountryArray, isReview, isSavedCityArray, isSavedCompanyArray, isUnsaved } from '$lib/models';

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
			const tea = await this.databaseTeaToSavedTea(query[0]);

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
			countryOfOrigin: tea.country_of_origin_id ? await this.loadCountryById(tea.country_of_origin_id, { db, closeDatabase: false }) : null,
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

	async loadCountryByName(name: string, { db, closeDatabase = true, operator = 'eq', limit = 10 }: { db?: Database, closeDatabase?: boolean, operator?: 'eq' | 'matches', limit?: number } = {}): Promise<Array<Saved<Country>>> {
		db = db ?? await this.getDatabase();

		let query = operator == 'eq' ? await db.select('SELECT * FROM countries WHERE name = $1 LIMIT $2', [name, limit]) : await db.select('SELECT * FROM countries WHERE name LIKE $1 LIMIT $2', [`%${name}%`, limit]);

		if (closeDatabase) db.close();
		if (isSavedCountryArray(query)) {
			return query;
		} else {
			return [];
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

	async loadCityByName(name: string, { db, closeDatabase = true, operator = 'eq', limit = 10 }: { db?: Database, closeDatabase?: boolean, operator?: 'eq' | 'matches', limit?: number } = {}): Promise<Array<Saved<City>>> {
		db = db ?? await this.getDatabase();

		let query = operator == 'eq' ? await db.select('SELECT * FROM cities WHERE name = $1 LIMIT $2', [name, limit]) : await db.select('SELECT * FROM cities WHERE name LIKE $1 LIMIT $2', [`%${name}%`, limit]);

		if (closeDatabase) db.close();
		if (isSavedCityArray(query)) {
			return query;
		} else {
			return [];
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

	async loadCompanyByName(name: string, { db, closeDatabase = true, operator = 'eq', limit = 10 }: { db?: Database, closeDatabase?: boolean, operator?: 'eq' | 'matches', limit?: number } = {}): Promise<Array<Saved<Company>>> {
		db = db ?? await this.getDatabase();

		let query = operator == 'eq' ? await db.select('SELECT * FROM companies WHERE name = $1 LIMIT $2', [name, limit]) : await db.select('SELECT * FROM companies WHERE name LIKE $1 LIMIT $2', [`%${name}%`, limit]);

		if (closeDatabase) db.close();
		if (isSavedCompanyArray(query)) {
			return query;
		} else {
			return [];
		}
	},

	/**
	 * Loads all the tea.
	 */
	async loadTea(): Promise<Array<Saved<Tea>>> {
		const db = await this.getDatabase();

		let query = await db.select('SELECT * FROM teas ORDER BY rating DESC');

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

	async loadReviewById(id: number, { db, closeDatabase = true }: { db?: Database, closeDatabase?: boolean } = {}): Promise<Saved<Review> | null> {
		db = db ?? await this.getDatabase();

		let query = await db.select('SELECT * FROM reviews WHERE id = $1', [id]);

		if (closeDatabase) db.close();

		if (Array.isArray(query) && query.length == 1 && isReview(query[0]) && isSaved(query[0])) {
			return query[0];
		} else {
			return null;
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

		if (tea.countryOfOrigin && isUnsaved(tea.countryOfOrigin)) {
			const savedCountryOfOrigin = await this.createCountry(tea.countryOfOrigin, { db, closeDatabase: false });
			if (savedCountryOfOrigin) tea.countryOfOrigin = savedCountryOfOrigin;
		}
		if (tea.cityOfOrigin && isUnsaved(tea.cityOfOrigin)) {
			const savedCityOfOrigin = await this.createCity(tea.cityOfOrigin, { db, closeDatabase: false });
			if (savedCityOfOrigin) tea.cityOfOrigin = savedCityOfOrigin;
		}
		if (tea.productionCompany && isUnsaved(tea.productionCompany)) {
			const savedProductionCompany = await this.createCompany(tea.productionCompany, { db, closeDatabase: false });
			if (savedProductionCompany) tea.productionCompany = savedProductionCompany;
		}
		if (tea.buyCompany && isUnsaved(tea.buyCompany)) {
			const savedBuyCompany = await this.createCompany(tea.buyCompany, { db, closeDatabase: false });
			if (savedBuyCompany) tea.buyCompany = savedBuyCompany;
		}

		let query = await db.execute(
			'INSERT into teas (name, description, rating, brewing_time_low, brewing_time_high, tea_gram_per_cup, brewing_temperature_low, brewing_temperature_high, price_per_100gram, country_of_origin_id, city_of_origin_id, production_company_id, buy_company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
			[tea.name, tea.description, tea.rating, tea.brewingTimeLow, tea.brewingTimeHigh, tea.teaGramPerCup, tea.brewingTemperatureLow, tea.brewingTemperatureHigh, tea.pricePer100gram, tea.countryOfOrigin?.id, tea.cityOfOrigin?.id, tea.productionCompany?.id, tea.buyCompany?.id]
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

	async createCountry(country: Unsaved<Country>, { db, closeDatabase = true }: { db?: Database, closeDatabase?: boolean } = {}): Promise<Saved<Country> | false> {
		db = db ?? await this.getDatabase();

		let query = await db.execute('INSERT into countries (name) VALUES ($1)', [country.name]);

		if (closeDatabase) db.close();
		if (typeof query.lastInsertId == 'number') {
			const savedCountry: Saved<Country> = {
				...country,
				id: query.lastInsertId
			};

			return savedCountry;
		} else {
			return false;
		}
	},

	async createCity(city: Unsaved<City>, { db, closeDatabase = true }: { db?: Database, closeDatabase?: boolean } = {}): Promise<Saved<City> | false> {
		db = db ?? await this.getDatabase();

		let query = await db.execute('INSERT into cities (name) VALUES ($1)', [city.name]);

		if (closeDatabase) db.close();
		if (typeof query.lastInsertId == 'number') {
			const savedCity: Saved<City> = {
				...city,
				id: query.lastInsertId
			};

			return savedCity;
		} else {
			return false;
		}
	},

	async createCompany(company: Unsaved<Company>, { db, closeDatabase = true }: { db?: Database, closeDatabase?: boolean } = {}): Promise<Saved<Company> | false> {
		db = db ?? await this.getDatabase();

		let query = await db.execute('INSERT into companies (name) VALUES ($1)', [company.name]);

		if (closeDatabase) db.close();
		if (typeof query.lastInsertId == 'number') {
			const savedCompany: Saved<Company> = {
				...company,
				id: query.lastInsertId
			};

			return savedCompany;
		} else {
			return false;
		}
	},

	async updateTea(tea: Saved<Tea>): Promise<boolean> {
		const db = await this.getDatabase();

		let query = await db.execute(
			'UPDATE teas SET name = $2, description = $3, rating = $4, brewing_time_low = $5, brewing_time_high = $6, tea_gram_per_cup = $7, brewing_temperature_low = $8, brewing_temperature_high = $9, price_per_100gram = $10 WHERE id = $1',
			[tea.id, tea.name, tea.description, tea.rating, tea.brewingTimeLow, tea.brewingTimeHigh, tea.teaGramPerCup, tea.brewingTemperatureLow, tea.brewingTemperatureHigh, tea.pricePer100gram]
		);
		db.close();

		return query.rowsAffected == 1;
	},

	async deleteTea(tea: Saved<Tea>): Promise<boolean> {
		const db = await this.getDatabase();

		await db.execute('DELETE FROM reviews WHERE tea_id = $1', [tea.id]);
		let query = await db.execute('DELETE FROM teas WHERE id = $1', [tea.id]);
		db.close();

		return query.rowsAffected == 1;
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
	},

	async updateReview(review: Saved<Review>): Promise<boolean> {
		const db = await this.getDatabase();

		let query = await db.execute(
			'UPDATE reviews SET username = $2, rating = $3, review = $4 WHERE id = $1',
			[review.id, review.username, review.rating, review.review]
		);
		db.close();

		return query.rowsAffected == 1;
	},

	async deleteReview(review: Saved<Review>): Promise<boolean> {
		const db = await this.getDatabase();

		let query = await db.execute('DELETE FROM reviews WHERE id = $1', [review.id]);
		db.close();

		return query.rowsAffected == 1;
	}
}

