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
	category: async ({ request }) => {
		const { name } = Object.fromEntries(await request.formData()) as {
			name: string;
		};
		try {
			await prismaClient.category.create({ data: { name } });
		} catch (err) {
			return JSON.stringify(err);
		}
	},
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
		} catch (err) {
			console.log(err);
			return {};
		}
	},
	brand: async ({ request }) => {
		const {
			brand: name,
			email,
			phone,
			url_img
		} = Object.fromEntries(await request.formData()) as {
			brand: string;
			email: string;
			phone: string;
			url_img: string;
		};
		try {
			await prismaClient.brand.create({ data: { name, email, phone, url_img } });
		} catch (err) {
			console.log(JSON.stringify(err));
		}
	}
};
