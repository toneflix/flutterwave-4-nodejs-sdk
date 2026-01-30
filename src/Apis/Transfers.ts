import { Flutterwave } from '../Flutterwave'

export class Transfers {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

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