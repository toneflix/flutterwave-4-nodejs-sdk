import { FlutterwaveGeneralError, FlutterwavePaymentError, FlutterwavePayoutError } from './Errors'

export type FlutterwaveErrorType =
    | keyof FlutterwaveGeneralError
    | keyof FlutterwavePaymentError
    | keyof FlutterwavePayoutError

export type FlutterwaveErrorValue =
    | FlutterwaveGeneralError[keyof FlutterwaveGeneralError]
    | FlutterwavePaymentError[keyof FlutterwavePaymentError]
    | FlutterwavePayoutError[keyof FlutterwavePayoutError]

export interface FlutterwaveValidationError {
    'field_name': string
    'message': string
}

export interface FlutterwaveErrorResponse {
    status: 'failed',
    error: {
        type: FlutterwaveErrorType,
        code: FlutterwaveErrorValue,
        message: string
        validation_errors: FlutterwaveValidationError[]
    }
}

export interface FlutterwaveSuccessResponse<T = any> {
    status: 'success',
    message: string
    data: T
}

export interface FlutterwaveAuthResponse {
    access_token: string
    expires_in: number
    refresh_expires_in: number
    token_type: 'Bearer',
    'notbefore-policy': number
    scope: 'profile email'
}

export interface FlutterwaveAuthErrorResponse {
    error: 'invalid_request'
    error_description: string
}

export type FlutterwaveResponse<T = any> = FlutterwaveSuccessResponse<T> | FlutterwaveErrorResponse

export interface UnifiedFlutterwaveResponse<T = any> {
    success: boolean
    message: string
    data?: T
    error?: {
        type: FlutterwaveErrorType
        code: FlutterwaveErrorValue
        message: string
        validation_errors: FlutterwaveValidationError[]
    }
}