import '../utilities/global'

import { WebhookValidatorOptions } from '../Contracts/Interfaces'
import crypto from 'crypto'

export class WebhookValidator {
    algorithm: 'sha256' | 'sha512' | 'sha1' = 'sha256'
    encoding: 'base64' | 'hex' = 'base64'

    /**
     * @param secretHash 
     * @param options 
     */
    constructor(private secretHash?: string, options?: WebhookValidatorOptions) {
        this.algorithm = options?.hashAlgorithm || 'sha256'
        this.encoding = options?.encoding || 'base64'
        if (!this.secretHash || this.secretHash.length === 0) {
            this.secretHash = process.env.SECRET_HASH
        }
    }

    /**
     * Validate webhook signature
     * @param rawBody - Raw request body as string
     * @param signature - Signature from request header
     * @returns {boolean} - True if signature is valid
     */
    validate (rawBody: string, signature: string): boolean {
        if (!this.secretHash) {
            throw new Error('Secret hash is required for validation')
        }
        const hash = crypto
            .createHmac(this.algorithm, this.secretHash)
            .update(rawBody)
            .digest(this.encoding)

        return hash === signature
    }

    /**
     * Generate signature for testing/verification
     * @param rawBody - Raw request body as string
     * @returns {string} - Generated signature
     */
    generateSignature (rawBody: string): string {
        if (!this.secretHash) {
            throw new Error('Secret hash is required to generate signature')
        }

        return crypto
            .createHmac(this.algorithm, this.secretHash)
            .update(rawBody)
            .digest(this.encoding)
    }

    /**
     * Async version of validate (for large payloads)
     * 
     * @param rawBody 
     * @param signature 
     * @returns {Promise<boolean>}
     */
    validateAsync (rawBody: string, signature: string): boolean {
        if (!this.secretHash) {
            throw new Error('Secret hash is required for validation')
        }

        const hmac = crypto.createHmac(this.algorithm, this.secretHash)
        hmac.update(rawBody)
        const hash = hmac.digest(this.encoding)

        return (hash === signature)
    }

    /**
     * Get current configuration
     */
    getConfig () {
        return {
            algorithm: this.algorithm,
            encoding: this.encoding,
            secretHashLength: this.secretHash?.length
        }
    }
}