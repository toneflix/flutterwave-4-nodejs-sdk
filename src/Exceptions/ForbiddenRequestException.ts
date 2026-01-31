import { FlutterwaveErrorType, FlutterwaveErrorValue } from '../Contracts/Errors'

import { FlutterwaveErrorResponse } from '../Contracts/FlutterwaveCore'

export class ForbiddenRequestException extends Error {
    statusCode: number = 403

    type: FlutterwaveErrorType = 'FORBIDDEN'
    code: FlutterwaveErrorValue = '10403'
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

        this.name = 'ForbiddenRequestException'
    }
}