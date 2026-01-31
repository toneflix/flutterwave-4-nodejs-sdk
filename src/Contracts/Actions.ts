import { XGenericObject } from './Interfaces'

export type NextAction = {
    type: 'redirect_url'
    redirect_url: {
        url: string
    }
} | {
    type: 'requires_additional_fields'
    requires_additional_fields: {
        fields: string[]
    }
} | {
    type: 'requires_pin'
    requires_pin: {
        fields: string[]
    }
} | {
    type: 'requires_pin'
    requires_pin: {
        pin: string
    }
} | {
    type: 'requires_requery'
    requires_requery: XGenericObject
} | {
    type: 'requires_otp'
    requires_otp: XGenericObject
} | {
    type: 'requires_capture'
    requires_capture: XGenericObject
} | {
    type: 'payment_instruction'
    payment_instruction: {
        note: string
    }
} | {
    type: 'requires_bank_transfer'
    requires_bank_transfer: {
        account_number: string
        account_bank_name: string
        account_expiration_datetime: string
        note: string
    }
} | {
    type: 'qr_code'
    qr_code: {
        image: string
    }
}