import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prismaClient } from '$lib/server/prisma';
import type { Product } from '../../types';

export const load: PageServerLoad = (async ({ params, locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/');
	}
	return {
		products: await prismaClient.product.findMany({
			where: {
				brand: {
					name: params.brand
				}
			},
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
			},
			orderBy: {
				category: {
					name: 'asc'
				}
			}
		}),
		categories: await prismaClient.category.findMany()
	};
}) satisfies PageServerLoad;
/* export const actions: Actions = {
	default: async ({ request }) => {
		try {
			redirect(304, '/');
		} catch (err) {
			return {};
		}
	} */
