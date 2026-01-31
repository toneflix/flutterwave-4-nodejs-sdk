import { BaseListQueryParams, IAuthorization, IPersonName, IPhoneNumber, XGenericObject } from '../Interfaces'
import { FeeDetails, IPaymentMethod } from '../Payment'

import { CurrencyCode } from '../Codes'
import { NextAction } from '../Actions'

export type OrderStatus =
    | 'completed'
    | 'pending'
    | 'authorized'
    | 'partially-completed'
    | 'voided'
    | 'failed'

export interface OrdersListQueryParams extends BaseListQueryParams {
    from?: string
    to?: string
    status?: OrderStatus
    customer_id?: string
    payment_method_id?: string
}

export interface IOrder {
    id: string
    amount: number
    fees: FeeDetails[]
    billing_details: {
        email: string
        name: IPersonName
        phone: IPhoneNumber
    },
    currency: CurrencyCode
    customer_id: string
    description: string
    meta: XGenericObject
    next_action: NextAction
    payment_method_details: IPaymentMethod
    redirect_url: string
    reference: string
    status: OrderStatus
    processor_response: {
        type: string
        code: string
    },
    created_datetime: string
}

export interface OrderCreateFormData {
    amount: number
    currency: CurrencyCode
    reference: string
    customer_id: string
    payment_method_id: string
    redirect_url?: string
    meta?: XGenericObject
    authorization?: IAuthorization
}

export interface OrderUpdateFormData {
    meta?: XGenericObject
    action?: 'void' | 'capture'
}