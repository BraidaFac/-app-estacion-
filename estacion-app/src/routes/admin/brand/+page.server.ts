import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prismaClient } from '$lib/server/prisma';

export const load: PageServerLoad = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session || session?.user.rol !== 'ADMIN') {
		throw redirect(302, '/');
	}
	return {
		brands: prismaClient.brand.findMany()
	};
}) satisfies PageServerLoad;
export const actions: Actions = {
	default: async ({ request }) => {
		const {
			brand: name,
			email,
			phone,
			url_img
		} = Object.fromEntries(await request.formData()) as {
			brand: string;
			email: string;
			phone: string;
			url_img: string;
		};
		try {
			await prismaClient.brand.create({ data: { name, email, phone, url_img } });
			return {
				status: 200
			};
		} catch (err) {
			return fail(501, { error: err });
		}
	}
};
