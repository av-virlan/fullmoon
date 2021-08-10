import { IFilter } from "../../../Common/IFilter";
import { TokenDetail } from "../../../Common/TokenDetail";
import * as Emoji from "node-emoji";

export class EmojiContractionFilter implements IFilter {

    constructor() {
    }

    process(tokens: Map<string, TokenDetail[]>): Promise<Map<string, TokenDetail[]>> {
        return new Promise(resolve => {
            let newTokens = new Map<string, TokenDetail[]>();
            tokens.forEach((tokenDetails, key) => {
                let emojiExpanded = Emoji.which(key);
                if (emojiExpanded && emojiExpanded !== key) {
                    let emojiWords = emojiExpanded.split(/[-_]/);
                    emojiWords.forEach(word => {
                        if (newTokens.has(word)) {
                            let details = newTokens.get(word);
                            details?.push(...JSON.parse(JSON.stringify(tokenDetails)));
                        } else {
                            newTokens.set(word, JSON.parse(JSON.stringify(tokenDetails)));
                        }
                    });
                }
            });

            resolve(new Map([...tokens, ...newTokens]));
        });
    }
}