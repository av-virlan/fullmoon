import * as franc from "franc";
import { AnalyzerSettings } from "../../../Common/AnalyzerSettings";
import { IAnalyzer } from "../../../Common/IAnalyzer";
import { NoOpAnalyzer } from "../NoOpAnalyzer";
import { EnglishTextTokenizer } from "./Languages/en/EnglishTextTokenizer";

export class LanguageTokenizerFactory {
    private _languageTokenizers: Array<IAnalyzer> = new Array<IAnalyzer>();

    constructor(customSettings: AnalyzerSettings){
        this._languageTokenizers.push(new EnglishTextTokenizer(customSettings));
        //TODO: add other languages
    }

    get(value: string): IAnalyzer {
        let language = franc(value);
        
        for(let tokenizerIndex = 0; tokenizerIndex < this._languageTokenizers.length; tokenizerIndex++) {
            let currentTokenizer = this._languageTokenizers[tokenizerIndex];
            if(currentTokenizer.supports(language)) {
                return currentTokenizer;
            }
        }

        return new NoOpAnalyzer();
    }
}