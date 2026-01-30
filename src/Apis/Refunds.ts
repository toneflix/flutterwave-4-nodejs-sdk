import { Flutterwave } from '../Flutterwave'

export class Refunds {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List refunds
     * 
     * @method GET
     */
    list () { }

    /**
     * Create a refund
     * 
     * @param query 
     * 
     * @method POST
     */
    create () { }

    /**
     * Retrieve a refund
     * 
     * @param id 
     * @method GET
     */
    retrieve (id: string) { }
}