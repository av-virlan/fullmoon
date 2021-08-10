import { expect } from "chai";
import { BenchmarkSuite } from "./TestUtils";
import { EnglishTextTokenizer } from "../src/Analyzers/Common/Tokenizing/Languages/en/EnglishTextTokenizer";
import { LanguageDetection } from "../src/Common/LanguageDetection";

describe('english tokenization', function () {
    before(async function () {
        await LanguageDetection.init();
    });    
    beforeEach(BenchmarkSuite.record);
    after(BenchmarkSuite.report);

    it("can tokenize basic sentence", async function () {
        const input = 'this is a basic sentence';
        const expected = ['this', 'is', 'a', 'basic', 'sentence'];
        const tokenizer = new EnglishTextTokenizer({});

        const tokens = await tokenizer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("keeps subtokens", async function () {
        const input: string = "127.0.0.1";
        const expected: string[] = ["127.0.0.1", "127", "0", "1"];
        const tokenizer = new EnglishTextTokenizer({});

        const tokens = await tokenizer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("handles sentances with weird spacing", async function () {
        const input: string = "this is    a   sentence that just. is weird  ";
        const expected: string[] = ["this", "is", "a", "sentence", "that", "just", "weird"];
        const tokenizer = new EnglishTextTokenizer({});

        const tokens = await tokenizer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("doesn't split contractions", async function () {
        const input: string = "i said i'll call him but i haven't";
        const expected: string[] = ["i", "said", "i'll", "call", "him", "but", "haven't"];
        const tokenizer = new EnglishTextTokenizer({});

        const tokens = await tokenizer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("can tokenize advanced sentences", async function () {
        //last word should already be contained in the rest of the sentance to make this test complete
        const input: string = 'when billion dollar p&g ventures group decided to acquire - award wining company - Gillete, they hadn\'t expected to pay $57.1 billion';
        const expected: string[] = ["when", "billion", "dollar", "p&g", "p", "g", "ventures", "group", "decided", "to", "acquire", "award", "wining", "company", "Gillete", "they", "hadn't", "expected", "pay", "$57.1", "57", "1"];
        const tokenizer = new EnglishTextTokenizer({});

        const tokens = await tokenizer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("can tokenize weird sentences", async function () {
        const input: string = '!!! Just some #weird stuff I wrote for @jhn1234 to check out http://somevalue.com - haha :) right??';
        const expected: string[] = ["!!", "Just", "some", "#weird", "weird", "stuff", "I", "wrote", "for", "@jhn1234", "jhn1234", "to", "check", "out", "http://somevalue.com", "http", "somevalue", "com", "haha", ":", "right??", "right"];
        const tokenizer = new EnglishTextTokenizer({});

        const tokens = await tokenizer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });
});