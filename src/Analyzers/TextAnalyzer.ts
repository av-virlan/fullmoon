import { AnalyzerSettings } from '../Common/AnalyzerSettings';
import { FieldValue } from '../Common/FieldValue'
import { IAnalyzer } from '../Common/IAnalyzer';
import { IAnalyzerGroup } from '../Common/IAnalyzerGroup'
import { TokenDetail } from '../Common/TokenDetail'
import { NoOpAnalyzer } from './Common/NoOpAnalyzer';
import { PlainTextAnalyzer } from './Text/plaintext/PlainTextAnalyzer';

export class TextAnalyzer implements IAnalyzerGroup {
    private _supportedAnalyzers: Array<IAnalyzer> = new Array<IAnalyzer>();
    private _settings: Map<string, any> = new Map<string, any>([
        [ "type", "text" ]
    ]);
    private _analyzer: IAnalyzer;

    private setSettings(customSettings: AnalyzerSettings) {
        Object.keys(customSettings).forEach(key => this._settings.set(key, customSettings[key]));
    }

    private getAnalyzer(type: string) {
        for(let analyzerIndex = 0; analyzerIndex < this._supportedAnalyzers.length; analyzerIndex++) {
            let currentAnalyzer = this._supportedAnalyzers[analyzerIndex];
            if(currentAnalyzer.supports(type)) {
                return currentAnalyzer;
            }
        }

        return new NoOpAnalyzer();
    }

    constructor(customSettings: AnalyzerSettings) {
        this.setSettings(customSettings);
        this._supportedAnalyzers.push(new PlainTextAnalyzer(customSettings));
        this._analyzer = this.getAnalyzer(this._settings.get("type"));
    }
    
    process(fieldValue: FieldValue, documentId: string): Promise<Map<string, Array<TokenDetail>>> {
        return this._analyzer.process(fieldValue, documentId);
    }
}