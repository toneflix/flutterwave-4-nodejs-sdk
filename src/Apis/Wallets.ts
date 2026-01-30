export class Wallets {
    /**
     * Verify wallet account information for a customer
     * 
     * @method POST
     */
    accountResolve () { }

    /**
     * Retrieve wallet statement
     * 
     * @method GET
     */
    statement () { }

    /**
     * Fetch a currency's balance.
     * 
     * @param currency 
     * 
     * @method GET
     */
    balance (currency: string) { }

    /**
     * Fetch wallet balance for multiple currencies.
     * 
     * @param currency 
     * 
     * @method GET
     */
    balances () { }
}