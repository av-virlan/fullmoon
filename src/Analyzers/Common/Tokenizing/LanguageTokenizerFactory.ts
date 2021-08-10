import { LanguageDetection } from "../../../Common/LanguageDetection";
import { AnalyzerSettings } from "../../../Common/AnalyzerSettings";
import { IAnalyzer } from "../../../Common/IAnalyzer";
import { NoOpAnalyzer } from "../NoOpAnalyzer";
import { EnglishTextTokenizer } from "./Languages/en/EnglishTextTokenizer";

export class LanguageTokenizerFactory {
    private _languageTokenizers: Array<IAnalyzer> = new Array<IAnalyzer>();

    constructor(customSettings: AnalyzerSettings) {
        this._languageTokenizers.push(new EnglishTextTokenizer(customSettings));
        //TODO: add other languages
    }

    get(value: string): Promise<IAnalyzer> {
        return new Promise(resolve => {
            LanguageDetection.detect(value).then((label: string) => {
                for (let tokenizerIndex = 0; tokenizerIndex < this._languageTokenizers.length; tokenizerIndex++) {
                    let currentTokenizer = this._languageTokenizers[tokenizerIndex];
                    if (currentTokenizer.supports(label)) {
                        return resolve(currentTokenizer);
                    }
                }

                return resolve(new NoOpAnalyzer());
            });
        });
    }
}