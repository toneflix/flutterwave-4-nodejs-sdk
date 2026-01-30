import 'dotenv/config'

import { describe, expect, it } from 'vitest'

import { Flutterwave } from '../src/Flutterwave'

describe('Flutterwave Spec', () => {
    describe('Access Token', () => {
        it('should generate an access token', async () => {
            const instance = new Flutterwave()
            const token = await instance.generateAccessToken()

            expect(typeof token).toBe('string')
            expect(token.length).toBeGreaterThan(0)
            expect(instance.getAccessToken()).toBe(token)
        })

        it('should throw if the wrong credentials are provided', async () => {
            const instance = new Flutterwave('wrong_id', 'wrong_secret')

            await expect(instance.generateAccessToken()).rejects.toThrow('Invalid client or Invalid client credentials')
        })

        it('should throw error if clientId and clientSecret are not provided', () => {
            process.env.CLIENT_ID = ''
            process.env.CLIENT_SECRET = ''

            expect(() => {
                new Flutterwave()
            }).toThrow('Client ID and Client Secret are required to initialize Flutterwave instance')
        })
    })
})