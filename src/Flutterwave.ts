import { AccessTokenException } from './Exceptions/AccessTokenException'
import { FlutterwaveAuthResponse } from './Contracts/FlutterwaveResponse'
import { Http } from './Http'

export class Flutterwave {
    /**
     * Client ID
     */
    private clientId: string

    /**
     * Client Secret
     */
    private clientSecret: string

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
     * Creates an instance of Flutterwave.
     * 
     * @param clientId 
     * @param clientSecret 
     * @param encryptionKey 
     */
    constructor(clientId?: string, clientSecret?: string, encryptionKey?: string) {
        this.clientId = clientId ?? process.env.CLIENT_ID ?? ''
        this.clientSecret = clientSecret ?? process.env.CLIENT_SECRET ?? ''
        this.encryptionKey = encryptionKey ?? process.env.ENCRYPTION_KEY

        if (!this.clientId || !this.clientSecret) {
            throw new Error('Client ID and Client Secret are required to initialize Flutterwave instance')
        }
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
    init (clientId?: string, clientSecret?: string, encryptionKey?: string) {
        return new Flutterwave(
            clientId,
            clientSecret,
            encryptionKey,
        )
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
     * Generates an access token
     * 
     * @returns 
     */
    async generateAccessToken () {
        const { data, error } = await Http.post<FlutterwaveAuthResponse>(
            'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token',
            {
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                scope: 'profile email',
            },
            {
                'Content-Type': 'application/x-www-form-urlencoded',
            })

        if (data && !error) {
            this.accessToken = data.access_token
            this.expiresIn = data.expires_in
            this.lastTokenRefreshTime = Date.now()

            return data.access_token
        }

        throw new AccessTokenException(error!.message || 'Failed to generate access token')
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