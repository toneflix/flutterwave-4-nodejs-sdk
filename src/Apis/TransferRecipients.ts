import { Flutterwave } from '../Flutterwave'

export class TransferRecipients {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List transfer recipients
     * 
     * @method GET
     */
    list () { }

    /**
     * Create a transfer recipient
     * 
     * @param query 
     * @method POST
     */
    create () { }

    /**
     * Retrieve a transfer recipient
     * 
     * @param id 
     * @method GET
     */
    retrieve (id: string) { }

    /**
     * Delete a transfer recipient
     * 
     * @param id 
     * @method DELETE
     */
    delete (id: string) { }
}