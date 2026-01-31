import { IAddress, IPersonName, IPhoneNumber } from '../Interfaces'

import { CurrencyCode } from '../Codes'

export interface IPaymentAmount {
    value: number
    applies_to: 'destination_currency' | 'source_currency'
}


export interface DisburseOption {
    date_time?: string
    timezone?: string
}

export interface ISender {
    name: IPersonName
    email?: string
    phone?: IPhoneNumber
    address?: IAddress
}

export interface IPaymentInstructionBase {
    source_currency: CurrencyCode
    destination_currency?: CurrencyCode
    amount: IPaymentAmount
}

export interface EtbBankPaymentInstruction extends IPaymentInstructionBase {
    recipient: {
        name: IPersonName
        bank: {
            account_number: string
            code: string
        }
    }
    sender: ISender
}

export interface EurBankPaymentInstruction extends IPaymentInstructionBase {
    recipient: {
        name: IPersonName
        phone: IPhoneNumber
        email: string
        address: IAddress
        bank: {
            account_number: string
            name: string
            swift_code: string
        }
    }
    sender: Required<ISender>
}

export interface GbpBankPaymentInstruction extends IPaymentInstructionBase {
    recipient: {
        name: IPersonName
        phone: IPhoneNumber
        email: string
        address: IAddress
        bank: {
            account_number: string
            account_type: 'individual' | 'corporate'
            name: string
            sort_code: string
        }
    }
    sender: Required<ISender>
}

export interface GhsBankPaymentInstruction extends IPaymentInstructionBase {
    recipient: {
        name: IPersonName
        bank: {
            account_number: string
            code: string
            branch: string
        }
    }
    sender: ISender
}

export interface CommonBankPaymentInstructionWithoutBranch extends IPaymentInstructionBase {
    recipient: {
        bank: {
            account_number: string
            code: string
        }
    }
    sender: ISender
}

export type KesBankPaymentInstruction = CommonBankPaymentInstructionWithoutBranch

export interface MwkBankPaymentInstruction extends IPaymentInstructionBase {
    recipient: {
        bank: {
            account_number: string
            code: string
            branch?: string
        }
    }
    sender: ISender
}

export type NgnBankPaymentInstruction = CommonBankPaymentInstructionWithoutBranch

export interface UsdBankPaymentInstruction extends IPaymentInstructionBase {
    recipient: {
        name: IPersonName
        phone: IPhoneNumber
        email: string
        address: IAddress
        bank: {
            account_number: string
            code: string
            account_type: 'checking' | 'savings'
            routing_number: string
            swift_code: string
        }
    }
    sender: Required<ISender>
}

export interface CommonBankPaymentInstructionWithBranch extends IPaymentInstructionBase {
    recipient: {
        bank: {
            account_number: string
            code: string
            branch: string
        }
    }
    sender: ISender
}

export type RwfBankPaymentInstruction = CommonBankPaymentInstructionWithBranch

export type SllBankPaymentInstruction = CommonBankPaymentInstructionWithBranch

export type UgxBankPaymentInstruction = CommonBankPaymentInstructionWithBranch

export type XafBankPaymentInstruction = CommonBankPaymentInstructionWithBranch

export type XofBankPaymentInstruction = CommonBankPaymentInstructionWithBranch

export interface ZarBankPaymentInstruction extends IPaymentInstructionBase {
    recipient: {
        name: IPersonName
        phone: IPhoneNumber
        email: string
        address: IAddress
        bank: {
            account_number: string
            code: string
        }
    }
    sender: ISender
}

export interface CommonMobileMoneyPaymentInstructionWithoutCountry extends IPaymentInstructionBase {
    recipient: {
        name: IPersonName
        mobile_money: {
            network: string
            msisdn: string
        }
    }
    sender: ISender
}

export type EtbMobileMoneyPaymentInstruction = CommonMobileMoneyPaymentInstructionWithoutCountry

export type GhsMobileMoneyPaymentInstruction = CommonMobileMoneyPaymentInstructionWithoutCountry

export type KesMobileMoneyPaymentInstruction = CommonMobileMoneyPaymentInstructionWithoutCountry

export type RwfMobileMoneyPaymentInstruction = CommonMobileMoneyPaymentInstructionWithoutCountry

export type TzsMobileMoneyPaymentInstruction = CommonMobileMoneyPaymentInstructionWithoutCountry

export type UgxMobileMoneyPaymentInstruction = CommonMobileMoneyPaymentInstructionWithoutCountry

export type ZmwMobileMoneyPaymentInstruction = CommonMobileMoneyPaymentInstructionWithoutCountry

export interface CommonMobileMoneyPaymentInstructionWithCountry extends IPaymentInstructionBase {
    recipient: {
        name: IPersonName
        mobile_money: {
            network: string
            country: string
            msisdn: string
        }
    }
    sender: ISender
}

export type XafMobileMoneyPaymentInstruction = CommonMobileMoneyPaymentInstructionWithCountry

export type XofMobileMoneyPaymentInstruction = CommonMobileMoneyPaymentInstructionWithCountry


export interface WalletPaymentInstruction extends Required<IPaymentInstructionBase> {
    amount: IPaymentAmount
    recipient: {
        wallet: {
            provider: 'flutterwave'
            identifier: string
        }
    }
    sender: ISender
}


export type IDirectTransferPaymentInstruction = {} & (
    {
        type: 'bank'
        payment_instruction: EtbBankPaymentInstruction | EurBankPaymentInstruction | GbpBankPaymentInstruction | GhsBankPaymentInstruction | KesBankPaymentInstruction | MwkBankPaymentInstruction | NgnBankPaymentInstruction | UsdBankPaymentInstruction | RwfBankPaymentInstruction | SllBankPaymentInstruction | UgxBankPaymentInstruction | XafBankPaymentInstruction | XofBankPaymentInstruction | ZarBankPaymentInstruction
    } | {
        type: 'mobile_money'
        payment_instruction: EtbMobileMoneyPaymentInstruction | GhsMobileMoneyPaymentInstruction | KesMobileMoneyPaymentInstruction | RwfMobileMoneyPaymentInstruction | TzsMobileMoneyPaymentInstruction | UgxMobileMoneyPaymentInstruction | XafMobileMoneyPaymentInstruction | XofMobileMoneyPaymentInstruction
    } | {
        type: 'wallet'
        payment_instruction: WalletPaymentInstruction
    }
)