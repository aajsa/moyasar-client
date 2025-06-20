import { z } from 'zod/v4-mini'
import { MetaResponseSchema, paramPathIdSchema } from './common'

export const PaymentStatusEnum = z.enum([
	'initiated',
	'paid',
	'authorized',
	'failed',
	'refunded',
	'captured',
	'voided',
	'verified',
])

export const PaymentResponseSchema = z.object({
	id: z.uuid(),
	status: PaymentStatusEnum,
	amount: z.number(),
	fee: z.number(),
	currency: z.string().check(z.length(3)),
	refunded: z.number(),
	refunded_at: z.nullish(z.string()),
	captured: z.number(),
	captured_at: z.nullish(z.string()),
	voided_at: z.nullish(z.string()),
	description: z.nullish(z.string()),
	amount_format: z.string(),
	fee_format: z.string(),
	refunded_format: z.nullish(z.string()),
	captured_format: z.nullish(z.string()),
	invoice_id: z.nullish(z.string()),
	ip: z.string(),
	callback_url: z.nullish(z.url()),
	created_at: z.nullish(z.string()),
	updated_at: z.nullish(z.string()),
	metadata: z.nullish(z.record(z.string(), z.string())),
	source: z.object({
		type: z.enum(['creditcard', 'applepay', 'googlepay', 'samsungpay', 'stcpay']),
		number: z.string(),
		gateway_id: z.string(),
		company: z.nullish(z.string()),
		name: z.nullish(z.string()),
		reference_number: z.nullish(z.string()),
		message: z.nullish(z.string()),
		authorization_code: z.nullish(z.string()),
		transaction_url: z.nullish(z.url()),
		response_code: z.nullish(z.string()),
		issuer_name: z.nullish(z.string()),
		issuer_country: z.nullish(z.string()),
		issuer_card_type: z.nullish(z.enum(['debit', 'credit', 'charge_card', 'unspecified'])),
		issuer_card_category: z.nullish(z.string()),
		token: z.nullish(z.string()),
		dpan: z.nullish(z.string()),
		mobile: z.nullish(z.string()),
		cashier: z.nullish(z.string()),
	}),
})

export const createPaymentSchema = z.object({
	given_id: z.uuid(),
	amount: z.number().check(z.positive()),
	currency: z.string().check(z.length(3)),
	description: z.optional(z.string()),
	source: z.discriminatedUnion('type', [
		z.object({
			type: z.literal('creditcard'),
			name: z.string().check(z.minLength(1), z.maxLength(255)),
			number: z.string().check(z.regex(/^\d{16,19}$/)),
			month: z.number().check(z.minimum(1), z.maximum(12)),
			year: z.number().check(z.minimum(Number(new Date().getFullYear()))),
			cvc: z.string().check(z.minLength(3), z.maxLength(4)),
			statement_descriptor: z.optional(z.string()),
			'3ds': z.optional(z._default(z.boolean(), true)),
			manual: z.optional(z.boolean()),
			save_card: z.optional(z._default(z.boolean(), false)),
		}),
		z.object({
			type: z.literal('token'),
			token: z.string().check(z.startsWith('token_')),
			cvc: z.string().check(z.minLength(3), z.maxLength(4)),
			statement_descriptor: z.optional(z.string()),
			'3ds': z._default(z.boolean(), true),
			manual: z.optional(z.boolean()),
		}),
		z.object({
			type: z.enum(['applepay', 'samsungpay', 'googlepay']),
			token: z.string(),
			manual: z.optional(z.boolean()),
			statement_descriptor: z.optional(z.string()),
		}),
		z.object({
			type: z.literal('stcpay'),
			mobile: z.string().check(z.regex(/^(0|(00|\+)?966)?(5\d{8})/)),
			cashier: z.optional(z.string()),
			branch: z.optional(z.string()),
		}),
	]),
	callback_url: z.url(), // (fix) it's required if source type is creditcard or token
	metadata: z.optional(z.record(z.string(), z.string())),
	apply_coupon: z.optional(z.boolean()),
})

export const getPaymentSchema = z.object({
	id: z.uuid(),
})

export const listPaymentSchema = z.optional(
	z.partial(
		z.object({
			page: z.number(),
			id: z.uuid(),
			status: PaymentStatusEnum,
			'created[gt]': z.string(),
			'created[lt]': z.string(),
			'updated[gt]': z.string(),
			'updated[lt]': z.string(),
			card_last_digits: z.string().check(z.minLength(4)),
			receipt_no: z.string(),
			metadata: z.record(z.string(), z.string()),
		}),
	),
)

export const updatePaymentSchema = z.partial(
	z.object({
		description: z.string(),
		metadata: z.record(z.string(), z.string()),
	}),
)

export const paymentAdjustmentSchema = z.object({
	amount: z.number(),
})

export const paymentsEndpoints = {
	getPaymentId: {
		path: '/payments/:id',
		method: 'GET',
		params: paramPathIdSchema,
		output: PaymentResponseSchema,
	},
	listPayments: {
		path: '/payments',
		method: 'GET',
		query: listPaymentSchema,
		output: z.partial(
			z.object({
				payments: z.array(PaymentResponseSchema),
				meta: MetaResponseSchema,
			}),
		),
	},
	createPayment: {
		path: '/payments',
		method: 'POST',
		input: createPaymentSchema,
		output: PaymentResponseSchema,
	},
	updatePayment: {
		path: '/payments/:id',
		method: 'PUT',
		params: paramPathIdSchema,
		input: updatePaymentSchema,
		output: PaymentResponseSchema,
	},
	refundPayment: {
		path: '/payments/:id/refund',
		method: 'POST',
		params: paramPathIdSchema,
		input: paymentAdjustmentSchema,
		output: PaymentResponseSchema,
	},
	capturePayment: {
		path: '/payments/:id/capture',
		method: 'POST',
		params: paramPathIdSchema,
		input: paymentAdjustmentSchema,
		output: PaymentResponseSchema,
	},
	voidPayment: {
		path: '/payments/:id/void',
		method: 'POST',
		params: paramPathIdSchema,
		output: PaymentResponseSchema,
	},
}
