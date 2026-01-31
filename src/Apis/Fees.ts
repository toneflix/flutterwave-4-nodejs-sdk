import { FeesRetrieveQueryParams, ITransactionFee } from '../Contracts/Api/FeesApi'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class Fees {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Retrieve transaction fees
     * 
     * @param query Query parameters for retrieving fees
     * @method GET
     */
    async retrieve (
        query: FeesRetrieveQueryParams,
        traceId?: string
    ): Promise<ITransactionFee> {

        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<ITransactionFee>(
            this.#flutterwave.builder.buildTargetUrl('fees', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }
}