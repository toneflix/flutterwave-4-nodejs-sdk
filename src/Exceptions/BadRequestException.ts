import { FlutterwaveErrorType, FlutterwaveErrorValue } from '../Contracts/Errors'

import { FlutterwaveValidationErrorResponse } from '../Contracts/FlutterwaveCore'

export class BadRequestException extends Error {
    statusCode: number = 400

    type: FlutterwaveErrorType = 'INVALID_REQUEST'
    code: FlutterwaveErrorValue = '000001'
    data: FlutterwaveValidationErrorResponse

    constructor(data?: FlutterwaveValidationErrorResponse) {
        super(
            data?.error.message ??
            data?.message ??
            'Bad request. The server could not understand the request due to invalid syntax.'
        )

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
                message: this.message,
                validation_errors: []
            }
        }

        this.name = 'BadRequestException'
    }
}