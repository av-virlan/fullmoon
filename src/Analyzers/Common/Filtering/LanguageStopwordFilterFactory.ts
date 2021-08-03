import * as franc from "franc";
import { AnalyzerSettings } from "../../../Common/AnalyzerSettings";
import { IFilter } from "../../../Common/IFilter";
import { EnglishTextStopwordFilter } from "./Languages/en/EnglishTextStopwordFilter";
import { NoOpFilter } from "../NoOpFilter";

export class LanguageStopwordFilterFactory {
    private _languageStopwordFilters: Array<IFilter> = new Array<IFilter>();

    constructor(customSettings: AnalyzerSettings){
        this._languageStopwordFilters.push(new EnglishTextStopwordFilter(customSettings));
        //TODO: add other languages
    }

    get(value: string): IFilter {
        let language = franc(value);
        
        for(let filterIndex = 0; filterIndex < this._languageStopwordFilters.length; filterIndex++) {
            let currentFilter = this._languageStopwordFilters[filterIndex];
            if(currentFilter.supports(language)) {
                return currentFilter;
            }
        }

        return new NoOpFilter();
    }
}