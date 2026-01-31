import { ITransaction, IWalletAccountResolveForm, IWalletAccountResolveResponse, IWalletBalance, IWalletStatementQueryParams, PageInfoMeta } from '../Contracts'

import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'

export class Wallets {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Verify wallet account information for a customer
     * 
     * @method POST
     */
    async accountResolve (
        formData: IWalletAccountResolveForm,
        traceId?: string
    ): Promise<IWalletAccountResolveResponse> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IWalletAccountResolveResponse>(
            this.#flutterwave.builder.buildTargetUrl('/wallets/account-resolve'),
            'POST',
            formData,
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Retrieve wallet statement
     * 
     * @method GET
     */
    async statement (
        query: IWalletStatementQueryParams,
        traceId?: string
    ): Promise<{ data: ITransaction[], meta: PageInfoMeta }> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data, meta } = await Http.send<ITransaction[], PageInfoMeta>(
            this.#flutterwave.builder.buildTargetUrl('/wallets/statement', {}, query),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return { data, meta: meta! }
    }

    /**
     * Fetch a currency's balance.
     * 
     * @param currency 
     * 
     * @method GET
     */
    async balance (
        currency: string,
        traceId?: string
    ): Promise<IWalletBalance> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IWalletBalance>(
            this.#flutterwave.builder.buildTargetUrl('/wallets/balances/{currency}', { currency }),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }

    /**
     * Fetch wallet balance for multiple currencies.
     * 
     * @method GET
     */
    async balances (
        traceId?: string
    ): Promise<IWalletBalance[]> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<IWalletBalance[]>(
            this.#flutterwave.builder.buildTargetUrl('/wallets/balances'),
            'GET',
            {},
            { 'X-Trace-Id': traceId }
        )

        return data
    }
}