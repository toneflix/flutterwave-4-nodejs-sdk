import { CountryCodeRestricted, IMobileNetwork } from '../Contracts'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class MobileNetworks {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List available mobile networks
     * 
     * @param query Query parameters for listing customers
     * @method GET
     */
    async list (
        query: { country: CountryCodeRestricted },
        traceId?: string
    ): Promise<IMobileNetwork[]> {

        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IMobileNetwork[]>(
            this.#flutterwave.builder.buildTargetUrl('/mobile-networks', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }
}