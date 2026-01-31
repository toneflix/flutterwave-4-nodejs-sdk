import { XGenericObject } from '../Interfaces'

export interface IRefundCompletedWebhookPayload {
    data: {
        id: string
        meta: XGenericObject
        amount_refunded: number
        reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge',
        status: 'pending' | 'requires_action' | 'succeeded' | 'failed' | 'cancelled' | 'completed' | 'new',
        charge_id: string
        created_datetime: string
    },
    webhook_id: string
    timestamp: number
    type: 'refund.completed' | 'charge.completed' | 'transfer.disburse' | 'transfer.reversal' | 'order.authorization'
}