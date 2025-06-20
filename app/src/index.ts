import { createMoyasar } from '@aajsa/moyasar-client'

const data = await createMoyasar({
	keyType: 'public',
}).createPayment({
	body: {
		given_id: crypto.randomUUID(),
		amount: 100,
		currency: 'SAR',
		source: {
			type: 'creditcard',
			name: 'Saud Fawaz',
			number: '4111111111111111',
			cvc: '518',
			month: 3,
			year: 2030,
		},
		callback_url: 'https://example.com/',
	},
})

console.log(data?.source?.transaction_url)
