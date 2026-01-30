export interface GeneralError {
    /**
     * The request was rejected due to invalid parameters or missing data.
     */
    REQUEST_NOT_VALID: '10400'
    /**
     * The request requires authentication or has invalid credentials.
     */
    UNAUTHORIZATION: '10401'
    /**
     * The client does not have permission to access the resource.
     */
    FORBIDDEN: '10403'
    /**
     * The requested resource could not be found on the server.
     */
    RESOURCE_NOT_FOUND: '10404'
    /**
     * A conflict occurred due to duplicate or conflicting data.
     */
    RESOURCE_CONFLICT: '10409'
    /**
     * The request was well-formed but contained invalid data.
     */
    UNPROCESSABLE: '10422'
    /**
     * An unexpected server error occurred while processing the request.
     */
    INTERNAL_SERVER_ERROR: '10500'

    /**
     * An unknown error occurred.
     */
    UNKNOWN_ERROR: '000000'

    /**
     * The request is missing required parameters or has invalid formatting.
     */
    INVALID_REQUEST: '000001'
}

export interface PaymentError {
    /**
     * The request was rejected due to invalid parameters or missing data.
     */
    REQUEST_NOT_VALID: '10400'

    /**
     * The request requires authentication or has invalid credentials.
     */
    UNAUTHORIZED: '10401'

    /**
     * The client does not have permission to access the resource.
     */
    FORBIDDEN: '10403'

    /**
     * The requested resource could not be found on the server.
     */
    RESOURCE_NOT_FOUND: '10404'

    /**
     * You used GET instead of POST (or vice versa).
     */
    METHOD_NOT_ALLOWED: '10405'

    /**
     * Attempt to create an existing resource or version conflict.
     */
    RESOURCE_CONFLICT: '10409'

    /**
     * Failed validation due to incorrect or incomplete fields.
     */
    UNPROCESSABLE: '10422'

    /**
     * System failure or unhandled exceptions.
     */
    INTERNAL_SERVER_ERROR: '10500'

    /**
     * The pagination parameters (page, limit) are formatted incorrectly.
     */
    INVALID_PAGINATION_TYPE: '701500'

    /**
     * You are reusing a transaction reference that has already been used.
     */
    CHARGE_ALREADY_EXISTS: '1100409'

    /**
     * The customer_id provided does not exist.
     */
    CUSTOMER_NOT_FOUND_FOR_CHARGE: '1101422'

    /**
     * The payment_method_id is invalid or does not belong to this customer.
     */
    PAYMENT_METHOD_NOT_FOUND_FOR_CHARGE: '1102422'

    /**
     * You sent raw card data to an endpoint expecting a token/nonce.
     */
    CARD_NOT_TOKENIZED: '1104400'

    /**
     * General processing failure from the upstream provider.
     */
    CHARGE_FAILED: '1105500'

    /**
     * The request body is missing the type field (e.g., card, bank_transfer).
     */
    PAYMENT_METHOD_TYPE_MISSING: '1106400'

    /**
     * System error during the initialization of the charge. Kindly retry.
     */
    CHARGE_CREATION_FAILED: '1107500'

    /**
     * The encryption or token used is invalid or expired.
     */
    CARD_RETOKENIZATION_REQUIRED: '1108400'

    /**
     * The charge ID provided does not exist.
     */
    CHARGE_NOT_FOUND: '1110404'

    /**
     * You cannot update or retry a transaction that is already successful or failed.
     */
    CHARGE_FINALIZED: '1111400'

    /**
     * The current state of the charge does not allow modification.
     */
    CHARGE_UPDATE_NOT_ALLOWED: '1112400'

    /**
     * System error during the update process.
     */
    CHARGE_UPDATE_FAILED: '1113500'

    /**
     * Internal configuration error regarding the merchant account.
     */
    ACCOUNT_ID_NOT_FOUND: '1114400'

    /**
     * The card number length is incorrect or failed the Luhn check.
     */
    INVALID_CARD_NUMBER: '1118400'

    /**
     * The payment provider rejected the initialization request.
     */
    FAILED_TO_INITIATE_CHARGE: '1119500'

    /**
     * The PIN or OTP provided is incorrect.
     */
    INVALID_AUTHORIZATION: '1121400'

    /**
     * An error occurred while checking the status of a previous transaction.
     */
    FAILED_TO_VALIDATE_EXISTING_CHARGE: '1122400'

    /**
     * Currency not supported for payment type
     * Example: Trying to use UGX with a payment method that only supports NGN.
     */
    CURRENCY_NOT_SUPPORTED: '1125400'

    /**
     * The country code provided is not valid for mobile money.
     */
    MOBILE_MONEY_COUNTRY_CODE_NOT_SUPPORTED: '1126400'

    /**
     * Network not supported for Mobile Money.	
     * The network (e.g., MTN, Airtel) is not supported in the selected region.
     */
    MOBILE_MONEY_NETWORK_NOT_SUPPORTED: '1127400'

