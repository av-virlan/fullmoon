import { IAnalyzer } from "../../Common/IAnalyzer";
import { TokenDetail } from "../../Common/TokenDetail";

export class NoOpAnalyzer implements IAnalyzer {

    /* istanbul ignore next */
    supports(type: string): boolean {
        return true;
    }

    process(fieldValue: any, documentId: string): Map<string, Array<TokenDetail>> {
        console.log("NoOpAnalyzer - returning empty map");
        return new Map<string, Array<TokenDetail>>();
    }
}