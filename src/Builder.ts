import { buildUrl } from './utilities/helpers'

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
    static buildParams (params: Record<string, string | number | boolean>, type: 'query' | 'path' = 'path') {
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
    static assignParamsToUrl (url: string, params: Record<string, string | number | boolean>, type: 'query' | 'path' = 'path') {
        let builtUrl = url

        if (type === 'path') {
            for (const [key, value] of Object.entries(params)) {
                builtUrl = builtUrl.replace(`{${key}}`, encodeURIComponent(String(value)))
            }
        } else {
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
        params: Record<string, string | number | boolean> = {},
        queryParams: Record<string, string | number | boolean> = {}
    ) {
        const url = this.buildUrl(path)

        let builtUrl = this.assignParamsToUrl(url, params, 'path')

        builtUrl = this.assignParamsToUrl(builtUrl, queryParams, 'query')

        return builtUrl
    }
}