import { z } from 'zod';

export const registerSchema = z.object({
	username: z
		.string({ required_error: 'Ingrese su nombre' })
		.min(1, { message: 'Ingrese su nombre' })
		.max(50, { message: 'Ingrese hasta 50 caracteres' })
		.trim(),
	password: z
		.string({ required_error: 'Ingrese su contraseña' })
		.min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
		.max(20, { message: 'La contraseña puede tener hasta 20 caracteres' })
		.trim()
});
