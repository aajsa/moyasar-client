import { createMoyasar } from '@aajsa/moyasar-client'

const mysr = createMoyasar({
	fetchOptions: {
		cache: 'no-store',
	},
})

const uuid = crypto.randomUUID()

// Create Payment
mysr
	.createPayment({
		body: {
			given_id: uuid,
			amount: 100, // amount in halalas
			currency: 'SAR',
			source: {
				type: 'stcpay',
				mobile: '0500000000',
			},
			callback_url: 'https://aaj.sa',
		},
	})
	.then((res) => console.log(res, '\n Url: ', res.source.transaction_url))

// Get Payment
const getPayment = await mysr.getPaymentId({
	params: { id: 'c00df9a8-3fce-4422-87ec-9740257ca7ea' },
})

console.log(getPayment)
