import './utilities/global'

import { FlutterwaveAuthResponse, InitOptions } from './Contracts/FlutterwaveCore'

import { BaseApi } from './Apis/BaseApi'
import { Builder } from './Builder'
import { Http } from './Http'

export class Flutterwave {
    debugLevel = 0

    /**
     * Client ID
     */
    private clientId: string

    /**
     * Client Secret
     */
    private clientSecret: string

    /**
     * Flutterwave Environment
     */
    private environment: 'sandbox' | 'live' = 'live'

    /**
     * Encryption Key
     */
    private encryptionKey?: string

    /**
     * Access Token
     */
    private accessToken?: string

    /**
     * Token expiry time in seconds
     */
    private expiresIn = 0

    /**
     * Last token refresh time in milliseconds
     */
    private lastTokenRefreshTime = 0

    /**
     * API Instance
     */
    api: BaseApi

    /**
     * Builder Instance
     */
    builder = Builder

    /**
     * Creates an instance of Flutterwave.
     * 
     * @param clientId 
     * @param clientSecret 
     * @param encryptionKey 
     */
    constructor(clientId?: InitOptions)
    constructor(clientId?: string, clientSecret?: string, encryptionKey?: string, env?: 'sandbox' | 'live')
    constructor(clientId?: string | InitOptions, clientSecret?: string, encryptionKey?: string, env?: 'sandbox' | 'live') {
        if (typeof clientId === 'object') {
            this.clientId = clientId.clientId
            this.clientSecret = clientId.clientSecret
            this.encryptionKey = clientId.encryptionKey ?? process.env.ENCRYPTION_KEY
            this.environment = clientId.environment ?? 'live'
        } else {
            this.clientId = clientId ?? process.env.CLIENT_ID ?? ''
            this.clientSecret = clientSecret ?? process.env.CLIENT_SECRET ?? ''
            this.encryptionKey = encryptionKey ?? process.env.ENCRYPTION_KEY
            this.environment = env ?? (process.env.ENVIRONMENT ?? 'live') as 'sandbox' | 'live'
        }

        if (!this.clientId || !this.clientSecret) {
            throw new Error('Client ID and Client Secret are required to initialize Flutterwave instance')
        }

        this.builder.setEnvironment(this.environment)
        this.api = BaseApi.initialize(this)
    }

    /**
     * Initializes the Flutterwave instance
     * 
     * @param clientId 
     * @param clientSecret 
     * @param encryptionKey 
     * @param accessToken 
     * @returns 
     */
    init (clientId?: InitOptions): Flutterwave
    init (clientId?: string, clientSecret?: string, encryptionKey?: string, env?: 'sandbox' | 'live'): Flutterwave
    init (clientId?: any, clientSecret?: string, encryptionKey?: string, env?: 'sandbox' | 'live'): Flutterwave {
        return new Flutterwave(
            clientId,
            clientSecret,
            encryptionKey,
            env
        )
    }

    /**
     * Set the debug level
     * 
     * @param level 
     * @returns 
     */
    debug (level: number = 0): this {
        this.debugLevel = level

        Http.setDebugLevel(level)

        return this
    }

    /**
     * Get the current access token
     * 
     * @returns 
     */
    getAccessToken () {
        return this.accessToken
    }

    /**
     * Get the current environment
     * 
     * @returns 
     */
    getEnvironment () {
        return this.environment
    }

    /**
     * Generates an access token
     * 
     * @returns 
     */
    async generateAccessToken () {
        const { data } = await Http.send<FlutterwaveAuthResponse>(
            'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token',
            'POST',
            {
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                scope: 'profile email',
            },
            {
                'Content-Type': 'application/x-www-form-urlencoded',
            })

        this.accessToken = data.access_token
        this.expiresIn = data.expires_in
        this.lastTokenRefreshTime = Date.now()
        Http.setBearerToken(this.accessToken)

        return data.access_token
    }

    /**
     * Refreshes the access token
     */
    async refreshToken () {
        await this.generateAccessToken()
    }

    /**
     * Ensures the access token is valid, refreshes if expired or about to expire
     */
    async ensureTokenIsValid () {
        const currentTime = Date.now()
        const timeSinceLastRefresh = (currentTime - this.lastTokenRefreshTime) / 1000 // convert to seconds
        const timeLeft = this.expiresIn - timeSinceLastRefresh

        if (!this.accessToken || timeLeft < 60) {
            /**
             * Refresh the token if it's expired or about to expire in the next 60 seconds
             */
            await this.refreshToken()
        }
    }
}