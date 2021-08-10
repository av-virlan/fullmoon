import { AnalyzerSettings } from '../../../../../Common/AnalyzerSettings';
import { FieldValue } from '../../../../../Common/FieldValue'
import { IAnalyzer } from '../../../../../Common/IAnalyzer'
import { TokenDetail, TokenLocation } from '../../../../../Common/TokenDetail'

export class EnglishTextTokenizer implements IAnalyzer {

    private static readonly _wordConnectorsNeedSpace: string[] = ['.', '_', '—', '\u00AD', '\'', '-', '‘', '’', ',', '@', ':', '!', '^', '?', '`', '|', '~', '+', '/', '\\', '*', '#', '$', '%', '&',];
    private static readonly _wordSeparators: string[] = [' ', ';', '"', '(', ')', '[', ']', '{', '}', '<', '>', '=',];

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
        return type.toLowerCase() === "en" || type.toLowerCase() === "eng";
    }

    process(fieldValue: FieldValue, documentId: string): Promise<Map<string, Array<TokenDetail>>> {
        return new Promise(resolve => {
            let stringValue: string = fieldValue.toString();
            let result = new Map<string, Array<TokenDetail>>();
            let pos = 0;
            let currentToken: string[] = [];
            let currentSubToken: string[] = [];
            let skipSubTokens = false;

            let subTokens: Map<string, Array<TokenDetail>> = new Map<string, Array<TokenDetail>>();

            while (pos < stringValue.length) {
                let currentChar: string = stringValue.charAt(pos);
                let nextChar: string = stringValue.charAt(pos + 1);

                if (EnglishTextTokenizer._wordSeparators.indexOf(currentChar) > -1) {
                    if (currentToken.length > 0) {
                        let token = currentToken.join('');
                        let detail = new TokenDetail(documentId, [{ start: pos - currentToken.length, end: pos - 1 }]);
                        if (result.has(token)) {
                            result.get(token)!.push(detail);
                        } else {
                            result.set(token, [detail]);
                        }

                        if (!skipSubTokens) {
                            if (currentSubToken.length) {
                                let subToken = currentSubToken.join('');
                                if (token !== subToken) {
                                    detail = new TokenDetail(documentId, [{ start: pos - currentSubToken.length, end: pos - 1 }]);
                                    subTokens.set(subToken, [detail]);
                                }
                            }

                            subTokens.forEach((value: TokenDetail[], key: string) => {
                                result.set(key, value);
                            });
                        }
                        subTokens.clear();
                        currentToken = [];
                        currentSubToken = [];
                        skipSubTokens = false;
                    }
                } else if (EnglishTextTokenizer._wordConnectorsNeedSpace.indexOf(currentChar) > -1) {
                    if (nextChar !== ' ') {
                        currentToken.push(currentChar);
                        if (currentChar === '\'') {
                            skipSubTokens = true;
                            currentSubToken = [];
                        }
                        if (currentSubToken.length) {
                            let token = currentSubToken.join('');
                            let detail = new TokenDetail(documentId, [{ start: pos - currentSubToken.length, end: pos - 1 }]);
                            if (subTokens.has(token)) {
                                subTokens.get(token)!.push(detail);
                            } else {
                                subTokens.set(token, [detail]);
                            }

                            currentSubToken = [];
                        }
                    }
                } else {
                    currentToken.push(currentChar);
                    currentSubToken.push(currentChar);
                }

                ++pos;
            }

            //Add remaining token
            if (currentToken.length) {
                let token = currentToken.join('');
                let detail = new TokenDetail(documentId, [{ start: pos - currentToken.length, end: pos - 1 }]);
                if (result.has(token)) {
                    result.get(token)!.push(detail);
                } else {
                    result.set(token, [detail]);
                }
                currentToken = [];

                if (!skipSubTokens) {
                    if (currentSubToken.length) {
                        let subToken = currentSubToken.join('');
                        if (subToken !== token) {
                            detail = new TokenDetail(documentId, [{ start: pos - currentSubToken.length, end: pos - 1 }]);
                            subTokens.set(subToken, [detail]);
                        }
                    }
                    subTokens.forEach((value: TokenDetail[], key: string) => {
                        result.set(key, value);
                    });
                }
                subTokens.clear();
                currentSubToken = [];
            }

            resolve(result);
        });
    }
}