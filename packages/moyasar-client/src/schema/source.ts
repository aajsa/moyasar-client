import { z } from 'zod/v4-mini'

export const sourcesEndpoints = {
	getIssuer: {
		path: '/source/issuer',
		method: 'POST',
		input: z.object({
			source: z.discriminatedUnion('type', [
				z.object({
					type: z.literal('creditcard'),
					number: z.string().check(z.regex(/^\d{16,19}$/)),
				}),
				z.object({
					type: z.literal('applepay'),
					token: z.string().check(z.startsWith('token_')),
				}),
			]),
		}),
		output: z.object({
			issuer_name: z.string(),
			issuer_country: z.string(),
			issuer_card_type: z.enum(['debit', 'credit', 'charge_card', 'unspecified']),
			issuer_card_category: z.string(),
			first_digits: z.string(),
			last_digits: z.nullish(z.string()),
		}),
	},
}
