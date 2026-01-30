import './utilities/global'

import axios, { RawAxiosRequestHeaders } from 'axios'

import { Builder } from './Builder'
import { UnifiedFlutterwaveResponse } from './Contracts/FlutterwaveResponse'
import { XGenericObject } from './Contracts/Interfaces'

export class Http {
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



    setDefaultHeaders (defaults: Record<string, string>) {
        this.headers = { ...defaults, ...this.headers }
    }

    getHeaders () {
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
    static async get<R = any> (
        url: string,
        params?: XGenericObject,
        headers: RawAxiosRequestHeaders = {},
    ): Promise<UnifiedFlutterwaveResponse<R>> {

        try {
            const { data } = await new Http(headers)
                .axiosApi()
                .get<R>(url, { params })

            return {
                success: true,
                message: 'Request successful',
                data,
            }
        } catch (error: any) {
            return {
                success: false,
                message: 'Request failed',
                error: {
                    type: ((typeof error.error === 'string' ? error.error : error.error?.type) ?? 'UNKNOWN_ERROR').toUpperCase(),
                    code: error.error?.code ?? '000000',
                    message: error.error?.message ?? error.error_description ?? error.message,
                    validation_errors: error.error?.validation_errors ?? []
                },
            }
        }
    }

    /**
     * Makes a POST request
     * 
     * @param args 
     * @returns 
     */
    static GET<R = any> (...args: Parameters<typeof Http.get>) {
        return Http.get<R>(...args)
    }

    /**
     * Makes a GET request
     * 
     * @param url 
     * @param headers 
     * @param params 
     * @returns 
     */
    static async post<R = any> (
        url: string,
        body?: any,
        headers: RawAxiosRequestHeaders = {},
        params?: XGenericObject,
    ): Promise<UnifiedFlutterwaveResponse<R>> {
        try {
            const { data } = await new Http(headers)
                .axiosApi()
                .post<R>(url, body, { params })

            return {
                success: true,
                message: 'Request successful',
                data,
            }
        } catch (e: any) {
            const error = (e.response?.data ?? {}) as Record<string, any>

            return {
                success: false,
                message: 'Request failed',
                error: {
                    type: ((typeof error.error === 'string' ? error.error : error.error?.type) ?? 'UNKNOWN_ERROR').toUpperCase(),
                    code: error.error?.code ?? '000000',
                    message: error.error?.message ?? error.error_description ?? error.message,
                    validation_errors: error.error?.validation_errors ?? []
                },
            }
        }
    }

    /**
     * Makes a POST request
     * 
     * @returns 
     */
    static POST<R = any> (...args: Parameters<typeof Http.post>) {
        return Http.post<R>(...args)
    }
}