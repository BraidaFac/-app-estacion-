export type Product = {
	id: string;
	category: Category;
	price: Price[];
	brand: Brand;
	description?: string;
};
export type Category = {
	id?: number;
	name: string;
	description?: string;
};
export type Price = {
	price: number;
	date_from?: Date;
};
export type Brand = {
	id?: number;
	name: string;
	email?: string;
	phone?: string;
};
