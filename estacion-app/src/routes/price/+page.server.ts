import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './upprice/$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/');
	}
	return {
		categories: await prismaClient.category.findMany({
			select: { name: true, id: true }
		}),
		brands: await prismaClient.brand.findMany({
			select: { name: true, id: true }
		})
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	update: async ({ request }) => {
		const { category_id, brand_id, percent } = Object.fromEntries(
			await request.formData()
		) as Record<string, string | undefined>;
		try {
			const products = await prismaClient.product.findMany({
				where: {
					category_id: category_id,
					brand_id: brand_id
				},
				include: {
					price: true
				}
			});
			console.log(products);
			products.forEach(async (product) => {
				const currentPrice = product.price.find((price) => price.current_price);
				if (currentPrice) {
					await prismaClient.price.update({
						where: { id: currentPrice.id },
						data: { current_price: false }
					});
					const newPrice = currentPrice.price * (1 + Number(percent) / 100);
					await prismaClient.price.create({
						data: {
							product_id: product.id,
							price: newPrice,
							date: new Date().toISOString(),
							current_price: true
						}
					});
				}
			});
		} catch (err) {
			return { success: false };
		}
		return {
			success: true,
			data: { category_id: category_id, brand_id: brand_id, percent: percent }
		};
	}
};
