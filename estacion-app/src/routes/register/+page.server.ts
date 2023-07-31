import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { ZodError } from 'zod';
import { generateRandomString } from 'lucia/utils';

const registerSchema = z
	.object({
		name: z
			.string({ required_error: 'Ingrese su nombre' })
			.min(1, { message: 'Ingrese su nombre' })
			.max(50, { message: 'Ingrese hasta 50 caracteres' })
			.trim(),
		username: z
			.string({ required_error: 'Ingrese su nombre de usuario' })
			.min(1, { message: 'Ingrese su nombre de usuario' })
			.max(20, {
				message: 'El nombre de usuario puede tener hasta 20 caracteres'
			}),
		password: z
			.string({ required_error: 'Ingrese su contraseña' })
			.min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
			.max(20, { message: 'La contraseña puede tener hasta 20 caracteres' })
			.trim(),
		confirmPassword: z
			.string({ required_error: 'Confirme su contraseña' })
			.min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
			.max(20, { message: 'La contraseña puede tener hasta 20 caracteres' })
			.trim()
	})
	.superRefine(({ password, confirmPassword }, context) => {
		if (password !== confirmPassword) {
			context.addIssue({
				code: 'custom',
				message: 'Las contraseñas no coinciden',
				path: ['confirmPassword']
			});
		}
	});

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData()) as Record<string, string>;
		try {
			const result = registerSchema.parse(formData);
			await auth.createUser({
				userId: generateRandomString(20),
				key: {
					providerId: 'username',
					providerUserId: result.username.toLowerCase(),
					password: result.password
				},
				attributes: {
					username: result.username,
					name: result.name
				}
			});
		} catch (error) {
			if (error instanceof ZodError) {
				const { fieldErrors: errors } = error.flatten();
				return {
					data: { ...formData },
					errors
				};
			} else {
				console.log(error);
				return {
					message: 'No se pudo registrar al usuario'
				};
			}
		}
		throw redirect(302, '/login');
	}
};
