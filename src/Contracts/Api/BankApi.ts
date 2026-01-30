import { CountryCode } from '../Codes'

export interface BankApiResponse {
    id: string
    code: string
    name: string
}

export interface BankBranchApiResponse {
    id: string
    code: string
    name: string
    swift_code: string
    bic: string
}

export interface GbpAccountBodyParams {
    account: {
        code: string
        number: string
    } & ({
        type: 'corporate'
        business_name: string
    } | {
        type: 'individual'
        name: {
            first: string
            middle?: string
            last: string
        }
    }),
    currency: 'GBP'
}

export interface NgnAccountBodyParams {
    account: {
        code: string
        number: string
    },
    currency: 'NGN'
}

export interface UsdAccountBodyParams {
    account: {
        country: CountryCode
        code: string
        number: string
    },
    currency: 'USD'
}