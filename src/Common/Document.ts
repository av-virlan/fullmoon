import { FieldValue } from './FieldValue'
import { DocumentJSON } from './JSON';

export class Document {
    private _fields: { [k: string]: FieldValue };
    private _id: string;

    constructor(id: string, fields: { [k: string]: FieldValue } = {}) {
        this._id = id;
        this._fields = fields;
    }

    get id(): string {
        return this._id;
    }

    get fields(): { [k: string]: FieldValue } {
        return this._fields;
    }

    static fromJSON(doc: DocumentJSON) : Document {
        return new Document(
            doc._id,
            doc.fields
        );
    }

    toJSON(): any {
        return {
            _id: this._id,
            fields: this._fields
        };
    }
}