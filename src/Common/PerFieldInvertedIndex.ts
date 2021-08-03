import { InvertedIndex } from './InvertedIndex';
import { PerFieldInvertedIndexJSON } from './JSON';
import { TokenDetail } from './TokenDetail';

export class PerFieldInvertedIndex {
    private _perFieldIndex: { [k: string]: InvertedIndex};

    constructor(perFieldIndex: { [k: string]: InvertedIndex} = {}) {
        this._perFieldIndex = perFieldIndex;
    }

    ensureField(fieldName: string) {
        if (!(fieldName in this._perFieldIndex)) {
            this._perFieldIndex[fieldName] = new InvertedIndex();
        }
    }

    ensure(fieldName: string, token: string, ...tokenDetails: Array<TokenDetail>) {
        this.ensureField(fieldName);
        this._perFieldIndex[fieldName].ensure(token, new Set(tokenDetails));
    }

    removeTokensForDocument(documentId: string) {
        for(let field in this._perFieldIndex) {
            this._perFieldIndex[field].removeTokensForDocument(documentId);
        }
    }

    tokenDetailsForToken(fieldName: string, token: string): Set<TokenDetail> {
        this.ensure(fieldName, token);
        return this._perFieldIndex[fieldName].tokenDetailsForToken(token);
    }

    static fromJSON(perFieldInvertedIndex: PerFieldInvertedIndexJSON): PerFieldInvertedIndex {
        if(!perFieldInvertedIndex) {
            return new PerFieldInvertedIndex({});
        }

        let entries: Array<[string, InvertedIndex]> = Object.entries(perFieldInvertedIndex).map(([k,v]) => [k, InvertedIndex.fromJSON(v)]);
        let perFieldInvertedIdx = Object.fromEntries(entries);
        return new PerFieldInvertedIndex(perFieldInvertedIdx);
    }

    toJSON(): PerFieldInvertedIndexJSON {
        return Object.fromEntries(Object.entries(this._perFieldIndex).map(([k,v]) => [k, v.toJSON()]));
    }
}
