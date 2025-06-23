import { apiUrl, publicKey, secretKey } from './env'
import type { ApiHandler, ClientConfig, RouteOptions } from './types'
import { routeHandler } from './utils'

export const createClient = <T extends Record<string, RouteOptions>>(
	schema: T,
	config?: ClientConfig,
): { [K in keyof T]: ApiHandler<T[K]> } => {
	const baseUrl = apiUrl ?? 'https://api.moyasar.com/v1'
	const keyType = config?.keyType ?? 'secret'
	const apiKey = config?.apiKey ?? (keyType === 'public' ? publicKey : secretKey)
	const disableValidation = config?.disableValidation ?? false
	const fetchOptions = config?.fetchOptions

	if (!apiKey) {
		throw new Error('API key is required but was not provided.')
	}

	const client = {} as { [K in keyof T]: ApiHandler<T[K]> }

	for (const key in schema) {
		client[key] = routeHandler(baseUrl, schema[key], apiKey, fetchOptions, disableValidation)
	}

	return client
}
