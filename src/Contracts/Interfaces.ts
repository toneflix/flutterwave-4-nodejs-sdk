export interface XGenericObject {
    [key: string]: any
}

export interface CardDetails {
    expiry_month: string,
    expiry_year: string,
    card_number: string,
    cvv: string
}

export type EncryptedCardDetails = {
    [K in keyof CardDetails as `encrypted_${K}`]: string;
} & { nonce: string };

export interface WebhookValidatorOptions {
    hashAlgorithm?: 'sha256' | 'sha512' | 'sha1';
    encoding?: 'base64' | 'hex';
}