import { afterEach, describe, expect, it, vi } from 'vitest'

import { Flutterwave } from '../src/Flutterwave'
import { Http } from '../src/Http'

describe('V3 API Spec', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('can retrieve BVN verification by reference from flutterwave.v3', async () => {
        const flutterwave = new Flutterwave({
            clientId: 'test_client_id',
            clientSecret: 'test_client_secret',
            environment: 'live',
        })

        vi.spyOn(flutterwave, 'ensureTokenIsValid').mockResolvedValue(undefined)
        const send = vi.spyOn(Http, 'send').mockResolvedValue({
            success: true,
            message: 'success',
            data: {
                first_name: 'Ada',
                last_name: 'Lovelace',
                status: 'completed',
                reference: 'bvn-ref-123',
                callback_url: 'https://example.com/callback',
                bvn_data: {
                    bvn: '12345678901',
                    nin: '',
                    email: 'ada@example.com',
                    gender: 'F',
                    surname: 'Lovelace',
                    serialNo: '',
                    faceImage: '',
                    firstName: 'Ada',
                    landmarks: '',
                    branchName: '',
                    middleName: '',
                    nameOnCard: '',
                    dateOfBirth: '',
                    lgaOfOrigin: '',
                    watchlisted: '',
                    lgaOfCapture: '',
                    phoneNumber1: '',
                    phoneNumber2: '',
                    maritalStatus: '',
                    stateOfOrigin: '',
                    enrollBankCode: '',
                    enrollUserName: '',
                    enrollmentDate: '',
                    lgaOfResidence: '',
                    stateOfCapture: '',
                    additionalInfo1: '',
                    productReference: '',
                    stateOfResidence: '',
                    created_at: '',
                    complete_message: '',
                },
            },
        })

        const result = await flutterwave.v3.bvn.verifications('bvn-ref-123')

        expect(result.reference).toBe('bvn-ref-123')
        expect(send).toHaveBeenCalledWith(
            'https://api.flutterwave.com/v3/bvn/verifications/bvn-ref-123?include_complete_message=1',
            'GET'
        )
    })

    it('can override the BVN complete message query param', async () => {
        const flutterwave = new Flutterwave({
            clientId: 'test_client_id',
            clientSecret: 'test_client_secret',
            environment: 'sandbox',
        })

        vi.spyOn(flutterwave, 'ensureTokenIsValid').mockResolvedValue(undefined)
        const send = vi.spyOn(Http, 'send').mockResolvedValue({
            success: true,
            message: 'success',
            data: {
                first_name: 'Ada',
                last_name: 'Lovelace',
                status: 'completed',
                reference: 'bvn-ref-123',
                callback_url: 'https://example.com/callback',
                bvn_data: {} as never,
            },
        })

        await flutterwave.v3.bvn.verifications('bvn-ref-123', {
            include_complete_message: true,
        })

        expect(send).toHaveBeenCalledWith(
            'https://api.flutterwave.com/v3/bvn/verifications/bvn-ref-123?include_complete_message=true',
            'GET'
        )
    })
})
