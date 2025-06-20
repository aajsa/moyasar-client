import { z } from 'zod/v4-mini'

export const getApplePaySessionRequestSchema = z.object({
	validation_url: z.url(),
	display_name: z.string(),
	domain_name: z.string(),
	publishable_api_key: z.string(),
})

export const getApplePaySessionResponseSchema = z.partial(
	z.object({
		epochTimestamp: z.number(),
		expiresAt: z.number(),
		merchantSessionIdentifier: z.string(),
		nonce: z.string(),
		merchantIdentifier: z.string(),
		domainName: z.string(),
		displayName: z.string(),
		signature: z.string(),
		operationalAnalyticsIdentifier: z.string(),
		retries: z.number(),
	}),
)

export type getApplePaySessionRequestSchema = z.infer<typeof getApplePaySessionResponseSchema>
export type ApplePaySessionResponse = z.infer<typeof getApplePaySessionResponseSchema>

export const applePayEndpoints = {
	getApplePaySession: {
		path: '/applepay/initiate',
		method: 'POST',
		input: getApplePaySessionRequestSchema,
		output: getApplePaySessionResponseSchema,
	},
}
