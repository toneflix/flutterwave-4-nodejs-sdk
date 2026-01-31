import { IDirectChargeCreateForm, IDirectOrderCreateForm } from '../Contracts/Api/OrchestrationApi'

import { Builder } from '../Builder'
import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'
import { ICharge } from '../Contracts'
import { IOrder } from '../Contracts/Api/OrdersApi'

export class Orchestration {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Create a charge with Orchestator helper
     * 
     * @param formData 
     * @param traceId 
     * @param indempotencyKey 
     * @param scenarioKey 
     * @method POST
     * @returns 
     */
    async directCharges (
        formData: IDirectChargeCreateForm,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<ICharge> {
        await this.#flutterwave.ensureTokenIsValid()
        /**
         * Encrypt card details if type is card
         */
        if (formData.payment_method.type === 'card') {
            Object.assign(
                formData.payment_method.card,
                await Builder.encryptCardDetails(formData.payment_method.card)
            )
        }

        const { data } = await Http.send<ICharge>(
            this.#flutterwave.builder.buildTargetUrl('/orchestration/direct-charges'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }

    /**
     * Create an order with orchestator helper
     * 
     * @param formData 
     * @param traceId 
     * @param indempotencyKey 
     * @param scenarioKey 
     * @method POST
     * @returns 
     */
    async directOrders (
        formData: IDirectOrderCreateForm,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<IOrder> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IOrder>(
            this.#flutterwave.builder.buildTargetUrl('/orchestration/direct-orders'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }
}