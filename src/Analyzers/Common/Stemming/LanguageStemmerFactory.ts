import { AnalyzerSettings } from "../../../Common/AnalyzerSettings";
import { IConditionalFilter } from "../../../Common/IConditionalFilter";
import { LanguageDetection } from "../../../Common/LanguageDetection";
import { NoOpFilter } from "../NoOpFilter";
import { EnglishTextStemmer } from "./Languages/en/EnglishTextStemmer";

export class LanguageStemmerFactory {
    private _languageStemmers = new Array<IConditionalFilter>();

    constructor(customSettings: AnalyzerSettings) {
        this._languageStemmers.push(new EnglishTextStemmer(customSettings));
        //TODO: add other languages
    }

    get(value: string): Promise<IConditionalFilter> {
        return new Promise(resolve => {
            LanguageDetection.detect(value).then((label: string) => {
                for (let stemmerIndex = 0; stemmerIndex < this._languageStemmers.length; stemmerIndex++) {
                    let currentStemmer = this._languageStemmers[stemmerIndex];
                    if (currentStemmer.supports(label)) {
                        return resolve(currentStemmer);
                    }
                }

                return resolve(new NoOpFilter());
            });
        });
    }
}