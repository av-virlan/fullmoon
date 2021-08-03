import { TokenDetail } from './TokenDetail';


export class InvertedIndexContent {
    private _invertedIndexContent: { [k: string]: Set<TokenDetail>; };

    constructor(invertedIndex: { [k: string]: Set<TokenDetail>; }) {
        this._invertedIndexContent = invertedIndex;
    }

    get(key: string): Set<TokenDetail> {
        return this._invertedIndexContent[key] = (this._invertedIndexContent[key] || new Set<TokenDetail>());
    }

    delete(key: string, documentId: string) {
        const tokenDetails = this._invertedIndexContent[key];
        for (let tokenDetail of tokenDetails) {
            if (tokenDetail.documentId === documentId) {
                tokenDetails.delete(tokenDetail);
            }
        }
    }

    deleteAll(documentId: string) {
        this.tokens().forEach(token => this.delete(token, documentId));
    }

    tokens(): Array<string> {
        return Object.keys(this._invertedIndexContent);
    }

    toJSON(): any {
        const contentToJson = ([k,v]: [string, Set<TokenDetail>]) => {
            const tokenDetailsJson = [...v].map(v => v.toJSON());
            return [k, tokenDetailsJson];
        };
        return Object.fromEntries(Object.entries(this._invertedIndexContent).map(contentToJson));
    }
}
