import { CountryCode, CurrencyCode } from '../Codes'
import { FeeDetails, PaymentMethodType } from '../Payment'

export interface FeesRetrieveQueryParams {
    amount: number
    currency: CurrencyCode
    payment_method: PaymentMethodType
    card6?: string
    country?: CountryCode
    network?: string
}

export interface ITransactionFee {
    charge_amount: number
    fee: FeeDetails[]
}