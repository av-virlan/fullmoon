import { AnalyzerSettings } from "../../../Common/AnalyzerSettings";
import { EnglishTextStopwordFilter } from "./Languages/en/EnglishTextStopwordFilter";
import { NoOpFilter } from "../NoOpFilter";
import { LanguageDetection } from "../../../Common/LanguageDetection";
import { IConditionalFilter } from "../../../Common/IConditionalFilter";

export class LanguageStopwordFilterFactory {
    private _languageStopwordFilters = new Array<IConditionalFilter>();

    constructor(customSettings: AnalyzerSettings) {
        this._languageStopwordFilters.push(new EnglishTextStopwordFilter(customSettings));
        //TODO: add other languages
    }

    get(value: string): Promise<IConditionalFilter> {
        return new Promise(resolve => {
            LanguageDetection.detect(value).then((label: string) => {
                for (let filterIndex = 0; filterIndex < this._languageStopwordFilters.length; filterIndex++) {
                    let currentFilter = this._languageStopwordFilters[filterIndex];
                    if (currentFilter.supports(label)) {
                        return resolve(currentFilter);
                    }
                }

                return resolve(new NoOpFilter());
            });
        });
    }
}