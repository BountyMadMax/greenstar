import type { PageLoad } from './$types';
import db from '$lib/database';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const tea = await db.loadTeaById(Number(params.id));

	if (!tea) {
		error(404, { message: 'Not found' });
	}

	return {
		tea: tea,
	};
}

