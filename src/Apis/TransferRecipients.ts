import { BasicListQueryParams, CursorPagination, ITransferRecipient, ITransferRecipientCreateForm } from '../Contracts'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class TransferRecipients {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List transfer recipients
     * 
     * @method GET
     */
    async list (
        query: BasicListQueryParams = {},
        traceId?: string
    ): Promise<{ data: ITransferRecipient[], cursor: CursorPagination }> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<{ recipients: ITransferRecipient[], cursor: CursorPagination }>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/recipients', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data: data.recipients, cursor: data.cursor }
    }

    /**
     * Create a transfer recipient
     * 
     * @param formData 
     * @method POST
     */
    async create (
        formData: ITransferRecipientCreateForm,
        traceId?: string,
        indempotencyKey?: string
    ): Promise<ITransferRecipient> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransferRecipient>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/recipients'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey }
        )

        return data
    }

    /**
     * Retrieve a transfer recipient
     * 
     * @param id 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string
    ): Promise<ITransferRecipient> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransferRecipient>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/recipients/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Delete a transfer recipient
     * 
     * @param id 
     * @method DELETE
     */
    async delete (
        id: string,
        traceId?: string
    ): Promise<void> {
        await this.#flutterwave.ensureTokenIsValid()

        await Http.send<void>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/recipients/{id}', { id }),
            'DELETE',
            {},
            { 'X-Trace-Id': traceId }
        )
    }
}