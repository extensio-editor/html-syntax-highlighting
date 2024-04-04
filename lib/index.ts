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
 * (These values were picked by chatgpt, I dont really like them but it'll do for now)
 */
const defaultColors: HighlighterColors = {
    identifier: '#7eaacc',
    keyword: '#ff7f0e',
    separator: '#dcdcdc',
    operator: '#2ca02c',
    literals: {
        boolean: '#9467bd',
        number: '#1f77b4',
        string: '#ffbb78',
        null: '#d62728',
    },
    comment: '#808080',
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
    C = C.replaceAll("<", "&lt;");
    C = C.replaceAll(">", "&gt;");

    let found: result[] = [];

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
            found.push({ value: partialFound[i].value, type: "string", index: partialFound[i].index });
        }

        // We dont need to check overlapping strings because they will both be given the same color anyways.
        C = C.replaceAll(stringMatcher, (match) => "Ø".repeat(match.length));
    });

    // find all comments
    languageDefinition.comment.forEach((commentMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const comment of C.matchAll(commentMatcher)) {
            partialFound.push({value: comment, type: "comment", index: comment.index!});
        }
        for (const comment of code.matchAll(commentMatcher)) {
            fullFound.push({value: comment, type: "comment", index: comment.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            found.push({value: partialFound[i].value, type: "comment", index: partialFound[i].index});
        }

        C = C.replaceAll(commentMatcher, (match) => "Ø".repeat(match.length));
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
            found.push({value: partialFound[i].value, type: "keyword", index: partialFound[i].index});
        }
        C = C.replaceAll(keywordMatcher, (match) => "Ø".repeat(match.length));
    });

    // find identifiers
    languageDefinition.identifier.forEach((identifierMatcher) => {
        let fullFound: result[] = [];
        let partialFound: result[] = [];
        for (const identifier of C.matchAll(identifierMatcher)) {
            partialFound.push({value: identifier, type: "identifier", index: identifier.index!});
        }
        for (const identifier of C.matchAll(identifierMatcher)) {
            fullFound.push({value: identifier, type: "identifier", index: identifier.index!});
        }
        for (let i = 0; i < partialFound.length; i++) {
            found.push({value: partialFound[i].value, type: "identifier", index: partialFound[i].index});
        }
        C = C.replaceAll(identifierMatcher, (match) => "Ø".repeat(match.length));
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
            found.push({value: partialFound[i].value, type: "number", index: partialFound[i].index});
        }
        C = C.replaceAll(numberMatcher, (match) => "Ø".repeat(match.length));
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
            found.push({value: partialFound[i].value, type: "boolean", index: partialFound[i].index});
        }
        C = C.replaceAll(booleanMatcher, (match) => "Ø".repeat(match.length));
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
            found.push({value: partialFound[i].value, type: "nullLiteral", index: partialFound[i].index});
        }
        C = C.replaceAll(nullMatcher, (match) => "Ø".repeat(match.length));
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
            found.push({value: partialFound[i].value, type: "operator", index: partialFound[i].index});
        }
        C = C.replaceAll(operatorMatcher, (match) => "Ø".repeat(match.length));
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
            found.push({value: partialFound[i].value, type: "separator", index: partialFound[i].index});
        }
        C = C.replaceAll(separatorMatcher, (match) => "Ø".repeat(match.length));
    });

    // New lines in html are ignored but must still be replaced out.
    C = C.replaceAll(/\n\r|\n/g, (match) => "Ø".repeat(match.length));

    // We want the code to be the same in the source as in the result,
    // so we are also matching any unmatched whitespace.
    let fullFound: result[] = [];
    let partialFound: result[] = [];
    for(const whitespace of C.matchAll(/\s+?/g)) {
        partialFound.push({value: whitespace, type: "whitespace", index: whitespace.index!});
    }
    for (const whitespace of code.matchAll(/\s+?/g)) {
        fullFound.push({value: whitespace, type: "whitespace", index: whitespace.index!});
    }
    for (let i = 0; i < partialFound.length; i++)
       { found.push({value: partialFound[i].value, type: "whitespace", index: partialFound[i].index});
    }
    C = C.replaceAll(/\s+?/g, (match) => "Ø".repeat(match.length));

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
    C = C.replaceAll(/\S+/g, (match) => "Ø".repeat(match.length));

    // At this point, everything should be matched and removed.
    // If not the code has a syntax error.
    // if (C.trim().length > 0) {
    //     console.warn(`Syntax error in cod!\nNot everything was matched!`);
    // }

    // Sort all found values by where in the code they should be.
    found = found.sort((a, b) => {
        return (a.index || 0) - (b.index || 0);
    });

    let highlighted = "";

    // Color the text
    for (const part of found) {
        switch (part.type) {
            case "newline":
                highlighted += "<br>";
                break;
            case "whitespace":
            case "character":
                highlighted += part.value[0];
                break;
            case "identifier":
                !options.tailwind
                    ? highlighted += `<span style="color: ${options.colors.identifier}">${part.value[0]}</span>`
                    : highlighted += `<span class="text-${options.colors.identifier}">${part.value[0]}</span>`;
                break;
            case "keyword":
                !options.tailwind
                    ? highlighted += `<span style="color: ${options.colors.keyword}">${part.value[0]}</span>`
                    : highlighted += `<span class="text-${options.colors.keyword}">${part.value[0]}</span>`;
                break;
            case "separator":
                !options.tailwind
                    ? highlighted += `<span style="color: ${options.colors.separator}">${part.value[0]}</span>`
                    : highlighted += `<span class="text-${options.colors.separator}">${part.value[0]}</span>`;
                break;
            case "operator":
                !options.tailwind
                    ? highlighted += `<span style="color: ${options.colors.operator}">${part.value[0]}</span>`
                    : highlighted += `<span class="text-${options.colors.operator}">${part.value[0]}</span>`;
                break;
            case "boolean":
                !options.tailwind
                    ? highlighted += `<span style="color: ${options.colors.literals.boolean}">${part.value[0]}</span>`
                    : highlighted += `<span class="text-${options.colors.literals.boolean}">${part.value[0]}</span>`;
                break;
            case "number":
                !options.tailwind
                    ? highlighted += `<span style="color: ${options.colors.literals.number}">${part.value[0]}</span>`
                    : highlighted += `<span class="text-${options.colors.literals.number}">${part.value[0]}</span>`;
                break;
            case "string":
                !options.tailwind
                    ? highlighted += `<span style="color: ${options.colors.literals.string}">${part.value[0]}</span>`
                    : highlighted += `<span class="text-${options.colors.literals.string}">${part.value[0]}</span>`;
                break;
            case "null":
                !options.tailwind
                    ? highlighted += `<span style="color: ${options.colors.literals.null}">${part.value[0]}</span>`
                    : highlighted += `<span class="text-${options.colors.literals.null}">${part.value[0]}</span>`;
                break;
            case "comment":
                !options.tailwind
                    ? highlighted += `<span style="color: ${options.colors.comment}">${part.value[0]}</span>`
                    : highlighted += `<span class="text-${options.colors.comment}">${part.value[0]}</span>`;
                break;
            default:
                throw new Error("Something went wrong!");
        }
    }

    return highlighted.replaceAll("Ø", "");
}

export { registerLanguage, LanguageDefinition, Language };


/**
 * Importing default languages.
 * Any non default language can be imported in the file that uses it.
*/
import "./JavaScript.js"
