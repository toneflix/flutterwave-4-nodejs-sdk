import { IAddress, IPersonName, IPhoneNumber, XGenericObject } from '../Interfaces'

export interface ICustomer {
    id: string
    address: IAddress
    email: string
    name: IPersonName
    phone: IPhoneNumber
    meta: XGenericObject
    created_datetime: string
}

export interface ICustomerCreateFormData {
    email: string
    name?: IPersonName
    address?: Omit<IAddress, 'line2'> & { line2?: string }
    meta?: XGenericObject
    phone?: IPhoneNumber
}

export type ICustomerUpdateFormData = Omit<ICustomerCreateFormData, 'email'>;