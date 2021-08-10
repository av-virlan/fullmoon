import { TokenDetail } from "./TokenDetail";

export interface IFilter { 
    process(tokens: Map<string, Array<TokenDetail>>) : Promise<Map<string, Array<TokenDetail>>>;
}