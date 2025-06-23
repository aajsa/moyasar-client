import { z } from 'zod/v4-mini'
import { MetaResponseSchema, paramPathIdSchema } from './common'
import { PaymentResponseSchema } from './payment'

const InvoiceStatusEnum = z.enum([
	'initiated',
	'paid',
	'failed',
	'refunded',
	'canceled',
	'on_hold',
	'expired',
	'voided',
])

const InvoiceResponseSchema = z.object({
	id: z.uuid(),
	status: InvoiceStatusEnum,
	amount: z.number(),
	currency: z.string().check(z.length(3)),
	description: z.string(),
	logo_url: z.nullish(z.url()),
	amount_format: z.string(),
	url: z.url(),
	callback_url: z.nullish(z.url()),
	expired_at: z.nullish(z.string()),
	created_at: z.string(),
	updated_at: z.string(),
	back_url: z.nullish(z.url()),
	success_url: z.nullish(z.url()),
	payments: PaymentResponseSchema,
	metadata: z.nullish(z.record(z.string(), z.string())),
})

const createInvoiceSchema = z.object({
	amount: z.number(),
	currency: z.string().check(z.length(3)),
	description: z.string(),
	callback_url: z.url(),
	success_url: z.url(),
	back_url: z.url(),
	expired_at: z.string(),
})

const createBulkInvoiceSchema = z.array(
	z.object({
		amount: z.number(),
		currency: z.string().check(z.length(3)),
		description: z.string(),
		callback_url: z.url(),
		success_url: z.url(),
		back_url: z.url(),
		expired_at: z.string(),
	})
)

const listInvoicesSchema = z.nullish(
	z.object({
		id: z.uuid(),
		page: z.number(),
		status: InvoiceStatusEnum,
		'created[gt]': z.string(),
		'created[lt]': z.string(),
		metadata: z.string(),
	})
)

const updateInvoice = z.partial(
	z.object({
		description: z.string(),
		metadata: z.record(z.string(), z.string()),
	})
)

export const invoicesEndpoints = {
	getInvoiceId: {
		path: '/invoices/:id',
		method: 'GET',
		params: paramPathIdSchema,
		output: InvoiceResponseSchema,
	},
	listInvoices: {
		path: '/invoices',
		method: 'GET',
		query: listInvoicesSchema,
		output: z.object({
			invoices: z.nullish(z.array(InvoiceResponseSchema)),
			meta: MetaResponseSchema,
		}),
	},
	createInvoice: {
		path: '/invoices',
		method: 'POST',
		input: createInvoiceSchema,
		output: InvoiceResponseSchema,
	},
	createBulkInvoice: {
		path: '/invoices/bulk',
		method: 'POST',
		input: createBulkInvoiceSchema,
		output: z.array(InvoiceResponseSchema),
	},
	updateInvoice: {
		path: '/invoices/:id',
		method: 'PUT',
		params: paramPathIdSchema,
		input: updateInvoice,
		output: InvoiceResponseSchema,
	},
	cancelInvoice: {
		path: '/invoices/:id/cancel',
		method: 'POST',
		params: paramPathIdSchema,
		output: InvoiceResponseSchema,
	},
}
