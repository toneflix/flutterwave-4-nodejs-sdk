import { CurrencyCode } from '../Codes'
import { FeeDetails } from '../Payment'
import { IChargeSummary } from './ChargesApi'
import { XGenericObject } from '../Interfaces'

export interface ISettlement {
    id: string
    net_amount: number
    gross_amount: number
    currency: CurrencyCode
    meta: XGenericObject
    status:
    | 'disburse-pending' | 'pending' | 'reviewed' | 'approved' | 'completed'
    | 'completed-offline' | 'failed' | 'flagged' | 'processing' | 'on-hold'
    due_datetime: string
    fees: FeeDetails[],
    destination: string
    charge_count: string
    charges: IChargeSummary[]
    created_datetime: string
}
