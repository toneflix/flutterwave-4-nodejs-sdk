import { Flutterwave } from '../Flutterwave'

export class MobileNetworks {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List available mobile networks
     * 
     * @method GET
     */
    list () { }
}