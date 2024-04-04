import { registerLanguage, LanguageDefinition } from "./languageManager.js";

const definition: LanguageDefinition = {
    identifier: [/[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/ug],
    keyword: [
        /abstract/g,
        /boolean/g,
        /break/g,
        /byte/g,
        /case/g,
        /catch/g,
        /char/g,
        /class/g,
        /const/g,
        /continue/g,
        /debugger/g,
        /default/g,
        /delete/g,
        /do/g,
        /double/g,
        /else/g,
        /enum/g,
        /export/g,
        /extends/g,
        /false/g,
        /final/g,
        /finally/g,
        /float/g,
        /for/g,
        /function/g,
        /goto/g,
        /if/g,
        /implements/g,
        /import/g,
        /in/g,
        /instanceof/g,
        /int/g,
        /interface/g,
        /long/g,
        /native/g,
        /new/g,
        /null/g,
        /package/g,
        /private/g,
        /protected/g,
        /public/g,
        /return/g,
        /short/g,
        /static/g,
        /synchronized/g,
        /switch/g,
        /this/g,
        /throw/g,
        /throws/g,
        /transient/g,
        /true/g,
        /try/g,
        /typeof/g,
        /var/g,
        /void/g,
        /while/g,
        /with/g
    ],
    separator: [
        /\}/g,
        /\]/g,
        /\)/g,
        /\>/g,
        /\;/g,
        /\{/g,
        /\[/g,
        /\(/g,
        /\</g,
        /\,/g,
        /\./g
    ],
    operator: [
        /\+/g,
        /\-/g,
        /\*/g,
        /\*\*/g,
        /\//g,
        /\%/g,
        /\+\+/g,
        /\-\-/g,
        /\=/g,
        /\+\=/g,
        /\-\=/g,
        /\*\=/g,
        /\/\=/g,
        /\%\=/g,
        /\*\*\=/g,
        /\=\=/g,
        /\=\=\=/g,
        /\!\=/g,
        /\!\=\=/g,
        /\>/g,
        /\</g,
        /\>\=/g,
        /\<\=/g,
        /\?/g,
        /\:/g,
        /\&\&/g,
        /\|\|/g,
        /\!/g,
        /\&/g,
        /\|/g,
        /\~/g,
        /\^/g,
        /\<\</g,
        /\>\>/g,
        /\>\>\>/g
    ],
    literals: {
        boolean: [/true/g,/false/g],
        number: [/[0-9]/g],
        string: [
            /`.*`/gm,
            /'.*'/g,
            /".*"/g
        ],
        null: [/null/g]
    },
    comment: [
        /\/\*.*\*\//g,
        /\/\/.*/g
    ],
}

// Language definition doesnt differ for
//  - JS
//  - JavaScript
//  - TS
//  - TypeScript

registerLanguage({
    name: "JS",
    defenition: definition,
});

registerLanguage({
    name: "JavaScript",
    defenition: definition,
});

registerLanguage({
    name: "TS",
    defenition: definition,
});

registerLanguage({
    name: "TypeScript",
    defenition: definition,
});
