import { Language, LanguageDefinition, getLanguages, registerLanguage,  } from "./languageManager.js";

/**
 * @property {string} language - The language that the string should be highlighted as, Default is javascript.
 * @property {string} tailwind - Wether or not to use Tailwind CSS, Default is false.
 * @property {HighlighterColors} colors - The colors that should be used for highlighting.
 */
export interface SyntaxHighlighterOptions {
    language?: string;
    tailwind?: boolean;
    colors?: HighlighterColors;
}

/**
 * The colors for the syntax highlighter.
 * Colors can be in any format css supports when not using tailwind.
 * When using tailwind it can be any tailwind color found at https://tailwindcss.com/docs/text-color without the "text-" part.
 * View what types are what on https://en.wikipedia.org/wiki/Lexical_analysis#Lexical_token_and_lexical_tokenization
 */
export interface HighlighterColors {
    identifier: string;
    keyword: string;
    separator: string;
    operator: string;
    literals: {
        boolean: string;
        number: string;
        string: string;
    };
    comment: string;
}

/**
 * The default color scheme for the syntax highlighter.
 * Values are picked generically based on what we thought looked good.
 */
const defaultColors: HighlighterColors = {
    identifier: '#80dbdd',
    keyword: '#7e43d1',
    separator: '#d4d4d4',
    operator: '#7ce6ba',
    literals: {
        boolean: '#1a12b3',
        number: '#3d73f2',
        string: '#f5a973',
    },
    comment: '#0f4503',
};

/**
 * Gets a language definition for a given language name.
 * @param language The language name to get the language definition for.
 * @returns The language definition.
 */
export function getLanguageDefinition(language: string): LanguageDefinition {
    let languages = getLanguages()
    languages = languages.filter((lang: Language) => {
        return lang.name.toUpperCase() === language.toUpperCase();
    });

    if (languages.length > 1) {
        console.warn(`Multiple languages found with the name ${language}, Using the first one found.`);
    }

    if (languages.length === 0) {
        console.warn(`No language found with the name ${language}.`);
        return {
            identifier: [] as RegExp[],
            keyword: [] as RegExp[],
            separator: [] as RegExp[],
            operator: [] as RegExp[],
            literals: {
                boolean: [] as RegExp[],
                number: [] as RegExp[],
                string: [] as RegExp[],
                null: [] as RegExp[],
            },
            comment: [] as RegExp[],
        } as LanguageDefinition;
    }

    return languages[0].defenition;
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
    options.colors = options.colors || defaultColors;

    // Get the language definition based of the language.
    const languageDefinition = getLanguageDefinition(options.language);

    // FOR TESTING PURPOSES
    // TODO: Remove this
    // TODO: Add unit tests instead
    console.log(languageDefinition);

    return code;
}

export { registerLanguage, LanguageDefinition, Language };


/**
 * Importing default languages.
 * Any non default language can be imported in the file that uses it.
*/
import "./JavaScript.js"
