import { IFilter } from "./IFilter";

export interface IConditionalFilter extends IFilter {
    supports(type: string): boolean;
}
