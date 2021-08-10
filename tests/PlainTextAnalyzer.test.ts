import { expect } from "chai";
import { BenchmarkSuite } from "./TestUtils";
import { PlainTextAnalyzer } from "../src/Analyzers/Text/plaintext/PlainTextAnalyzer";
import { LanguageDetection } from "../src/Common/LanguageDetection";

describe('analysis for plain text in english', function () {
    before(async function () {
        await LanguageDetection.init();
    });
    beforeEach(BenchmarkSuite.record);
    after(BenchmarkSuite.report);

    it("uses NoOp and processes even unsupported languages (Klingon)", async function () {
        const input = 'ghojmoH jatlhlu';
        const expected: Array<string> = [];
        const analyzer = new PlainTextAnalyzer({});

        const tokens = await analyzer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("can analyze basic sentence", async function () {
        const input = 'this is a basic sentence';
        const expected = ['basic', 'sentence'];
        const analyzer = new PlainTextAnalyzer({});

        const tokens = await analyzer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("can tokenize advanced sentences", async function () {
        const input: string = 'when p&g decided to acquire - award wining company - Gillete, they hadn\'t expected to pay $57.1 billion';
        const expected: string[] = ["when", "p&g", "decided", "acquire", "award", "wining", "company", "gillete", "hadn't", "expected", "pay", "$57.1", "57", "billion", "had", "not"];
        const analyzer = new PlainTextAnalyzer({});

        const tokens = await analyzer.process(input, "doc1")
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("can tokenize weird sentences", async function () {
        const input: string = '!!! Just some #weird stuff I wrote for @jhn1234 to check out http://somevalue.com - haha :) right??';
        const expected: string[] = ["just", "some", "#weird", "weird", "stuff", "wrote", "@jhn1234", "jhn1234", "check", "out", "http://somevalue.com", "http", "somevalue", "com", "haha", "right??", "right"];
        const analyzer = new PlainTextAnalyzer({});

        const tokens = await analyzer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("can handle emoji", async function () {
        const input: string = "Welcome to our page 😊 Have 😊 😊 fun 😊";
        const expected: string[] = ["welcome", "our", "page", "😊", "have", "fun", "blush"];
        const analyzer = new PlainTextAnalyzer({});

        const tokens = await analyzer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });

    it("can handle expanded emoji", async function () {
        const input: string = "😅 😄";
        const expected: string[] = ["smile", "sweat", "😅", "😄"];
        const analyzer = new PlainTextAnalyzer({});

        const tokens = await analyzer.process(input, "doc1");
        const output = [...tokens.keys()];
        expect(output).members(expected);
    });
});