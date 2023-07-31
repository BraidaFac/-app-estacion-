// lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { prismaClient } from '$lib/server/prisma';

export const auth = lucia({
	adapter: prisma(prismaClient, {
		user: 'authUser',
		session: 'authSession',
		key: 'authKey'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => ({
		userid: data.id,
		username: data.username,
		name: data.name
	})
});

export type Auth = typeof auth;
