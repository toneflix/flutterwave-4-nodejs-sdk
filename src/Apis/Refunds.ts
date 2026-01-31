import { BasicListQueryParams, PageInfoMeta } from '../Contracts'
import { IRefund, IRefundCreateForm } from '../Contracts/Api/RefundsApi'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class Refunds {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List refunds
     * 
     * @method GET
     */
    async list (
        query: BasicListQueryParams = {},
        traceId?: string
    ): Promise<{ data: IRefund[], meta: PageInfoMeta }> {

        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<IRefund[], PageInfoMeta>(
            this.#flutterwave.builder.buildTargetUrl('/refunds', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }

    }

    /**
     * Create a refund
     * 
     * @param formData 
     * @param traceId 
     * @param indempotencyKey 
     * @method POST
     * @returns 
     */
    async create (
        formData: IRefundCreateForm,
        traceId?: string,
        indempotencyKey?: string
    ): Promise<IRefund> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IRefund>(
            this.#flutterwave.builder.buildTargetUrl('/refunds'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey }
        )

        return data
    }

    /**
     * Retrieve a refund
     * 
     * @param id 
     * 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string,
    ): Promise<IRefund> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IRefund>(
            this.#flutterwave.builder.buildTargetUrl('/refunds/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }
}