<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	const brand = data.brand;
</script>

<div class="container">
	<form
		use:enhance={() => {
			return ({ update, result }) => {
				if (result.status === 200) {
					if (window) {
						alert('Marca actualizada correctamente');
					}
					goto('./');
				}
			};
		}}
		method="POST"
	>
		<input hidden value={brand?.id} name="id" />
		<label for="brand">Marca</label>
		<input type="text" value={brand?.name} name="brand" id="brand" />
		<label for="email">Email</label>
		<input type="text" value={brand?.email} name="email" id="email" />
		<label for="phone">Numero de telefono</label>
		<input type="text" value={brand?.phone} name="phone" id="phone" />
		<label for="url_img">URL de la imagen</label>
		<input type="text" value={brand?.url_img} name="url_img" id="url_img" />
		<button type="submit">Agregar</button>
	</form>
</div>
