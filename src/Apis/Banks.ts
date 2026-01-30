import { BankApiResponse, BankBranchApiResponse, GbpAccountBodyParams, NgnAccountBodyParams, UsdAccountBodyParams } from '../Contracts/Api/BankApi'

import { CountryCode } from '../Contracts/Codes'
import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class Banks {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Retrieve supported banks by country.
     * 
     * @param country 
     * @param traceId 
     * @method GET
     * @returns 
     */
    async list (country: CountryCode, traceId?: string): Promise<BankApiResponse[]> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<BankApiResponse[]>(
            this.#flutterwave.builder.buildTargetUrl('/banks', {}, { country }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Retrieve branches by bank id
     * 
     * @param id 
     * @param traceId 
     * @method GET
     * @returns 
     */
    async branches (id: string, traceId?: string): Promise<BankBranchApiResponse[]> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<BankBranchApiResponse[]>(
            this.#flutterwave.builder.buildTargetUrl('/banks/{id}/branches', { id }, {}),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Resolve your customer's bank account information
     * 
     * @method POST
     */
    async resolve (params: GbpAccountBodyParams, traceId?: string): Promise<any>
    async resolve (params: NgnAccountBodyParams, traceId?: string): Promise<any>
    async resolve (params: UsdAccountBodyParams, traceId?: string): Promise<any>
    async resolve (params: any, traceId?: string, scenarioKey?: string): Promise<any> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<BankApiResponse[]>(
            this.#flutterwave.builder.buildTargetUrl('/banks/account-resolve'),
            'POST',
            params,
            { 'X-Trace-Id': traceId, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }
}