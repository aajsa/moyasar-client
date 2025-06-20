import { compile } from 'path-to-regexp'
import type { ApiHandler, Prettify, RouteOptions } from './types'
import type { z } from 'zod/v4-mini'

export const routeHandler = <T extends RouteOptions>(
	baseUrl: string,
	route: T,
	apiKey?: string,
	fetchOptions?: RequestInit,
	disableValidation?: boolean,
): ApiHandler<T> => {
	return async (input: any): Promise<Prettify<z.infer<T['output']>>> => {
		const { body, query, params } = input
		const { method, path } = route

		if (!disableValidation) {
			route.input?.parse?.(body)
			route.params?.parse?.(params)
			route.query?.parse?.(query)
		}

		const compilePath = compile(path)
		let url = baseUrl + compilePath(params ?? {})

		if (query) {
			const searchParams = new URLSearchParams()
			for (const [k, v] of Object.entries(query)) {
				if (v != null) searchParams.append(k, String(v))
			}
			if (searchParams.toString()) {
				url += `?${searchParams.toString()}`
			}
		}

		const headers: Record<string, any> = {
			Accept: 'application/json',
			...(apiKey ? { Authorization: `Basic ${btoa(`${apiKey}:`)}` } : {}),
			...(body ? { 'Content-Type': 'application/json' } : {}),
			...fetchOptions?.headers,
		}

		const config: RequestInit = {
			...fetchOptions,
			method: method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		}

		return await fetch(url, config).then(async (response) => {
			const data = await response.json()

			if (!response.ok) {
				return data as any
			}
			return data
		})
	}
}
