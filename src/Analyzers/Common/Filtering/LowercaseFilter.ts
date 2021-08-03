import { IFilter } from "../../../Common/IFilter";
import { TokenDetail } from "../../../Common/TokenDetail";

export class LowercaseFilter implements IFilter {

    /* istanbul ignore next */
    supports(type: string): boolean {
        return true;
    }

    process(tokens: Map<string, Array<TokenDetail>>): Map<string, Array<TokenDetail>> {
        let processedTokens = new Map<string, Array<TokenDetail>>();
        tokens.forEach((tokenDetails, token) => {
            processedTokens.set(token.toLowerCase(), tokenDetails);
        });
        return processedTokens;
    }

}