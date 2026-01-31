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

export interface IRefundCreateForm {
    meta?: XGenericObject
    /**
     * Reason for the refund
     */
    reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge',
    /**
     * The payment amount in decimals.
     */
    amount: number
    /**
     * ID of the charge to refund
     */
    charge_id: string
}

export interface IRefund {
    id: string
    /**
     * The payment amount in decimals.
     */
    amount_refunded: number
    meta: XGenericObject
    reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge'
    /**
     * Reason for the refund
     */
    status: 'pending' | 'requires_action' | 'succeeded' | 'failed' | 'cancelled' | 'completed' | 'new'
    charge_id: string
}