/* istanbul ignore file */

import { FieldValue } from '../Common/FieldValue'
import { IAnalyzerGroup } from '../Common/IAnalyzerGroup'
import { TokenDetail } from '../Common/TokenDetail'

export class CodeAnalyzer implements IAnalyzerGroup {
    private _settings: Map<string, any> = new Map<string, any>([
        //TODO: add default settings
    ]);

    constructor(analyzerSettings: Map<string, any>) {
        this._settings = analyzerSettings;
    }
    
    process(fieldValue: FieldValue, documentId: string): Promise<Map<string, Array<TokenDetail>>> {
        //TODO: process the fieldValue
        return new Promise(resolve => {
            resolve(new Map<string, Array<TokenDetail>>());
        });
    }
}