import { beforeAll, describe, expect, it } from 'vitest'

import { Flutterwave } from '../src'
import { faker } from '@faker-js/faker'

let flutterwave: Flutterwave
let rateId: string
let traceId: string
let settlementId: string
let transferRecipientId: string
let transferId: string
let transferSenderId: string
let virtualAccountId: string
let indempotencyKey: string
const trX = faker.string.alphanumeric({ casing: 'mixed', length: 10 })
const scenarioKey: string = 'TEST_SCENARIO_KEY'
let person: {
    [k: string]: {
        firstName: string
        lastName: string
        email: string
        account: string
    }
}

describe('API Spec', () => {
    beforeAll(() => {
        traceId = 'test-trace-id-' + Math.floor(Math.random() * 999).toString()
        indempotencyKey = 'test-idempotency-key-' + Math.floor(Math.random() * 999).toString()
        flutterwave = new Flutterwave()
        person = {
            a: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                account: faker.finance.accountNumber(10),
            },
            b: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                account: faker.finance.accountNumber(10),
            }
        }
    })

    describe('Transfer Rates', () => {
        it('should convert transfer rate', async () => {
            const rate = await flutterwave.api.transferRates.convert({
                source: {
                    currency: 'USD'
                },
                destination: {
                    amount: '100',
                    currency: 'NGN'
                },
                precision: 4
            }, traceId)

            expect(rate).toBeDefined()
            expect(rate.id).toBeDefined()
            expect(rate.rate).toBeDefined()
            expect(rate.source.currency).toBe('USD')
            expect(rate.destination.currency).toBe('NGN')

            rateId = rate.id
        })

        it('should fetch converted rate by id', async () => {
            const rate = await flutterwave.api.transferRates.fetch(
                rateId,
                traceId
            )

            expect(rate).toBeDefined()
            expect(rate.id).toBe(rateId)
        })
    })

    describe('Settlements', () => {
        it('should list settlements', async () => {
            const result = await flutterwave.api.settlements.list({
                page: 1,
                size: 10
            }, traceId)

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
            expect(Array.isArray(result.data)).toBe(true)
            expect(result.meta).toBeDefined()

            if (result.data.length > 0) {
                settlementId = result.data[0].id
            }
        })

        it('should retrieve a settlement', async () => {
            if (!settlementId) return

            const settlement = await flutterwave.api.settlements.retrieve(
                settlementId,
                traceId
            )

            expect(settlement).toBeDefined()
            expect(settlement.id).toBe(settlementId)
            expect(settlement.net_amount).toBeDefined()
            expect(settlement.currency).toBeDefined()
            expect(settlement.status).toBeDefined()
        })
    })

    describe('Transfer Recipients', () => {
        it('should create a transfer recipient', async () => {
            const recipient = await flutterwave.api.transferRecipients.create({
                type: 'bank_ngn',
                name: {
                    first: person.a.firstName,
                    last: person.a.lastName
                },
                bank: {
                    code: '044',
                    account_number: person.a.account
                },
            }, traceId)
            expect(recipient).toBeDefined()
            expect(recipient.id).toBeDefined()
            if (recipient.type === 'bank') {
                expect(recipient.bank.account_number).toBe(person.a.account)
            }
            expect(recipient.currency).toBe('NGN')

            transferRecipientId = recipient.id
        })

        it('should list transfer recipients', async () => {
            const result = await flutterwave.api.transferRecipients.list({
                page: 1,
                size: 10
            }, traceId)

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
            expect(Array.isArray(result.data)).toBe(true)
            expect(result.cursor).toBeDefined()
        })

        it('should retrieve a transfer recipient', async () => {
            if (!transferRecipientId) return
            const recipient = await flutterwave.api.transferRecipients.retrieve(
                transferRecipientId,
                traceId
            )

            expect(recipient).toBeDefined()
            expect(recipient.id).toBe(transferRecipientId)
            expect(recipient.name).toBeDefined()
        })

        it('should delete a transfer recipient', async () => {
            await flutterwave.api.transferRecipients.delete(
                transferRecipientId,
                traceId
            )

            // No error means success
            expect(true).toBe(true)
        })
    })

    describe('Transfer Senders', () => {
        it('should create a transfer sender', async () => {
            const sender = await flutterwave.api.transferSenders.create({
                type: 'generic_sender',
                name: {
                    first: person.b.firstName,
                    last: person.b.lastName
                },
                email: person.b.email,
            }, traceId)

            expect(sender).toBeDefined()
            expect(sender.id).toBeDefined()
            expect(sender.name.first).toBe(person.b.firstName)

            transferSenderId = sender.id
        })

        it('should list transfer senders', async () => {
            const result = await flutterwave.api.transferSenders.list({
                page: 1,
                size: 10
            }, traceId)

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
            expect(Array.isArray(result.data)).toBe(true)
            expect(result.cursor).toBeDefined()
        })

        it('should retrieve a transfer sender', async () => {
            if (!transferSenderId) return
            const sender = await flutterwave.api.transferSenders.retrieve(
                transferSenderId,
                traceId
            )

            expect(sender).toBeDefined()
            expect(sender.id).toBe(transferSenderId)
            expect(sender.name).toBeDefined()
        })

        it('should delete a transfer sender', async () => {
            await flutterwave.api.transferSenders.delete(
                transferSenderId,
                traceId
            )

            // No error means success
            expect(true).toBe(true)
        })
    })

    describe('Transfers', () => {
        it('should create a transfer with direct method', async () => {
            const transfer = await flutterwave.api.transfers.directTransfer({
                action: 'instant',
                reference: 'test-ref-' + Date.now(),
                narration: 'Test transfer',
                type: 'bank',
                payment_instruction: {
                    source_currency: 'NGN',
                    destination_currency: 'NGN',
                    amount: {
                        value: 100,
                        applies_to: 'source_currency'
                    },
                    recipient: {
                        bank: {
                            account_number: '0690000031',
                            code: '044'
                        }
                    },
                    sender: {
                        name: {
                            first: 'Test',
                            last: 'Sender'
                        }
                    }
                }
            }, traceId, indempotencyKey, scenarioKey)

            expect(transfer).toBeDefined()
            expect(transfer.id).toBeDefined()

            transferId = transfer.id
        })

        it('should create a transfer to wallet', async () => {
            const transfer = await flutterwave.api.transfers.directTransfer({
                action: 'instant',
                reference: 'test-ref-' + Date.now(),
                narration: 'Test transfer',
                type: 'wallet',
                payment_instruction: {
                    source_currency: 'NGN',
                    destination_currency: 'NGN',
                    amount: {
                        value: 100,
                        applies_to: 'source_currency'
                    },
                    recipient: {
                        wallet: {
                            identifier: '0690000031',
                            provider: 'flutterwave'
                        }
                    },
                    sender: {
                        name: {
                            first: 'Test',
                            last: 'Sender'
                        }
                    }
                }
            }, traceId, indempotencyKey, scenarioKey)

            expect(transfer).toBeDefined()
            expect(transfer.id).toBeDefined()
        })

        it.skip('should create a transfer that fails', async () => {
            const recipient = await flutterwave.api.transferRecipients.create({
                type: 'bank_ngn',
                name: { first: person.a.firstName, last: person.a.lastName },
                bank: { code: '044', account_number: person.a.account },
            }, traceId)

            const transfer = await flutterwave.api.transfers.create({
                action: 'instant',
                reference: 'test-ref-' + Date.now(),
                narration: 'Test transfer',
                payment_instruction: {
                    source_currency: 'NGN',
                    amount: {
                        value: 100,
                        applies_to: 'source_currency'
                    },
                    recipient_id: recipient.id,
                }
            }, traceId, indempotencyKey, 'scenario:invalid_currency')

            expect(transfer).toBeDefined()
            expect(transfer.id).toBeDefined()
        })

        it('should list transfers', async () => {
            const result = await flutterwave.api.transfers.list({
                page: 1,
                size: 10
            }, traceId)

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
            expect(Array.isArray(result.data)).toBe(true)
            expect(result.cursor).toBeDefined()
        })

        it('should retrieve a transfer', async () => {
            if (!transferId) return
            const transfer = await flutterwave.api.transfers.retrieve(
                transferId,
                traceId
            )

            expect(transfer).toBeDefined()
            expect(transfer.id).toBe(transferId)
            expect(transfer.amount).toBeDefined()
            expect(transfer.sender).toBeDefined()
        })

        it.skip('should update a transfer', async () => {
            if (!transferId) return
            const updated = await flutterwave.api.transfers.update(
                transferId,
                {
                    initiate: true,
                    disburse_option: {
                        date_time: new Date(Date.now() + 3600 * 1000).toISOString(),
                        timezone: 'UTC'
                    }
                },
                traceId
            )

            expect(updated).toBeDefined()
            expect(updated.id).toBe(transferId)
        })

        it.skip('should retry a transfer', async () => {
            if (!transferId) return
            const retried = await flutterwave.api.transfers.retry(
                transferId,
                {
                    action: 'retry'
                },
                traceId
            )

            expect(retried).toBeDefined()
            expect(retried.id).toBeDefined()
        })
    })

    describe('Virtual Accounts', () => {
        it('should create a virtual account', async () => {
            const { data: [customer] } = await flutterwave.api.customers.list({
                page: 1,
                size: 10,
            })

            const account = await flutterwave.api.virtualAccounts.create({
                reference: trX,
                customer_id: customer.id,
                amount: 1000,
                expiry: 222,
                currency: 'NGN',
                account_type: 'static',
                meta: {},
                narration: 'Test virtual account',
                bvn: '12345678901',
                nin: '12345678901',
                customer_account_number: '1234567890',
                merchant_vat_amount: 50
            }, traceId)

            expect(account).toBeDefined()
            expect(account.id).toBeDefined()
            expect(account.reference).toBe(trX)
            expect(account.account_number).toBeDefined()
            expect(account.currency).toBe('NGN')

            virtualAccountId = account.id
        })

        it('should list virtual accounts', async () => {
            const result = await flutterwave.api.virtualAccounts.list({
                page: 1,
                size: 10
            }, traceId)

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
            expect(Array.isArray(result.data)).toBe(true)
            expect(result.meta).toBeDefined()
        })

        it('should retrieve a virtual account', async () => {
            if (!virtualAccountId) return
            const account = await flutterwave.api.virtualAccounts.retrieve(
                virtualAccountId,
                traceId
            )

            expect(account).toBeDefined()
            expect(account.id).toBe(virtualAccountId)
            expect(account.account_number).toBeDefined()
        })

        it('should update a virtual account', async () => {
            if (!virtualAccountId) return
            const updated = await flutterwave.api.virtualAccounts.update(
                virtualAccountId,
                {
                    action_type: 'update_bvn',
                    bvn: '12345678901',
                },
                traceId
            )

            expect(updated).toBeDefined()
            expect(updated.id).toBe(virtualAccountId)
        })
    })

    describe('Wallets', () => {
        it('should resolve wallet account', async () => {
            const resolved = await flutterwave.api.wallets.accountResolve({
                provider: 'flutterwave',
                identifier: '00118468'
            }, traceId)

            expect(resolved).toBeDefined()
            expect(resolved.identifier).toBe('00118468')
            expect(resolved.provider).toBeDefined()
            expect(resolved.name).toBeDefined()
        })

        it.skip('should get wallet statement', async () => {
            const result = await flutterwave.api.wallets.statement({
                page: 1,
                size: 10,
                currency: 'NGN'
            }, traceId)

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
            expect(Array.isArray(result.data)).toBe(true)
            expect(result.meta).toBeDefined()
        })

        it('should get balance for a specific currency', async () => {
            const balance = await flutterwave.api.wallets.balance('NGN', traceId)

            expect(balance).toBeDefined()
            expect(balance.currency).toBe('NGN')
            expect(balance.available_balance).toBeDefined()
        })

        it('should get balances for all currencies', async () => {
            const balances = await flutterwave.api.wallets.balances(traceId)

            expect(balances).toBeDefined()
            expect(Array.isArray(balances)).toBe(true)

            if (balances.length > 0) {
                expect(balances[0].currency).toBeDefined()
                expect(balances[0].available_balance).toBeDefined()
            }
        })
    })
})