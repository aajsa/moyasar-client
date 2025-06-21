import { createMoyasar } from '@aajsa/moyasar-client'

const uuid = crypto.randomUUID()
const mysr = createMoyasar()

const data = await createMoyasar({
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

console.log(data?.source?.transaction_url)

const getPaymentId = await mysr.getPaymentId({
	params: { id: uuid },
})

console.log(getPaymentId)

const createWebhook = await mysr.createWebhook({
	body: {
		url: 'https://example.com/test',
		shared_secret: 'any secert key',
		events: ['payment_paid', 'payment_faild'],
	},
})

console.log(createWebhook)
