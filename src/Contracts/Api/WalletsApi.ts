import { BasicListQueryParams } from '../Interfaces'
import { CurrencyCode } from '../Codes'
import { IAmount } from './TransferRateApi'
import { ITransfer } from './TransfersApi'

export interface IWalletAccountResolveForm {
    provider: 'flutterwave'
    identifier: string
}

export interface IWalletAccountResolveResponse {
    provider: string
    identifier: string
    name: string
}

export interface IWalletStatementQueryParams extends BasicListQueryParams {
    next?: string
    previous?: string
    currency: CurrencyCode
}

export interface IBalance {
    currency: CurrencyCode
    before: number
    after: number
}

export interface ITransaction {
    transaction_direction: 'credit' | 'debit'
    amount: IAmount
    balance: IBalance
    remarks: string
    sent_amount: {
        value: number
        currency: CurrencyCode
    },
    transaction_type:
    | 'transfer' | 'fee' | 'reversal' | 'reversal_fee' | 'settlement' | 'funding'
    | 'bill' | 'chargeback' | 'card' | 'card_fee' | 'otp_saas'
    transaction_date: string
    transfer: ITransfer
}

export interface IWalletBalance {
    currency: CurrencyCode
    available_balance: number
}
