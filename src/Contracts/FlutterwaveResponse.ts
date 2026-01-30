import { FlutterwaveErrorType, FlutterwaveErrorValue } from './Errors'

export interface FlutterwaveValidationError {
    'field_name': string
    'message': string
}

export interface FlutterwaveErrorResponse {
    status: 'failed' | 'success'
    message?: string
    error: {
        type: FlutterwaveErrorType
        code: FlutterwaveErrorValue
        message: string
    }
}

export interface FlutterwaveValidationErrorResponse {
    status: 'failed' | 'success'
    message?: string
    error: {
        type: FlutterwaveErrorType
        code: FlutterwaveErrorValue
        message: string
        validation_errors: FlutterwaveValidationError[]
    }
}

export interface FlutterwaveSuccessResponse<T = any> {
    status: 'failed' | 'success'
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
    status?: 'failed' | 'success'
    data: T
    error?: {
        type: FlutterwaveErrorType
        code: FlutterwaveErrorValue
        message: string
        validation_errors: FlutterwaveValidationError[]
    }
}

export interface CursorPagination {
    next: string
    previous: string
    limit: number
    total: number
    has_more_items: boolean
}