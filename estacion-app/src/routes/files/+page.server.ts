import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { readFile } from '$lib/data/filesUpload';
import { writeFileSync } from 'fs';
import { read } from 'xlsx';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
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
		// writeFileSync(`static/${file.name}`, Buffer.from(await file.arrayBuffer()));
		readFile();
		return {
			success: true
		};
	}
};
