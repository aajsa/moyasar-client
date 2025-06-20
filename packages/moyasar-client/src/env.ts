import { z } from 'zod/v4-mini'

export const env = z
	.object({
		MOYASAR_SECRET_KEY: z.optional(
			z
				.string({ error: 'MOYASAR_SECRET_KEY must be provided in environment' })
				.check(z.startsWith('sk_')),
		),

		MOYASAR_PUBLIC_KEY: z.optional(
			z
				.string({ error: 'MOYASAR_PUBLIC_KEY must be provided in environment' })
				.check(z.startsWith('pk_')),
		),

		MOYASAR_API_URL: z._default(z.url(), 'https://api.moyasar.com/v1'),
	})
	.parse(process.env)

export const apiUrl = env.MOYASAR_API_URL

export const secretKey = env.MOYASAR_SECRET_KEY

export const publicKey = env.MOYASAR_PUBLIC_KEY
