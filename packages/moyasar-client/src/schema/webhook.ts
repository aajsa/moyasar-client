import { z } from 'zod/v4-mini'
import { MetaResponseSchema, paramPathIdSchema } from './common'

export const WebhooksEventsEnum = z.enum([
	'payment_paid',
	'payment_failed',
	'payment_voided',
	'payment_authorized',
	'payment_captured',
	'payment_refunded',
	'payment_abandoned',
	'payment_verified',
	'payment_canceled',
	'payment_expired',
	'balance_transferred',
	'payout_initiated',
	'payout_paid',
	'payout_failed',
	'payout_canceled',
	'payout_returned',
])

export const WebhookResponseSchema = z.object({
	id: z.uuid(),
	http_method: z.string(),
	url: z.url(),
	events: z.array(WebhooksEventsEnum),
	created_at: z.string(),
})

export const WebhookAttemptResponseSchema = z.object({
	id: z.uuid(),
	webhook_id: z.uuid(),
	event_id: z.uuid(),
	event_type: WebhooksEventsEnum,
	retry_number: z.number(),
	result: z.string(),
	message: z.string(),
	response_code: z.number(),
	response_headers: z.string(),
	response_body: z.string(),
	created_at: z.string(),
})

export const createWebhookSchema = z.object({
	url: z.url(),
	shared_secret: z.string(),
	events: z.array(WebhooksEventsEnum),
})

export const webhooksEndpoints = {
	getWebhookAttemptId: {
		path: '/webhooks/attempts/:id',
		method: 'GET',
		params: paramPathIdSchema,
		output: WebhookAttemptResponseSchema,
	},
	listWebhookAttempts: {
		path: '/webhooks/attempts',
		method: 'GET',
		output: z.object({
			webhook_attempts: z.array(WebhookAttemptResponseSchema),
			meta: MetaResponseSchema,
		}),
	},
	getWebhookId: {
		path: '/webhooks/:id',
		method: 'GET',
		params: paramPathIdSchema,
		output: WebhookResponseSchema,
	},
	listWebhooks: {
		path: '/webhooks',
		method: 'GET',
		output: z.object({
			webhooks: z.array(WebhookResponseSchema),
		}),
	},
	listWebhookEvents: {
		path: '/webhooks/available_events',
		method: 'GET',
		output: z.object({
			events: z.array(WebhooksEventsEnum),
		}),
	},
	createWebhook: {
		path: '/webhooks',
		method: 'POST',
		input: createWebhookSchema,
		output: WebhookResponseSchema,
	},
	deleteWebhook: {
		path: '/webhooks/:id',
		method: 'DELETE',
		params: paramPathIdSchema,
		output: z.object({
			success: z.boolean(),
		}),
	},
}
