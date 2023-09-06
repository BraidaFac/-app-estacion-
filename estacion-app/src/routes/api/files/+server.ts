import { prismaClient } from '$lib/server/prisma';

type Format = {
	ARTICULO?: string;
	MARCA: string;
	CATEGORIA: string;
	DESCRIPCION?: string;
	PRECIO: string | number;
};
const brands = await prismaClient.brand.findMany();
const categories = await prismaClient.category.findMany();
const products = await prismaClient.product.findMany();
const newProducts: Format[] = [];
const oldProducts: Format[] = [];
export const POST = async ({ request }) => {
	const responseObj: { error: string[]; status: number } = { error: [], status: 200 };
	try {
		const data = await request.json();
		const array_data: Array<Array<Format>> = [...data];
		for (const sheet of array_data) {
			console.log(searchNewProduct(sheet));
			await processOldProducts(oldProducts, responseObj);
		}
		return new Response(JSON.stringify(responseObj), {
			status: responseObj.error.length === 0 ? 200 : 404
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), {
			status: 500
		});
	}
};

function searchNewProduct(sheet: Format[]): Format[] {
	sheet.forEach((row) => {
		const product = products.find((product) => product.article === row.ARTICULO?.toString());
		if (product) {
			oldProducts.push(row);
			return;
		}
		newProducts.push(row);
	});
	return newProducts;
}
async function processOldProducts(
	sheet: Format[],
	responseObj: { error: string[]; status: number }
) {
	for (let i = 0; i < sheet.length; i++) {
		try {
			const row = sheet[i];
			const category = categories.find(
				(cat) => cat.name.toLowerCase() === row.CATEGORIA.toLowerCase()
			);
			const brand = brands.find((brand) => brand.name.toLowerCase() === row.MARCA.toLowerCase());
			console.log(category, row.CATEGORIA.toLowerCase());
			if (!brand) {
				responseObj.error.push(`Error en marca.` + row.MARCA + 'hoja:' + i + 1);
				responseObj.status = 404;
				break;
			} else if (!category) {
				responseObj.error.push(`Error en categoria. ` + row.CATEGORIA + 'hoja:' + (i + 1));
				responseObj.status = 404;
				break;
			} else {
				await prismaClient.product.update({
					where: {
						article: row.ARTICULO ? row.ARTICULO.toString() : '-'
					},
					data: {
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
								date: new Date().toISOString(),
								current_price: true
							}
						}
					}
				});
			}
		} catch (err) {
			console.log(err);
			responseObj.error.push('Prisma error');
			responseObj.status = 404;
		}
	}
}
