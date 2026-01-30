import { Flutterwave } from '../Flutterwave'

export class Customers {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

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