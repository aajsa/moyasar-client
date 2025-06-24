import { createClient } from './client'
import { schema } from './schema'
import type { ClientConfig, MoyasarClient } from './types'

/**
 * Create a client to interact with the Moyasar API.
 * @param config - Configuration options
 * @example
 * const mysr = createMoyasar({ apiKey: "sk_test_"});
 * const listInvoices = await moyasar.listInvoices();
 */
export const createMoyasar = (config?: ClientConfig): MoyasarClient => {
	return createClient(schema, config)
}
