import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prismaClient } from '$lib/server/prisma';
import type { Price, Product } from '../../../types';

export const load: PageServerLoad = (async ({ params, locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/');
	}
	return {
		prices: await prismaClient.price.findMany({
			where: {
				product_id: params.product
			},
			select: {
				price: true,
				date: true,
				id: true
			}
		}),
		product: await prismaClient.product.findUnique({
			where: {
				id: params.product
			}
		})
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
