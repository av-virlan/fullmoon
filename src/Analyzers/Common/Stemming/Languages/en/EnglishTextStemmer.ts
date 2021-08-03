import { AnalyzerSettings } from "../../../../../Common/AnalyzerSettings";
import { IAnalyzer } from "../../../../../Common/IAnalyzer";
import { IFilter } from "../../../../../Common/IFilter";
import { TokenDetail } from "../../../../../Common/TokenDetail";

export class EnglishTextStemmer implements IFilter {
    private _settings: Map<string, any> = new Map<string, any>([
        //TODO: add default settings
    ]);

    private setSettings(customSettings: AnalyzerSettings) {
        Object.keys(customSettings).forEach(key => this._settings.set(key, customSettings[key]));
    }

    constructor(customSettings: AnalyzerSettings) {
        this.setSettings(customSettings);
    }

    supports(type: string): boolean {
        return type.toLowerCase() === "eng";
    }

    process(tokens: Map<string, Array<TokenDetail>>): Map<string, Array<TokenDetail>> {
        //TODO: implement stemming
        return tokens;
    }

}