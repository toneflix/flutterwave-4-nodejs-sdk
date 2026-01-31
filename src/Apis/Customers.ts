import { BaseListQueryParams, PageInfoMeta } from '../Contracts'
import { ICustomer, ICustomerCreateFormData, ICustomerUpdateFormData } from '../Contracts/Api/CustomerApi'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class Customers {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List customers
     * 
     * @method GET
     */
    async list (
        query: BaseListQueryParams = {},
        traceId?: string
    ): Promise<{ data: ICustomer[], meta: PageInfoMeta }> {

        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<ICustomer[], PageInfoMeta>(
            this.#flutterwave.builder.buildTargetUrl('/customers', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }

    }

    /**
     * Create a customer
     * 
     * @param formData 
     * @param traceId 
     * @param indempotencyKey 
     * @method POST
     * @returns 
     */
    async create (
        formData: ICustomerCreateFormData,
        traceId?: string,
        indempotencyKey?: string,
    ): Promise<ICustomer> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ICustomer>(
            this.#flutterwave.builder.buildTargetUrl('/customers'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey }
        )

        return data
    }

    /**
     * Retrieve a customer
     * 
     * @param id 
     * @param traceId
     * 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string,
    ): Promise<ICustomer> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ICustomer>(
            this.#flutterwave.builder.buildTargetUrl('/customers/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Update a customer
     * 
     * @param id 
     * @param formData 
     * @param traceId  
     * @method PUT
     * @returns 
     */
    async update (
        id: string,
        formData: ICustomerUpdateFormData,
        traceId?: string,
    ): Promise<ICustomer> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ICustomer>(
            this.#flutterwave.builder.buildTargetUrl('/customers/{id}', { id }),
            'PUT',
            formData,
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Search for a customer
     * 
     * @param query  
     * @param traceId
     * @method POST
     */
    async search (
        formData: { email: string },
        query: BaseListQueryParams = {},
        traceId?: string
    ): Promise<{ data: ICustomer[], meta: PageInfoMeta }> {

        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<ICustomer[], PageInfoMeta>(
            this.#flutterwave.builder.buildTargetUrl('/customers', {}, query),
            'POST',
            formData,
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }

    }
}