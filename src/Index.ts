import { AnalyzerFactory } from './Common/AnalyzerFactory';
import { Document } from './Common/Document';
import { IndexDefinition } from './Common/IndexDefinition'
import { IndexStats } from './Common/IndexStats';
import { PerFieldInvertedIndex } from './Common/PerFieldInvertedIndex';
import { IndexJSON } from './Common/JSON';
import { TokenDetail } from './Common/TokenDetail';

export class Index {
    private _documents: { [k: string] : Document };
    private _definition: IndexDefinition;
    private _analyzerFactory: AnalyzerFactory;
    private _perFieldInvertedIndex: PerFieldInvertedIndex;
    private _stats: IndexStats;

    private storeDocument(document: Document) {
        let cleanDocument = new Document(document.id);
        this._definition.storedFields(document).forEach(f => {
            cleanDocument.fields[f] = document.fields[f];
        });

        this._documents[cleanDocument.id] = cleanDocument;

        return cleanDocument.id;
    }

    private preprocessDocument(document: Document) {
        this._definition.processingPipeline.forEach(pipeline => pipeline(document, this._definition));
    }

    private addToInvertedIndex(document: Document, docIndex: string) {
        this._definition.fieldValues(document).forEach(fieldDefinition => {
            let analyzer = this._analyzerFactory.get(fieldDefinition.analyzer);
            let fieldValue = document.fields[fieldDefinition.name];
            let newTokens = analyzer.process(fieldValue, docIndex);

            newTokens.forEach((newTokenDetails: TokenDetail[], newToken: string) => {
                this._perFieldInvertedIndex.ensure(fieldDefinition.name, newToken, ...newTokenDetails);
            });
        });
    }

    private removeFromInvertedIndex(documentId: string) {
        this._perFieldInvertedIndex.removeTokensForDocument(documentId);
    }

    constructor(indexDefinition: IndexDefinition = new IndexDefinition(), perFieldInvertedIndex: PerFieldInvertedIndex = new PerFieldInvertedIndex(), documents: { [k:string]: Document } = {}, stats: IndexStats = new IndexStats()) {
        this._analyzerFactory = new AnalyzerFactory();
        this._definition = indexDefinition;
        this._perFieldInvertedIndex = perFieldInvertedIndex;
        this._documents = documents;
        this._stats = stats;
    }

    static fromJSON(index: IndexJSON) {
        let entries: Array<[string, Document]> = index?.doc?.map(d => ([d._id, Document.fromJSON(d)]));
        let docs = entries ? Object.fromEntries(entries) : {};
        return new Index(
            IndexDefinition.fromJSON(index?.def),
            PerFieldInvertedIndex.fromJSON(index?.idx),
            docs,
            IndexStats.fromJSON(index?.stat)
        );
    }

    toJSON(): IndexJSON {
        return {
            doc: Object.values(this._documents).filter(d => d != undefined).map(d => d.toJSON()),
            def: this._definition.toJSON(),
            idx: this._perFieldInvertedIndex.toJSON(),
            stat: this._stats.toJSON()
        };
    }

    addDocument(document: Document) {
        this.preprocessDocument(document);
        let docIndex = this.storeDocument(document);
        this.addToInvertedIndex(document, docIndex);
        this._stats.lastChange = Date.now();
        this._stats.docCount++;
    }

    getDocuments(): Array<Document> {
        return Object.values(this._documents);
    }

    getDocument(documentId: string): Document {
        return this._documents[documentId];
    }

    removeDocument(documentId: string) {
        this.removeFromInvertedIndex(documentId);
        delete this._documents[documentId];
        this._stats.lastChange = Date.now();
    }

    findTokenDetails(fieldName: string, token: string): Set<TokenDetail> {
        return this._perFieldInvertedIndex.tokenDetailsForToken(fieldName, token);
    }

    get definition(): IndexDefinition {
        return this._definition;
    }

    set definition(definition: IndexDefinition) {
        this._definition = definition;
    }

    get stats(): IndexStats {
        return this._stats;
    }
}
    // import { SearchEngine } from './SearchEngine';

    // declare global {
    //     interface Window {
    //         fullmoon: any
    //     }
    // }

    // window.fullmoon = SearchEngine;