import * as franc from "franc";
import { AnalyzerSettings } from "../../../Common/AnalyzerSettings";
import { IFilter } from "../../../Common/IFilter";
import { EnglishTextContractionFilter } from "./Languages/en/EnglishTextContractionFilter";
import { NoOpFilter } from "../NoOpFilter";

export class LanguageContractionFilterFactory {
    private _languageContractionFilters: Array<IFilter> = new Array<IFilter>();

    constructor(customSettings: AnalyzerSettings){
        this._languageContractionFilters.push(new EnglishTextContractionFilter(customSettings));
        //TODO: add other languages
    }

    get(value: string): IFilter {
        let language = franc(value);
        
        for(let filterIndex = 0; filterIndex < this._languageContractionFilters.length; filterIndex++) {
            let currentFilter = this._languageContractionFilters[filterIndex];
            if(currentFilter.supports(language)) {
                return currentFilter;
            }
        }

        return new NoOpFilter();
    }
}