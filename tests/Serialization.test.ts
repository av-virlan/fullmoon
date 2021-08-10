import { expect } from "chai";
import { BenchmarkSuite } from "./TestUtils";
import { Document } from '../src/Common/Document';
import { IndexStats } from "../src/Common/IndexStats";
import { SearchIndex } from "../src/SearchIndex";
import { IndexDefinition } from "../src/Common/IndexDefinition";
import { IndexDefinitionJSON, IndexJSON } from "../src/Common/JSON";
import { Index } from "../src/Index";
import { TokenDetail } from "../src/Common/TokenDetail";
import { InvertedIndex } from "../src/Common/InvertedIndex";
import { PerFieldInvertedIndex } from "../src/Common/PerFieldInvertedIndex";

describe('serialization', function () {
    beforeEach(BenchmarkSuite.record);
    after(BenchmarkSuite.report);

    it("can serialize documents", function () {
        const input = new Document('test', { a: 3, 'b': 5, 'long key': true, 'array': [1, 2, 3] });
        const output = Document.fromJSON(input.toJSON());
        expect(output).eql(input);
    });

    it("can serialize index stats", function () {
        const input = new IndexStats('test', 5, 1, Date.now());
        const output = IndexStats.fromJSON(input.toJSON());
        expect(output).eql(input);
    });

    it("can serialize search index", function () {
        const input = new SearchIndex();
        input.configure({ fields: [{ name: "some", store: true, analyzer: "text" }, { name: "other", store: false, analyzer: "code" }] });
        input.indexDocument({ some: 3, other: 'a' });
        const output = SearchIndex.fromJSON(input.toJSON());
        expect(output.toJSON()).to.eql(input.toJSON());
    });

    it("can deserialize null index", function () {
        const input = JSON.parse("{}") as IndexJSON;
        const output = Index.fromJSON(input);

        expect(output.getDocuments().length).eq(0);
    });

    it("can deserialize null definitions", function () {
        const input = JSON.parse("{}") as IndexDefinitionJSON;
        const output = IndexDefinition.fromJSON(input);

        expect(output.fieldDefinitions).eql({});
    });

    it("can serialize empty index", function () {
        const input = new SearchIndex();
        const output = SearchIndex.fromJSON(input.toJSON());
        expect(output).eql(input);
    });

    it("can serialize token detail", function () {
        const input = new TokenDetail("doc1", [{ start: 0, end: 5}]);
        const output = TokenDetail.fromJSON(input.toJSON());
        expect(output).eql(input);
    });

    it("can serialize inverted index", function () {
        const input = new InvertedIndex({ "some": new Set<TokenDetail>([new TokenDetail("doc1", [{ start:0, end: 5}])])});
        const output = InvertedIndex.fromJSON(input.toJSON());
        expect(output).eql(input);
    });

    it("can serialize per field inverted index", function () {
        const input = new PerFieldInvertedIndex({ "some": new InvertedIndex({ "some": new Set<TokenDetail>([new TokenDetail("doc1", [{ start:0, end: 5}])])})});
        const output = PerFieldInvertedIndex.fromJSON(input.toJSON());
        expect(output).eql(input);
    });
});