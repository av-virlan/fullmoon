import { expect } from "chai";
import { BenchmarkSuite } from "./TestUtils";
import { Document } from '../src/Common/Document';
import { IndexStats } from "../src/Common/IndexStats";
import { SearchIndex } from "../src/SearchIndex";
import { IndexDefinition } from "../src/Common/IndexDefinition";
import { IndexDefinitionJSON, IndexJSON } from "../src/Common/JSON";
import { Index } from "../src/Index";

describe('serialization', function () {
    beforeEach(BenchmarkSuite.record);
    after(BenchmarkSuite.report);
/*
    it("can serialize documents", function () {
        let input = new Document('test', { a:3, 'b': 5, 'long key': true, 'array': [1,2,3] });
        let output = Document.fromJSON(input.toJSON());
        expect(output).eql(input);
    });

    it("can serialize index stats", function(){
        let input = new IndexStats('test', 5, 1, Date.now());
        let output = IndexStats.fromJSON(input.toJSON());
        expect(output).eql(input);
    });
*/
    it("can serialize search index", function(){
        let input = new SearchIndex();
        input.configure({ fields: [{ name: "some", store: true, analyzer: "text"}, { name: "other", store: false, analyzer: "code"}] });
        input.indexDocument({ some: 3, other: 'a' });
        let output = SearchIndex.fromJSON(input.toJSON());
        expect(output.toJSON()).to.eql(input.toJSON());
    });

    it("can deserialize null index", function(){
        let input = JSON.parse("{}") as IndexJSON;
        let output = Index.fromJSON(input);

        expect(output.getDocuments().length).eq(0);
    });

    it("can deserialize null definitions", function(){
        let input = JSON.parse("{}") as IndexDefinitionJSON;
        let output = IndexDefinition.fromJSON(input);

        expect(output.fieldDefinitions).eql({});
    });
/*
    it("can serialize empty index", function(){
        let input = new SearchIndex();
        let output = SearchIndex.fromJSON(input.toJSON());
        expect(output).eql(input);
    });*/
});