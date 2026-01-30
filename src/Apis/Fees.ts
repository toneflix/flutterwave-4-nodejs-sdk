import { Flutterwave } from '../Flutterwave'

export class Fees {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Retrieve transaction fees
     * 
     * @method GET
     */
    retrieve () { }
}