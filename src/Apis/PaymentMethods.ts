import { BaseListQueryParams, IPaymentMethod, IPaymentMethodCreateFormData, PageInfoMeta } from '../Contracts'

import { Builder } from '../Builder'
import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class PaymentMethods {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List payment methods
     * 
     * @method GET
     */
    async list (
        query: BaseListQueryParams,
        traceId?: string
    ): Promise<{ data: IPaymentMethod[], meta: PageInfoMeta }> {

        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<IPaymentMethod[], PageInfoMeta>(
            this.#flutterwave.builder.buildTargetUrl('/payment-methods', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }

    }

    /**
     * Create a payment method
     * 
     * @param formData 
     * @param traceId 
     * @param idempotencyKey 
     * @method POST
     * @returns 
     */
    async create (
        formData: IPaymentMethodCreateFormData,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<IPaymentMethod> {
        await this.#flutterwave.ensureTokenIsValid()

        /**
         * Encrypt card details if type is card
         */
        if (formData.type === 'card') {
            formData.card = await Builder.encryptCardDetails(formData.card)
        }

        const { data } = await Http.send<IPaymentMethod>(
            this.#flutterwave.builder.buildTargetUrl('/payment-methods'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }

    /**
     * Retrieve a payment method
     * 
     * @param id 
     * 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string,
    ): Promise<IPaymentMethod> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IPaymentMethod>(
            this.#flutterwave.builder.buildTargetUrl('/payment-methods/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }
}