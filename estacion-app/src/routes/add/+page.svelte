<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	export let data: PageData;

	const categories = data.categories;
	const brands = data.brands;
</script>

<div class="container-fluid grid">
	<div class="">
		<form use:enhance action="?/brand" method="POST">
			<label for="brand">Marca</label>
			<input type="text" name="brand" id="brand" />
			<label for="email">Email</label>
			<input type="text" name="email" id="email" />
			<label for="phone">Numero de telefono</label>
			<input type="text" name="phone" id="phone" />
			<button type="submit">Agregar</button>
		</form>
	</div>
	<div class="">
		<form use:enhance action="?/category" method="POST">
			<label for="category">Categoria</label>
			<input type="text" name="name" id="category" />
			<button type="submit">Agregar</button>
		</form>
	</div>
	<div class="">
		<form action="?/product" method="POST">
			<label for="article">Articulo</label>
			<input type="text" name="article" id="article" />
			<label for="name">Nombre</label>
			<input type="text" name="name" id="name" />
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
			<button type="submit">Agregar</button>
		</form>
	</div>
</div>
