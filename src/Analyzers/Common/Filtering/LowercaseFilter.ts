import { IFilter } from "../../../Common/IFilter";
import { TokenDetail } from "../../../Common/TokenDetail";

export class LowercaseFilter implements IFilter {
    process(tokens: Map<string, Array<TokenDetail>>): Promise<Map<string, Array<TokenDetail>>> {
        return new Promise(resolve => {
            let processedTokens = new Map<string, Array<TokenDetail>>();
            tokens.forEach((tokenDetails, token) => {
                processedTokens.set(token.toLowerCase(), tokenDetails);
            });
            resolve(processedTokens);
        });
    }
}