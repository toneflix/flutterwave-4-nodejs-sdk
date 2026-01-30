import { Flutterwave } from '../Flutterwave'

export class Settlements {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List settlements
     * 
     * @method GET
     */
    list () { }

    /**
     * Retrieve a settlement
     * 
     * @param id 
     * @method GET
     */
    retrieve (id: string) { }
}