import type { Flutterwave } from '../../Flutterwave'
import { V3Bvn } from './Bvn'

export class V3Api {
    /**
     * BVN API instance
     */
    bvn: V3Bvn

    constructor(flutterwave: Flutterwave) {
        this.bvn = new V3Bvn(flutterwave)
    }
}
