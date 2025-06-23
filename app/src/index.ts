import { createMoyasar } from '@aajsa/moyasar-client'

const uuid = crypto.randomUUID()
const mysr = createMoyasar({
	fetchOptions: {
		cache: 'no-store',
	},
})

const createPayment = await createMoyasar({
	keyType: 'public',
}).createPayment({
	body: {
		given_id: uuid,
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

const getPaymentId = await mysr.getPaymentId({
	params: { id: uuid },
})

const createWebhook = await mysr.createWebhook({
	body: {
		url: 'https://app.test.com/test',
		shared_secret: '555',
		events: ['payment_paid', 'payment_failed'],
	},
})
/*
const deleteWehbook = await mysr.deleteWebhook({
	params: {
		id: '',
	},
})
*/

const stcpay = await mysr.createPayment({
	body: {
		given_id: crypto.randomUUID(),
		amount: 100,
		currency: 'SAR',
		source: {
			type: 'stcpay',
			mobile: '0510510939',
		},
		callback_url: 'https://google.com', // i will fix it.
	},
})
