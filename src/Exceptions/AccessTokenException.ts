export class AccessTokenException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AccessTokenException'
    }
}