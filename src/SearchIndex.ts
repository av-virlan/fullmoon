import { stringify } from 'relaxed-json';
import { Document } from './Common/Document';
import { FieldDefinition } from './Common/FieldDefinition';
import { IndexDefinition } from './Common/IndexDefinition';
import { IndexStats } from './Common/IndexStats';
import { IndexDefinitionJSON, IndexJSON, SearchIndexJSON } from './Common/JSON';
import { TokenDetail } from './Common/TokenDetail';
import { CloneAsJSON, FlakeId } from './Common/Utils';
import { Index } from './Index'

export class SearchIndex {
    private _index: Index;
    private _machineId: number | undefined;
    private _idGenerator: FlakeId;

    constructor(index: Index = new Index(), machineId?: number, idGenerator: FlakeId = new FlakeId(machineId)) {
        this._machineId = machineId;
        this._index = index;
        this._idGenerator = idGenerator;
    }

    configure(fields: IndexDefinitionJSON) {
        this._index.definition = IndexDefinition.fromJSON(fields);
    }

    getDocument(documentId: string) {
        return this._index.getDocument(documentId);
    }

    getStats(): IndexStats {
        return this._index.stats;
    }

    copyObjectTo(source: { [k: string]: any }, dest: { [k: string]: any }) {
        for (let key in source) {
            dest[key] = source[key];
        }
    }

    indexDocument(doc: { [k: string]: any }): string {
        const newDoc = new Document(doc._id || doc.id || this._idGenerator.generate());
        this.copyObjectTo(doc, newDoc.fields);
        this._index.addDocument(newDoc);
        return newDoc.id;
    }

    removeDocument(documentId: string) {
        this._index.removeDocument(documentId);
    }

    search(keyword: string, fieldsToSearch?: Array<string>) {
        const fields = fieldsToSearch ?? Object.keys(this._index.definition.fieldDefinitions);
        const fieldMatches = new Map<string, Set<TokenDetail>>();
        fields.forEach(field => {
            let details = this._index.findTokenDetails(field, keyword);
            fieldMatches.set(field, details);
        });

        //TODO: Compute score for each document in fieldMatches
        //and convert from Map(field, tokendetails) to Map(document, score)
        const documentMatches = new Map<string, number>();
        fieldMatches.forEach(tokenDetails => {
            tokenDetails.forEach(tokenDetail => {
                //TODO: compute sum based on field TF
                documentMatches.set(tokenDetail.documentId, (documentMatches.get(tokenDetail.documentId) || 0) + tokenDetail.termFrequency);
            });

        });

        const results = Array.from(documentMatches).sort((docId1, docId2) => docId1[1] - docId2[1]);
        return results.map(r => {
            const searchResult: { [k: string]: any } = {
                _score: r[1],
                _id: r[0]
            };
            const doc = this._index.getDocument(r[0]);
            this.copyObjectTo(doc, searchResult);
            return searchResult;
        });
    }

    toJSON(): string {
        const index = this._index.toJSON();
        return JSON.stringify({ lt: this._idGenerator.lastTime, si:  index});
    }

    static fromJSON(value: string) {
        const searchIndexJSON = JSON.parse(value) as SearchIndexJSON;
        const index = Index.fromJSON(searchIndexJSON.si);
        return new SearchIndex(index, undefined, new FlakeId(searchIndexJSON.lt));
    }
}