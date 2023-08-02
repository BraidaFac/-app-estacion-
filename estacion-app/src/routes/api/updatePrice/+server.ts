import { json } from '@sveltejs/kit';
import { prismaClient } from '$lib/server/prisma';

export const POST = async ({ request }) => {
	const data = await request.json();
	try {
		await prismaClient.product.update({
			where: { id: data.id },
			data: {
				price: {
					updateMany: {
						where: {
							current_price: true
						},
						data: {
							current_price: false
						}
					}
				}
			},
			include: {
				price: true
			}
		});
		await prismaClient.product.update({
			where: { id: data.id },
			data: {
				price: {
					create: { price: Number(data.price), date: new Date().toISOString(), current_price: true }
				}
			}
		});
		data.status = 200;
		return json(data);
	} catch (err) {
		console.log(err);
	}
};
