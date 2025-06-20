import { z } from 'zod/v4-mini'

export const TokenStatusEnum = z.enum(['initiated', 'active', 'inactive'])

export const TokenResponseSchema = z.object({
	id: z.string().check(z.startsWith('token_')),
	status: TokenStatusEnum,
	brand: z.string(),
	funding: z.string(),
	country: z.string(),
	month: z.string(),
	year: z.string(),
	name: z.string(),
	last_four: z.string(),
	metadata: z.nullish(z.object()),
	message: z.nullish(z.any()),
	verification_url: z.nullish(z.url()),
	created_at: z.string(),
	updated_at: z.string(),
	expires_at: z.string(),
})

export const createTokenSchema = z.object({
	name: z.string().check(z.minLength(1), z.maxLength(255)),
	number: z.string().check(z.regex(/^\d{16,19}$/)),
	month: z.number().check(z.minimum(1), z.maximum(12)),
	year: z.number().check(z.minimum(Number(new Date().getFullYear()))),
	cvc: z.number().check(z.minimum(3), z.maximum(4)),
	callback_url: z.url(),
})

export const tokenIdSchema = z.object({
	id: z.string().check(z.startsWith('token_')),
})

export const tokensEndpoints = {
	getTokenId: {
		path: '/tokens/:id',
		method: 'GET',
		params: tokenIdSchema,
		output: TokenResponseSchema,
	},
	createToken: {
		path: '/tokens',
		method: 'POST',
		input: createTokenSchema,
		output: TokenResponseSchema,
	},
	deleteToken: {
		path: '/tokens/:id',
		method: 'DELETE',
		params: tokenIdSchema,
		output: TokenResponseSchema,
	},
}
