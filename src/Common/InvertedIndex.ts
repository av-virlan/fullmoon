import { InvertedIndexContent } from './InvertedIndexContent';
import { InvertedIndexJSON, TokenDetailJSON } from './JSON';
import { TokenDetail } from './TokenDetail';

export class InvertedIndex {

    private readonly _invertedIndexContent: InvertedIndexContent;

    constructor(invertedIndex: { [k:string]: Set<TokenDetail> } = {}) {
        this._invertedIndexContent = new InvertedIndexContent(invertedIndex);
    }

    ensure(token: string, tokenDetails: Set<TokenDetail>) {
        const details = this._invertedIndexContent.get(token);
        tokenDetails.forEach((tokenDetail: TokenDetail) => details.add(tokenDetail));
    }

    removeTokensForDocument(documentId: string) {
        this._invertedIndexContent.deleteAll(documentId);
    }

    tokenDetailsForToken(token: string): Set<TokenDetail> {
        return this._invertedIndexContent.get(token);
    }

    static fromJSON(invertedIndex: InvertedIndexJSON): InvertedIndex {
        const o: any = {};
        Object.entries(invertedIndex).forEach(entry => {
            const set = new Set<TokenDetail>(entry[1].map(TokenDetail.fromJSON));
            o[entry[0]] = set;
        });
        return new InvertedIndex(o);
    }

    toJSON(): any {
        return this._invertedIndexContent.toJSON();
    }
}
