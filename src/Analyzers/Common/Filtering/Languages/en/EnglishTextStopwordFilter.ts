import { AnalyzerSettings } from "../../../../../Common/AnalyzerSettings";
import { IConditionalFilter } from "../../../../../Common/IConditionalFilter";
import { TokenDetail } from "../../../../../Common/TokenDetail";

export class EnglishTextStopwordFilter implements IConditionalFilter {

    public static readonly STOPWORDS_SETTING_KEY = "stopwords";
    public static readonly CLEAN_JARGON_SETTINGS_KEY = "cleanJargon";

    //Computed based on https://github.com/apache/lucene/blob/d5d6dc079395c47cd6d12dcce3bcfdd2c7d9dc63/lucene/analysis/common/src/java/org/apache/lucene/analysis/en/EnglishAnalyzer.java
    private static readonly _stopwords: string[] = ["a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these", "they", "this", "to", "was", "will", "with"];

    private _settings: Map<string, any> = new Map<string, any>([
        [EnglishTextStopwordFilter.STOPWORDS_SETTING_KEY, EnglishTextStopwordFilter._stopwords],
        [EnglishTextStopwordFilter.CLEAN_JARGON_SETTINGS_KEY, true]
    ]);

    private setSettings(customSettings: AnalyzerSettings) {
        Object.keys(customSettings).forEach(key => this._settings.set(key, customSettings[key]));
    }

    constructor(customSettings: AnalyzerSettings) {
        this.setSettings(customSettings);
    }

    supports(type: string): boolean {
        return type.toLowerCase() === "en" || type.toLowerCase() === "eng";
    }

    process(tokens: Map<string, Array<TokenDetail>>): Promise<Map<string, Array<TokenDetail>>> {
        return new Promise(resolve => {
            let result = new Map<string, Array<TokenDetail>>();

            let validTokens = [...tokens.keys()].filter(key => key.length > 1 && this._settings.get(EnglishTextStopwordFilter.STOPWORDS_SETTING_KEY).indexOf(key) === -1 && !this.isJargon(key));
            validTokens.forEach(token => result.set(token, tokens.get(token)!));

            resolve(result);
        });
    }

    private isJargon(key: string): boolean {
        let lowerKey = key.toLowerCase();

        // ahhh
        // brrrr
        // ufff
        // woushhh
        const letters = [...new Set(lowerKey.split(''))];

        //English does not have words with same letter 3 times
        //based on https://www.lexico.com/explore/words-with-same-letter-three-times-in-a-row
        const repeatThreeTimes = (v: string) => v.repeat(3);
        const containsSubstring = (v: string) => lowerKey.indexOf(v) > -1;

        let charReps = letters.map(repeatThreeTimes).filter(containsSubstring);
        let tooManyReps = charReps && charReps.length > 0;

        // !!
        // ??
        // ...
        // oooOoooo
        // zZzzZzz
        let sameCharEntireString = lowerKey[0].repeat(lowerKey.length) === lowerKey;

        return tooManyReps || sameCharEntireString;
    }
}