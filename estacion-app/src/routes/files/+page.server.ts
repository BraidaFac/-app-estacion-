import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { readfile } from '$lib/data/filesUpload';
import { writeFileSync, unlink } from 'fs';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		if (!(formData.file as File).name || (formData.file as File).name === 'undefined') {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

		const { file } = formData as { file: File };
		// Write the file to the static folder
		try {
			writeFileSync(`static/archivo.xlsx`, Buffer.from(await file.arrayBuffer()));
			await readfile();
			unlink(`static/archivo.xlsx`, (err) => {
				if (err) {
					console.log(err);
				}
			});
			return {
				success: true
			};
		} catch (error) {
			return fail(404, { error });
		}
	}
};
