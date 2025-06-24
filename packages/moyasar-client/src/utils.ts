import type { z } from 'zod/v4-mini'
import { apiUrl } from './env'
import type { Prettify, RouteOptions } from './types'
export const routeHandler = <T extends RouteOptions>(
	route: T,
	apiKey?: string,
	fetchOptions?: RequestInit,
	disableValidation?: boolean,
) => {
	return async (input: any) => {
		const { body, query, params } = input ?? {}
		const { method, path } = route

		// Validation
		try {
			if (!disableValidation) {
				route.input?.parse?.(body)
				route.params?.parse?.(params)
				route.query?.parse?.(query)
			}
		} catch (e) {
			throw new Error(`Validation failed: ${(e as Error).message}`)
		}

		// Build URL
		let url = apiUrl + path
		if (params) {
			url = url.replace(/:([a-zA-Z0-9_]+)/g, (_, id) => {
				return encodeURIComponent(params[id])
			})
		}

		if (query) {
			const searchParams = new URLSearchParams()
			for (const [k, v] of Object.entries(query)) {
				if (v != null) searchParams.append(k, String(v))
			}
			if (searchParams.toString()) {
				url += `?${searchParams.toString()}`
			}
		}

		// Request config
		const headers: Record<string, any> = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Basic ${btoa(`${apiKey}:`)}`,
			...fetchOptions?.headers,
		}

		const config: RequestInit = {
			...fetchOptions,
			method: method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		}

		// Make request
		const response = await fetch(url, config)
		const data = await response.json()

		if (response.ok) return data as Prettify<z.infer<T['output']>>
		return data
	}
}
