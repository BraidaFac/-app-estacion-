<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import type { Category, Product } from '../../types';
	import { onDestroy } from 'svelte';
	import { createSearchStore, searchHandler } from '../../stores/stores';
	import UpdatePrice from '$lib/components/updatePrice.svelte';

	//props
	export let data: PageData;

	//variables
	const products = data.products;
	const categories = data.categories as Category[];
	const searchProducts = data.products.map((product: Product) => ({
		...product,
		searchTerms: `${product.article} ${product.description} ${product.category.name}`
	}));
	export const searchStore = createSearchStore(searchProducts);
	let filterCategory: string = '';
	let show_new_form_modal = false;

	$: updateProd = {} as Product;

	//methods
	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	function filt() {
		{
			$searchStore.category = `${filterCategory}`;
		}
	}

	function update(id: string) {
		return () => {
			updateProd = products.find((prod) => prod.id === id) as Product;
			show_new_form_modal = true;
		};
	}
</script>

<div class="filters">
	<select bind:value={filterCategory} on:change={filt} name="category" id="category">
		<option selected value="">Todos</option>
		{#each categories as cat (cat.id)}
			<option value={cat.name}>{cat.name}</option>
		{/each}
	</select>
	<input type="search" placeholder="Buscar" bind:value={$searchStore.search} />
</div>

{#if true}
	<div class="list">
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
{#if show_new_form_modal}
	<UpdatePrice bind:show_new_form_modal {searchStore} product={updateProd} />
{/if}

<style lang="scss">
	.filters {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: flex-start;
		input {
			width: 40%;
		}
		select {
			width: 40%;
			border-radius: 5rem;
		}
	}

	.list {
		table {
			tr {
				th {
					text-align: center;
					color: rgb(159, 16, 16);
					width: 302.5px;
				}
				td {
					text-align: center;
					width: 302.5px !important;
				}
			}
		}
	}
</style>
