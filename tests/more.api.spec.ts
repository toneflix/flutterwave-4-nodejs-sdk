import { beforeAll, describe, expect, it } from 'vitest'

import { Flutterwave } from '../src'

let flutterwave: Flutterwave
let rateId: string
let traceId: string

describe('API Spec', () => {
    beforeAll(() => {
        traceId = 'test-trace-id-' + Math.floor(Math.random() * 999).toString()
        flutterwave = new Flutterwave()
    })

    describe('Transfer Rates', () => {
        it('should convert transfer rate', async () => {
            const rate = await flutterwave.api.transferRates.convert({
                source: {
                    currency: 'USD'
                },
                destination: {
                    amount: '100',
                    currency: 'NGN'
                },
                precision: 4
            }, traceId)

            expect(rate).toBeDefined()
            expect(rate.id).toBeDefined()
            expect(rate.rate).toBeDefined()
            expect(rate.source.currency).toBe('USD')
            expect(rate.destination.currency).toBe('NGN')

            rateId = rate.id
        })

        it('should fetch converted rate by id', async () => {
            const rate = await flutterwave.api.transferRates.fetch(
                rateId,
                traceId
            )

            expect(rate).toBeDefined()
            expect(rate.id).toBe(rateId)
        })
    })
})