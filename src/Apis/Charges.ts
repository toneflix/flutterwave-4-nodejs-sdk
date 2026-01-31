import { ChargeCreateFormData, ChargeUpdateFormData, ChargesListQueryParams, ICharge } from '../Contracts/Api/ChargesApi'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'
import { PageInfoMeta } from '../Contracts/FlutterwaveResponse'

export class Charges {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List charges
     * 
     * @method GET
     */
    async list (
        query: ChargesListQueryParams,
        traceId?: string
    ): Promise<{ data: ICharge[], meta: PageInfoMeta }> {

        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<ICharge[], PageInfoMeta>(
            this.#flutterwave.builder.buildTargetUrl('/charges', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }

    }

    /**
     * Create a charge
     * 
     * @param formData 
     * @param traceId 
     * @param idempotencyKey 
     * @method POST
     * @returns 
     */
    async create (
        formData: ChargeCreateFormData,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<ICharge> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ICharge>(
            this.#flutterwave.builder.buildTargetUrl('/charges'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }

    /**
     * Retrieve a charge
     * 
     * @param id 
     * 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string,
    ): Promise<ICharge> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ICharge>(
            this.#flutterwave.builder.buildTargetUrl('/charges/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Update a charge
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
        formData: ChargeUpdateFormData,
        traceId?: string,
        scenarioKey?: string
    ): Promise<ICharge> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ICharge>(
            this.#flutterwave.builder.buildTargetUrl('/charges/{id}', { id }),
            'PUT',
            formData,
            { 'X-Trace-Id': traceId, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }
}