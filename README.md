# @aajsa/moyasar-client

A lightweight and type-safe TypeScript client for interacting with Moyasar Payment Gateway APIs.

> [!NOTE]
> This is an **unofficial project** and is not affiliated with [Moyasar.com](https://moyasar.com).
> Created for personal use, following the [official Moyasar documentation](https://docs.moyasar.com).

## Installation

```bash
# Using npm
npm install @aajsa/moyasar-client
```

## Usage

> [!WARNING]
> Do **NOT** use `createPayment` or `createToken` on the **backend**.
> These functions are for **frontend use only**, using a **Publishable Key** (or `keyType: 'public'` if using environment keys).
> For more information, refer to the official docs:
> [https://docs.moyasar.com/api/authentication](https://docs.moyasar.com/api/authentication)

## Setup Environment Variables

You can use the keys directly in your code, but if you prefer using **Environment Keys**, add the following to your `.env` file:

```env
# Environment Keys (Optional)
MOYASAR_PUBLIC_KEY=public_key_here
MOYASAR_SECRET_KEY=secret_key_here
```

## Example

```typescript
import { createMoyasar } from '@aajsa/moyasar-client'

const mysr = createMoyasar({ keyType: 'public' })

const uuid = crypto.randomUUID()

export const data = await mysr.createPayment({
	body: {
		given_id: uuid,
		amount: 100, // Amount in cents
		currency: 'SAR',
		source: {
			type: 'creditcard',
			name: 'Saud Fawaz',
			number: '4111111111111111',
			cvc: '966',
			month: 1,
			year: 2030,
		},
		callback_url: 'https://example.com/callback',
	},
})

console.log(data?.source.transaction_url)
```

## Configuration

The client can be initialized with the following options:

```typescript
const mysr = createMoyasar({
	apiKey: string, // MOYASAR_API_KEY, use if not using environment keys

	keyType: 'public' | 'secret', // Default: secret -  Use if you setup environment keys

	disableValidation: boolean, // Default: false — disables input, params, query, and output validation

	fetchOptions: RequestInit, // Fetch API options
})
```

## License

MIT © [AzizAljohani](https://github.com/aajsa)
