<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import CardList from '$lib/components/CardList.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Card from '$lib/components/Card.svelte';
	export let data: PageData;
	const brands = data.brands;

	//flags
	let show_new_form_modal = false;
	let show_delete_input = false;

	//functions
</script>

<div class="actions">
	<a href="./" on:click|preventDefault={() => (show_new_form_modal = true)}>Nueva marca</a>
</div>

<div class="list">
	<div class="content">
		{#each brands as brand}
			<Card let:CardImg>
				<CardImg route="admin/brand/{brand.id}" url_img={brand.url_img} />
			</Card>
		{/each}
	</div>
</div>

<Modal {show_new_form_modal}>
	<h1 class="title" slot="header">Nueva Marca</h1>

	<form
		use:enhance={() => {
			return ({ update, result }) => {
				console.log(result);
				if (result.status === 200) {
					show_new_form_modal = false;
					update();
				}
			};
		}}
		method="POST"
	>
		<label for="brand">Marca</label>
		<input type="text" name="brand" id="brand" />
		<label for="email">Email</label>
		<input type="text" name="email" id="email" />
		<label for="phone">Numero de telefono</label>
		<input type="text" name="phone" id="phone" />
		<label for="url_img">URL de la imagen</label>
		<input type="text" name="url_img" id="url_img" />
		<button type="submit">Agregar</button>
	</form>
</Modal>

<style lang="scss">
	label {
		color: rgb(255, 255, 255);
	}
	.title {
		color: red;
		text-align: center;
	}
	.content {
		margin: 50px;
		margin-top: 100px;
		display: grid;
		column-gap: 30px;
		row-gap: 30px;
		grid-template-rows: repeat(2, 1fr);
		grid-template-columns: auto auto auto;
	}
</style>
