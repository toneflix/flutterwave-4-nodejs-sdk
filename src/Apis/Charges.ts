import { Flutterwave } from '../Flutterwave'

export class Charges {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List charges
     * 
     * @method GET
     */
    list () { }

    /**
     * Create a charge
     * 
     * @param query  
     * @method POST
     */
    create () { }

    /**
     * Retrieve a charge
     * 
     * @param id 
     * @method GET
     */
    retrieve (id: string) { }

    /**
     * Update a charge
     * 
     * @param id 
     * @method PUT
     */
    update (id: string) { }
}