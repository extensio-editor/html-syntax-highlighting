/**
 * @property {string} language - The language that the string should be highlighted as, Default is javascript.
 * @property {string} tailwind - Wether or not to use Tailwind CSS, Default is false.
 */
export interface SyntaxHighlighterOptions {
    language?: string;
    tailwind?: boolean;
}

/**
 * Highlight code in html syntax
 * @param code The code to be highlighted
 * @param options Options for highlighting
 */
export default function(code: string, options: SyntaxHighlighterOptions) {
    // Set defualts if not set.
    options.language = options.language || "javascript";
    options.tailwind = options.tailwind || false;

    return code;
}