import { FlutterwaveErrorType, FlutterwaveErrorValue } from '../Contracts/Errors'

import { FlutterwaveErrorResponse } from '../Contracts/FlutterwaveCore'

export class UnauthorizedRequestException extends Error {
    statusCode: number = 401

    type: FlutterwaveErrorType = 'UNAUTHORIZED'
    code: FlutterwaveErrorValue = '10401'
    data: FlutterwaveErrorResponse

    constructor(data?: FlutterwaveErrorResponse) {
        super(data?.error.message ?? data?.message ?? 'Forbidden request. You do not have permission to access this resource.')

        if (data?.error.code) {
            this.type = data.error.type
        }
        if (data?.error.code) {
            this.code = data.error.code
        }

        this.data = data ?? {
            status: 'failed',
            error: {
                type: this.type,
                code: this.code,
                message: this.message
            }
        }

        this.name = 'UnauthorizedRequestException'
    }
}