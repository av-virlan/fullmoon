import { IFilter } from "../../Common/IFilter";
import { TokenDetail } from "../../Common/TokenDetail";

export class NoOpFilter implements IFilter {

    /* istanbul ignore next */
    supports(type: string): boolean {
        return true;
    }

    process(tokens: Map<string, Array<TokenDetail>>): Map<string, Array<TokenDetail>> {
        console.log("NoOpFilter - returning map as-is")
        return tokens;
    }

}