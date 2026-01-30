import { Flutterwave } from '../Flutterwave'

export class RateConversion {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Retrieve transfer rate for international transfers
     * @method POST
     */
    convert () { }

    /**
     * Retrieve a converted rate item using the returned unique identifier
     * 
     * @param id 
     * @method GET
     */
    fetch (id: string) { }
}