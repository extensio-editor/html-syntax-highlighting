/**
 * @property {string} language - The language that the string should be highlighted as, Default is javascript.
 * @property {string} tailwind - Wether or not to use Tailwind CSS, Default is false.
 */
export interface SyntaxHighlighterOptions {
    language?: string;
    tailwind?: boolean;
}

/**
 * The colors for the syntax highlighter.
 * Colors can be in any format css supports when not using tailwind.
 * When using tailwind it can be any tailwind color found at https://tailwindcss.com/docs/text-color without the "text-" part.
 * View what types are what on https://en.wikipedia.org/wiki/Lexical_analysis#Lexical_token_and_lexical_tokenization
 */
export interface HighlighterColors {
    identifier?: string;
    keyword?: string;
    separator?: string;
    operator?: string;
    literals?: {
        boolean?: string;
        number?: string;
        string?: string;
    };
    comment?: string;
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
