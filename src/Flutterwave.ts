import { AccessTokenException } from './Exceptions/AccessTokenException'
import { FlutterwaveAuthResponse } from './Contracts/FlutterwaveResponse'
import { Http } from './Http'

export class Flutterwave {
    private clientId: string
    private clientSecret: string
    private encryptionKey?: string
    private accessToken?: string

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

            return data.access_token
        }

        throw new AccessTokenException(error!.message || 'Failed to generate access token')
    }
}