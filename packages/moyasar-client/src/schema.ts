import { applePayEndpoints } from './schema/applePay'
import { invoicesEndpoints } from './schema/invoice'
import { paymentsEndpoints } from './schema/payment'
import { payoutAccountEndpoint, payoutsEndpoints } from './schema/payout'
import { settlementsEndpoints } from './schema/settlement'
import { sourcesEndpoints } from './schema/source'
import { tokensEndpoints } from './schema/token'
import { transfersEndpoints } from './schema/transfer'
import { webhooksEndpoints } from './schema/webhook'

export const schema = {
	...paymentsEndpoints,
	...invoicesEndpoints,
	...payoutAccountEndpoint,
	...payoutsEndpoints,
	...settlementsEndpoints,
	...sourcesEndpoints,
	...tokensEndpoints,
	...applePayEndpoints,
	...webhooksEndpoints,
	...transfersEndpoints,
} as const
