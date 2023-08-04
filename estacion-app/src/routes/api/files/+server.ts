import { prismaClient } from '$lib/server/prisma';

type lotusFormat = {
	id: string;
	brand: string;
	category: string;
	price: string | number;
	description?: string;
};
export const POST = async ({ request }) => {
	const responseObj: { error: string[]; status: number } = { error: [], status: 200 };
	try {
		const data = await request.json();
		const array_data: Array<Array<lotusFormat>> = [...data];
		for (const sheet of array_data) {
			await processSheet(sheet, responseObj);
		}
		return new Response(JSON.stringify(responseObj), {
			status: responseObj.error.length === 0 ? 200 : 404
		});
	} catch (err) {
		console.log(err);
		return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), {
			status: 500
		});
	}
};
async function processSheet(
	sheet: lotusFormat[],
	responseObj: { error: string[]; status: number }
) {
	for (let i = 0; i < sheet.length; i++) {
		try {
			const row = sheet[i];
			const brand = await prismaClient.brand.findMany({
				where: { name: { contains: row.brand.toLowerCase(), mode: 'insensitive' } },
				select: { id: true }
			});
			const category = await prismaClient.category.findMany({
				where: { name: { contains: row.category.toLowerCase(), mode: 'insensitive' } },
				select: { id: true }
			});
			if (brand.length === 0 || brand.length > 1) {
				responseObj.error.push(`Error:: Marca de la fila ${i} no coincide con ninguna marca.`);
				responseObj.status = 404;
				continue;
			} else if (category.length === 0 || category.length > 1) {
				responseObj.error.push(
					`Error:: Categoria de la fila ${i} no coincide con ninguna categoria.`
				);
				responseObj.status = 404;

				continue;
			} else {
				await prismaClient.product.upsert({
					where: {
						id: row.id
					},
					update: {
						price: {
							updateMany: {
								where: {
									current_price: true
								},
								data: {
									current_price: false
								}
							},
							create: {
								price: Number(row.price),
								date: new Date().toISOString(),
								current_price: true
							}
						}
					},
					create: {
						id: row.id,
						price: {
							create: {
								price: Number(row.price),
								date: new Date().toISOString(),
								current_price: true
							}
						},
						category_id: category[0].id,
						brand_id: brand[0].id,
						description: row?.description ?? 'No tiene'
					}
				});
			}
		} catch (err) {
			responseObj.error.push('Prisma error');
			responseObj.status = 404;
		}
	}
}
