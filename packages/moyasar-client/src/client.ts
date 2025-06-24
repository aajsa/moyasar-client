import { publicKey, secretKey } from './env'
import type { ApiHandler, ClientConfig, RouteOptions } from './types'
import { routeHandler } from './utils'

export const createClient = <T extends Record<string, RouteOptions>>(
	schema: T,
	config?: ClientConfig,
): { [K in keyof T]: ApiHandler<T[K]> } => {
	const apiKey = config?.apiKey ?? (config?.keyType === 'public' ? publicKey : secretKey)

	if (!apiKey) {
		throw new Error('API key is required but was not provided.')
	}

	const client = {} as { [K in keyof T]: ApiHandler<T[K]> }

	for (const key in schema) {
		client[key] = routeHandler(
			schema[key],
			apiKey,
			config?.fetchOptions,
			config?.disableValidation ?? false,
		) as ApiHandler<T[typeof key]>
	}
	return client
}
