export type CurrencyCode =
    | 'AED' | 'AFN' | 'ALL' | 'AMD' | 'ANG' | 'AOA' | 'AQD' | 'ARS' | 'AUD' | 'AZN' | 'BAM' | 'BBD' | 'BDT'
    | 'BHD' | 'BIF' | 'BMD' | 'BND' | 'BOB' | 'BRL' | 'BSD' | 'BWP' | 'BYR' | 'BZD' | 'CAD' | 'CDF' | 'CHF'
    | 'CLP' | 'CNY' | 'COP' | 'CRC' | 'CUP' | 'CVE' | 'CYP' | 'CZK' | 'DJF' | 'DKK' | 'DOP' | 'DZD' | 'ECS'
    | 'EEK' | 'EGP' | 'ETB' | 'EUR' | 'FJD' | 'FKP' | 'GBP' | 'GEL' | 'GGP' | 'GHS' | 'GIP' | 'GMD' | 'GNF'
    | 'GTQ' | 'GYD' | 'HKD' | 'HNL' | 'HRK' | 'HTG' | 'HUF' | 'IDR' | 'ILS' | 'INR' | 'IQD' | 'IRR' | 'ISK'
    | 'JMD' | 'JOD' | 'JPY' | 'KES' | 'KGS' | 'KHR' | 'KMF' | 'KPW' | 'KRW' | 'KWD' | 'KYD' | 'KZT' | 'LAK'
    | 'LBP' | 'LKR' | 'LRD' | 'LSL' | 'LTL' | 'LVL' | 'LYD' | 'MAD' | 'MDL' | 'MGA' | 'MKD' | 'MMK' | 'MNT'
    | 'MOP' | 'MRO' | 'MTL' | 'MUR' | 'MVR' | 'MWK' | 'MXN' | 'MYR' | 'MZN' | 'NAD' | 'NGN' | 'NIO' | 'NOK'
    | 'NPR' | 'NZD' | 'OMR' | 'PAB' | 'PEN' | 'PGK' | 'PHP' | 'PKR' | 'PLN' | 'PYG' | 'QAR' | 'RON' | 'RSD'
    | 'RUB' | 'RWF' | 'SAR' | 'SBD' | 'SCR' | 'SDG' | 'SEK' | 'SGD' | 'SKK' | 'SLL' | 'SOS' | 'SRD' | 'STD'
    | 'SVC' | 'SYP' | 'SZL' | 'THB' | 'TJS' | 'TMT' | 'TND' | 'TOP' | 'TRY' | 'TTD' | 'TWD' | 'TZS' | 'UAH'
    | 'UGX' | 'USD' | 'UYU' | 'UZS' | 'VEF' | 'VND' | 'VUV' | 'XAF' | 'XCD' | 'XOF' | 'XPF' | 'YER' | 'ZAR'
    | 'ZMK' | 'ZWD' | 'ZMW' | 'BGN'


export type CountryCode =
    | 'CM' | 'CI' | 'CG' | 'EG' | 'ET' | 'GA' | 'GH' | 'IN' | 'KE' | 'MW' | 'NG' | 'RW'
    | 'SL' | 'SN' | 'TD' | 'TZ' | 'UG' | 'US' | 'ZA' | 'ZM'

export type CountryCodeRestricted =
    | 'CG' | 'CM' | 'CI' | 'EG' | 'ET' | 'GA' | 'GH' | 'KE' | 'MW' | 'RW' | 'SN' | 'TZ' | 'TD'
    | 'UG' | 'ZM'

export type ProviderResponseCode =
    | 'transfer_amount_exceeds_limit' | 'transfer_amount_below_limit' | 'monthly_transfer_limit_exceeded'
    | 'daily_transfer_limit_exceeded' | 'transfer_limit_not_set_for_currency' | 'payout_creation_failed'
    | 'insufficient_balance' | 'service_unavailable' | 'transfer_failed' | 'pricing_not_set'
    | 'currency_conversion_not_set' | 'rejected_recipient_merchant' | 'invalid_bank_code'
    | 'unable_to_determine_country' | 'invalid_wallet_currency'