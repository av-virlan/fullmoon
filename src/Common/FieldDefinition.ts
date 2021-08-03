import { FieldDefinitionJSON } from "./JSON";

export class FieldDefinition {
    private _storeValue: boolean;
    private _name: string;
    private _analyzer: string;

    get storeValue(): boolean {
        return this._storeValue;
    }

    set storeValue(value: boolean) {
        this._storeValue = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get analyzer(): string {
        return this._analyzer;
    }

    set analyzer(value: string) {
        this._analyzer = value;
    }

    static fromJSON(fieldDef: FieldDefinitionJSON): FieldDefinition {
        let def = new FieldDefinition();
        def.name = fieldDef.name;
        def.storeValue = fieldDef.store;
        def.analyzer = fieldDef.analyzer;

        return def;
    }

    toJSON(): FieldDefinitionJSON {
        return {
            name: this._name,
            store: this._storeValue,
            analyzer: this._analyzer
        };
    }
}