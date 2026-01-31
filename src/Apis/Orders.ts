import { IOrder, OrderCreateFormData, OrderUpdateFormData, OrdersListQueryParams } from '../Contracts/Api/OrdersApi'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'
import { PageInfoMeta } from '../Contracts'

export class Orders {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List orders
     * 
     * @method GET
     */
    async list (
        query: OrdersListQueryParams = {},
        traceId?: string
    ): Promise<{ data: IOrder[], meta: PageInfoMeta }> {

        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<IOrder[], PageInfoMeta>(
            this.#flutterwave.builder.buildTargetUrl('/orders', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }

    }

    /**
     * Create an order
     * 
     * @param formData 
     * @param traceId 
     * @param indempotencyKey 
     * @method POST
     * @returns 
     */
    async create (
        formData: OrderCreateFormData,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<IOrder> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IOrder>(
            this.#flutterwave.builder.buildTargetUrl('/orders'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }

    /**
     * Retrieve an order
     * 
     * @param id 
     * 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string,
    ): Promise<IOrder> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IOrder>(
            this.#flutterwave.builder.buildTargetUrl('/orders/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Update an order
     * 
     * @param id 
     * @param formData 
     * @param traceId 
     * @param indempotencyKey 
     * @method PUT
     * @returns 
     */
    async update (
        id: string,
        formData: OrderUpdateFormData,
        traceId?: string,
        scenarioKey?: string
    ): Promise<IOrder> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IOrder>(
            this.#flutterwave.builder.buildTargetUrl('/orders/{id}', { id }),
            'PUT',
            formData,
            { 'X-Trace-Id': traceId, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }
}