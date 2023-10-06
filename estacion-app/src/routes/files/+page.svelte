<script lang="ts">
	import { enhance } from '$app/forms';
	import RingLoader from 'svelte-loading-spinners/RingLoader.svelte';

	$: file = null;
	let loading: boolean = false;
	export let form;
</script>

{#if !loading}
	<div class="files-form">
		<h1>Files</h1>
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => {
					if (result.status === 200) {
						update();
						loading = false;
						alert('Archivo subido correctamente');
						//alert(form?.uploaded);
					} else {
						loading = false;
						//const errors = result.data.error.error.join('\n');
						//alert(errors + '\n' + 'Intente nuevamente');
					}
				};
			}}
			enctype="multipart/form-data"
		>
			<label for="file">Archivo</label>
			<input bind:value={file} type="file" name="file" id="file" accept=".xlsx, .xls" />
			<div>
				<button disabled={!file} type="submit">Agregar</button>
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
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;
	}
	.files-form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.spinner {
		z-index: 1000;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
