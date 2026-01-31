import './utilities/global'

import axios, { RawAxiosRequestHeaders } from 'axios'

import { BaseApi } from './Apis/BaseApi'
import { Builder } from './Builder'
import { HttpException } from './Exceptions/HttpException'
import { UnifiedFlutterwaveResponse } from './Contracts/FlutterwaveResponse'
import { XGenericObject } from './Contracts/Interfaces'

export class Http {
    /**
     * Bearer token
     */
    private static bearerToken: string

    /**
     * Debug level
     */
    private static debugLevel: number = 0

    private static apiInstance: BaseApi

    /**
     * Creates an instance of Http.
     * 
     * @param method 
     * @param url 
     * @param headers 
     * @param body 
     */
    constructor(
        private headers: RawAxiosRequestHeaders = {},
        private body?: any,
    ) { }

    /**
     * Set the debug level
     * 
     * @param debug 
     */
    static setDebugLevel (level: number = 0) {
        this.debugLevel = level ?? 0
    }

    /**
     * Set the API instance
     * 
     * @param api 
     */
    static setApiInstance (api: BaseApi) {
        this.apiInstance = api
    }

    /**
     * Set the bearer token
     * 
     * @param token 
     */
    static setBearerToken (token: string) {
        this.bearerToken = token
    }

    setDefaultHeaders (defaults: Record<string, string>) {
        this.headers = { ...defaults, ...this.headers }
        if (Http.bearerToken) {
            this.headers.Authorization = `Bearer ${Http.bearerToken}`
        }
    }

    getHeaders (): RawAxiosRequestHeaders {
        return this.headers
    }

    getBody () {
        return this.body
    }

    axiosApi () {
        this.setDefaultHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        })

        return axios.create({
            baseURL: Builder.baseUrl(),
            headers: this.getHeaders(),
        })
    }

    /**
     * Makes a GET request
     * 
     * @param url 
     * @param headers 
     * @param params 
     * @returns 
     */
    static async get<R = any, M extends XGenericObject = XGenericObject> (
        url: string,
        params?: XGenericObject,
        headers: RawAxiosRequestHeaders = {},
    ): Promise<UnifiedFlutterwaveResponse<R, M>> {
        return this.send<R, M>(url, 'GET', undefined, headers, params)
    }

    /**
     * 
     * 
     * @param url 
     * @param headers 
     * @param params 
     * @returns 
     */
    static async send<R = any, M extends XGenericObject = XGenericObject> (
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        body?: any,
        headers: RawAxiosRequestHeaders = {},
        params?: XGenericObject,
    ): Promise<UnifiedFlutterwaveResponse<R, M>> {
        try {
            const { data } = await new Http(headers).axiosApi()<UnifiedFlutterwaveResponse<R & M>>({
                url,
                method,
                data: body,
                params,
            })

            return {
                success: true,
                message: data.message || 'Request successful',
                data: data.data ?? data as R,
                meta: data.meta as M,
            }
        } catch (e: any) {
            const error = (e.response?.data ?? {})

            throw this.exception(e.response?.status ?? 500, error || e, e)
        }
    }

    /**
     * Create an HttpException from status and error
     * 
     * @param status 
     * @param error 
     * @returns 
     */
    private static exception (status: number, error: XGenericObject, originalError: Error): Error {
        const exception = HttpException.fromCode(status, {
            success: false,
            message: `Request failed: ${error.error?.message || 'An error occurred'}`,
            status: 'failed',
            data: undefined,
            meta: {},
            error: {
                type: ((typeof error.error === 'string' ? error.error : error.error?.type) ?? 'UNKNOWN_ERROR').toUpperCase(),
                code: error.error?.code ?? '000000',
                message: error.error?.message ?? error.error_description ?? error.message,
                validation_errors: error.error?.validation_errors ?? []
            },
        }, originalError)

        if (this.apiInstance) {
            this.apiInstance.setLastException(exception)
        }

        return exception
    }
}