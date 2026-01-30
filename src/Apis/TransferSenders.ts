import { Flutterwave } from '../Flutterwave'

export class TransferSenders {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List transfer senders
     * 
     * @method GET
     */
    list () { }

    /**
     * Create a transfer sender
     * 
     * @param query  
     * @method POST
     */
    create () { }

    /**
     * Retrieve a transfer sender
     * 
     * @param id  
     * @method GET
     */
    retrieve (id: string) { }

    /**
     * Delete a transfer sender
     * 
     * @param id 
     * @method DELETE
     */
    delete (id: string) { }
}