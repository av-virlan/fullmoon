import * as franc from "franc";
import { AnalyzerSettings } from "../../../Common/AnalyzerSettings";
import { IFilter } from "../../../Common/IFilter";
import { NoOpFilter } from "../NoOpFilter";
import { EnglishTextStemmer } from "./Languages/en/EnglishTextStemmer";

export class LanguageStemmerFactory {
    private _languageStemmers: Array<IFilter> = new Array<IFilter>();

    constructor(customSettings: AnalyzerSettings){
        this._languageStemmers.push(new EnglishTextStemmer(customSettings));
        //TODO: add other languages
    }

    get(value: string): IFilter {
        let language = franc(value);
        
        for(let stemmerIndex = 0; stemmerIndex < this._languageStemmers.length; stemmerIndex++) {
            let currentStemmer = this._languageStemmers[stemmerIndex];
            if(currentStemmer.supports(language)) {
                return currentStemmer;
            }
        }

        return new NoOpFilter();
    }
}