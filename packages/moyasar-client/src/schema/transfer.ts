import { z } from 'zod/v4-mini'
import { MetaResponseSchema, paramPathIdSchema } from './common'
import { RecipientTypeEnum } from './settlement'

const TransferResponseSchema = z.object({
	id: z.uuid(),
	recipient_type: RecipientTypeEnum,
	recipient_id: z.uuid(),
	currency: z.string().check(z.length(3)),
	amount: z.number(),
	fee: z.number(),
	tax: z.number(),
	reference: z.string(),
	transaction_count: z.number(),
	created_at: z.string(),
})

export const transfersEndpoints = {
	listTransfers: {
		path: '/transfers',
		method: 'GET',
		output: z.object({
			transfers: z.array(TransferResponseSchema),
			meta: MetaResponseSchema,
		}),
	},
	getTransferId: {
		path: '/transfers/:id',
		method: 'GET',
		params: paramPathIdSchema,
		output: TransferResponseSchema,
	},
	getTransferLines: {
		path: '/transfers/:id/lines',
		method: 'GET',
		params: paramPathIdSchema,
		output: z.object({
			lines: z.array(
				z.object({
					payment_id: z.string(),
					type: z.string(),
					amount: z.number(),
					fee: z.number(),
					tax: z.number(),
				}),
			),
			meta: MetaResponseSchema,
		}),
	},
}
