import { BaseListQueryParams, IAddress, IIdentification, IPersonName, IPhoneNumber } from '../Interfaces'

export interface TransferSendersListQueryParams extends BaseListQueryParams {
    from?: string
    to?: string
}

export interface IBaseTransferSender {
    name: IPersonName
    address: IAddress
    phone: IPhoneNumber
    email: string
}

export interface IGenericTransferSender extends Partial<IBaseTransferSender> {
    name: IPersonName
    type: 'generic_sender'
}

export interface IBankGbpTransferSender extends IBaseTransferSender {
    type: 'bank_gbp'
}

export interface IBankEurTransferSender extends IBaseTransferSender {
    type: 'bank_eur'
}

export type ITransferSenderCreateForm = IGenericTransferSender | IBankGbpTransferSender | IBankEurTransferSender

export interface ITransferSender {
    id: string
    name: IPersonName
    national_identification: IIdentification
    phone: IPhoneNumber
    date_of_birth: string
    email: string
    address: IAddress
}