    /**
     * Payment card details tokenization failed	Encryption failed. 
     * Check your encryption keys and logic.
     */
    PAYMENT_CARD_TOKENIZATION_FAILED: '1128500'

    /**
     * Amount below the minimum for the payment type	
     * The transaction amount is too small to be processed.
     */
    AMOUNT_BELOW_MINIMUM: '1130400'

    /**
     * The Card has expired	
     * 
     * The expiry date on the card is due.
     */
    CARD_EXPIRED: '1134422'

    /**
     * Card expiry year out of range	
     * 
     * The card expiry year provided is invalid.
     */
    CARD_EXPIRY_YEAR_OUT_OF_RANGE: '1135422'

    /**
     * Card expiry month out of range	
     * 
     * The card expiry month provided is not between 01 and 12.
     */
    CARD_EXPIRY_MONTH_OUT_OF_RANGE: '1136422'

    /**
     * Unable to decrypt encrypted fields	
     * 
     * The encryption logic is incorrect, or the wrong encryption key was used.
     */
    CLIENT_ENCRYPTION_ERROR: '1137400'

    /**
     * Unprocessable F4B response	
     * 
     * An error was received from the banking partner system.
     */
    UNPROCESSABLE_F4B_RESPONSE: '1138422'

    /**
     * Unprocessable CC response	
     * 
     * An error was received from the card network/scheme.
     */
    UNPROCESSABLE_CC_RESPONSE: '1139422'

    /**
     * The charge is not successful.	
     * 
     * The transaction was declined by the bank or failed fraud checks.
     */
    CHARGE_NOT_SUCCESSFUL: '1140400'

    /**
     * Redirect URL is invalid.	
     * 
     * The redirect URL format is incorrect.
     */
    REDIRECT_URL_INVALID: '1141400'

    /**
     * Invalid bank code	
     * 
     * The USSD bank code provided is incorrect
     */
    USSD_BANK_CODE_INVALID: '1142400'

    /**
     * Please use the /virtual-accounts resource	
     * 
     * You are attempting to create a bank transfer using the wrong endpoint.
     */
    INVALID_CHARGE: '1150400'

    /**
     * Order with reference already exists	
     * 
     * Duplicate order reference.
     */
    ORDER_ALREADY_EXISTS: '1100409'

    /**
     * Customer not found for the order	
     * 
     * The customer_id attached to the order is invalid.
     */
    CUSTOMER_NOT_FOUND_FOR_ORDER: '1101422'

    /**
     * Payment method not found for order	
     * 
     * The payment_method_id attached to the order is invalid.
     */
    PAYMENT_METHOD_NOT_FOUND_FOR_ORDER: '1102422'

    /**
     * The Order ID provided does not exist.
     */
    ORDER_NOT_FOUND: '1110404'

    /**
     * You cannot modify an order that is already completed.
     */
    ORDER_FINALIZED: '1111400'

    /**
     * The order state does not allow updates.
     */
    ORDER_UPDATE_NOT_ALLOWED: '1112400'

    /**
     * You cannot capture more funds than were authorized.
     */
    CAPTURE_AMOUNT_INVALID: '1143400'

    /**
     * The payment method in the charge request differs from the Order.
     */
    PAYMENT_METHOD_MISMATCH: '1144400'

    /**
     * The customer in the charge request differs from the Order.
     */
    CUSTOMER_MISMATCH: '1144400'

    /**
     * The currency in the charge request differs from the Order.
     */
    CURRENCY_MISMATCH: '1144400'

    /**
     * The order is not in a state (e.g., authorized) that allows capture/void.
     */
    CAPTURE_VOID_NOT_ALLOWED: '1145400'

    /**
     * The payment method provided is not valid for this order type.
     */
    PAYMENT_METHOD_INVALID: '1145400'

    /**
     * The Refund ID provided does not exist.
     */
    REFUND_NOT_FOUND: '1401404'

    /**
     * You are attempting to refund more than the original transaction value.
     */
    REFUND_AMOUNT_INVALID: '1402400'

    /**
     * You must wait for the transaction to be successful before refunding.
     */
    REFUND_CREATION_FAILED: '1403400'

    /**
     * The transaction has already been fully refunded.
     */
    REFUND_ALREADY_COMPLETED: '1404400'

    /**
     * The Settlement ID provided does not exist.
     */
    SETTLEMENT_NOT_FOUND: '1500404'

    /**
     * The URL provided is not a valid HTTP/HTTPS URL.
     */
    WEBHOOK_URL_INVALID: '1600400'

    /**
     * No webhook configuration exists for this account.
     */
    WEBHOOK_ENDPOINT_NOT_FOUND: '1601404'

    /**
     * Error communicating with the webhook provider (Svix).
     */
    UNPROCESSABLE_SVIX_RESPONSE: '1602422'

    /**
     * System failure with the webhook provider.
     */
    INTERNAL_SERVER_ERROR_SVIX: '1603500'

    /**
     * The Chargeback ID provided does not exist.
     */
    CHARGEBACK_NOT_FOUND: '1700404'

