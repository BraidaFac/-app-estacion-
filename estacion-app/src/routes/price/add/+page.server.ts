import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from '../$types';
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
	category: async ({ request }) => {
		const { name } = Object.fromEntries(await request.formData()) as {
			name: string;
		};
		try {
			await prismaClient.category.create({ data: { name } });
		} catch (err) {
			return JSON.stringify(err);
		}
		throw redirect(304, '/price');
	},
	product: async ({ request }) => {
		const { id, price, category_id, brand_id, description } = Object.fromEntries(
			await request.formData()
		) as {
			id: string;
			price: string;
			category_id: string;
			brand_id: string;
			description: string;
		};
		try {
			await prismaClient.product.create({
				data: {
					id,
					price: {
						create: { price: Number(price), date: Date(), current_price: true }
					},
					category_id,
					brand_id,
					description
				}
			});
			redirect(304, '/');
		} catch (err) {
			console.log(err);
			return {};
		}
	},
	brand: async ({ request }) => {
		const {
			brand: name,
			email,
			phone
		} = Object.fromEntries(await request.formData()) as {
			brand: string;
			email: string;
			phone: string;
		};
		try {
			await prismaClient.brand.create({ data: { name, email, phone } });
		} catch (err) {
			console.log(JSON.stringify(err));
		}
		throw redirect(304, '/price');
	}
};
