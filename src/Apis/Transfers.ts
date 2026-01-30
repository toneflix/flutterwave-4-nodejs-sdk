export class Transfers {
    /**
     * Create a transfer with ochestrator helper
     * 
     * @method POST
     */
    directTransfers () { }

    /**
     * List transfers
     * 
     * @method GET
     */
    list () { }

    /**
     * Create a transfer
     * 
     * @param query 
     * 
     * @method POST
     */
    create () { }

    /**
     * Retrieve a transfer
     * 
     * @param id 
     * @method GET
     */
    retrieve (id: string) { }

    /**
     * Update a transfer
     * 
     * @param id 
     * @method PUT
     */
    update (id: string) { }

    /**
     * Retry a transfer
     * 
     * @param id 
     * @method POST
     */
    retry (id: string) { }
}