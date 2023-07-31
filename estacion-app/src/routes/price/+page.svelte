<script lang="ts">
	import type { ActionData, PageData } from './$types';
	export let data: PageData;
	import type { Product } from '../../types';
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	const categories = data.categories;
	const brands = data.brands;
	const products = data.products as Product[];
	import { createSearchStore, searchHandler } from '../../stores/stores';
	import type { Writable } from 'svelte/store';
	import UpdatePrice from '../../components/updatePrice.svelte';

	const searchProducts: Product[] = data.products.map((product: Product) => ({
		...product,
		searchTerms: `${product.id} ${product.price[0].price} ${product.brand.name} ${product.category.name}`
	}));
	export const searchStore = createSearchStore(searchProducts);
	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	let filter: Boolean = false;
	function enable() {
		filter = !filter;
	}
	function filt(e: Event) {
		if (e.target) {
			const data = new FormData(e.target as HTMLFormElement);
			const category = data.get('category') as string;
			const brand = data.get('brand') as string;
			$searchStore.category = `${category}`;
			$searchStore.brand = `${brand}`;
		}
	}
	let updateProd: Product;
	let flagUpdate: Boolean = false;
	function update(id: string) {
		return () => {
			flagUpdate = !flagUpdate;
			updateProd = products.find((prod) => prod.id === id) as Product;
		};
	}
	function close() {
		flagUpdate = !flagUpdate;
	}
</script>

<div class="grid">
	<div><a role="button" href="/price/add">Agregar</a></div>
	<div>
		<a href="/" role="button" on:click|preventDefault={enable}>Filtros</a>
		<input type="search" placeholder="Search..." bind:value={$searchStore.search} />
	</div>
</div>
{#if filter}
	<div class="filters">
		<form use:enhance on:submit|preventDefault={filt}>
			<label for="category">Categoria</label>
			<select name="category" id="category">
				<option selected value="">Todos</option>
				{#each categories as cat (cat.id)}
					<option value={cat.name}>{cat.name}</option>
				{/each}
			</select>
			<label for="brand">Marca</label>
			<select name="brand" id="brand">
				<option selected value="">Todos</option>
				{#each brands as brand (brand.id)}
					<option value={brand.name}>{brand.name}</option>
				{/each}
			</select>
			<button type="submit">Filtrar</button>
		</form>
	</div>
{/if}
{#if true}
	<div class="list" class:hidden={flagUpdate}>
		<table data-sveltekit-reload role="grid">
			<thead>
				<tr>
					<th>Articulo</th>
					<th>Categoria</th>
					<th>Marca</th>
					<th>Precio</th>
					<th>Historial Precios</th>
				</tr>
			</thead>
			<tbody>
				{#each $searchStore.filtered as prod (prod.id)}
					<tr>
						<td>{prod.id}</td>
						<td>{prod.category.name}</td>
						<td>{prod.brand.name}</td>
						<td
							><a href="/" on:click|preventDefault={update(prod.id)}> ${prod.price[0].price}</a></td
						>
						<td><a href={`/price/${prod.id}`}>Precios</a></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
{#if flagUpdate}
	<UpdatePrice on:close={close} {searchStore} product={updateProd} />
{/if}

<style lang="scss">
	.grid {
		div {
			input {
				width: 50%;
				margin: auto;
			}
		}
	}
	.list {
		margin-top: 50px;
		table {
			th {
				text-align: center;
				color: rgb(159, 16, 16);
				width: 350px;
			}
			td {
				text-align: center;
				width: 350px !important;
			}
		}
	}
	.filters {
		width: 100%;
		display: block;
		position: relative;
		text-align: center;

		div {
			padding: 5px;
		}
		form {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 40%;
			margin: auto;
		}
		button {
			margin-top: 12px;
			margin-bottom: 0px;
		}
	}
	.hidden {
		display: none;
	}
</style>
