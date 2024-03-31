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
        null: string;
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
        null: '#1a12b3',
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

interface result {
    value: RegExpMatchArray;
    type: string;
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

    let C = structuredClone(code);

    let found: result[] = [];

    // find all comments
    languageDefinition.comment.forEach((commentMatcher) => {
        for (const comment of C.matchAll(commentMatcher)) {
            found.push({value: comment, type: "comment"});
        }

        C = C.replaceAll(commentMatcher, "");
    });

    // Find all strings
    languageDefinition.literals.string.forEach((stringMatcher) => {
        for (const string of C.matchAll(stringMatcher)) {
            found.push({value: string, type: "string"});
        }
        // We dont need to check overlapping strings because they will both be given the same color anyways.
        C = C.replaceAll(stringMatcher, "");
    });

    // find other literals
    // numeric literals
    languageDefinition.literals.number.forEach((numberMatcher) => {
        for (const number of C.matchAll(numberMatcher)) {
            found.push({value: number, type: "number"});
        }
        C = C.replaceAll(numberMatcher, "");
    });
    // boolean literals
    languageDefinition.literals.boolean.forEach((booleanMatcher) => {
        for (const boolean of C.matchAll(booleanMatcher)) {
            found.push({value: boolean, type: "boolean"});
        }
        C = C.replaceAll(booleanMatcher, "");
    });
    // null literals
    languageDefinition.literals.null.forEach((nullMatcher) => {
        for (const nullLiteral of C.matchAll(nullMatcher)) {
            found.push({value: nullLiteral, type: "null"});
        }
        C = C.replaceAll(nullMatcher, "");
    });

    // find operators
    languageDefinition.operator.forEach((operatorMatcher) => {
        for (const operator of C.matchAll(operatorMatcher)) {
            found.push({value: operator, type: "operator"});
        }
        C = C.replaceAll(operatorMatcher, "");
    });

    // find seperators
    languageDefinition.separator.forEach((separatorMatcher) => {
        for (const separator of C.matchAll(separatorMatcher)) {
            found.push({value: separator, type: "separator"});
        }
        C = C.replaceAll(separatorMatcher, "");
    });

    // find keywords
    languageDefinition.keyword.forEach((keywordMatcher) => {
        for (const keyword of C.matchAll(keywordMatcher)) {
            found.push({value: keyword, type: "keyword"});
        }
        C = C.replaceAll(keywordMatcher, "");
    });

    // find identifiers
    languageDefinition.identifier.forEach((identifierMatcher) => {
        for (const identifier of C.matchAll(identifierMatcher)) {
            found.push({value: identifier, type: "identifier"});
        }
        C = C.replaceAll(identifierMatcher, "");
    });

    // New lines in html are made with <br> tags. So we match newlines seperately.
    for(const newline of C.matchAll(/\n\r|\n/g)) {
        found.push({value: newline, type: "newline"});
    }

    // We want the code to be the same in the source as in the result,
    // so we are also matching any unmatched whitespace.
    for (const whitespace of C.matchAll(/\s+?/g)) {
        found.push({value: whitespace, type: "whitespace"});
    }

    // For the same reason we will also match any other unmatched characters.
    for (const character of C.matchAll(/\S+/g)) {
        found.push({value: character, type: "character"});
    }

    // At this point, everything should be matched and removed.
    // If not the code has a syntax error.
    if (C.trim().length > 0) {
        console.warn(`Syntax error in code: ${code}\nNot everything was matched!`);
    }

    const highlighted = "";

    // Sort all found values by where in the code they should be.
    found = found.sort((a, b) => {
        return (a.value.index || 0) - (b.value.index || 0);
    });

    return highlighted;
}

export { registerLanguage, LanguageDefinition, Language };


/**
 * Importing default languages.
 * Any non default language can be imported in the file that uses it.
*/
import "./JavaScript.js"
