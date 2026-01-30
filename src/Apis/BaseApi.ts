import { Banks } from './Banks'
import { Chargebacks } from './Chargebacks'
import { Charges } from './Charges'
import { Customers } from './Customers'
import { Fees } from './Fees'
import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'
import { MobileNetworks } from './MobileNetworks'
import { Orchestration } from './Orchestration'
import { Orders } from './Orders'
import { PaymentMethods } from './PaymentMethods'
import { RateConversion } from './RateConversion'
import { RefundCompleted } from './RefundCompleted'
import { Refunds } from './Refunds'
import { Settlements } from './Settlements'
import { TransferRecipients } from './TransferRecipients'
import { TransferSenders } from './TransferSenders'
import { Transfers } from './Transfers'
import { VirtualAccounts } from './VirtualAccounts'
import { Wallets } from './Wallets'

export class BaseApi {
    /**
     * Flutterwave instance
     */
    #flutterwave: Flutterwave

    /**
     * Banks API instance
     */
    banks!: Banks

    /**
     * Chargebacks API instance
     */
    chargebacks!: Chargebacks

    /**
     * Charges API instance
     */
    charges!: Charges

    /**
     * Customers API instance
     */
    customers!: Customers

    /**
     * Fees API instance
     */
    fees!: Fees

    /**
     * Mobile Networks API instance
     */
    mobileNetworks!: MobileNetworks

    /**
     * Orchestration API instance
     */
    orchestration!: Orchestration

    /**
     * Orders API instance
     */
    orders!: Orders

    /**
     * Payment Methods API instance
     */
    paymentMethods!: PaymentMethods

    /**
     * Rate Conversion API instance
     */
    rateConversion!: RateConversion

    /**
     * Refund Completed API instance
     */
    refundCompleted!: RefundCompleted

    /**
     * Refunds API instance
     */
    refunds!: Refunds

    /**
     * Settlements API instance
     */
    settlements!: Settlements

    /**
     * Transfer Recipients API instance
     */
    transferRecipients!: TransferRecipients

    /**
     * Transfer Senders API instance
     */
    transfers!: Transfers

    /**
     * Transfer Senders API instance
     */
    transferSenders!: TransferSenders

    /**
     * Virtual Accounts API instance
     */
    virtualAccounts!: VirtualAccounts

    /**
     * Wallets API instance
     */
    wallets!: Wallets


    /**
     * Create a BaseApi instance
     * 
     * @param #flutterwave 
     */
    constructor(flutterwave?: Flutterwave) {
        this.#flutterwave = flutterwave ?? new Flutterwave()
    }

    /**
     * Initialize BaseApi and its sub-APIs
     * 
     * @param #flutterwave 
     * @returns 
     */
    static initialize (flutterwave: Flutterwave) {

        Http.setDebugLevel(flutterwave.debugLevel)

        const baseApi = new BaseApi(flutterwave)

        baseApi.banks = new Banks(baseApi.#flutterwave)
        baseApi.charges = new Charges(baseApi.#flutterwave)
        baseApi.chargebacks = new Chargebacks(baseApi.#flutterwave)
        baseApi.customers = new Customers(baseApi.#flutterwave)
        baseApi.fees = new Fees(baseApi.#flutterwave)
        baseApi.mobileNetworks = new MobileNetworks(baseApi.#flutterwave)
        baseApi.orchestration = new Orchestration(baseApi.#flutterwave)
        baseApi.orders = new Orders(baseApi.#flutterwave)
        baseApi.paymentMethods = new PaymentMethods(baseApi.#flutterwave)
        baseApi.rateConversion = new RateConversion(baseApi.#flutterwave)
        baseApi.refundCompleted = new RefundCompleted(baseApi.#flutterwave)
        baseApi.refunds = new Refunds(baseApi.#flutterwave)
        baseApi.settlements = new Settlements(baseApi.#flutterwave)
        baseApi.transferRecipients = new TransferRecipients(baseApi.#flutterwave)
        baseApi.transfers = new Transfers(baseApi.#flutterwave)
        baseApi.transferSenders = new TransferSenders(baseApi.#flutterwave)
        baseApi.virtualAccounts = new VirtualAccounts(baseApi.#flutterwave)
        baseApi.wallets = new Wallets(baseApi.#flutterwave)

        return baseApi
    }
}