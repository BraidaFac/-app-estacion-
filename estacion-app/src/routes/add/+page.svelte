<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	export let data: PageData;

	const categories = data.categories;
	const brands = data.brands;
</script>

<div class="container">
	<div class="">
		<form
			use:enhance={() => {
				return async ({ update, result }) => {
					if (result.type === 'success') {
						update();
						alert('Se agrego el producto');
					} else {
						alert('Error al agregar el producto');
					}
				};
			}}
			action="?/product"
			method="POST"
		>
			<label for="article">Articulo</label>
			<input type="text" name="article" id="article" />
			<select name="category_id">
				<option selected disabled value="">Selecciona una categoria</option>
				{#each categories as cat (cat.id)}
					<option value={cat.id}>{cat.name}</option>
				{/each}
			</select>
			<select name="brand_id">
				<option selected disabled value="">Selecciona una marca</option>
				{#each brands as brand (brand.id)}
					<option value={brand.id}>{brand.name}</option>
				{/each}
			</select>
			<label for="price">Precio</label>
			<input type="number" name="price" id="price" />

			<label for="description">Descripcion</label>
			<textarea name="description" id="description" />
			<div class="btn-actions">
				<button type="submit">Agregar</button>
			</div>
		</form>
	</div>
</div>

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
		a {
			background-color: rgb(162, 2, 2);
			border-color: rgb(162, 2, 2);
			width: 40%;
			margin-left: 1rem;
			height: 3rem;
		}
		a:hover {
			background-color: rgb(255, 0, 0);
			border-color: rgb(255, 0, 0);
		}
	}
</style>
