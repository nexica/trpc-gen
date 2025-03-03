/**
 * String extension utilities
 */

declare global {
    interface String {
        /**
         * Converts a string to camelCase
         * @returns The string in camelCase format
         */
        toCamelCase(): string
    }
}

String.prototype.toCamelCase = function (): string {
    const str = this.toString()
    if (str.length <= 1) return str.toLowerCase()
    const words = str.split(/(?=[A-Z])/)
    const firstWord = words[0].toLowerCase()
    const restWords = words.slice(1)
    return firstWord + restWords.join('')
}

// Export an empty object to make this a module
export {}
