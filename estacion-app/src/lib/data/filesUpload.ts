import { prismaClient } from '$lib/server/prisma';
import type { Product } from '@prisma/client';
import fs from 'fs';
import readXlsxFile, { readSheetNames, type Row } from 'read-excel-file/node';

enum arrayIndex {
	MARCA = 0,
	ARTICULO = 1,
	CATEGORIA = 2,
	DESCRIPCION = 3,
	PRECIO = 4
}

readSheetNames('D:\\Escritorio\\estacion-app\\estacion-app\\static\\listaprecios.xlsx').then(
	(sheetNames) => {
		for (const sheetName of sheetNames) {
			readXlsxFile('D:\\Escritorio\\estacion-app\\estacion-app\\static\\listaprecios.xlsx', {
				sheet: 2
			}).then(async (rows) => {
				const new_old_object = searchNewProduct(rows.slice(2), await getAllProducts());
				const responseObj = { error: [], status: 200 };
				console.log(new_old_object);
				if (new_old_object.oldProducts.length > 0) {
					//await processOldProducts(new_old_object.oldProducts, responseObj);
				}
				if (new_old_object.newProducts.length > 0) {
					await processNewProducts(new_old_object.newProducts, responseObj);
				}
			});
		}
	}
);

async function getAllProducts(): Promise<Product[]> {
	const products = await prismaClient.product.findMany();
	return products;
}
function searchNewProduct(rows: Row[], products: Product[]) {
	const newProducts: Row[] = [];
	const oldProducts: Row[] = [];
	rows.forEach((row) => {
		const product = products.find(
			(product) => product.article === row[arrayIndex.ARTICULO]?.toString()
		);
		if (product) {
			oldProducts.push(row);
			return;
		}
		newProducts.push(row);
	});
	return { newProducts, oldProducts };
}

async function processOldProducts(sheet: Row[], responseObj: { error: string[]; status: number }) {
	for (let i = 0; i < sheet.length; i++) {
		try {
			const row = sheet[i];
			console.log(row[arrayIndex.ARTICULO].toString());
			await prismaClient.product.update({
				where: {
					article: row[arrayIndex.ARTICULO] ? row[arrayIndex.ARTICULO].toString() : '-'
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
							price: Number(row[arrayIndex.PRECIO]),
							date: new Date().toISOString(),
							current_price: true
						}
					}
				}
			});
		} catch (err) {
			responseObj.error.push('Prisma error');
			responseObj.status = 404;
		}
	}
	return responseObj;
}

async function processNewProducts(sheet: Row[], responseObj: { error: string[]; status: number }) {
	const categories = await prismaClient.category.findMany();
	const brands = await prismaClient.brand.findMany();
	for (let i = 0; i < sheet.length; i++) {
		try {
			const row = sheet[i];
			const category = categories.find(
				(cat) => cat.name.toUpperCase() === row[arrayIndex.CATEGORIA]
			);
			const brand = brands.find((brand) => brand.name.toUpperCase() === row[arrayIndex.MARCA]);
			if (!brand) {
				responseObj.status = 404;
				break;
			} else if (!category) {
				responseObj.status = 404;
				break;
			} else {
				await prismaClient.product.create({
					data: {
						article: row[arrayIndex.ARTICULO] ? row[arrayIndex.ARTICULO].toString() : '-',
						brand_id: brand.id,
						category_id: category.id,
						description: row[arrayIndex.DESCRIPCION]
							? row[arrayIndex.DESCRIPCION].toString()
							: 'No tiene',
						price: {
							create: {
								price: Number(row[arrayIndex.PRECIO]),
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
	return responseObj;
}
