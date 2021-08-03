import { expect } from "chai";
import { FlakeId } from "../src/Common/Utils";
import { BenchmarkSuite } from "./TestUtils";

describe('util functions', function () {
    beforeEach(BenchmarkSuite.record);
    after(BenchmarkSuite.report);

    it("FlakeID supports generating 5000 sequence numbers", function(){
        let generator = new FlakeId();
        let inputSize = 5000;
        
        let output = new Set();
        for(var i = 0; i < inputSize; i++) {
            output.add(generator.generate());
        }

        expect(output.size).eq(inputSize);
    });
});