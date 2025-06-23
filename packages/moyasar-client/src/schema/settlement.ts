import { z } from 'zod/v4-mini'
import { MetaResponseSchema, paramPathIdSchema } from './common'

export const RecipientTypeEnum = z.enum(['Entity', 'Platform', 'Beneficiary'])

const SettlementsResponseSchema = z.object({
	id: z.uuid(),
	recipient_type: RecipientTypeEnum,
	recipient_id: z.uuid(),
	currency: z.string().check(z.length(3)),
	amount: z.number(),
	fee: z.number(),
	tax: z.number(),
	reference: z.string(),
	settlement_count: z.number(),
	invoice_url: z.nullish(z.url()),
	csv_list_url: z.nullish(z.url()),
	pdf_list_url: z.nullish(z.url()),
	created_at: z.string(),
})

export const settlementsEndpoints = {
	getSettlementId: {
		path: '/settlements/:id',
		method: 'GET',
		params: paramPathIdSchema,
		output: SettlementsResponseSchema,
	},
	listSettlements: {
		path: '/settlements',
		method: 'GET',
		query: z.partial(
			z.object({
				page: z.number(),
				id: z.uuid(),
				'created[gt]': z.string(),
				'created[lt]': z.string(),
			}),
		),

		output: z.object({
			settlements: z.nullish(z.array(SettlementsResponseSchema)),
			meta: MetaResponseSchema,
		}),
	},
	getSettlementsLines: {
		path: '/settlements/:id/lines',
		method: 'GET',
		params: paramPathIdSchema,
		query: z.partial(z.object({ page: z.number() })),
		output: z.object({
			settlements: z.nullish(z.array(SettlementsResponseSchema)),
			meta: MetaResponseSchema,
		}),
	},
}
