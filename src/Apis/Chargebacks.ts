import { ChargebackCreateFormData, ChargebackUpdateFormData, ChargebacksApiResponse, ChargebacksListQueryParams } from '../Contracts/Api/ChargebacksApi'

import { ChargebacksMeta } from '../Contracts/Api/ChargesApi'
import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class Chargebacks {

    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List charge backs
     * 
     * @method GET
     */
    async list (
        query: ChargebacksListQueryParams,
        traceId?: string
    ): Promise<{ data: ChargebacksApiResponse[], meta: ChargebacksMeta }> {

        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<ChargebacksApiResponse[], ChargebacksMeta>(
            this.#flutterwave.builder.buildTargetUrl('/chargebacks', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }

    }

    /**
     * Create a charge back
     * 
     * @param formData 
     * @param traceId 
     * @param idempotencyKey 
     * @method POST
     * @returns 
     */
    async create (
        formData: ChargebackCreateFormData,
        traceId?: string,
        idempotencyKey?: string
    ): Promise<ChargebacksApiResponse> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ChargebacksApiResponse>(
            this.#flutterwave.builder.buildTargetUrl('/chargebacks'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': idempotencyKey }
        )

        return data
    }

    /**
     * Retrieve a charge back
     * 
     * @param id 
     * 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string,
    ): Promise<ChargebacksApiResponse> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ChargebacksApiResponse>(
            this.#flutterwave.builder.buildTargetUrl('/chargebacks/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Update a charge back
     * 
     * @param id 
     * @param formData 
     * @param traceId 
     * @param idempotencyKey 
     * @method PUT
     * @returns 
     */
    async update (
        id: string,
        formData: ChargebackUpdateFormData,
        traceId?: string,
        idempotencyKey?: string
    ): Promise<ChargebacksApiResponse> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ChargebacksApiResponse>(
            this.#flutterwave.builder.buildTargetUrl('/chargebacks/{id}', { id }),
            'PUT',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': idempotencyKey }
        )

        return data
    }
}