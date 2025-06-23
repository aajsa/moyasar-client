import { z } from 'zod/v4-mini'

export const paramPathIdSchema = z.object({ id: z.uuid() })

export const MetaResponseSchema = z.partial(
	z.object({
		current_page: z.number(),
		next_page: z.number(),
		prev_page: z.number(),
		total_pages: z.number(),
		total_count: z.number(),
	}),
)

/*
export const CommonResponses = {
	400: {
		name: "Bad Request",
		description:
			"The request was unacceptable, often due to missing a required parameter",
	},
	401: {
		name: "Unauthorized",
		description: "No valid API key was provided",
	},
	403: {
		name: "Forbidden",
		description: "credentials not enough to access resources",
	},
	404: {
		name: "Not Found",
		description: "The requested resource doesn’t exist",
	},
	405: {
		name: "Method Not Allowed",
		description: "Entity not activated to use live account",
	},
	429: {
		name: "Too Many Requests",
		description: "Too many requests hit the API too quickly",
	},
	500: {
		name: "Internal Server Error",
		description: "We had a problem with our server. Try again later.",
	},
	503: {
		name: "Service Unavailable",
		description:
			"We are temporarily offline for maintenance. Please try again later.",
	},
};
*/
