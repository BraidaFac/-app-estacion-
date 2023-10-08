import { prismaClient } from '$lib/server/prisma';

type Format = {
	ARTICULO?: string;
	MARCA: string;
	CATEGORIA: string;
	DESCRIPCION?: string;
	PRECIO: string | number;
};

export const POST = async ({ request }) => {
	const responseObj: { error: string[]; status: number } = { error: [], status: 200 };
	try {
		const data = (await request.json()) as Format[][];
		if (data.length === 0) {
			return new Response(JSON.stringify({ error: 'No hay datos.' }));
		}
		sanatizaceSheet(data, responseObj);

		if (responseObj.error.length > 0) {
			return new Response(
				JSON.stringify({
					error: responseObj.error,
					status: responseObj.status
				})
			);
		}
		for (const sheet of data) {
			await processProducts(sheet);
		}
		return new Response(JSON.stringify({ status: 200, success: true }));
	} catch (error) {
		console.log(error);
		return new Response(
			JSON.stringify({ status: 500, error: 'Error No se encontro marca o catetgoria' })
		);
	}
};

async function processProducts(sheet: Format[]) {
	const brandName = sheet[0].MARCA;
	const categoryName = sheet[0].CATEGORIA;
	const date = new Date();
	date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
	const category = await prismaClient.category.findMany({
		where: { name: { equals: categoryName.toLowerCase(), mode: 'insensitive' } }
	});
	const brand = await prismaClient.brand.findMany({
		where: { name: { equals: brandName.toLowerCase(), mode: 'insensitive' } }
	});
	if (category.length === 0 || brand.length === 0) {
		throw new Error('No se encontro la categoria o la marca');
	}
	for (let i = 0; i < sheet.length; i++) {
		const row = sheet[i];
		if (row.ARTICULO === undefined) throw new Error('No se encontro el articulo');
		await prismaClient.product.upsert({
			where: {
				article: row.ARTICULO.toString()
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
						price: Number(row.PRECIO),
						date: date.toISOString(),
						current_price: true
					}
				}
			},
			create: {
				article: row.ARTICULO.toString(),
				price: {
					create: {
						price: Number(row.PRECIO),
						date: date.toISOString(),
						current_price: true
					}
				},
				category_id: category[0].id,
				brand_id: brand[0].id,
				description: row?.DESCRIPCION ?? 'No tiene'
			}
		});
	}
}
function sanatizaceSheet(sheets: Format[][], responseObj: { error: string[]; status: number }) {
	sheets.forEach((sheet, i) => {
		for (const row of sheet) {
			if (!row.ARTICULO || !row.MARCA || !row.CATEGORIA || !row.PRECIO) {
				responseObj.error.push('Error en la hoja ' + (i + 1));
				break;
			}
		}
	});
	if (responseObj.error.length > 0) {
		responseObj.status = 404;
	}
}
