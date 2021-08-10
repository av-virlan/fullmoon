import { AnalyzerSettings } from "../../../Common/AnalyzerSettings";
import { IAnalyzer } from "../../../Common/IAnalyzer";
import { IFilter } from "../../../Common/IFilter";
import { TokenDetail } from "../../../Common/TokenDetail";
import { TryDecode } from "../../../Common/Utils";
import { EmojiContractionFilter } from "../../Common/Filtering/EmojiContractionFilter";
import { LanguageContractionFilterFactory } from "../../Common/Filtering/LanguageContractionFilterFactory";
import { LanguageStopwordFilterFactory } from "../../Common/Filtering/LanguageStopwordFilterFactory";
import { LowercaseFilter } from "../../Common/Filtering/LowercaseFilter";
import { LanguageStemmerFactory } from "../../Common/Stemming/LanguageStemmerFactory";
import { LanguageTokenizerFactory } from "../../Common/Tokenizing/LanguageTokenizerFactory";

export class PlainTextAnalyzer implements IAnalyzer {
    private readonly SUPPORTED_TYPES: Array<string> = new Array<string>(
        "plain",
        "text",
        "txt",
        "plain/text",
        "text/plain",
        "plaintext",
        "ascii",
        "utf-8",
        "ibm866",
        "iso-8859-2",
        "iso-8859-3",
        "iso-8859-4",
        "iso-8859-5",
        "iso-8859-6",
        "iso-8859-7",
        "iso-8859-8",
        "iso-8859-8i",
        "iso-8859-10",
        "iso-8859-13",
        "iso-8859-14",
        "iso-8859-15",
        "iso-8859-16",
        "koi8-r",
        "koi8-u",
        "macintosh",
        "windows-874",
        "windows-1250",
        "windows-1251",
        "windows-1252",
        "windows-1253",
        "windows-1254",
        "windows-1255",
        "windows-1256",
        "windows-1257",
        "windows-1258",
        "x-mac-cyrillic",
        "gbk",
        "gb18030",
        "hz-gb-2312",
        "big5.",
        "euc-jp",
        "iso-2022-jp",
        "shift-jis.",
        "euc-kr",
        "iso-2022-kr",
        "utf-16be",
        "utf-16le",
        "x-user-defined"
    );

    private _languageStemmerFactory: LanguageStemmerFactory;
    private _languageTokenizerFactory: LanguageTokenizerFactory;
    private _languageStopwordFilterFactory: LanguageStopwordFilterFactory;
    private _lowercaseFilter: IFilter = new LowercaseFilter();
    private _languageContractionFilterFactory: LanguageContractionFilterFactory;
    private _emojiContractionFilter: IFilter = new EmojiContractionFilter();

    private _settings: Map<string, any> = new Map<string, any>([
        //TODO: add default settings
    ]);

    private setSettings(customSettings: AnalyzerSettings) {
        Object.keys(customSettings).forEach(key => this._settings.set(key, customSettings[key]));
    }

    private stem(tokens: Map<string, Array<TokenDetail>>, fieldStringValue: string): Promise<Map<string, Array<TokenDetail>>> {
        return this._languageStemmerFactory.get(fieldStringValue).then(stemmer => stemmer.process(tokens));
    }

    private stopWordFilter(tokens: Map<string, Array<TokenDetail>>, fieldStringValue: string): Promise<Map<string, Array<TokenDetail>>> {
        return this._languageStopwordFilterFactory.get(fieldStringValue).then(stopWordFilter => stopWordFilter.process(tokens));
    }

    private contractionFilter(tokens: Map<string, Array<TokenDetail>>, fieldStringValue: string): Promise<Map<string, Array<TokenDetail>>> {
        return this._languageContractionFilterFactory.get(fieldStringValue).then(contractionFilter => contractionFilter.process(tokens));
    }

    private emojiFilter(tokens: Map<string, Array<TokenDetail>>): Promise<Map<string, Array<TokenDetail>>> {
        return this._emojiContractionFilter.process(tokens);
    }

    private tokenize(fieldStringValue: string, documentId: string): Promise<Map<string, Array<TokenDetail>>> {
        return this._languageTokenizerFactory.get(fieldStringValue).then((tokenizer: IAnalyzer) => tokenizer.process(fieldStringValue, documentId));
    }

    private casing(tokens: Map<string, Array<TokenDetail>>) {
        return this._lowercaseFilter.process(tokens);
    }

    constructor(customSettings: AnalyzerSettings) {
        this.setSettings(customSettings);
        this._languageTokenizerFactory = new LanguageTokenizerFactory(customSettings);
        this._languageStemmerFactory = new LanguageStemmerFactory(customSettings);
        this._languageStopwordFilterFactory = new LanguageStopwordFilterFactory(customSettings);
        this._languageContractionFilterFactory = new LanguageContractionFilterFactory(customSettings);
    }

    supports(type: string): boolean {
        return this.SUPPORTED_TYPES.indexOf(type.toLowerCase()) >= 0;
    }

    process(fieldValue: any, documentId: string): Promise<Map<string, Array<TokenDetail>>> {
        let decodeResult = TryDecode(fieldValue);

        if (decodeResult.error) {
            let tokenDetail = new TokenDetail(documentId, [{ start: 0, end: fieldValue.length - 1 }]);
            return new Promise<Map<string, Array<TokenDetail>>>(resolve => {
                    const emptyMap = [fieldValue, [tokenDetail]];
                    resolve(new Map<string, Array<TokenDetail>>(emptyMap))
                }
            );
        }

        const fieldStringValue = decodeResult.value;

        return this.tokenize(fieldStringValue, documentId)
            .then(tokens => this.casing(tokens))
            .then(tokens => this.stopWordFilter(tokens, fieldStringValue))
            .then(tokens => this.contractionFilter(tokens, fieldStringValue))
            .then(tokens => this.emojiFilter(tokens))
            .then(tokens => this.stem(tokens, fieldStringValue));
    }
}