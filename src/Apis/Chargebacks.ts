import { Flutterwave } from '../Flutterwave'

export class Chargebacks {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List charge backs
     * 
     * @method GET
     */
    list () { }

    /**
     * Create a charge back
     * 
     * @param query 
     * 
     * @method POST
     */
    create () { }

    /**
     * Retrieve a charge back
     * 
     * @param id 
     * 
     * @method GET
     */
    retrieve (id: string) { }

    /**
     * Update a charge back
     * 
     * @param id 
     * 
     * @method PUT
     */
    update (id: string) { }
}