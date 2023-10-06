<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Product } from '../../types';
	import type { Writable } from 'svelte/store';
	import type { SearchStoreModel } from '../../stores/stores';

	export let show_new_form_modal: boolean; // boolean
	let dialog: HTMLDialogElement; // HTMLDialogElement
	$: if (dialog && show_new_form_modal) dialog.showModal();
	export let product: Product;
	export let searchStore: Writable<SearchStoreModel<Product>>;
	let disabled: boolean = true;
	let oldPrice: string = product.price[0].price.toString();
	let newPrice: string = '';
	$: disabled = parseInt(oldPrice) === parseInt(newPrice);

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
						dialog.close();
					}
				});
		} else {
			dialog.close();
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (show_new_form_modal = false)}
	on:click|self={() => dialog.close()}
>
	<div class="formPrice">
		<h3>Modificar precio</h3>
		<form on:submit|preventDefault={submit}>
			<label for="price">Articulo: <span>{product.article}</span></label>
			<label
				>Precio actual:
				<span>${oldPrice}</span>
			</label>
			<input
				bind:value={newPrice}
				placeholder="Nuevo Precio"
				name="price"
				id="price"
				type="number"
			/>
			{#if disabled}
				<span style=" display:block; color:red; font-size:small">Tiene el mismo precio</span>
			{/if}
			<div>
				<button {disabled} type="submit">Cambiar</button>
				<a
					role="button"
					href="/"
					on:click|preventDefault={() => {
						dialog.close();
					}}>Volver</a
				>
			</div>
		</form>
	</div>
</dialog>

<style lang="scss">
	.formPrice {
		border-radius: 10px;
		padding: 3rem;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
		width: 30%;
		span {
			color: rgb(142, 0, 0);
			font-weight: bolder;
		}

		a {
			display: block;
			background-color: rgb(142, 0, 0);
			border-color: rgb(142, 0, 0);
			height: 3rem;
			margin-left: 1rem;
			width: 6rem;
		}
		a:hover {
			background-color: #ff0000;
			border-color: #ff0000;
		}
		div {
			margin-top: 1rem;
			display: flex;
			flex-direction: row;
			justify-content: center;
		}
		button {
			height: 3rem;
			margin-right: 1rem;
			width: 6rem;
		}
	}

	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		background: #11191f;
		padding: 1em;
		width: 30%;
		border-radius: 10px;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
