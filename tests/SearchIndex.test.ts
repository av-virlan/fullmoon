import { expect } from "chai";
import { SearchIndex } from "../src/SearchIndex";
import { BenchmarkSuite } from "./TestUtils";
import { Document } from '../src/Common/Document';

describe('index management', function () {
    beforeEach(BenchmarkSuite.record);
    after(BenchmarkSuite.report);

    it("can create index", function () {
        let si: SearchIndex = new SearchIndex();
        
        this.bench.record("building index", () => {
            si = new SearchIndex();
            si.configure({
                fields: [{
                    name: "some",
                    store: true,
                    analyzer: "text"
                }]
            });
        });

        let stats = si.getStats();

        expect(si).not.eq(undefined);
        expect(stats.docCount).eq(0);
        expect(stats.lastChange).greaterThan(0);
        expect(stats.lastChange).lessThanOrEqual(Date.now());
    });

    it("can serialize index", function () {
        let si: SearchIndex;
        this.bench.record("building index", () => {
            si = new SearchIndex();
            si.configure({
                fields: [{
                    name: "some",
                    store: true,
                    analyzer: "text"
                }]
            });
        });

        let serialized: string = '';
        this.bench.record("serialize index", () => {
            serialized = si.toJSON();
        });

        expect(serialized).to.satisfy((j: string) => j.length > 0);
        expect(serialized).to.contain("si").to.contain('def').to.contains('some');
    });

    it("adds documents and ignores fields that are not defined as stored", function () {
        let si: SearchIndex;

        this.bench.record("building index", () => {
            si = new SearchIndex();
            si.configure({
                fields: [{
                    name: "some",
                    store: true,
                    analyzer: "text"
                }, {
                    name: "notStored",
                    store: false,
                    analyzer: "text"
                }, {
                    name: "nonExistent",
                    store: true,
                    analyzer: "text"
                }]
            });
        });

        let id: string = '';
        this.bench.record("adding doc", () => {
            id = si.indexDocument({ some: "value", notPartOfFieldDefinition: "me", notStored: "finger-scrossed" });
        });

        let doc: Document = new Document('');
        this.bench.record("getting doc", () => {
            doc = si.getDocument(id);
        });

        expect(doc.id).eq(id);
        expect(doc.fields['some']).eq('value');
        expect(Object.keys(doc.fields).length).eq(1);
    });

    it("can find document", function(){
        let si: SearchIndex;

        this.bench.record("building index", () => {
            si = new SearchIndex();
            si.configure({
                fields: [{
                    name: "some",
                    store: true,
                    analyzer: "text"
                }, {
                    name: "notStored",
                    store: false,
                    analyzer: "text"
                }, {
                    name: "nonExistent",
                    store: true,
                    analyzer: "text"
                }]
            });
        });

        let id: string;
        this.bench.record("adding doc", () => {
            id = si.indexDocument({ some: "value", notPartOfFieldDefinition: "me", notStored: "finger-scrossed" });
        });

        let searchResult = new Array<{ [k:string]: any }>();
        this.bench.record("search doc in all fields", () => {
            searchResult = si.search("value");
        });

        let noResult = new Array<{ [k:string]: any}>();
        this.bench.record("search doc in specific field", () => {
            noResult = si.search("me", ["nonExistent", "notPartOfFieldDefinition"]);
        });

        expect(searchResult.length).eq(1);
        expect(noResult.length).eq(0);
    });

    it("uses first analyzer mentioned on field", function(){
        let si: SearchIndex;

        this.bench.record("building index", () => {
            si = new SearchIndex();
            si.configure({
                fields: [{
                    name: "some",
                    store: true,
                    analyzer: "text:{},dummy:{}"
                }]
            });
        });

        let id: string;
        this.bench.record("adding doc", () => {
            id = si.indexDocument({ some: "value", notPartOfFieldDefinition: "me", notStored: "fingers-crossed" });
        });

        let searchResult = new Array<{ [k:string]: any }>();
        this.bench.record("search doc in all fields", () => {
            searchResult = si.search("value");
        });

        expect(searchResult.length).eq(1);
    });

    it("falls back to text analyzer group if unknown analyzer referenced", function(){
        let si: SearchIndex;

        this.bench.record("building index", () => {
            si = new SearchIndex();
            si.configure({
                fields: [{
                    name: "some",
                    store: true,
                    analyzer: "dummy:{}"
                }]
            });
        });

        let id: string;
        this.bench.record("adding doc", () => {
            id = si.indexDocument({ some: "value", notPartOfFieldDefinition: "me", notStored: "fingers-crossed" });
        });

        let searchResult = new Array<{ [k:string]: any }>();
        this.bench.record("search doc in all fields", () => {
            searchResult = si.search("value");
        });

        expect(searchResult.length).eq(1);
    });

    it("can remove document", function(){
        let si: SearchIndex;

        this.bench.record("building index", () => {
            si = new SearchIndex();
            si.configure({
                fields: [{
                    name: "some",
                    store: true,
                    analyzer: "text"
                }, {
                    name: "notStored",
                    store: false,
                    analyzer: "text"
                }, {
                    name: "nonExistent",
                    store: true,
                    analyzer: "text"
                }]
            });
        });

        let id: string;
        this.bench.record("adding doc", () => {
            id = si.indexDocument({ some: "value", notPartOfFieldDefinition: "me", notStored: "fingers-crossed" });
        });

        this.bench.record("adding doc 2", () => {
            id = si.indexDocument({ some: "value2", notPartOfFieldDefinition: "me2", notStored: "fingers-crossed2" });
        });

        let doc: Document;
        this.bench.record("getting doc", () => {
            doc = si.getDocument(id);
        });

        this.bench.record("removing doc", () => {
            si.removeDocument(id);
        });

        let docAfterRemove: Document = new Document('');
        this.bench.record("getting doc after remove", () => {
            docAfterRemove = si.getDocument(id);
        });

        expect(docAfterRemove).eq(undefined);
    });
});