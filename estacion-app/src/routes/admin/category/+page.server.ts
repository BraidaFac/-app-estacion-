import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		throw redirect(302, '/');
	}
	return {
		categories: prismaClient.category.findMany(),
		brands: prismaClient.brand.findMany()
	};
}) satisfies PageServerLoad;
export const actions: Actions = {
	create: async ({ request }) => {
		const { name } = Object.fromEntries(await request.formData()) as {
			name: string;
		};
		try {
			await prismaClient.category.create({ data: { name } });
		} catch (err) {
			return JSON.stringify(err);
		}
	},
	delete: async ({ request, url }) => {
		try {
			const id = url.searchParams.get('id');
			if (!id) {
				return {
					status: 404,
					body: { error: 'id not found' }
				};
			}
			await prismaClient.category.delete({ where: { id: id } });
		} catch (err) {
			return JSON.stringify(err);
		}
	}
};
