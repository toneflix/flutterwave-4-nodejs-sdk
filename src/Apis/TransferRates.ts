import { IRateConversionForm, ITransferRate } from '../Contracts/Api/TransferRateApi'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class TransferRates {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Retrieve transfer rate for international transfers
     * 
     * @param formData 
     * @param traceId 
     * @param indempotencyKey 
     * @param scenarioKey 
     * @method POST
     * @returns 
     */
    async convert (
        formData: IRateConversionForm,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<ITransferRate> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransferRate>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/rates'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }

    /**
     * Retrieve a converted rate item using the returned unique identifier
     * 
     * @param id 
     * @method GET
     */
    async fetch (
        id: string,
        traceId?: string,
    ): Promise<ITransferRate> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransferRate>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/rates/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }
}