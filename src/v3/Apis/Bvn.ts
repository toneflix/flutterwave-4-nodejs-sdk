import { V3BvnVerificationData, V3BvnVerificationQueryParams } from '../../Contracts/v3/Api/BvnApi'

import { Builder } from '../../Builder'
import type { Flutterwave } from '../../Flutterwave'
import { Http } from '../../Http'

export class V3Bvn {
    #flutterwave: Flutterwave
    #builder: Builder

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
        this.#builder = new Builder(flutterwaveInstance.getEnvironment(), 'v3')
    }

    /**
     * Retrieve a BVN consent request verification by reference.
     *
     * @param reference Unique identifier for the BVN consent request.
     * @param query Query parameters for the BVN verification request.
     * @method GET
     */
    async verifications (
        reference: string,
        query: V3BvnVerificationQueryParams = {}
    ): Promise<V3BvnVerificationData> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<V3BvnVerificationData>(
            this.#builder.buildTargetUrl('/bvn/verifications/{reference}', { reference }, {
                include_complete_message: '1',
                ...query,
            }),
            'GET'
        )

        return data
    }
}
