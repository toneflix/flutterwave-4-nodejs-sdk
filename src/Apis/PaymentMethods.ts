import { Flutterwave } from '../Flutterwave'

export class PaymentMethods {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List payment methods
     * 
     * @method GET
     */
    list () { }

    /**
     * Create a payment method
     * 
     * @param query  
     * @method POST
     */
    create () { }

    /**
     * Retrieve a payment method
     * 
     * @param id  
     * @method GET
     */
    retrieve (id: string) { }
}