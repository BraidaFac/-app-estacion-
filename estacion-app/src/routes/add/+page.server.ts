import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from '../price/$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/');
	}
	return {
		categories: prismaClient.category.findMany(),
		brands: prismaClient.brand.findMany()
	};
}) satisfies PageServerLoad;
export const actions: Actions = {
	product: async ({ request }) => {
		const { article, price, category_id, brand_id, description } = Object.fromEntries(
			await request.formData()
		) as {
			article: string;
			price: string;
			category_id: string;
			brand_id: string;
			description: string;
		};
		try {
			const date = new Date();
			date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
			await prismaClient.product.create({
				data: {
					article,
					price: {
						create: { price: Number(price), date: date.toISOString(), current_price: true }
					},
					category_id,
					brand_id,
					description
				}
			});
			return { success: true };
		} catch (err) {
			return fail(501, { err });
		}
	}
};
