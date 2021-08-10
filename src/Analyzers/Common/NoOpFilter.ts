import { IFilter } from "../../Common/IFilter";
import { TokenDetail } from "../../Common/TokenDetail";

export class NoOpFilter implements IFilter {

    /* istanbul ignore next */
    supports(type: string): boolean {
        return true;
    }

    process(tokens: Map<string, Array<TokenDetail>>): Promise<Map<string, Array<TokenDetail>>> {
        return new Promise(resolve => {
            console.log("NoOpFilter - returning map as-is")
            resolve(tokens);
        });
    }

}