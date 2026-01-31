import { BasicListQueryParams, ISettlement, PageInfoMeta } from '../Contracts'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class Settlements {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List settlements
     * 
     * @method GET
     */
    async list (
        query: BasicListQueryParams = {},
        traceId?: string
    ): Promise<{ data: ISettlement[], meta: PageInfoMeta }> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<ISettlement[], PageInfoMeta>(
            this.#flutterwave.builder.buildTargetUrl('/settlements', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }
    }

    /**
     * Retrieve a settlement
     * 
     * @param id 
     * @method GET
     */
    async retrieve (
        id: string,
        traceId?: string
    ): Promise<ISettlement> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ISettlement>(
            this.#flutterwave.builder.buildTargetUrl('/settlements/{id}', { id }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }
}