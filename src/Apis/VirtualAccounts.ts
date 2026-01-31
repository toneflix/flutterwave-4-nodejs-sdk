import { IVirtualAccount, IVirtualAccountCreateForm, IVirtualAccountUpdateForm, PageInfoMeta, VirtualAccountsListQueryParams } from '../Contracts'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class VirtualAccounts {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List virtual accounts
     * 
     * @method GET
     */
    async list (
        query: VirtualAccountsListQueryParams = {},
        traceId?: string
    ): Promise<{ data: IVirtualAccount[], meta: PageInfoMeta }> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<IVirtualAccount[], PageInfoMeta>(
            this.#flutterwave.builder.buildTargetUrl('/virtual-accounts', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }
    }

    /**
     * Create a virtual account
     * 
     * @param formData 
     * @method POST
     */
    async create (
        formData: IVirtualAccountCreateForm,
        traceId?: string,
        indempotencyKey?: string
    ): Promise<IVirtualAccount> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IVirtualAccount>(
            this.#flutterwave.builder.buildTargetUrl('/virtual-accounts'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey }
        )

        return data
    }

    /**
     * Retrieve a virtual account
     * 
     * @param id 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string
    ): Promise<IVirtualAccount> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IVirtualAccount>(
            this.#flutterwave.builder.buildTargetUrl('/virtual-accounts/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Update a virtual account
     * 
     * @param id 
     * @method PUT
     */
    async update (
        id: string,
        formData: IVirtualAccountUpdateForm,
        traceId?: string
    ): Promise<IVirtualAccount> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IVirtualAccount>(
            this.#flutterwave.builder.buildTargetUrl('/virtual-accounts/{id}', { id }),
            'PUT',
            formData,
            { 'X-Trace-Id': traceId }
        )

        return data
    }
}