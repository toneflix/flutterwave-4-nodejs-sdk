import { BasicListQueryParams, XGenericObject } from '../Interfaces'

import { CurrencyCode } from '../Codes'

export interface VirtualAccountsListQueryParams extends BasicListQueryParams {
    reference?: string
}

export interface IVirtualAccountCreateForm {
    reference: string
    customer_id: string
    amount: number
    expiry: number
    currency: CurrencyCode
    account_type: 'static' | 'dynamic'
    meta?: XGenericObject
    narration?: string
    bvn?: string
    nin?: string
    customer_account_number?: string
    merchant_vat_amount?: number
}

interface IVirtualAccountBvnUpdateAction {
    action_type: 'update_bvn'
    bvn: string
}

interface IVirtualAccountStatusUpdateAction {
    action_type: 'update_status'
    status: 'inactive'
}

export type IVirtualAccountUpdateForm = {
    meta?: XGenericObject
} & (IVirtualAccountBvnUpdateAction | IVirtualAccountStatusUpdateAction)

export interface IVirtualAccount {
    id: string
    amount: 1000,
    account_number: string
    reference: string
    account_bank_name: string
    account_type: 'static' | 'dynamic'
    status: 'active' | 'inactive'
    account_expiration_datetime: string
    note: string
    customer_id: string
    created_datetime: string
    meta?: XGenericObject
    customer_reference: string
    currency: CurrencyCode
}
