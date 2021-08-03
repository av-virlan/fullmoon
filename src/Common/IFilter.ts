import { TokenDetail } from "./TokenDetail";

export interface IFilter { 
    supports(type: string): boolean;
    process(tokens: Map<string, Array<TokenDetail>>) : Map<string, Array<TokenDetail>>;
}