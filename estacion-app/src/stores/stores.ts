import { writable } from 'svelte/store';

export interface SearchStoreModel<T extends Record<PropertyKey, any>> {
	data: T[];
	filtered: T[];
	search: string;
	category?: string;
	brand?: string;
}

export const createSearchStore = <T extends Record<PropertyKey, any>>(data: T[]) => {
	const { subscribe, set, update } = writable<SearchStoreModel<T>>({
		data: data,
		filtered: data,
		search: '',
		category: '',
		brand: ''
	});

	return {
		subscribe,
		set,
		update
	};
};

export const searchHandler = <T extends Record<PropertyKey, any>>(store: SearchStoreModel<T>) => {
	{
		const searchCat = store.category?.toLowerCase() || '';
		const searchBrand = store.brand?.toLowerCase() || '';
		const searchTerm = store.search.toLowerCase() || '';
		store.filtered = store.data.filter((item) => {
			return (
				item.searchTerms.toLowerCase().includes(searchCat) &&
				item.searchTerms.toLowerCase().includes(searchBrand) &&
				item.searchTerms.toLowerCase().includes(searchTerm)
			);
		});
	}
};
