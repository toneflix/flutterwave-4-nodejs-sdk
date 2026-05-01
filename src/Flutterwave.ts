import './utilities/global'

import { FlutterwaveApiVersion, FlutterwaveAuthResponse, FlutterwaveEnvironment, InitOptions } from './Contracts/FlutterwaveCore'

import { ApiVersionConfig } from './Builder'
import { BaseApi } from './Apis/BaseApi'
import { Builder } from './Builder'
import { Http } from './Http'
import { V3Api } from './v3/Apis/V3Api'

export type FlutterwaveApiInitializer<TApi extends BaseApi = BaseApi> = (flutterwave: Flutterwave) => TApi

export class Flutterwave {
    private static apiInitializers: Record<string, FlutterwaveApiInitializer> = {}

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
    private environment: FlutterwaveEnvironment = 'live'

    /**
     * Flutterwave API version
     */
    private apiVersion: FlutterwaveApiVersion = 'v4'

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
     * Flutterwave v3 API instance
     */
    v3: V3Api

    /**
     * Builder Instance
     */
    builder: Builder

    /**
     * Creates an instance of Flutterwave.
     * 
     * @param clientId 
     * @param clientSecret 
     * @param encryptionKey 
     */
    constructor(clientId?: InitOptions)
    constructor(
        clientId?: string,
        clientSecret?: string,
        encryptionKey?: string,
        env?: FlutterwaveEnvironment,
        apiVersion?: FlutterwaveApiVersion
    )
    constructor(
        clientId?: string | InitOptions,
        clientSecret?: string,
        encryptionKey?: string,
        env?: FlutterwaveEnvironment,
        apiVersion?: FlutterwaveApiVersion
    ) {
        if (typeof clientId === 'object') {
            this.clientId = clientId.clientId
            this.clientSecret = clientId.clientSecret
            this.encryptionKey = clientId.encryptionKey ?? process.env.ENCRYPTION_KEY
            this.environment = clientId.environment ?? 'live'
            this.apiVersion = clientId.apiVersion ?? 'v4'
        } else {
            this.clientId = clientId ?? process.env.CLIENT_ID ?? ''
            this.clientSecret = clientSecret ?? process.env.CLIENT_SECRET ?? ''
            this.encryptionKey = encryptionKey ?? process.env.ENCRYPTION_KEY
            this.environment = env ?? (process.env.ENVIRONMENT ?? 'live') as FlutterwaveEnvironment
            this.apiVersion = apiVersion ?? 'v4'
        }

        if (!this.clientId || !this.clientSecret) {
            throw new Error('Client ID and Client Secret are required to initialize Flutterwave instance')
        }

        Builder.setEnvironment(this.environment)
        Builder.setApiVersion(this.apiVersion)
        this.builder = new Builder(this.environment, this.apiVersion)
        this.v3 = new V3Api(this)
        this.api = Flutterwave.initializeApi(this)
    }

    /**
     * Register an API version/family and the API root that should initialize it.
     *
     * @param version
     * @param initializer
     * @param config
     */
    static registerApiVersion (
        version: FlutterwaveApiVersion,
        initializer: FlutterwaveApiInitializer,
        config: ApiVersionConfig
    ) {
        Builder.registerApiVersion(version, config)
        this.apiInitializers[version] = initializer
    }

    private static initializeApi (flutterwave: Flutterwave) {
        if (flutterwave.getApiVersion() === 'v4') {
            return BaseApi.initialize(flutterwave)
        }

        const initializer = this.apiInitializers[flutterwave.getApiVersion()]

        if (!initializer) {
            throw new Error(`API version "${flutterwave.getApiVersion()}" has not been registered`)
        }

        return initializer(flutterwave)
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
    init (
        clientId?: string,
        clientSecret?: string,
        encryptionKey?: string,
        env?: FlutterwaveEnvironment,
        apiVersion?: FlutterwaveApiVersion
    ): Flutterwave
    init (
        clientId?: any,
        clientSecret?: string,
        encryptionKey?: string,
        env?: FlutterwaveEnvironment,
        apiVersion?: FlutterwaveApiVersion
    ): Flutterwave {
        return new Flutterwave(
            clientId,
            clientSecret,
            encryptionKey,
            env,
            apiVersion
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
     * Get the current API version
     *
     * @returns
     */
    getApiVersion () {
        return this.apiVersion
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
