export type Product = {
	id: string;
	article?: string;
	category: Category;
	price: Price[];
	brand: Brand;
	description?: string;
};
export type Category = {
	id?: string;
	name: string;
	description?: string;
};
export type Price = {
	price: number;
	date_from?: Date;
};
export type Brand = {
	id?: string;
	name: string;
	email?: string;
	phone?: string;
};
