import { FieldDefinition } from './FieldDefinition'
import { IProcessingPipeline } from './IProcessingPipeline'
import { FieldDefinitionJSON, IndexDefinitionJSON } from './JSON';
import { Document } from './Document';

export class IndexDefinition {
    private _fieldDefinitions: { [k: string]: FieldDefinition };
    private _processingPipeline: Array<IProcessingPipeline>;

    get fieldDefinitions(): { [k: string]: FieldDefinition } {
        return this._fieldDefinitions;
    }

    get processingPipeline(): Array<IProcessingPipeline> {
        return this._processingPipeline;
    }

    constructor(fieldDefinitions: { [k: string]: FieldDefinition } = {}, processingPipeline: Array<IProcessingPipeline> = new Array<IProcessingPipeline>()) {
        this._fieldDefinitions = fieldDefinitions;
        this._processingPipeline = processingPipeline;
    }

    fieldValues(doc: Document): Array<FieldDefinition> {
        return Object.entries(this._fieldDefinitions).filter(fd => fd[0] in doc.fields).map(fd => fd[1]);
    }

    storedFields(doc: Document): Array<string> {
        return Object.entries(this._fieldDefinitions).filter(fd => fd[0] in doc.fields && this._fieldDefinitions[fd[0]].storeValue).map(fd => fd[0]);
    }

    static fromJSON(indexDef: IndexDefinitionJSON) {
        let entries = indexDef?.fields?.map(f => ([f.name, FieldDefinition.fromJSON(f)]));
        let fieldDef = entries ? Object.fromEntries(entries) : {};
        return new IndexDefinition(
            fieldDef,
            indexDef?.pipeline
        );
    }

    toJSON(): IndexDefinitionJSON {
        return {
            fields: Object.values(this._fieldDefinitions).map(v => v.toJSON()),
            pipeline: this._processingPipeline
        };
    }
}