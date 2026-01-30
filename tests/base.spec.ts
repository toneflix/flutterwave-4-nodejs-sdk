import { describe, expect, it } from 'vitest'

import { Builder } from '../src/Builder'

describe('Builder Spec', () => {
    it('should get the base url based on environment', () => {
        const url = Builder.baseUrl()

        expect(url).toBe('https://developersandbox-api.flutterwave.com/')

        process.env.ENVIRONMENT = 'live'
        const liveUrl = Builder.baseUrl()
        expect(liveUrl).toBe('https://api.flutterwave.com/v4/')
    })

    it('should build a full url based on endpoint provided', () => {
        process.env.ENVIRONMENT = 'sandbox'
        const fullUrl = Builder.buildUrl('payments', 'initiate')

        expect(fullUrl).toBe('https://developersandbox-api.flutterwave.com/payments/initiate')

        process.env.ENVIRONMENT = 'live'
        const liveFullUrl = Builder.buildUrl('transactions', 'verify')
        expect(liveFullUrl).toBe('https://api.flutterwave.com/v4/transactions/verify')
    })

    it('should build parameters for query', () => {
        const queryParams = Builder.buildParams(
            {
                amount: 100,
                currency: 'USD',
                redirect: true,
            },
            'query'
        )

        expect(queryParams).toBe('amount=100&currency=USD&redirect=true')
    })

    it('should build parameters for path', () => {
        const pathParams = Builder.buildParams(
            {
                userId: 42,
                orderId: 1001,
            },
            'path'
        )

        expect(pathParams).toBe('42/1001')
    })

    it('should assign parameters to url for query', () => {
        const urlWithQuery = Builder.assignParamsToUrl(
            'https://api.example.com/resource',
            {
                search: 'test',
                page: 2,
            },
            'query'
        )

        expect(urlWithQuery).toBe('https://api.example.com/resource?search=test&page=2')
    })

    it('should assign parameters to url for path', () => {
        const urlWithPath = Builder.assignParamsToUrl(
            'https://api.example.com/user/{userId}/{detailId}',
            {
                userId: 42,
                detailId: 7,
            },
            'path'
        )

        expect(urlWithPath).toBe('https://api.example.com/user/42/7')
    })

    it('should build target url with path and query parameters', () => {
        const targetUrl = Builder.buildTargetUrl(
            'transactions/{transactionId}/details',
            { transactionId: 12345 },
            { include: 'all', verbose: true }
        )

        expect(targetUrl).toBe('https://api.flutterwave.com/v4/transactions/12345/details?include=all&verbose=true')
    })
})