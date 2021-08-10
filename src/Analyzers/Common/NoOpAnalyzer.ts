import { IAnalyzer } from "../../Common/IAnalyzer";
import { TokenDetail } from "../../Common/TokenDetail";

export class NoOpAnalyzer implements IAnalyzer {

    /* istanbul ignore next */
    supports(type: string): boolean {
        return true;
    }

    process(fieldValue: any, documentId: string): Promise<Map<string, Array<TokenDetail>>> {
        return new Promise(resolve => {
            console.log("NoOpAnalyzer - returning empty map");
            resolve(new Map<string, Array<TokenDetail>>());
        });
    }
}