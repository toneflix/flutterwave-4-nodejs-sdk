import { EtbBankPaymentInstruction, EtbMobileMoneyPaymentInstruction, EurBankPaymentInstruction, GbpBankPaymentInstruction, GhsBankPaymentInstruction, GhsMobileMoneyPaymentInstruction, KesBankPaymentInstruction, KesMobileMoneyPaymentInstruction, MwkBankPaymentInstruction, NgnBankPaymentInstruction, RwfBankPaymentInstruction, RwfMobileMoneyPaymentInstruction, SllBankPaymentInstruction, TzsMobileMoneyPaymentInstruction, UgxBankPaymentInstruction, UgxMobileMoneyPaymentInstruction, UsdBankPaymentInstruction, XafBankPaymentInstruction, XafMobileMoneyPaymentInstruction, XofBankPaymentInstruction, XofMobileMoneyPaymentInstruction, ZarBankPaymentInstruction, ZmwMobileMoneyPaymentInstruction } from './PaymentInstruction'
import { IAddress, IBank, ICashPickup, IIdentification, IMobileMoney, IPerson, IPersonName, IPhoneNumber, IWallet } from '../Interfaces'

import { CurrencyCode } from '../Codes'

export type ITransferRecipientCreateForm = {
    name: IPersonName
} & (
        {
            type: 'mobile_money_etb'
            mobile_money: EtbMobileMoneyPaymentInstruction['recipient']['mobile_money']
        } | {
            type: 'mobile_money_ghs'
            mobile_money: GhsMobileMoneyPaymentInstruction['recipient']['mobile_money']
        } | {
            type: 'mobile_money_kes'
            mobile_money: KesMobileMoneyPaymentInstruction['recipient']['mobile_money']
        } | {
            type: 'mobile_money_rwf'
            mobile_money: RwfMobileMoneyPaymentInstruction['recipient']['mobile_money']
        } | {
            type: 'mobile_money_tzs'
            mobile_money: TzsMobileMoneyPaymentInstruction['recipient']['mobile_money']
        } | {
            type: 'mobile_money_ugx'
            mobile_money: UgxMobileMoneyPaymentInstruction['recipient']['mobile_money']
        } | {
            type: 'mobile_money_xaf'
            mobile_money: XafMobileMoneyPaymentInstruction['recipient']['mobile_money']
        } | {
            type: 'mobile_money_xof'
            mobile_money: XofMobileMoneyPaymentInstruction['recipient']['mobile_money']
        } | {
            type: 'mobile_money_zmw'
            mobile_money: ZmwMobileMoneyPaymentInstruction['recipient']['mobile_money']
        } | {
            type: 'bank_etb'
            bank: EtbBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_eur'
            bank: EurBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_gbp'
            bank: GbpBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_ghs'
            bank: GhsBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_kes'
            bank: KesBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_mwk'
            bank: MwkBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_ngn'
            bank: NgnBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_usd'
            bank: UsdBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_rwf'
            bank: RwfBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_sll'
            bank: SllBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_ugx'
            bank: UgxBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_xaf'
            bank: XafBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_xof'
            bank: XofBankPaymentInstruction['recipient']['bank']
        } | {
            type: 'bank_zar'
            bank: ZarBankPaymentInstruction['recipient']['bank']
        }
    )

interface NPDEA {
    national_identification: IIdentification
    phone: IPhoneNumber
    date_of_birth: string
    email: string
    address: IAddress
}

export interface ITransferRecipientBank extends NPDEA {
    type: 'bank',
    bank: IBank
}

export interface ITransferRecipientMobileMoney extends NPDEA {
    type: 'mobile_money',
    mobile_money: IMobileMoney
}

export interface ITransferRecipientWallet {
    type: 'wallet',
    wallet: IWallet
}

export interface ITransferRecipientCashPickup extends NPDEA {
    type: 'cash_pickup',
    cash_pickup: ICashPickup
}


export type ITransferRecipient = {
    id: string
    name: IPersonName
    currency: CurrencyCode
} & (ITransferRecipientBank | ITransferRecipientMobileMoney | ITransferRecipientWallet | ITransferRecipientCashPickup)