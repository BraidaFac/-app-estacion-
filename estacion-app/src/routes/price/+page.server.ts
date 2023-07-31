import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prismaClient } from '$lib/server/prisma';
import type { Product } from '../../types';

export const load: PageServerLoad = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/');
	}

	return {
		products: (await prismaClient.product.findMany({
			include: {
				price: {
					where: {
						current_price: true
					},
					select: { price: true }
				},
				category: {
					select: { name: true }
				},
				brand: {
					select: { name: true }
				}
			}
		})) as Product[],
		categories: prismaClient.category.findMany(),
		brands: prismaClient.brand.findMany()
	};
}) satisfies PageServerLoad;
export const actions: Actions = {
	dafault: async ({ request }) => {
		const data = request.body;
		console.log(data);
		try {
			redirect(304, '/');
		} catch (err) {
			return {};
		}
	}
} satisfies Actions;
