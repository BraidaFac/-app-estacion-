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
export async function readfile(): Promise<void> {
	const sheetNames = await readSheetNames(
		`D:\\Escritorio\\estacion-app\\estacion-app\\static\\archivo.xlsx`
	);

	// Procesa las primeras 3 hojas (índices 0, 1 y 2)

	for (let i = 0; i < sheetNames.length; i++) {
		await processSheet(sheetNames[i]);
	}
}

async function processSheet(sheetName: any): Promise<void> {
	const rows = await readXlsxFile(
		'D:\\Escritorio\\estacion-app\\estacion-app\\static\\archivo.xlsx',
		{
			sheet: sheetName
		}
	);

	const new_old_object = searchNewProduct(rows.slice(2), await getAllProducts());
	const responseObj: { error: string[]; status: number } = { error: [], status: 200 };

	if (new_old_object.oldProducts.length > 0) {
		await processOldProducts(new_old_object.oldProducts, responseObj, sheetName);
		if (responseObj.status === 404) {
			responseObj.error.unshift('Error en la hoja ' + sheetName);
			throw responseObj;
		}
	}
	if (new_old_object.newProducts.length > 0) {
		await processNewProducts(new_old_object.newProducts, responseObj, sheetName);
		if (responseObj.status === 404) {
			responseObj.error.unshift('Error en la hoja ' + sheetName);
			throw responseObj;
		}
	}
}

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

async function processOldProducts(
	sheet: Row[],
	responseObj: { error: string[]; status: number },
	sheetName: string
) {
	sanatizaceArticles(sheet, responseObj, sheetName);
	if (responseObj.status === 404) throw responseObj;
	for (let i = 0; i < sheet.length; i++) {
		try {
			const row = sheet[i];
			await prismaClient.product.update({
				where: {
					id: row[arrayIndex.ARTICULO] ? row[arrayIndex.ARTICULO].toString() : '-'
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

async function processNewProducts(
	sheet: Row[],
	responseObj: { error: string[]; status: number },
	sheetName: string
) {
	sanatizaceArticles(sheet, responseObj, sheetName);
	if (responseObj.status === 404) throw responseObj;
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
				responseObj.error.push('No existe la marca ' + row[arrayIndex.MARCA]);
				responseObj.status = 404;
				break;
			} else if (!category) {
				responseObj.error.push('No existe la categoria ' + row[arrayIndex.CATEGORIA]);
				responseObj.status = 404;
				break;
			} else {
				const product = await prismaClient.product.create({
					data: {
						article: row[arrayIndex.ARTICULO] ? row[arrayIndex.ARTICULO].toString() : '-',
						brand_id: brand.id,
						category_id: category.id,
						description: row[arrayIndex.DESCRIPCION] ? row[arrayIndex.DESCRIPCION].toString() : '-',
						price: {
							create: {
								price: Number(row[arrayIndex.PRECIO]),
								date: new Date().toISOString(),
								current_price: true
							}
						}
					}
				});
				console.log(product);
			}
		} catch (err) {
			console.log(err);
			responseObj.error.push('Prisma error');
			responseObj.status = 404;
		}
	}
}

function sanatizaceArticles(
	sheet: Row[],
	responseObj: { error: string[]; status: number },
	sheetName: string
) {
	sheet.forEach((row) => {
		if (!row[arrayIndex.ARTICULO]) {
			responseObj.error.push('No tiene articulo el producto ' + row[arrayIndex.DESCRIPCION]);
		} else if (!row[arrayIndex.MARCA]) {
			responseObj.error.push('No tiene marca el producto ' + row[arrayIndex.ARTICULO]);
		} else if (!row[arrayIndex.CATEGORIA]) {
			responseObj.error.push('No tiene categoria el producto ' + row[arrayIndex.ARTICULO]);
		} else if (!row[arrayIndex.PRECIO]) {
			responseObj.error.push('No tiene precio el producto ' + row[arrayIndex.ARTICULO]);
		}
	});
	if (responseObj.error.length > 0) {
		responseObj.status = 404;
		responseObj.error.unshift('Error en la hoja ' + sheetName);
		return responseObj;
	}
}
