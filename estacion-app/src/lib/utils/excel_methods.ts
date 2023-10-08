import { writable } from 'svelte/store';
import * as XLSX from 'xlsx';

interface excelFormat {
	ARTICULO: string;
	DESCRIPCION: string;
	MARCA: string;
	CATEGORIA: string;
	PRECIO: number;
}
export const loading = writable(false);
export async function submit(event: Event) {
	const array_json_data: Array<excelFormat[]> = [];
	if (!event.target) {
		return;
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
				const binaryData = event.target?.result;
				const workbook = XLSX.read(binaryData, { type: 'binary' });
				for (const sheet of workbook.SheetNames) {
					const sheet_to_json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
						header: 2,
						range: 1
					}) as excelFormat[];
					array_json_data.push(sheet_to_json);
				}
				sendData(array_json_data);
			};
		}

		//json_data.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 3, range: 2 }));

		//const json_object = [...json_data];
		/* try {
					fetch('/api/files', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(json_data)
					})
						.then((res) => res.json())
						.then((res) => {
							console.log(res);
							if (res.status === 200) {
								alert('Precio actualizado');
							}
						});
				} catch (e) {
					console.log(e);
				} */
	}
}

async function sendData(sheets: excelFormat[][]) {
	try {
		loading.set(true);
		fetch('/api/files', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sheets)
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.status === 200) {
					alert(JSON.stringify(res));
					loading.set(false);
				} else {
					alert(JSON.stringify(res));
					loading.set(false);
				}
			});
	} catch (error) {
		alert('Error');
	}
}
//sanatization
