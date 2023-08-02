import { IncomingForm } from 'formidable';

export async function post(req, res) {
	const form = new IncomingForm();
	const files = await new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err);
			else resolve(files);
		});
	});

	// Aquí puedes guardar y procesar los archivos según tus necesidades
	console.log('Archivos recibidos:', files);

	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ message: 'Archivos recibidos exitosamente.' }));
}
