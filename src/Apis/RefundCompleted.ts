import { Flutterwave } from '../Flutterwave'
import { Http } from '../Http'
import { IRefundCompletedWebhookPayload } from '../Contracts/Api/RefundCompletedApi'

/**
 * Send refund completion webhook
 */
export class RefundCompleted {
    #flutterwave: Flutterwave

    constructor(flutterwaveInstance: Flutterwave) {
        this.#flutterwave = flutterwaveInstance
    }

    /**
     * Send refund completion webhook
     * 
     * @method POST
     */
    async create (
        payload: IRefundCompletedWebhookPayload,
        traceId?: string,
        indempotencyKey?: string,
        scenarioKey?: string
    ): Promise<void> {
        await this.#flutterwave.ensureTokenIsValid()

        const { data } = await Http.send<void>(
            this.#flutterwave.builder.buildTargetUrl('/webhooks/refund-completed'),
            'POST',
            payload,
            { 'X-Trace-Id': traceId, 'X-Idempotency-Key': indempotencyKey, 'X-Scenario-Key': scenarioKey }
        )

        return data
    }
}