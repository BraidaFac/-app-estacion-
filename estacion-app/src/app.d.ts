import type { PrismaClient } from '@prisma/client';

declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}
	// eslint-disable-next-line no-var
	var __prisma: PrismaClient;
	/// <reference types="lucia" />
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			name: string;
			username: string;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}
export {};
