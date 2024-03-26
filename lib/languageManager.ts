/**
 * This file is the main manager for languages.
 * Language files register themselves here.
 */

export interface LanguageDefinition {
    identifier: RegExp[];
    keyword: RegExp[];
    separator: RegExp[];
    operator: RegExp[];
    literals: {
        boolean: RegExp[];
        number: RegExp[];
        string: RegExp[];
        null: RegExp[];
    };
    comment: RegExp[];
}

export interface Language {
    name: string;
    defenition: LanguageDefinition;
}

const languages: Language[] = [];

export function registerLanguage(lang: Language): void {
    languages.push(lang);
}

export function getLanguages(): Language[] {
    return languages;
}
