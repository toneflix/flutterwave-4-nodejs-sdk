import { CursorPagination, IDirectTransferForm, ITransfer, ITransferCreateForm, ITransferRetryForm, ITransferUpdateForm, TransfersListQueryParams } from '../Contracts'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class Transfers {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Create a transfer with orchestrator helper
     * 
     * @method POST
     */
    async directTransfer (
        formData: IDirectTransferForm,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<ITransfer> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransfer>(
            this.#flutterwave.builder.buildTargetUrl('/direct-transfers'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }

    /**
     * List transfers
     * 
     * @method GET
     */
    async list (
        query: TransfersListQueryParams = {},
        traceId?: string
    ): Promise<{ data: ITransfer[], cursor: CursorPagination }> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<{ transfers: ITransfer[], cursor: CursorPagination }>(
            this.#flutterwave.builder.buildTargetUrl('/transfers', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data: data.transfers, cursor: data.cursor }
    }

    /**
     * Create a transfer
     * 
     * @param formData 
     * 
     * @method POST
     */
    async create (
        formData: ITransferCreateForm,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<ITransfer> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransfer>(
            this.#flutterwave.builder.buildTargetUrl('/transfers'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }

    /**
     * Retrieve a transfer
     * 
     * @param id 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string
    ): Promise<ITransfer> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransfer>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Update a transfer
     * 
     * @param id 
     * @method PUT
     */
    async update (
        id: string,
        formData: ITransferUpdateForm,
        traceId?: string
    ): Promise<ITransfer> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransfer>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/{id}', { id }),
            'PUT',
            formData,
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Retry a transfer
     * 
     * @param id 
     * @method POST
     */
    async retry (
        id: string,
        formData: ITransferRetryForm,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<ITransfer> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransfer>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/{id}/retries', { id }),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }
}