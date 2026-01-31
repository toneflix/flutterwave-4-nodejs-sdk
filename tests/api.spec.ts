import { beforeAll, describe, expect, it } from 'vitest'

import { Flutterwave } from '../src'
import crypto from 'crypto'

let flutterwave: Flutterwave
let customerId: string
let chargeId: string
let paymentMethodId: string
let orderId: string
let traceId: string
let indempotencyKey: string

describe('API Spec', () => {
    beforeAll(() => {
        traceId = 'test-trace-id-' + Math.floor(Math.random() * 999).toString()
        indempotencyKey = 'test-idempotency-key-' + Math.floor(Math.random() * 999).toString()
        flutterwave = new Flutterwave()
    })

    describe('Banks', () => {
        it('can load all banks', async () => {
            const banks = await flutterwave.api.banks.list('NG')

            expect(banks).toBeDefined()
            expect(banks.length).toBeGreaterThan(0)
            expect(flutterwave.api.banks).toBeDefined()
        })

        it('will throw an error for invalid country code', async () => {
            await expect(flutterwave.api.banks.list('XX' as any)).rejects.toThrow()
        })

        it('can load bank branches', async () => {
            const branches = await flutterwave.api.banks.branches('190')

            expect(branches).toBeDefined()
            // expect(branches.length).toBeGreaterThan(0)
        })

        it('can resolve NGN account', async () => {
            const response = await flutterwave.api.banks.resolve({
                account: {
                    code: '044',
                    number: '0690000031',
                },
                currency: 'NGN',
            })

            expect(response).toBeDefined()
            expect(response.account_name).toBeDefined()
        })

        it('can resolve USD account', async () => {
            const response = await flutterwave.api.banks.resolve({
                account: {
                    country: 'NG',
                    code: '101',
                    number: '1234567890',
                },
                currency: 'USD',
            })

            expect(response).toBeDefined()
            expect(response.account_name).toBeDefined()
            expect(response.account_number).toBe('1234567890')
        })

        it('can resolve GBP account - individual', async () => {
            const response = await flutterwave.api.banks.resolve({
                account: {
                    type: 'individual',
                    code: '044',
                    number: '12345678',
                    name: {
                        first: 'John',
                        last: 'Doe',
                    },
                },
                currency: 'GBP',
            })

            expect(response).toBeDefined()
            expect(response.account_name).toBeDefined()
            expect(response.account_name).toBe('John Doe')
        })

        it('can resolve GBP account - corporate', async () => {
            const response = await flutterwave.api.banks.resolve({
                account: {
                    type: 'corporate',
                    code: '04',
                    number: '12345678',
                    business_name: 'Acme Corp',
                },
                currency: 'GBP',
            })

            expect(response).toBeDefined()
            expect(response.account_name).toBeDefined()
            expect(response.account_name).toBe('Acme Corp')
        })
    })

    describe.skip('Fees', () => {
        /**
         * Probably Not Implemented Yet By Flutterwave
         */
        it('can retrieve transaction fees', async () => {
            const response = await flutterwave.api.fees.retrieve({
                amount: 12.34,
                currency: 'NGN',
                payment_method: 'card',
                card6: '424242',
                country: 'NG',
            }, traceId)

            expect(response).toBeDefined()
            expect(response.charge_amount).toBeDefined()
            expect(response.fee).toBeDefined()
            expect(Array.isArray(response.fee)).toBe(true)
        })
    })

    describe('Mobile Networks', () => {
        it('can list mobile networks', async () => {
            const response = await flutterwave.api.mobileNetworks.list({
                country: 'CG',
            }, traceId)

            expect(response).toBeDefined()
            expect(Array.isArray(response)).toBe(true)
            expect(response.length).toBeGreaterThan(0)
        })
    })

    describe.only('Customers', () => {
        it('can create customer', async () => {
            const response = await flutterwave.api.customers.create({
                email: `testuser${Date.now()}@example.com`,
                name: {
                    first: 'Test',
                    last: 'User',
                },
                phone: {
                    country_code: '234',
                    number: '8012345678',
                },
                address: {
                    line1: '123 Test St',
                    city: 'Lagos',
                    state: 'Lagos',
                    country: 'NG',
                    postal_code: '100001',
                },
                meta: {
                    custom_field: 'custom_value',
                },
            }, traceId, indempotencyKey)

            customerId = response.id
            expect(response).toBeDefined()
            expect(response.id).toBeDefined()
            expect(response.email).toBeDefined()
        })

        it('can list customers', async () => {
            const response = await flutterwave.api.customers.list({
                page: 1,
                size: 10,
            })

            expect(response).toBeDefined()
            expect(response.data).toBeDefined()
            expect(Array.isArray(response.data)).toBe(true)
            expect(response.meta).toBeDefined()
        })
    })

    describe.only('Payment Methods', () => {
        it('can create payment method', async () => {
            const response = await flutterwave.api.paymentMethods.create({
                type: 'card',
                card: {
                    // Random 12 digit alphanumeric string for nonce
                    nonce: crypto.randomBytes(6).toString('hex'),
                    card_number: '4242424242424242',
                    cvv: '123',
                    expiry_month: '12',
                    expiry_year: '30',
                    billing_address: {
                        line1: '123 Test St',
                        city: 'Lagos',
                        state: 'Lagos',
                        country: 'NG',
                        postal_code: '100001',
                    },
                },
                customer_id: customerId,
            }, traceId, indempotencyKey)

            paymentMethodId = response.id
            expect(response).toBeDefined()
            expect(response.id).toBeDefined()
            expect(response.type).toBe('card')
        })

        it('can list payment methods', async () => {
            const response = await flutterwave.api.paymentMethods.list({
                page: 1,
                size: 10,
            })

            expect(response).toBeDefined()
            expect(response.data).toBeDefined()
            expect(Array.isArray(response.data)).toBe(true)
            expect(response.meta).toBeDefined()
        })
    })

    describe('Orders', () => {
        it('can create order', async () => {
            const response = await flutterwave.api.orders.create({
                amount: 1500,
                currency: 'NGN',
                reference: `test-order-ref-${Date.now()}`,
                customer_id: customerId,
                payment_method_id: paymentMethodId,
                meta: {
                    order_note: 'Test order creation',
                },
            }, traceId, indempotencyKey)

            orderId = response.id
            expect(response).toBeDefined()
            expect(response.id).toBeDefined()
            expect(response.amount).toBe(1500)
        })

        it('can list orders', async () => {
            const response = await flutterwave.api.orders.list({
                from: '2025-04-21T10:55:16Z',
                to: '2025-04-30T23:59:59Z',
                page: 1,
                size: 10,
            })

            expect(response).toBeDefined()
            expect(response.data).toBeDefined()
            expect(Array.isArray(response.data)).toBe(true)
            expect(response.meta).toBeDefined()
        })

        it('can retrieve order', async () => {
            const response = await flutterwave.api.orders.retrieve(orderId, traceId)

            expect(response).toBeDefined()
            expect(response.id).toBe(orderId)
        })

        it('can update order', async () => {
            const response = await flutterwave.api.orders.update(orderId, {
                action: 'capture',
                meta: {
                    updated_note: 'Updated order note',
                },
            }, traceId, 'scenario-key-789')

            expect(response).toBeDefined()
            expect(response.id).toBe(orderId)
            expect(response.meta).toBeDefined()
            expect(response.status).toBe('completed')
        })
    })

    describe('Charges', async () => {
        it('can create charge', async () => {
            const response = await flutterwave.api.charges.create({
                amount: 1000,
                currency: 'NGN',
                reference: `test-charge-ref-${Date.now()}`,
                customer_id: customerId,
                payment_method_id: paymentMethodId,
            }, traceId, indempotencyKey)

            chargeId = response.id
            expect(response).toBeDefined()
            expect(response.id).toBeDefined()
            expect(response.amount).toBe(1000)
        })

        it('can list charges', async () => {
            const response = await flutterwave.api.charges.list({
                from: '2025-04-21T10:55:16Z',
                to: '2025-04-30T23:59:59Z',
                page: 1,
                size: 10,
            })

            expect(response).toBeDefined()
            expect(response.data).toBeDefined()
            expect(Array.isArray(response.data)).toBe(true)
            expect(response.meta).toBeDefined()
        })
    })

    describe('Chargebacks', () => {
        it('can create chargeback', async () => {
            const response = await flutterwave.api.chargebacks.create({
                type: 'local',
                charge_id: chargeId,
                amount: 500,
                expiry: 7,
                stage: 'new',
                status: 'pending',
                comment: 'Customer disputed the charge',
                arn: '1243453453434234534443423'
            }, traceId, indempotencyKey)

            expect(response).toBeDefined()
            expect(response.id).toBeDefined()
            expect(response.charge_id).toBe(chargeId)
        })

        it('can list chargebacks', async () => {
            const response = await flutterwave.api.chargebacks.list({
                from: '2025-04-21T10:55:16Z',
                to: '2025-04-30T23:59:59Z',
                page: 1,
                size: 10,
            })

            expect(response).toBeDefined()
            expect(response.data).toBeDefined()
            expect(Array.isArray(response.data)).toBe(true)
            expect(response.meta).toBeDefined()
        })
    })
})