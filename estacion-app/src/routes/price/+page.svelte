<script lang="ts">
	//imports
	import type { PageData } from './$types';
	import type { Category, Brand } from '../../types';
	import type { ActionResult } from '@sveltejs/kit';
	import { deserialize } from '$app/forms';
	import RingLoader from 'svelte-loading-spinners/RingLoader.svelte';

	//variables
	export let data: PageData;
	const categories: Category[] = data.categories;
	const brands: Brand[] = data.brands;
	let category_id: string = '';
	let brand_id: string = '';
	let percent: string = '';
	let loading = false;

	//functions
	async function submit() {
		if (parseInt(percent) > 100) {
			error = true;
			return;
		}
		const data = new FormData();
		data.append('percent', percent);
		data.append('category_id', category_id);
		data.append('brand_id', brand_id);
		loading = true;
		const response = await fetch('?/update', {
			method: 'POST',
			body: data
		});
		const result: ActionResult = deserialize(await response.text());
		if (result.type === 'success') {
			const category = categories.find((cat) => cat.id === category_id);
			const brand = brands.find((brand) => brand.id === brand_id);
			alert(
				`Se actualizaron los precios de la marca ${brand?.name}, la categoria ${category?.name}`
			);
			category_id = '';
			brand_id = '';
			percent = '';
			error = false;
			loading = false;
		} else {
			alert('Error al actualizar precios');
			loading = false;
		}
	}
	let error: boolean = false;
	$: error = parseInt(percent) > 100;
</script>

{#if !loading}
	<div class="container">
		<h2>Actualizar precios de articulos</h2>
		<label for="brand">Marca </label>
		<select bind:value={brand_id} name="brand" id="brand">
			<option selected value="">Todos</option>
			{#each brands as brand (brand.id)}
				<option value={brand.id}>{brand.name}</option>
			{/each}
		</select>
		<label for="">Categoria </label>
		<select bind:value={category_id} name="category " id="category">
			<option selected value="">Todos</option>
			{#each categories as category (category.id)}
				<option value={category.id}>{category.name}</option>
			{/each}
		</select>
		<label for="percent">Porcentaje de aumento</label>
		<input class:error type="number" bind:value={percent} min="0" max="100" />
		<input type="range" bind:value={percent} min="0" max="100" />
		{#if error}
			<span class="error"> No puede ser mayor a 100%</span>
		{/if}
		<div class="btn-actions">
			<button disabled={error} on:click={submit} type="submit">Actualizar</button>
		</div>
	</div>
{:else}
	<div class="overlay" />
	<div class="spinner">
		<RingLoader size="100" color="#FF3E00" unit="px" duration="2s" />
	</div>
{/if}

<style lang="scss">
	.btn-actions {
		display: flex;
		flex-direction: row;
		justify-content: center;
		button {
			margin-right: 1rem;
			width: 40%;
			height: 3rem;
		}
	}
	.error {
		border-color: red !important;
		color: red;
	}
	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
