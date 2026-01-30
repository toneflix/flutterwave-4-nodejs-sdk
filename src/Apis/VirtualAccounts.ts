import { Flutterwave } from '../Flutterwave'

export class VirtualAccounts {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List virtual accounts
     * 
     * @method GET
     */
    list () { }

    /**
     * Create a virtual account
     * 
     * @param query 
     * @method POST
     */
    create () { }

    /**
     * Retrieve a virtual account
     * 
     * @param id 
     * @method GET
     */
    retrieve (id: string) { }

    /**
     * Update a virtual account
     * 
     * @param id 
     * @method PUT
     */
    update (id: string) { }
}