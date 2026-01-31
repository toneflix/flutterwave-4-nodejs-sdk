import { CountryCode } from './Codes'

export interface XGenericObject {
    [key: string]: any
}

export interface BaseListQueryParams {
    page?: number
    size?: number
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