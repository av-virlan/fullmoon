import { AnalyzerSettings } from "../../../Common/AnalyzerSettings";
import EnglishTextContractionFilter from "./Languages/en/EnglishTextContractionFilter";
import { NoOpFilter } from "../NoOpFilter";
import { LanguageDetection } from "../../../Common/LanguageDetection";
import { IConditionalFilter } from "../../../Common/IConditionalFilter";

export class LanguageContractionFilterFactory {
    private _languageContractionFilters = new Array<IConditionalFilter>();

    constructor(customSettings: AnalyzerSettings) {
        this._languageContractionFilters.push(new EnglishTextContractionFilter(customSettings));
        //TODO: add other languages
    }

    get(value: string): Promise<IConditionalFilter> {
        return new Promise(resolve => {
            LanguageDetection.detect(value).then((label: string) => {
                for (let filterIndex = 0; filterIndex < this._languageContractionFilters.length; filterIndex++) {
                    let currentFilter = this._languageContractionFilters[filterIndex];
                    if (currentFilter.supports(label)) {
                        return resolve(currentFilter);
                    }
                }

                return resolve(new NoOpFilter());
            });
        });
    }
}