export declare const kebabToPascalCase: (str: string) => string;
export declare const kebabToCamelCase: (str: string) => string;
export declare const eventListenerName: (eventName: string) => string;
/**
 * Normalizes a type string by removing single-line comments and collapsing whitespace.
 * This is necessary because multiline types with comments would break when collapsed to a single line.
 */
export declare const normalizeTypeString: (type: string) => string;
