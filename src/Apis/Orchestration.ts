import { Flutterwave } from '../Flutterwave'

export class Orchestration {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Create a charge with Orchestator helper
     * 
     * @method POST
     */
    directCharges () { }

    /**
     * Create an order with orchestator helper
     * 
     * @method POST
     */
    directOrders () { }
}