    /**
     * You rejected a chargeback without providing evidence.
     */
    CHARGEBACK_DECLINE_INVALID: '1703400'

    /**
     * The file uploaded is corrupted or in an unsupported format.
     */
    CHARGEBACK_PROOF_INVALID: '1704400'

    /**
     * System error during file upload.
     */
    CHARGEBACK_PROOF_UPLOAD_FAILED: '1705500'

    /**
     * The deadline for responding to this chargeback has passed.
     */
    CHARGEBACK_DUE_DATE_INVALID: '1706400'

    /**
     * The amount specified does not match the dispute amount.
     */
    CHARGEBACK_AMOUNT_INVALID: '1707400'

    /**
     * A dispute is already in progress for this transaction.
     */
    CHARGEBACK_HAS_EXISTING_CHARGE: '1708400'

    /**
     * The session ID provided does not exist or has expired.
     */
    CHECKOUT_SESSION_NOT_FOUND: '1800404'

    /**
     * Duplicate session reference.
     */
    CHECKOUT_SESSION_ALREADY_EXISTS: '1801409'

    /**
     * The Virtual Account reference provided does not exist.
     */
    VIRTUAL_ACCOUNT_NOT_FOUND: '1900404'

    /**
     * You are reusing a reference for a new virtual account.
     */
    VIRTUAL_ACCOUNT_REFERENCE_ALREADY_EXISTS: '1900409'

    /**
     * System error during account update.
     */
    VIRTUAL_ACCOUNT_UPDATE_FAILED: '1900500'
    /**
     * System error during account creation.
     */
    FAILED_TO_CREATE_VIRTUAL_ACCOUNT: '1900500'

    /**
     * The provider took too long to generate the account. Retry.
     */
    VIRTUAL_ACCOUNT_CREATE_TIMEOUT: '10503'

    /**
     * The virtual account is already inactive
     */
    VIRTUAL_ACCOUNT_IS_ALREADY_INACTIVE: '19400'
}

export interface PayoutError {
    /**
     * The transfer amount exceeds the allowed limit.	
     * The amount you are trying to transfer exceeds the maximum allowed limit for a single transfer.
     */
    TRANSFER_AMOUNT_EXCEEDS_LIMIT: '0301'

    /**
     * The transfer amount is below the minimum amount required.	
     * You are trying to transfer an amount that is below the minimum allowed amount.
     */
    TRANSFER_AMOUNT_BELOW_LIMIT: '0302'

    /**
     * You have exceeded your monthly transfer limit.	
     * You have reached the cumulative value of transfers allowed for your account in a single month.
     */
    MONTHLY_TRANSFER_LIMIT_EXCEEDED: '0303'

    /**
     * The daily transfer limit has been reached.	
     * You have reached the cumulative value of transfers allowed on your account in a day.
     */
    DAILY_TRANSFER_LIMIT_EXCEEDED: '0304'

    /**
     * The transfer limit has not been set for this currency.	
     * There is no configured transfer limit for the specified currency. Kindly contact support.
     */
    TRANSFER_LIMIT_NOT_SET_FOR_CURRENCY: '0305'

    /**
     * An error occurred while creating the payout.	
     * Temporary service timeout. Kindly retry again.
     */
    PAYOUT_CREATION_FAILED: '0306'

    /**
     * You do not have sufficient funds.
     * Your wallet does not have sufficient funds to cover the transfer amount and the applicable fee.
     */
    INSUFFICIENT_BALANCE: '0307'

    /**
     * The service is temporarily unavailable.
     * Bank maintenance or network downtime
     */
    SERVICE_UNAVAILABLE: '0308'

    /**
     * We encountered an issue processing your transfer.
     * The destination account is closed or dormant, Network failure during processing.
     */
    TRANSFER_FAILED: '0309'

    /**
     * 	Pricing has not been set.The transfer fee could not be determined.Kindly contact support.
     */
    PRICING_NOT_SET: '0310'

    /**
     * Currency conversion has not been configured.
     * You are attempting a cross - currency transfer(e.g., USD Wallet to NGN Bank), but the exchange rate is not configured.
     * Kindly contact support.
     */
    CURRENCY_CONVERSION_NOT_SET: '0311'

    /**
     * The recipient merchant is not eligible to receive transfers.
     * There are compliance or risk restrictions on the destination account.
     */
    REJECTED_RECIPIENT_MERCHANT: '0312'

    /**
     * The provided bank destination code is invalid.
     * You are passing an incorrect or outdated bank code.
     */
    INVALID_BANK_CODE: '0313'

    /**
     * The country for the provided bank code could not be determined.
     * The bank code format is incorrect.
     * There is a mismatch between the bank code and the expected currency
     */
    UNABLE_TO_DETERMINE_COUNTRY: '0314'
}

export type FlutterwaveErrorType =
    | keyof GeneralError
    | keyof PaymentError
    | keyof PayoutError

export type FlutterwaveErrorValue =
    | GeneralError[keyof GeneralError]
    | PaymentError[keyof PaymentError]
    | PayoutError[keyof PayoutError]