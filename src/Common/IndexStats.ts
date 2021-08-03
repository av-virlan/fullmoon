import { IndexStatsJSON } from "./JSON";

export class IndexStats {
    private _docCount: number;
    private _version: number;
    private _lastChange: number;
    private _name: string;

    constructor (name: string = "index", docCount: number = 0, ver: number = 0, lastChange: number = Date.now()){
        this._name = name;
        this._docCount = docCount;
        this._version = ver;
        this._lastChange = lastChange;
    }

    public get docCount(): number {
        return this._docCount;
    }

    public set docCount(value: number) {
        this._docCount = value;
    }

    public get lastChange(): number {
        return this._lastChange;
    }

    public set lastChange(value: number) {
        this._lastChange = value;
    }

    static fromJSON(indexStats: IndexStatsJSON) : IndexStats {
        return new IndexStats(indexStats?.name, indexStats?.count, indexStats?.ver, indexStats?.change);
    }

    toJSON(): IndexStatsJSON {
        return {
            name: this._name,
            change: this._lastChange,
            ver: this._version,
            count: this._docCount
        };
    }
}