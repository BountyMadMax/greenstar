import type { PageLoad } from './$types';
import db from '$lib/database.svelte';

export const load: PageLoad = async () => {
	return {
		tea: await db.loadTea()
	}
};

