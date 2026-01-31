import { Authorization, BillingDetails, FeeDetails, IPaymentMethod } from '../Payment'
import { BaseListQueryParams, XGenericObject } from '../Interfaces'

import { CurrencyCode } from '../Codes'
import { FlutterwaveResponseStatus } from '../FlutterwaveResponse'
import { NextAction } from '../Actions'

export interface ChargebacksMeta {
    page_info: {
        total: number
        current_page: number
        total_pages: number
    }
}

export interface ChargeCreateFormData {
    amount: number
    currency: CurrencyCode
    reference: string
    customer_id: string
    meta?: XGenericObject
    payment_method_id: string
    redirect_url?: string
    authorization?: Authorization
    recurring?: boolean
    order_id?: string
    merchant_vat_amount?: number
}

export interface ChargeUpdateFormData {
    meta?: XGenericObject
    authorization?: Authorization
}

export interface ChargesListQueryParams extends BaseListQueryParams {
    from?: string
    to?: string
    status?: 'pending' | 'succeeded' | 'failed' | 'voided'
    order_id?: string
    reference?: string
    payment_method_id?: string
    customer_id?: string
    customer_identifier?: string
}

export interface ICharge {
    id: string
    amount: number
    fees: FeeDetails[]
    billing_details: BillingDetails
    currency: CurrencyCode
    customer_id: string
    description: string
    disputed: boolean
    settled: boolean
    settlement_id: string[]
    meta: XGenericObject
    next_action: NextAction
    payment_method_details: IPaymentMethod
    redirect_url: string
    refunded: boolean
    reference: string
    status: FlutterwaveResponseStatus
    processor_response: {
        type: string
        code: string
    },
    created_datetime: string
}

export interface IChargeSummary {
    id: string
    currency: CurrencyCode
    customer_id: string
    charge_date: string
    charged_amount: number
    settlement_amount: number
    payment_method_id: string
}