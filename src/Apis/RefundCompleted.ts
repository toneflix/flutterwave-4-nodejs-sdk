import { Flutterwave } from '../Flutterwave'

/**
 * Send refund completion webhook
 */
export class RefundCompleted {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Send refund completion webhook
     * 
     * @method POST
     */
    create () { }
}