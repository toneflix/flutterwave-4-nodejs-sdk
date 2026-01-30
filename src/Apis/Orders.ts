import { Flutterwave } from '../Flutterwave'

export class Orders {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * List orders
     * 
     * @method GET
     */
    list () { }

    /**
     * Create an order
     * 
     * @param query  
     * @method POST
     */
    create () { }

    /**
     * Retrieve an order
     * 
     * @param id  
     * @method GET
     */
    retrieve (id: string) { }

    /**
     * Update an order
     * 
     * @param id 
     * @method PUT
     */
    update (id: string) { }
}