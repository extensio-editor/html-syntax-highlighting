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

/**
 * A interface for results it finds in code.
 * @property {RegExpMatchArray} velue - The value that was found.
 * @property {string} type - The type of the value.
 * @property {number} index - The computed index of the value as it would be in the code instead of in the code with removed matches.
 */
interface result {
    value: RegExpMatchArray;
    type: string;
    index: number;
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
            // Dont need to ajust index since nothing has been removed from C yet
            found.push({value: comment, type: "comment", index: comment.index!});
        }

        C = C.replaceAll(commentMatcher, "");
    });

    // Find all strings
    languageDefinition.literals.string.forEach((stringMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const string of C.matchAll(stringMatcher)) {
            partialFound.push({value: string, type: "string", index: string.index!});
        }
        for (const string of code.matchAll(stringMatcher)) {
            fullFound.push({value: string, type: "string", index: string.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            if (!fullFound[i]) {
                throw new Error("Something went wrong!");
            }

            if (partialFound[i].value[0] === fullFound[i].value[0]) {
                found.push({value: partialFound[i].value, type: "string", index: fullFound[i].index});
            } else {
                fullFound.splice(i, 1);
                i -= 1;
            }
        }

        // We dont need to check overlapping strings because they will both be given the same color anyways.
        C = C.replaceAll(stringMatcher, "");
    });

    // find other literals
    // numeric literals
    languageDefinition.literals.number.forEach((numberMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const number of C.matchAll(numberMatcher)) {
            partialFound.push({value: number, type: "number", index: number.index!});
        }
        for (const number of code.matchAll(numberMatcher)) {
            fullFound.push({value: number, type: "number", index: number.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            if (!fullFound[i]) {
                throw new Error("Something went wrong!");
            }

            if (partialFound[i].value[0] === fullFound[i].value[0]) {
                found.push({value: partialFound[i].value, type: "number", index: fullFound[i].index});
            } else {
                fullFound.splice(i, 1);
                i -= 1;
            }
        }
        C = C.replaceAll(numberMatcher, "");
    });
    // boolean literals
    languageDefinition.literals.boolean.forEach((booleanMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const boolean of C.matchAll(booleanMatcher)) {
            partialFound.push({value: boolean, type: "boolean", index: boolean.index!});
        }
        for (const boolean of code.matchAll(booleanMatcher)) {
            fullFound.push({value: boolean, type: "boolean", index: boolean.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            if (!fullFound[i]) {
                throw new Error("Something went wrong!");
            }

            if (partialFound[i].value[0] === fullFound[i].value[0]) {
                found.push({value: partialFound[i].value, type: "boolean", index: fullFound[i].index});
            } else {
                fullFound.splice(i, 1);
                i -= 1;
            }
        }
        C = C.replaceAll(booleanMatcher, "");
    });
    // null literals
    languageDefinition.literals.null.forEach((nullMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const nullLiteral of C.matchAll(nullMatcher)) {
            partialFound.push({value: nullLiteral, type: "null", index: nullLiteral.index!});
        }
        for (const nullLiteral of code.matchAll(nullMatcher)) {
            fullFound.push({value: nullLiteral, type: "nullLiteral", index: nullLiteral.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            if (!fullFound[i]) {
                throw new Error("Something went wrong!");
            }

            if (partialFound[i].value[0] === fullFound[i].value[0]) {
                found.push({value: partialFound[i].value, type: "nullLiteral", index: fullFound[i].index});
            } else {
                fullFound.splice(i, 1);
                i -= 1;
            }
        }
        C = C.replaceAll(nullMatcher, "");
    });

    // find operators
    languageDefinition.operator.forEach((operatorMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const operator of C.matchAll(operatorMatcher)) {
            partialFound.push({value: operator, type: "operator", index: operator.index!});
        }
        for (const operator of code.matchAll(operatorMatcher)) {
            fullFound.push({value: operator, type: "operator", index: operator.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            if (!fullFound[i]) {
                throw new Error("Something went wrong!");
            }

            if (partialFound[i].value[0] === fullFound[i].value[0]) {
                found.push({value: partialFound[i].value, type: "operator", index: fullFound[i].index});
            } else {
                fullFound.splice(i, 1);
                i -= 1;
            }
        }
        C = C.replaceAll(operatorMatcher, "");
    });

    // find seperators
    languageDefinition.separator.forEach((separatorMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const separator of C.matchAll(separatorMatcher)) {
            partialFound.push({value: separator, type: "separator", index: separator.index!});
        }
        for (const separator of code.matchAll(separatorMatcher)) {
            fullFound.push({value: separator, type: "separator", index: separator.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            if (!fullFound[i]) {
                throw new Error("Something went wrong!");
            }

            if (partialFound[i].value[0] === fullFound[i].value[0]) {
                found.push({value: partialFound[i].value, type: "separator", index: fullFound[i].index});
            } else {
                fullFound.splice(i, 1);
                i -= 1;
            }
        }
        C = C.replaceAll(separatorMatcher, "");
    });

    // find keywords
    languageDefinition.keyword.forEach((keywordMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const keyword of C.matchAll(keywordMatcher)) {
            partialFound.push({value: keyword, type: "keyword", index: keyword.index!});
        }
        for (const keyword of code.matchAll(keywordMatcher)) {
            fullFound.push({value: keyword, type: "keyword", index: keyword.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            if (!fullFound[i]) {
                throw new Error("Something went wrong!");
            }

            if (partialFound[i].value[0] === fullFound[i].value[0]) {
                found.push({value: partialFound[i].value, type: "keyword", index: fullFound[i].index});
            } else {
                fullFound.splice(i, 1);
                i -= 1;
            }
        }
        C = C.replaceAll(keywordMatcher, "");
    });

    // find identifiers
    languageDefinition.identifier.forEach((identifierMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const identifier of C.matchAll(identifierMatcher)) {
            partialFound.push({value: identifier, type: "identifier", index: identifier.index!});
        }
        for (const identifier of code.matchAll(identifierMatcher)) {
            fullFound.push({value: identifier, type: "identifier", index: identifier.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            if (!fullFound[i]) {
                throw new Error("Something went wrong!");
            }

            if (partialFound[i].value[0] === fullFound[i].value[0]) {
                found.push({value: partialFound[i].value, type: "identifier", index: fullFound[i].index});
            } else {
                fullFound.splice(i, 1);
                i -= 1;
            }
        }
        C = C.replaceAll(identifierMatcher, "");
    });

    // New lines in html are made with <br> tags. So we match newlines seperately.
    let fullFound: result[] = [];
    let partialFound: result[] = [];
    for(const newline of C.matchAll(/\n\r|\n/g)) {
        partialFound.push({value: newline, type: "newline", index: newline.index!});
    }
    for (const newline of code.matchAll(/\n\r|\n/g)) {
        fullFound.push({value: newline, type: "newline", index: newline.index!});
    }
    for (let i = 0; i < partialFound.length; i++) {
        found.push({value: partialFound[i].value, type: "newline", index: fullFound[i].index});
    }

    // We want the code to be the same in the source as in the result,
    // so we are also matching any unmatched whitespace.
    fullFound = [];
    partialFound = [];
    for(const whitespace of C.matchAll(/\s+?/g)) {
        partialFound.push({value: whitespace, type: "whitespace", index: whitespace.index!});
    }
    for (const whitespace of code.matchAll(/\s+?/g)) {
        fullFound.push({value: whitespace, type: "whitespace", index: whitespace.index!});
    }
    for (let i = 0; i < partialFound.length; i++) {
        found.push({value: partialFound[i].value, type: "whitespace", index: fullFound[i].index});
    }

    // For the same reason we will also match any other unmatched characters.
    fullFound = [];
    partialFound = [];
    for(const character of C.matchAll(/\S+/g)) {
        partialFound.push({value: character, type: "character", index: character.index!});
    }
    for (const character of code.matchAll(/\S+/g)) {
        fullFound.push({value: character, type: "character", index: character.index!});
    }
    for (let i = 0; i < partialFound.length; i++) {
        found.push({value: partialFound[i].value, type: "character", index: fullFound[i].index});
    }

    // At this point, everything should be matched and removed.
    // If not the code has a syntax error.
    if (C.trim().length > 0) {
        console.warn(`Syntax error in code: ${code}\nNot everything was matched!`);
    }

    const highlighted = "";

    // Sort all found values by where in the code they should be.
    found = found.sort((a, b) => {
        return (a.index || 0) - (b.index || 0);
    });
    
    return highlighted;
}

export { registerLanguage, LanguageDefinition, Language };


/**
 * Importing default languages.
 * Any non default language can be imported in the file that uses it.
*/
import "./JavaScript.js"
