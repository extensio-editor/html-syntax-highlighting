import { registerLanguage, LanguageDefinition } from "./languageManager.js";

const definition: LanguageDefinition = {
    identifier: [/[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/ug],
    keyword: [
        /\babstract\b/g,
        /\bboolean\b/g,
        /\bbreak\b/g,
        /\bbyte\b/g,
        /\bcase\b/g,
        /\bcatch\b/g,
        /\bchar\b/g,
        /\bclass\b/g,
        /\bdebugger\b/g,
        /\bconst\b/g,
        /\bdelete\b/g,
        /\bcontinue\b/g,
        /\bdouble\b/g,
        /\bdefault\b/g,
        /\benum\b/g,
        /\bdo\b/g,
        /\bextends\b/g,
        /\belse\b/g,
        /\bfinal\b/g,
        /\bexport\b/g,
        /\bfloat\b/g,
        /\bfalse\b/g,
        /\bfunction\b/g,
        /\bfinally\b/g,
        /\bif\b/g,
        /\bfor\b/g,
        /\bimport\b/g,
        /\bgoto\b/g,
        /\binstanceof\b/g,
        /\bimplements\b/g,
        /\binterface\b/g,
        /\bin\b/g,
        /\bnative\b/g,
        /\bint\b/g,
        /\bnull\b/g,
        /\blong\b/g,
        /\bprivate\b/g,
        /\bnew\b/g,
        /\bpublic\b/g,
        /\bpackage\b/g,
        /\bshort\b/g,
        /\bprotected\b/g,
        /\bsynchronized\b/g,
        /\breturn\b/g,
        /\bthis\b/g,
        /\bstatic\b/g,
        /\bthrows\b/g,
        /\bswitch\b/g,
        /\btrue\b/g,
        /\bthrow\b/g,
        /\btypeof\b/g,
        /\btransient\b/g,
        /\bvoid\b/g,
        /\btry\b/g,
        /\bwith\b/g,
        /\bvar\b/g,
        /\bwhile\b/g,
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
            /`.*`/gs,
            /'.*?'/g,
            /".*?"/g
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
