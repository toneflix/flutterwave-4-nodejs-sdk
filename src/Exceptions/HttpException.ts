import { BadRequestException } from './BadRequestException'
import { ForbiddenRequestException } from './ForbiddenRequestException'
import { UnauthorizedRequestException } from './UnauthorizedRequestException'
import { UnifiedFlutterwaveResponse } from '../Contracts/FlutterwaveCore'

export class HttpException extends Error {
    statusCode: number = 500
    parent?: Error

    constructor(public data: UnifiedFlutterwaveResponse, statusCode?: number, parent?: Error) {
        super(data.message)
        this.name = 'HttpException'
        this.parent = parent

        if (statusCode) {
            this.statusCode = statusCode
        }
    }

    /**
     * Create an exception from status code
     * 
     * @param code 
     * @param data 
     */
    static fromCode (code: number, data: Required<UnifiedFlutterwaveResponse>, parent?: Error) {
        switch (code) {
            case 400:
                return new BadRequestException(data)
            case 401:
                return new UnauthorizedRequestException(data)
            case 403:
                return new ForbiddenRequestException(data)
            default:
                return new HttpException(data, code, parent)
        }
    }
}