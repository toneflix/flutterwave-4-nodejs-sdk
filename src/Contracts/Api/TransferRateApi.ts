import { Authorization, IPaymentMethodCreateFormData } from '../Payment'
import { IAddress, IPersonName, IPhoneNumber, XGenericObject } from '../Interfaces'

import { CurrencyCode } from '../Codes'

export interface IAmount {
    /**
     * This is the amount to be converted
     */
    amount: string
    /**
     * ISO 4217 currency code.
     */
    currency: CurrencyCode
}

export interface ITransferRate {
    id: string
    rate: string
    source: IAmount
    destination: IAmount
    created_datetime: string
}

export interface IRateConversionForm {
    source: Omit<IAmount, 'amount'>
    destination: IAmount
    /**
     * If no precision is set, 6 will be used
     */
    precision?: number
}