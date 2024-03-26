import { assert } from 'chai';
import { registerLanguage, getLanguageDefinition } from '../dist/index.js';

describe('Registration', () => {
    describe('#registerLanguage()', () => {
        it("should register and be able to get a language", () => {
            const emptyLang = {
                name: "TEST",
                defenition: { identifier: [], keyword: [], separator: [], operator: [], literals: { boolean: [], number: [], string: [], null: [], }, comment: [] }
            };
            registerLanguage(emptyLang);
            assert.equal(getLanguageDefinition("test"), emptyLang.defenition);
        })
    });
});