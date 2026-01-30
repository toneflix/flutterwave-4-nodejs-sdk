export class Customers {
    /**
     * List customers
     * 
     * @method GET
     */
    list () { }

    /**
     * Search for a customer
     * 
     * @param query  
     * @method POST
     */
    search (query: string) { }

    /**
     * Create a customer
     *  
     * @method POST
     */
    create () { }

    /**
     * Retrieve a customer
     * 
     * @param id  
     * @method GET
     */
    retrieve (id: string) { }

    /**
     * Update a customer
     * 
     * @param id  
     * @method PUT
     */
    update (id: string) { }
}