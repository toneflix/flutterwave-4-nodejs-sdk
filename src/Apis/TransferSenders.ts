import { CursorPagination, ITransferSender, ITransferSenderCreateForm, TransferSendersListQueryParams } from '../Contracts'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class TransferSenders {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List transfer senders
     * 
     * @method GET
     */
    async list (
        query: TransferSendersListQueryParams = {},
        traceId?: string
    ): Promise<{ data: ITransferSender[], cursor: CursorPagination }> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<{ senders: ITransferSender[], cursor: CursorPagination }>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/senders', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data: data.senders, cursor: data.cursor }
    }

    /**
     * Create a transfer sender
     * 
     * @param formData  
     * @method POST
     */
    async create (
        formData: ITransferSenderCreateForm,
        traceId?: string,
        indempotencyKey?: string
    ): Promise<ITransferSender> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransferSender>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/senders'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey }
        )

        return data
    }

    /**
     * Retrieve a transfer sender
     * 
     * @param id  
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string
    ): Promise<ITransferSender> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransferSender>(
            this.#flutterwave.builder.buildTargetUrl('/transfers/senders/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Delete a transfer sender
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
            this.#flutterwave.builder.buildTargetUrl('/transfers/senders/{id}', { id }),
            'DELETE',
            {},
            { 'X-Trace-Id': traceId }
        )
    }
}