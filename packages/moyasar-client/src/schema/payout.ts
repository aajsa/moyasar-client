import { length, z } from 'zod/v4-mini'
import { MetaResponseSchema, paramPathIdSchema } from './common'

const PayoutAccountTypeEnum = z.enum(['bank', 'wallet'])

const PayoutStatusEnum = z.enum(['queued', 'initiated', 'paid', 'failed', 'canceled', 'returned'])

const PayoutPurposeEnum = z.enum([
	'bills_or_rent',
	'expenses_services',
	'purchase_assets',
	'saving_investment',
	'government_dues',
	'money_exchange',
	'credit_card_loan',
	'gift_or_reward',
	'personal',
	'investment_transaction',
	'family_assistance',
	'donation',
	'payroll_benefits',
	'online_purchase',
	'hajj_and_umra',
	'dividend_payment',
	'government_payment',
	'investment_house',
	'payment_to_merchant',
	'own_account_transfer',
])

const PayoutChannelEnum = z.enum(['internal', 'ips', 'sarie'])

const PayoutResponseSchema = z.object({
	id: z.uuid(),
	source_id: z.uuid(),
	sequence_number: z.string().check(z.maxLength(16)),
	channel: PayoutChannelEnum,
	status: PayoutStatusEnum,
	amount: z.number(),
	currency: z.string().check(z.length(3)),
	purpose: PayoutPurposeEnum,
	comment: z.string(),
	destination: z.discriminatedUnion('type', [
		z.object({
			type: z.literal('bank'),
			iban: z.string(),
			name: z.string(),
			mobile: z.string(),
			country: z.string(),
			city: z.string(),
		}),
		z.object({
			type: z.literal('wallet'),
			mobile: z.string(),
		}),
	]),
	message: z.string(),
	failure_reason: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	metadata: z.nullish(z.record(z.string(), z.string())),
})

const PayoutAccountResponseSchema = z.object({
	id: z.uuid(),
	account_type: PayoutAccountTypeEnum,
	currency: z.string().check(z.length(3)),
	properties: z.record(z.string(), z.string()),
	created_at: z.string(),
})

const createPayoutSchema = z.object({
	source_id: z.uuid(),
	sequence_number: z.optional(z.string().check(length(16))),
	amount: z.number().check(z.positive()),
	purpose: PayoutPurposeEnum,
	destination: z.discriminatedUnion('type', [
		z.object({
			type: z.literal('bank'),
			iban: z.string(),
			name: z.string(),
			mobile: z.string(),
			country: z.string(),
			city: z.string(),
		}),
		z.object({
			type: z.literal('wallet'),
			mobile: z.string(),
		}),
	]),
	comment: z.optional(z.string()),
	metadata: z.nullish(z.record(z.string(), z.string())),
})

const createBulkPayoutsSchema = z.object({
	source_id: z.uuid(),
	payouts: z.array(
		z.object({
			sequence_number: z.optional(z.string().check(length(16))),
			amount: z.number().check(z.positive()),
			purpose: PayoutPurposeEnum,
			destination: z.discriminatedUnion('type', [
				z.object({
					type: z.literal('bank'),
					iban: z.string(),
					name: z.string(),
					mobile: z.string(),
					country: z.string(),
					city: z.string(),
				}),
				z.object({
					type: z.literal('wallet'),
					mobile: z.string(),
				}),
			]),
			comment: z.optional(z.string()),
			metadata: z.optional(z.record(z.string(), z.string())),
		})
	),
})

export const payoutAccountEndpoint = {
	getPayoutAccountId: {
		path: '/payout_accounts/:id',
		method: 'GET',
		params: paramPathIdSchema,
		output: PayoutAccountResponseSchema,
	},
	listPayoutAccounts: {
		path: '/payout_accounts',
		method: 'GET',
		query: z.optional(z.object({ page: z.number() })),
		output: z.object({
			payout_accounts: z.nullish(z.array(PayoutAccountResponseSchema)),
			meta: MetaResponseSchema,
		}),
	},
	createPayoutAccount: {
		path: '/payout_accounts',
		method: 'POST',
		input: z.object({
			account_type: PayoutAccountTypeEnum,
			properties: z.record(z.string(), z.string()),
			credentials: z.record(z.string(), z.string()),
		}),
		output: PayoutAccountResponseSchema,
	},
}

export const payoutsEndpoints = {
	getPayoutId: {
		path: '/payout/:id',
		method: 'GET',
		params: paramPathIdSchema,
		output: PayoutResponseSchema,
	},
	listPayouts: {
		path: '/payouts',
		method: 'GET',
		query: z.optional(z.object({ page: z.number() })),
		output: z.object({
			payouts: z.nullish(z.array(PayoutResponseSchema)),
			meta: MetaResponseSchema,
		}),
	},
	createPayout: {
		path: '/payouts',
		method: 'POST',
		input: createPayoutSchema,
		output: PayoutResponseSchema,
	},
	createBulkPayout: {
		path: '/payout/bulk',
		method: 'POST',
		input: createBulkPayoutsSchema,
		output: PayoutResponseSchema,
	},
}
