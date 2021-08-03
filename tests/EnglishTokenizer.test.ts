import { expect } from "chai";
import { BenchmarkSuite } from "./TestUtils";
import { EnglishTextTokenizer } from "../src/Analyzers/Common/Tokenizing/Languages/en/EnglishTextTokenizer";
import { LanguageTokenizerFactory } from "../src/Analyzers/Common/Tokenizing/LanguageTokenizerFactory";

describe('english tokenization', function () {
    beforeEach(BenchmarkSuite.record);
    after(BenchmarkSuite.report);

    it("can tokenize basic sentence", function () {
        let input = 'this is a basic sentence';
        let expected = ['this', 'is', 'a', 'basic', 'sentence'];
        let tokenizer = new EnglishTextTokenizer({});

        let output = [...tokenizer.process(input, "doc1").keys()];
        expect(output).eql(expected);
    });

    it("keeps subtokens", function() {
        let input: string = "127.0.0.1";
        let expected: string[] = ["127.0.0.1", "127", "0", "1"];
        let tokenizer = new EnglishTextTokenizer({});

        let output = [...tokenizer.process(input, "doc1").keys()];
        expect(output).eql(expected);
    });

    it("handles sentances with weird spacing", function(){
        let input: string = "this is    a   sentence that just. is weird  ";
        let expected: string[] = ["this", "is", "a", "sentence", "that", "just", "weird"];
        let tokenizer = new EnglishTextTokenizer({});

        let output = [...tokenizer.process(input, "doc1").keys()];
        expect(output).eql(expected);
    });

    it("doesn't split contractions", function(){
        let input: string = "i said i'll call him but i haven't";
        let expected: string[] = ["i", "said", "i'll", "call", "him", "but", "haven't"];
        let tokenizer = new EnglishTextTokenizer({});

        let output = [...tokenizer.process(input, "doc1").keys()];
        expect(output).eql(expected);
    });

    it("can tokenize advanced sentences", function () {
        //last word should already be contained in the rest of the sentance to make this test complete
        let input: string = 'when billion dollar p&g ventures group decided to acquire - award wining company - Gillete, they hadn\'t expected to pay $57.1 billion';
        let expected: string[] = ["when", "billion", "dollar", "p&g", "p", "g", "ventures", "group", "decided", "to", "acquire", "award", "wining", "company", "Gillete", "they", "hadn't", "expected", "pay", "$57.1", "57", "1"];
        let tokenizer = new EnglishTextTokenizer({});

        let output = [...tokenizer.process(input, "doc1").keys()];
        expect(output).eql(expected);
    });

    it("can tokenize weird sentences", function () {
        let input: string = '!!! Just some #weird stuff I wrote for @jhn1234 to check out http://somevalue.com - haha :) right??';
        let expected: string[] = ["!!", "Just", "some", "#weird", "weird", "stuff", "I", "wrote", "for", "@jhn1234", "jhn1234", "to", "check", "out", "http://somevalue.com", "http", "somevalue", "com", "haha", ":", "right??", "right"];
        let tokenizer = new EnglishTextTokenizer({});

        let output = [...tokenizer.process(input, "doc1").keys()];
        expect(output).eql(expected);
    });
});