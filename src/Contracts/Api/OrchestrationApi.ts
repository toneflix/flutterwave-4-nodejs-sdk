import { Authorization, IPaymentMethodCreateFormData } from '../Payment'
import { IAddress, IPersonName, IPhoneNumber, XGenericObject } from '../Interfaces'

import { CurrencyCode } from '../Codes'

export interface IDirectChargeCreateForm {
    amount: number
    currency: CurrencyCode
    reference: string
    customer: {
        email: string
        name?: IPersonName
        address?: Omit<IAddress, 'line2'> & { line2?: string }
        meta?: XGenericObject
        phone?: IPhoneNumber
    }
    meta?: XGenericObject
    payment_method: IPaymentMethodCreateFormData
    redirect_url?: string
    authorization?: Authorization
    merchant_vat_amount?: number
}

export type IDirectOrderCreateForm = IDirectChargeCreateForm