import { IAddress, IPersonName, IPhoneNumber, XGenericObject } from './Interfaces'

import { CountryCode } from './Codes'

export interface OtpAuthorization {
    type: 'otp',
    otp: {
        code: string
    }
}

export interface PinAuthorization {
    type: 'pin',
    pin: {
        nonce: string
        encrypted_pin: string
    }
}

export interface External3DsAuthorization {
    type: 'external_3ds',
    external_3ds: {
        transaction_status: 'N' | 'Y' | 'U' | 'A' | 'R'
        eci: string
        time: string
        transaction_id: string
        authentication_token: string
        version: string
        status_reason_code: string
        amount: number
    }
}

export type Authorization = OtpAuthorization | PinAuthorization | External3DsAuthorization

export interface CardDetails {
    expiry_month: string
    expiry_year: string
    card_number: string
    cvv: string
}

export interface FeeDetails {
    type: 'vat' | 'app' | 'merchant' | 'stamp_duty'
    amount: number
}

export interface BillingDetails {
    email: string
    name: IPersonName
    phone: IPhoneNumber
}

export type EncryptedCardDetails = {
    [K in keyof CardDetails as `encrypted_${K}`]: string;
} & { nonce: string };

export interface IPaymentCard extends CardDetails {
    nonce: string
    billing_address?: Omit<IAddress, 'line2'> & { line2?: string }
}

export type PaymentMethodType =
    | 'card' | 'bank_account' | 'mobile_money' | 'opay'
    | 'applepay' | 'googlepay' | 'ussd' | 'bank_transfer';

export interface ICard {
    type: 'card',
    card: {
        expiry_month: string
        expiry_year: string
        first6: string
        last4: string
        network: 'MASTERCARD' | 'VISA' | 'AMERICAN EXPRESS' | 'DISCOVER' | 'VERVE' | 'AFRIGO' | 'UNKNOWN'
        billing_address: IAddress,
        cof: {
            enabled: boolean
            agreement_id: string
            recurring_amount_variability: 'VARIABLE'
            agreement_type: 'UNSCHEDULED'
            trace_id: string
        },
        card_holder_name: string
    }
}

export interface ITransfer {
    type: 'transfer',
    transfer: {
        account_expires_in: string
        account_display_name: string
        account_type: 'dynamic' | 'static'
        originator_bank_name: string
        originator_account_number: string
        originator_name: string
    }
}

export interface IApplePay {
    type: 'applepay',
    applepay: {
        card_holder_name: string
    }
}

export interface IGooglePay {
    type: 'googlepay',
    googlepay: {
        card_holder_name: string
    }
}

export interface IUssd {
    type: 'ussd',
    ussd: {
        account_bank: string
    }
}

export interface IOpay {
    type: 'opay',
    opay: {
        [opay: string]: any
    }
}

export interface IBankAccount {
    type: 'bank_account',
    bank_account: {
        [bank_account: string]: any
    }
}


export interface IMobileMoney {
    type: 'mobile_money',
    mobile_money: {
        network: string
        country_code: CountryCode
        phone_number: string
        qr_code?: string
    }
}

export interface IBasePaymentMethod {
    id: string
    customer_id: string
    meta: XGenericObject
    device_fingerprint: string
    client_ip: string
    created_datetime: string
}

export type IPaymentMethod = IBasePaymentMethod & (
    ICard | ITransfer | IApplePay | IGooglePay | IUssd | IOpay | IBankAccount | IMobileMoney
);

export type IPaymentMethodCreateFormData = Omit<
    Partial<IBasePaymentMethod>, 'id' | 'device_fingerprint' | 'client_ip' | 'created_datetime'
> & (ITransfer | IApplePay | IGooglePay | IUssd | IOpay | IBankAccount | IMobileMoney | {
    type: 'card',
    card: IPaymentCard
})