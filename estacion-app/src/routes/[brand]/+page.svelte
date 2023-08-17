<script lang="ts">
	import type { ActionData, PageData } from './$types';
	export let data: PageData;
	import type { Category, Product } from '../../types';
	import { onDestroy } from 'svelte';
	const products = data.products as Product[];
	import { createSearchStore, searchHandler } from '../../stores/stores';
	import UpdatePrice from '$lib/components/updatePrice.svelte';
	const categories = data.categories as Category[];
	const searchProducts: Product[] = data.products.map((product: Product) => ({
		...product,
		searchTerms: `${product.id} ${product.price[0].price} ${product.brand.name} ${product.category.name}`
	}));
	export const searchStore = createSearchStore(searchProducts);
	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	let filterCategory: string = '';
	function filt() {
		{
			$searchStore.category = `${filterCategory}`;
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
	<div class="filters">
		<select bind:value={filterCategory} on:change={filt} name="category" id="category">
			<option selected value="">Todos</option>
			{#each categories as cat (cat.id)}
				<option value={cat.name}>{cat.name}</option>
			{/each}
		</select>
	</div>
	<div>
		<input type="search" placeholder="Search..." bind:value={$searchStore.search} />
	</div>
</div>
{#if true}
	<div class="list" class:hidden={flagUpdate}>
		<table data-sveltekit-reload role="grid">
			<thead>
				<tr>
					<th>Articulo</th>
					<th>Categoria</th>
					<th>Desripcion</th>
					<th>Marca</th>
					<th>Precio</th>
					<th>Historial Precios</th>
				</tr>
			</thead>
			<tbody>
				{#each $searchStore.filtered as prod (prod.id)}
					<tr>
						<td>{prod.article}</td>
						<td>{prod.category.name}</td>
						<td>{prod.description}</td>
						<td>{prod.brand.name}</td>
						<td
							><a href="/" on:click|preventDefault={update(prod.id)}>
								${prod.price[0].price.toFixed(2)}</a
							></td
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
	<div class="overlay" />
{/if}
{#if !data}
	<p>Cargando</p>
{/if}

<style lang="scss">
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(3px);
		z-index: 5;
	}
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
		width: 50%;
		display: block;
		position: relative;
		text-align: center;
	}
	.hidden {
		display: none;
	}
</style>
