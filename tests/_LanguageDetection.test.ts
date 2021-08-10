import { expect } from "chai";
import { LanguageDetection } from "../src/Common/LanguageDetection";
import { BenchmarkSuite } from "./TestUtils";

describe('language detection', function () {

    it("can init", async function () {
        expect(LanguageDetection.init).does.not.throw;
    })

    describe("can detect language", function () {
        before(async function () {
            await LanguageDetection.init();
        });
        beforeEach(BenchmarkSuite.record);
        after(BenchmarkSuite.report);

        it("can detect English", async function () {
            const lang = await LanguageDetection.detect("This is a test in English");
            expect(lang).eq("en");
        });
    });
});
