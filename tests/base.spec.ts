import { describe, expect, it } from 'vitest'

import { Builder } from '../src/Builder'
import { Flutterwave } from '../src'
import { WebhookValidator } from '../src/utilities/WebhookValidator'

describe('Base Spec', () => {
    describe('Builder', () => {
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

        it('should encrypt card details', async () => {
            const cardDetails = {
                expiry_month: '12',
                expiry_year: '25',
                card_number: '4242424242424242',
                cvv: '123',
            }

            const encryptedDetails = await Builder.encryptCardDetails(cardDetails)

            expect(encryptedDetails).toHaveProperty('encrypted_expiry_month')
            expect(encryptedDetails).toHaveProperty('encrypted_expiry_year')
            expect(encryptedDetails).toHaveProperty('encrypted_card_number')
            expect(encryptedDetails).toHaveProperty('encrypted_cvv')
            expect(encryptedDetails).toHaveProperty('nonce')

            expect(typeof encryptedDetails.encrypted_expiry_month).toBe('string')
            expect(typeof encryptedDetails.encrypted_expiry_year).toBe('string')
            expect(typeof encryptedDetails.encrypted_card_number).toBe('string')
            expect(typeof encryptedDetails.encrypted_cvv).toBe('string')
            expect(typeof encryptedDetails.nonce).toBe('string')
        })

        it('should throw error if nonce length is invalid during encryption', async () => {
            const invalidNonce = 'ortnonce'
            const encryptWithInvalidNonce = Builder.encryptAES('testdata', 'sometoken', invalidNonce)

            await expect(encryptWithInvalidNonce).rejects.toThrow('Nonce must be exactly 12 characters long')
        })
    })

    describe('WebhookValidator', () => {
        it('should validate webhook signature', () => {
            const rawBody = '{"event":"payment_completed","data":{"id":12345}}'

            const validator = new WebhookValidator(process.env.SECRET_HASH!)

            expect(validator.validate(rawBody, validator.generateSignature(rawBody))).toBe(true)
        })

        it('should fail webhook signature validation if signatures do not match', () => {
            const rawBody = '{"event":"payment_completed","data":{"id":12345}}'

            const validator = new WebhookValidator(process.env.SECRET_HASH!)
            const validator2 = new WebhookValidator('different_secret')

            expect(validator2.validate(rawBody, validator.generateSignature(rawBody))).toBe(false)
        })
    })

    describe('Flutterwave', () => {
        it('should set and get environment correctly', () => {
            process.env.ENVIRONMENT = 'live'
            const flutterwaveInstance2 = new Flutterwave()
            expect(flutterwaveInstance2.getEnvironment()).toBe('live')

            process.env.ENVIRONMENT = 'sandbox'
            const flutterwaveInstance1 = new Flutterwave()
            expect(flutterwaveInstance1.getEnvironment()).toBe('sandbox')
        })

        it('should set debug level correctly', () => {
            const flutterwaveInstance = new Flutterwave()
            flutterwaveInstance.debug(2)

            expect(flutterwaveInstance.debugLevel).toBe(2)
        })

        it('should throw error if clientId or clientSecret is missing', () => {
            process.env.CLIENT_ID = ''
            process.env.CLIENT_SECRET = ''

            expect(() => new Flutterwave()).toThrow('Client ID and Client Secret are required to initialize Flutterwave instance')
        })

        it('should initialize Flutterwave instance with InitOptions', () => {
            const flutterwaveInstance = new Flutterwave({
                clientId: 'test_client_id',
                clientSecret: 'test_client_secret',
                environment: 'sandbox',
            })

            expect(flutterwaveInstance).toBeInstanceOf(Flutterwave)
            expect(flutterwaveInstance.getEnvironment()).toBe('sandbox')
            expect(Builder.baseUrl()).toContain('developersandbox-api.flutterwave.com')
        })

        it('should initialize Flutterwave instance with individual parameters', () => {
            process.env.ENVIRONMENT = ''
            const flutterwaveInstance = new Flutterwave(
                'test_client_id',
                'test_client_secret',
                'test_encryption_key',
                'live'
            )

            expect(flutterwaveInstance).toBeInstanceOf(Flutterwave)
            expect(flutterwaveInstance.getEnvironment()).toBe('live')
            expect(Builder.baseUrl()).toContain('api.flutterwave.com')
        })
    })
})