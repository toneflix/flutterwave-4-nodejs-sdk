import { CountryCode } from './Codes'

export interface XGenericObject {
    [key: string]: any
}

export interface BaseListQueryParams {
    page?: number
    size?: number
}

export interface BasicListQueryParams extends BaseListQueryParams {
    from?: string
    to?: string
}


export interface IMobileNetwork {
    id: string
    network: string
    name: string
}

export interface IAddress {
    city: string
    country: CountryCode
    line1: string
    line2: string
    postal_code: string
    state: string
}

export interface IPersonName {
    first: string
    middle?: string
    last: string
}

export interface IIdentification {
    type: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID'
    identifier: string
    expiration_date: string
}

export interface IPhoneNumber {
    country_code: string
    number: string
}

export interface WebhookValidatorOptions {
    hashAlgorithm?: 'sha256' | 'sha512' | 'sha1';
    encoding?: 'base64' | 'hex';
}

export interface IAuthorization {
    '3ds': XGenericObject
    type: '3ds'
}

export interface IPerson {
    id: string
    name: IPersonName
    national_identification: IIdentification
    phone: IPhoneNumber
    date_of_birth: string
    email: string
    address: IAddress
}

export interface IBank {
    code: string,
    account_number: string,
    account_type?: 'checking' | 'savings' | 'corporate' | 'individual'
    branch?: string,
    name?: string,
    routing_number?: string,
    swift_code?: string,
    sort_code?: string
}

export interface IWallet {
    provider: 'flutterwave'
    identifier: string
}

export interface ICashPickup {
    network: string
}

export interface IMobileMoney {
    /**
     * recipient network
     */
    network: string
    /**
     * recipient country
     */
    country: string
    /**
     * recipient phone number
     */
    msisdn: string
}

export type XTransferRecipient = {} & ({
    type: 'bank'
    bank: IBank
} | {
    type: 'wallet'
    wallet: IWallet
} | {
    type: 'mobile_money'
    mobile_money: IMobileMoney
} | {
    type: 'cash_pickup'
    cash_pickup: ICashPickup
})