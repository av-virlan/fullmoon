import { TokenDetailJSON } from "./JSON";

export type TokenLocation = { start: number, end: number }

export class TokenDetail {
    private _locations: Array<TokenLocation>;
    private _documentId: string;

    constructor(documentId: string, locations: Array<TokenLocation>) {
        this._locations = locations;
        this._documentId = documentId;
    }

    get documentId(): string {
        return this._documentId;
    }

    get termFrequency(): number {
        return this._locations.length;
    }

    static fromJSON(tokenDetail: TokenDetailJSON) : TokenDetail {
        return new TokenDetail(tokenDetail.docId, tokenDetail.loc);
    }

    toJSON(): any {
        return {
            docId: this._documentId,
            loc: this._locations
        };
    }
}