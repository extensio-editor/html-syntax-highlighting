import { assert, expect } from 'chai';
import syntaxHighligher, { registerLanguage, getLanguageDefinition } from '../dist/index.js';

describe('Registration', () => {
    describe('Language Manager', () => {
        it("should register and be able to get a language", () => {
            const emptyLang = {
                name: "TEST",
                defenition: { identifier: [], keyword: [], separator: [], operator: [], literals: { boolean: [], number: [], string: [], null: [], }, comment: [] }
            };
            registerLanguage(emptyLang);
            assert.equal(getLanguageDefinition("test"), emptyLang.defenition);
        });

        it("Should be able to retrieve JavaScript (default language)", () => {
            const JavaScript = getLanguageDefinition("JavaScript");
            expect(JavaScript.keyword).to.have.a.lengthOf(57).and.to.be.an('array');
        });
    });

    describe("Highlighter", () => {
        it("Should create sapns out of the text", () => {
            const highlighted = syntaxHighligher("const a = 1 \n// Testing comment", {
                language: "JS",
            });
            expect(highlighted).to.include("span");
        });
    });
});
