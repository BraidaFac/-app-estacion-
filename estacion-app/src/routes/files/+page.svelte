<script lang="ts">
	import { enhance } from '$app/forms';
	import { unknown } from 'zod';
	import * as XLSX from 'xlsx';
	import type { Product } from '../../types';
	import RingLoader from 'svelte-loading-spinners/RingLoader.svelte';

	let loading: boolean = false;

	function submit(event: Event) {
		const json_data: unknown[] = [];

		if (!event.target) {
		} else {
			const data = new FormData(event.target as HTMLFormElement);
			const file = data.get('file') as File;
			if (!file || file?.name.length == 0) {
				alert('Please choose any file...');
				return;
			}
			const filename = file.name;

			const extension = filename.substring(filename.lastIndexOf('.')).toUpperCase();
			if (extension == '.XLS' || extension == '.XLSX') {
				const fileReader = new FileReader();
				fileReader.readAsBinaryString(file);
				fileReader.onload = (event) => {
					let binaryData = event.target?.result;
					let workbook = XLSX.read(binaryData, { type: 'binary' });
					workbook.SheetNames.forEach((sheet) => {
						json_data.push(
							XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 3, range: 2 })
						);
					});
					const json_object = [...json_data];
					try {
						loading = true;
						fetch('/api/files', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(json_object)
						})
							.then((res) => res.json())
							.then((res) => {
								console.log(res.status);
								if (res.status === 200) {
									loading = false;
									alert('Precio actualizado');
								} else if (res.status === 404) {
									res.error.forEach((error: string) => {
										alert(error);
									});
									loading = false;
								}
							});
					} catch (e) {
						loading = false;
						console.log(e);
					}
				};
			} else {
				alert('Please select a valid excel file.');
				return;
			}
		}
	}
</script>

{#if !loading}
	<div class="files-form">
		<h1>Files</h1>
		<form enctype="multipart/form-data" on:submit={submit}>
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
