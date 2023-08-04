<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Product } from '../../types';
	import type { Writable } from 'svelte/store';
	import type { SearchStoreModel } from '../../stores/stores';

	export let product: Product;
	export let searchStore: Writable<SearchStoreModel<Product>>;
	let disabled: boolean = true;
	let newPrice: string = product.price[0].price.toString();
	$: disabled = parseInt(newPrice) === product.price[0].price;
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

<article>
	<div class="formPrice">
		<a href="/" on:click|preventDefault={close}>X</a>
		<form on:submit|preventDefault={submit}>
			<label for="price">Articulo {product.id}</label>
			<input
				placeholder={product.price[0].price.toString()}
				bind:value={newPrice}
				name="price"
				id="price"
				type="number"
			/>
			{#if disabled}
				<span style=" display:block; color:red; font-size:small">Tiene el mismo precio</span>
			{/if}
			<div>
				<button {disabled} type="submit">Enviar</button>
			</div>
		</form>
	</div>
</article>

<style lang="scss">
	article {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30%;
		background-color: rgba(95, 177, 255, 0.824);
		padding: 1rem;
		border-radius: 5px;
		box-shadow: 0 3rem 5rem rgba(0, 0, 0, 0.3);
		z-index: 10;
	}
	.formPrice {
		border-radius: 10px;
		padding: 5px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		height: 100%;
		input {
			width: 200px;
		}
		a {
			font-size: xx-large;
			align-self: flex-end;
			justify-self: flex-start;
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
