import { BasicListQueryParams, IPerson, XGenericObject, XTransferRecipient } from '../Interfaces'
import { CurrencyCode, ProviderResponseCode } from '../Codes'
import { DisburseOption, IDirectTransferPaymentInstruction, IPaymentAmount } from './PaymentInstruction'

import { FeeDetails } from '../Payment'

export interface TransfersListQueryParams extends BasicListQueryParams {
    next?: string
    previous?: string
    bulk_id?: string
    recipient_id?: string
    sender_id?: string
    destination_currency?: CurrencyCode
    source_currency?: CurrencyCode
    action?: 'instant' | 'deferred' | 'scheduled' | 'retry'
    type?: 'bank' | 'wallet' | 'mobile_money' | 'cash_pickup'
    status?: 'pending' | 'new' | 'successful' | 'failed' | 'cancelled'
}

export interface ITransferCreateForm {
    action: 'instant' | 'deferred' | 'scheduled'
    reference?: string
    narration?: string
    disburse_option?: {
        date_time?: string
        timezone?: string
    }
    callback_url?: string
    meta?: XGenericObject
    payment_instruction: {
        source_currency: CurrencyCode
        amount: IPaymentAmount
        recipient_id: string
        sender_id?: string
    }
}

export interface ITransferUpdateForm {
    initiate?: boolean
    close?: boolean
    disburse_option?: DisburseOption
}

export interface ITransferRetryForm {
    action: 'retry' | 'duplicate'
    reference?: string
    meta?: XGenericObject
    callback_url?: string
}

export type IDirectTransferForm = IDirectTransferPaymentInstruction & {
    action: 'instant' | 'deferred' | 'scheduled'
    reference?: string
    narration?: string
    disburse_option?: DisburseOption
    callback_url?: string
    meta?: XGenericObject
}

export interface ITransfer {
    id: string
    type: 'bank' | 'mobile_money' | 'wallet' | 'cash_pickup'
    action: 'instant' | 'deferred' | 'scheduled' | 'retry' | 'duplicate'
    reference: string
    status: 'NEW' | 'PENDING' | 'FAILED' | 'SUCCESSFUL' | 'CANCELLED' | 'INITIATED'
    reversal?: {
        reversal_datetime: string,
        initial_status: string
        reconciliation_status: string
        reconciliation_type: 'D' | 'C'
    }
    narration: string
    source_currency: CurrencyCode
    destination_currency: CurrencyCode
    amount: IPaymentAmount
    fee: FeeDetails
    debit_information: {
        currency: CurrencyCode
        actual_debit_amount: number
        rate_used: number
        vat: number
    }
    payment_information: {
        proof: string
    }
    retry: {
        parent_id: string
        parent_reference: string
    }
    duplicate: {
        parent_id: string
        parent_reference: string
    }
    disburse_option?: DisburseOption
    callback_url: string
    provider_response: {
        message?: string
        type: ProviderResponseCode
        code: string
    }
    recipient: IPerson & XTransferRecipient
    sender: IPerson
    meta: XGenericObject
    created_datetime: string
}
