import { expect } from "chai";
import { BenchmarkSuite } from "./TestUtils";
import { TextAnalyzer } from "../src/Analyzers/TextAnalyzer";

describe('text analyzer', function () {
    beforeEach(BenchmarkSuite.record);
    after(BenchmarkSuite.report);

    it("supports plain text analysis", function(){
        var analyzer = new TextAnalyzer({type: "some-dumb-file-type"});
        var result = analyzer.process("some-value", "0");
        expect(result.size).eq(0);
    });
});