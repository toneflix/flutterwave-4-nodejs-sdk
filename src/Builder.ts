import './utilities/global'

import { CardDetails, EncryptedCardDetails } from './Contracts'

import { XGenericObject } from './Contracts/Interfaces'
import { buildUrl } from './utilities/helpers'
import crypto from 'crypto'

export class Builder {
    private static baseUrls = {
        live: 'https://api.flutterwave.com/v4/',
        sandbox: 'https://developersandbox-api.flutterwave.com/',
    }

    constructor() {
    }

    /**
     * Gets the base url based on environment
     * 
     * @returns 
     */
    static baseUrl () {
        const env = process.env.ENVIRONMENT || 'sandbox'

        if (env === 'live') {
            return this.baseUrls.live
        }

        return this.baseUrls.sandbox
    }

    /**
     * Builds a full url based on endpoint provided
     * 
     * @param endpoint 
     * @returns 
     */
    static buildUrl (...endpoint: string[]) {
        return buildUrl(this.baseUrl(), ...endpoint)
    }

    /**
     * Builds parameters for query or path
     * 
     * @param params 
     * @param type 
     * @returns 
     */
    static buildParams (params: XGenericObject, type: 'query' | 'path' = 'path') {
        let built = ''

        if (type === 'path') {
            built = Object.values(params).join('/')
        } else {
            const queryParams: string[] = []

            for (const [key, value] of Object.entries(params)) {
                queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            }

            built = queryParams.join('&')
        }

        return built
    }

    /**
     * Assigns parameters to url {placeholders} based on type
     * 
     * @param url 
     * @param params 
     * @param type 
     * 
     * @returns 
     */
    static assignParamsToUrl (url: string, params: XGenericObject, type: 'query' | 'path' = 'path') {
        let builtUrl = url

        if (type === 'path') {
            for (const [key, value] of Object.entries(params)) {
                builtUrl = builtUrl.replace(`{${key}}`, encodeURIComponent(String(value)))
                builtUrl = builtUrl.replace(`:${key}`, encodeURIComponent(String(value)))
            }
        } else {
            if (Object.keys(params).length === 0) {
                return builtUrl
            }

            const queryString = this.buildParams(params, 'query')
            const separator = builtUrl.includes('?') ? '&' : '?'
            builtUrl += `${separator}${queryString}`
        }

        return builtUrl
    }

    /**
     * Builds the target url by assigning both path and query parameters
     * 
     * @param path 
     * @param params 
     * @param queryParams 
     * @returns 
     */
    static buildTargetUrl (
        path: string,
        params: XGenericObject = {},
        queryParams: XGenericObject = {}
    ) {
        const url = this.buildUrl(path)

        let builtUrl = this.assignParamsToUrl(url, params, 'path')

        builtUrl = this.assignParamsToUrl(builtUrl, queryParams, 'query')

        return builtUrl
    }

    /**
     * Encrypts card details
     * 
     * @param card 
     * @returns 
     */
    static async encryptCardDetails (card: CardDetails): Promise<EncryptedCardDetails & CardDetails> {
        const nonce = crypto.randomBytes(12).toString('base64').slice(0, 12)

        return {
            nonce: nonce,
            encrypted_expiry_month: await this.encryptAES(card.expiry_month, process.env.ENCRYPTION_KEY!, nonce),
            encrypted_expiry_year: await this.encryptAES(card.expiry_year, process.env.ENCRYPTION_KEY!, nonce),
            encrypted_card_number: await this.encryptAES(card.card_number, process.env.ENCRYPTION_KEY!, nonce),
            encrypted_cvv: await this.encryptAES(card.cvv, process.env.ENCRYPTION_KEY!, nonce)
        } as never
    }

    /**
     * Encrypts data using AES-GCM encryption
     * @param data 
     * @param token 
     * @param nonce 
     * @returns 
     */
    static async encryptAES (data: string, token: string, nonce: string): Promise<string> {
        if (nonce.length !== 12) {
            throw new Error('Nonce must be exactly 12 characters long')
        }

        const cryptoSubtle = globalThis.crypto?.subtle || crypto.webcrypto?.subtle
        if (!cryptoSubtle) {
            throw new Error('Crypto API is not available in this environment.')
        }

        const decodedKeyBytes = Uint8Array.from(atob(token), c => c.charCodeAt(0))

        const key = await cryptoSubtle.importKey(
            'raw',
            decodedKeyBytes,
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        )
        const iv = new TextEncoder().encode(nonce)

        const encryptedData = await cryptoSubtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            new TextEncoder().encode(data)
        )

        return btoa(String.fromCharCode(...new Uint8Array(encryptedData)))
    }
}