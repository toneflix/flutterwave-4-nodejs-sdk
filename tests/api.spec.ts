import { beforeAll, describe, expect, it } from 'vitest'

import { Flutterwave } from '../src'

let flutterwave: Flutterwave

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
        })
    })
})