import { XGenericObject } from '../Interfaces'

export interface ChargebackCreateFormData {
    type: 'international' | 'local',
    charge_id: string
    amount: number
    expiry: number
    stage?: 'new' | 'second' | 'pre-arbitration' | 'arbitration',
    status?: 'pending' | 'initiated'
    uploaded_proof?: string
    comment?: string
    provider?: string
    arn?: string
    initiator?: string
}

export interface ChargebackUpdateFormData {
    status?: 'accepted' | 'declined'
    uploaded_proof?: string
    comment?: string
    provider?: string
    arn?: string
    due_datetime?: string
    proof_data?: string
}

export interface ChargebacksApiResponse {
    id: number
    charge_id: string
    amount: number
    meta: XGenericObject,
    stage: 'new' | 'second' | 'pre-arbitration' | 'arbitration' | 'invalid',
    status: 'pending' | 'accepted' | 'declined' | 'initiated' | 'won' | 'lost' | 'reversed' | 'new',
    type: 'local' | 'international',
    due_datetime: string
    created_datetime: string
    updated_datetime: string
    settlement_id: string
    uploaded_proof: string
    comment: string
    provider: string
    arn: string
    initiator: string
}