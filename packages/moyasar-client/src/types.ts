import type { ZodMiniType, z } from 'zod/v4-mini'

export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type ClientConfig = {
	apiKey?: string
	keyType?: 'public' | 'secret'
	disableValidation?: boolean
	fetchOptions?: RequestInit
}

export type RouteOptions = {
	path: string
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | string
	input?: ZodMiniType
	output: ZodMiniType
	query?: ZodMiniType
	params?: ZodMiniType<Record<string, unknown>>
}

type OptionalKey<K extends string, T> = undefined extends z.infer<T>
	? { [P in K]?: z.infer<T> }
	: { [P in K]: z.infer<T> }

type RouteArgs<T extends RouteOptions> = Prettify<
	(T['input'] extends z.ZodMiniType<any> ? OptionalKey<'body', T['input']> : {}) &
		(T['query'] extends z.ZodMiniType<any> ? OptionalKey<'query', T['query']> : {}) &
		(T['params'] extends z.ZodMiniType<any> ? OptionalKey<'params', T['params']> : {})
>

export type ApiHandler<T extends RouteOptions> = {} extends RouteArgs<T>
	? (input?: RouteArgs<T>) => Promise<Prettify<z.infer<T['output']>>>
	: (input: RouteArgs<T>) => Promise<Prettify<z.infer<T['output']>>>
