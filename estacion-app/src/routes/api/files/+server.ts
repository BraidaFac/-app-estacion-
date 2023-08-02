import { prismaClient } from '$lib/server/prisma';

type lotusFormat = {
	id: string;
	brand: string;
	category: string;
	price: string | number;
	description?: string;
};
export const POST = async ({ request }) => {
	try {
		const responseObj: { error?: string; status: number } = { status: 200 };
		const data = await request.json();
		console.log(data);
		const array_data: Array<Array<lotusFormat>> = [...data];
		for (const sheet of array_data) {
			for (const product of sheet) {
				console.log(product);
				try {
					const category = await prismaClient.category.findMany({
						where: {
							name: {
								contains: product.category.toLowerCase(),
								mode: 'insensitive'
							}
						}
					});
					const brand = await prismaClient.brand.findMany({
						where: {
							name: {
								contains: product.brand.toLowerCase(),
								mode: 'insensitive'
							}
						}
					});

					if (category.length === 0 || brand.length === 0) {
						responseObj.error = 'No se encontró la categoría o marca.';
						responseObj.status = 400;
					} else if (category.length !== 1 || brand.length !== 1) {
						responseObj.error = 'Coincide con dos marcas.';
						responseObj.status = 400;
					} else {
						await prismaClient.product.upsert({
							where: {
								id: product.id
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
										price: Number(product.price),
										date: new Date().toISOString(),
										current_price: true
									}
								}
							},
							create: {
								id: product.id,
								price: {
									create: {
										price: Number(product.price),
										date: new Date().toISOString(),
										current_price: true
									}
								},
								category_id: category[0].id,
								brand_id: brand[0].id,
								description: product?.description ?? 'No tiene'
							}
						});
					}
				} catch (err) {
					console.log(err);
					responseObj.error = 'Prisma error';
					responseObj.status = 404;
				}
			}
		}
		return new Response(JSON.stringify(responseObj), {
			status: responseObj.status || 200
		});
	} catch (err) {
		console.log(err);
		return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), {
			status: 500
		});
	}
};
/* function readExcelFile(filePath: string): ExcelRow<any>[] {
	const workbook = XLSX.readFile(filePath);
	const sheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[sheetName];

	const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
	const headers = rows.shift();
	console.log(headers);
	console.log(rows);
	const typedRows: ExcelRow<any>[] = rows.map((row) => {
		const rowObject: ExcelRow<any> = {};
		headers.forEach((header: string, index: number) => {
			rowObject[header] = row[index];
		});
		return rowObject;
	});
	console.log(typedRows);

	return typedRows;
} */
