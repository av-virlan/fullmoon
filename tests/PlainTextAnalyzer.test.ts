import { expect } from "chai";
import { BenchmarkSuite } from "./TestUtils";
import { PlainTextAnalyzer } from "../src/Analyzers/Text/plaintext/PlainTextAnalyzer";

describe('english analysis', function () {
    beforeEach(BenchmarkSuite.record);
    after(BenchmarkSuite.report);

    it("can analyze basic sentence", function () {
        let input = 'this is a basic sentence';
        let expected = ['basic', 'sentence'];
        let analyzer = new PlainTextAnalyzer({});

        let output = [...analyzer.process(input, "doc1").keys()];
        expect(output).eql(expected);
    });

    it("can tokenize advanced sentences", function () {
        let input: string = 'when p&g decided to acquire - award wining company - Gillete, they hadn\'t expected to pay $57.1 billion';
        let expected: string[] = ["when", "p&g", "decided", "acquire", "award", "wining", "company", "gillete", "hadn't", "expected", "pay", "$57.1", "57", "billion", "had", "not"];
        let analyzer = new PlainTextAnalyzer({});

        let output = [...analyzer.process(input, "doc1").keys()];
        expect(output).eql(expected);
    });

    it("can tokenize weird sentences", function () {
        let input: string = '!!! Just some #weird stuff I wrote for @jhn1234 to check out http://somevalue.com - haha :) right??';
        let expected: string[] = ["just", "some", "#weird", "weird", "stuff", "wrote", "@jhn1234", "jhn1234", "check", "out", "http://somevalue.com", "http", "somevalue", "com", "haha", "right??", "right"];
        let analyzer = new PlainTextAnalyzer({});

        let output = [...analyzer.process(input, "doc1").keys()];
        expect(output).eql(expected);
    });
});