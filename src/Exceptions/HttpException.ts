import { BadRequestException } from './BadRequestException'
import { ForbiddenRequestException } from './ForbiddenRequestException'
import { UnauthorizedRequestException } from './UnauthorizedRequestException'
import { UnifiedFlutterwaveResponse } from '../Contracts/FlutterwaveResponse'

export class HttpException extends Error {
    constructor(public data: UnifiedFlutterwaveResponse) {
        super(data.message)
        this.name = 'HttpException'
    }

    /**
     * Create an exception from status code
     * 
     * @param code 
     * @param data 
     */
    static fromCode (code: number, data: Required<UnifiedFlutterwaveResponse>) {
        switch (code) {
            case 400:
                return new BadRequestException(data)
            case 401:
                return new UnauthorizedRequestException(data)
            case 403:
                return new ForbiddenRequestException(data)
            default:
                return new HttpException(data)
        }
    }
}