<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	export let data: PageData;

	$: categories = data.categories;
</script>

<div class="container-fluid grid">
	<table data-sveltekit-reload role="grid">
		<thead>
			<tr>
				<th>Categoria</th>
			</tr>
		</thead>
		<tbody>
			{#each categories as cat (cat.id)}
				<tr>
					<td>{cat.name}</td>
					<td><a href="./{cat.id}" role="button">Editar</a></td>
					<td
						><form
							use:enhance={() => {
								return ({ update, result }) => {
									if (result.status === 200) {
										update();
										alert('Categoria eliminada');
									}
								};
							}}
							method="POST"
							action="?/delete&id={cat.id}"
						>
							<button>Eliminar</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="category_form">
		<form
			use:enhance={() => {
				return ({ update, result }) => {
					if (result.status === 200) {
						update();
					}
				};
			}}
			method="POST"
			action="?/create"
		>
			<label for="category">Nueva Categoria</label>
			<input type="text" name="name" id="category" />
			<button type="submit">Agregar</button>
		</form>
	</div>
</div>

<style lang="scss">
	table {
		width: 50%;
		tbody {
			tr {
				td {
					a {
						color: white;
						border: none;
						border-radius: 0.2em;
						padding: 0;
						margin: 0;
						text-decoration: none;
						width: 100px;
						margin: 0;
					}
					form {
						display: flex;
						flex-direction: column;
						margin: 0;
						button {
							background: rgb(152, 5, 5);
							color: white;
							border: none;
							border-radius: 0.2em;
							padding: 0;
							margin: 0;
							width: 100px;
						}
						button:hover {
							background: rgb(255, 0, 0);
						}
					}
				}
			}
		}
	}
	.category_form {
		width: 30%;
		position: fixed;
		right: 10%;
	}
</style>
