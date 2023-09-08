<script lang="ts">
	import { enhance } from '$app/forms';
	import { unknown } from 'zod';
	import * as XLSX from 'xlsx';
	import type { Product } from '../../types';
	import RingLoader from 'svelte-loading-spinners/RingLoader.svelte';

	type Format = {
		MARCA: string;
		ARTICULO?: string;
		CATEGORIA: string;
		DESCRIPCION?: string;
		PRECIO: string | number;
	};
	let loading: boolean = false;
</script>

{#if !loading}
	<div class="files-form">
		<h1>Files</h1>
		<form
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.status === 200) {
						update();
						alert('Archivo subido correctamente');
					}
				};
			}}
			enctype="multipart/form-data"
		>
			<label for="file">Archivo</label>
			<input type="file" name="file" id="file" accept=".xlsx, .xls" />
			<div>
				<button type="submit">Agregar</button>
			</div>
		</form>
	</div>
{:else}
	<div class="overlay" />
	<div class="spinner">
		<RingLoader size="100" color="#FF3E00" unit="px" duration="2s" />
	</div>
{/if}

<style lang="scss">
	.files-form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
