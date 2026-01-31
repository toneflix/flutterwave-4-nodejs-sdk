import { FlutterwaveErrorType, FlutterwaveErrorValue } from './Errors'

import { XGenericObject } from './Interfaces'

export type FlutterwaveResponseStatus = 'failed' | 'success'

export interface FlutterwaveValidationError {
    'field_name': string
    'message': string
}

export interface FlutterwaveErrorResponse {
    status: FlutterwaveResponseStatus
    message?: string
    error: {
        type: FlutterwaveErrorType
        code: FlutterwaveErrorValue
        message: string
    }
}

export interface FlutterwaveValidationErrorResponse {
    status: FlutterwaveResponseStatus
    message?: string
    error: {
        type: FlutterwaveErrorType
        code: FlutterwaveErrorValue
        message: string
        validation_errors: FlutterwaveValidationError[]
    }
}

export interface FlutterwaveSuccessResponse<T = any> {
    status: FlutterwaveResponseStatus
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

export interface UnifiedFlutterwaveResponse<T = any, M extends XGenericObject = XGenericObject> {
    success: boolean
    message: string
    status?: FlutterwaveResponseStatus
    data: T
    meta?: M | undefined
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

export interface NormalPagination {
    total: number
    current_page: number
    total_pages: number
}

export interface PageInfoMeta {
    page_info: NormalPagination
}