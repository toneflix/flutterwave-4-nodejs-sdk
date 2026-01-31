import { beforeAll, describe, expect, it } from 'vitest'

import { Flutterwave } from '../src'
import crypto from 'crypto'

let flutterwave: Flutterwave
let customerId: string
let chargeId: string
let paymentMethodId: string

describe('API Spec', () => {
    beforeAll(() => {
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

    describe('Customers', () => {
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
            }, 'test-trace-id-123', 'idempotency-key-456')

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

    describe('Payment Methods', () => {
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
            }, 'test-trace-id-123', 'idempotency-key-456')

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

    describe('Charges', async () => {
        it('can create charge', async () => {
            const response = await flutterwave.api.charges.create({
                amount: 1000,
                currency: 'NGN',
                reference: `test-charge-ref-${Date.now()}`,
                customer_id: customerId,
                payment_method_id: paymentMethodId,
            }, 'test-trace-id-123', 'idempotency-key-456')

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
            }, 'test-trace-id-123', 'idempotency-key-456')

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