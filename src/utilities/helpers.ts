import path from 'path'

/**
 * Takes a value like the one prodvided in a destructuring assignment where for instance
 * a single value might have been provided as opposed to an array of values and 
 * normalizes it.
 * 
 * Examples:
 * Definition:
 * (...value: string[]) => normalizeValue(value)
 * 
 * Usage:
 * normalizeValue('singleValue') // returns ['singleValue']
 * normalizeValue('value1', 'value2') // returns ['value1', 'value2']
 * normalizeValue(['value1', 'value2']) // returns ['value1', 'value2']
 * 
 * @param value 
 * @returns 
 */
export const normalizeValue = <T> (value: T | T[]) => {
    if (Array.isArray(value)) {
        return value
    }

    return [value]
}

/**
 * Builds a full url based on endpoint provided
 * 
 * @param baseUrl 
 * @param endpoint 
 * 
 * @returns 
 */
export const buildUrl = (baseUrl: string, ...endpoint: string[]) => {
    const url = baseUrl + path.normalize(
        path.join(...normalizeValue(endpoint))
    )

    // Remove any double slashes except the one after the protocol
    const cleanedUrl = url.replace(/([^:]\/)\/+/g, '$1')

    return cleanedUrl
}