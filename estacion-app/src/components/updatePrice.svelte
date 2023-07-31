<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Product } from '../types';
	import { searchHandler } from '../stores/stores';
	import type { Writable } from 'svelte/store';
	import type { SearchStoreModel } from '../stores/stores';

	export let product: Product;
	export let searchStore: Writable<SearchStoreModel<Product>>;

	const dispatch = createEventDispatcher();
	function close() {
		dispatch('close');
	}
	async function submit(e: Event) {
		const formData = new FormData(e.target as HTMLFormElement);
		const price: string = formData.get('price') as string;
		const data = { ...product, price };
		if (confirm('Estas seguro de actualizar el precio?')) {
			await fetch('/api/updatePrice', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.status === 200) {
						alert('Precio actualizado');
						$searchStore.filtered = $searchStore.filtered.map((prod: Product) => {
							if (prod.id === product.id) {
								return { ...prod, price: [{ price: parseFloat(price) }] };
							}
							return prod;
						});
						$searchStore.data = $searchStore.data.map((prod: Product) => {
							if (prod.id === product.id) {
								return { ...prod, price: [{ price: parseFloat(price) }] };
							}
							return prod;
						});
						close();
					}
				});
		} else {
			close();
		}
	}
</script>

<div class="formPrice">
	<a href="/" on:click|preventDefault={close}>X</a>
	<form on:submit|preventDefault={submit}>
		<label for="price">Articulo {product.id}</label>
		<input name="price" id="price" type="number" value={product.price[0].price} />
		<div>
			<button type="submit">Enviar</button>
		</div>
	</form>
</div>

<style lang="scss">
	.formPrice {
		margin: 60px auto;
		border-radius: 10px;
		padding: 5px;
		width: 400px;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgb(159, 17, 17);
		input {
			width: 200px;
			border-color: rgb(206, 199, 199);
		}
		a {
			font-size: xx-large;
			align-self: flex-end;
		}
		button {
			margin-top: 10px;
			width: 100px;
		}
		div {
			display: flex;
			flex-direction: row;
			justify-content: center;
		}
	}
</style>
