import { AnalyzerSettings } from "../../../../../Common/AnalyzerSettings";
import { IFilter } from "../../../../../Common/IFilter";
import { TokenDetail } from "../../../../../Common/TokenDetail";

export class EnglishTextContractionFilter implements IFilter {

    public static readonly CONTRACTIONS_SETTING_KEY: string = "contractions";

    //Computed based on https://en.wikipedia.org/wiki/Wikipedia%3aList_of_English_contractions
    private static readonly _contractions = new Map<string, string[]>([["a'ight", ["alright"]], ["ain't", ["am", "is", "are", "has", "have", "did", "not"]], ["amn't", ["am", "not"]], ["arencha", ["are", "not", "you"]], ["aren't", ["are", "not"]], ["'bout", ["about"]], ["cannot", ["can", "not"]], ["can't", ["cannot"]], ["cap'n", ["captain"]], ["'cause", ["because"]], ["'cept", ["except"]], ["could've", ["could", "have"]], ["couldn't", ["could", "not"]], ["couldn't've", ["could", "not", "have"]], ["dammit", ["damn", "it"]], ["daren't", ["dare", "not", "dared"]], ["daresn't", ["dare", "not"]], ["dasn't", ["dare", "not"]], ["didn't", ["did", "not"]], ["doesn't", ["does", "not"]], ["don't", ["do", "not", "does"]], ["dunno", ["know", "do", "not"]], ["d'ye", ["do", "you", "did"]], ["e'en", ["even"]], ["e'er", ["ever"]], ["'em", ["them"]], ["everybody's", ["everybody", "is"]], ["everyone's", ["everyone", "is"]], ["fo'c'sle", ["forecastle"]], ["'gainst", ["against"]], ["g'day", ["good", "day"]], ["gimme", ["give", "me"]], ["giv'n", ["given"]], ["gonna", ["going", "to"]], ["gon't", ["go", "not"]], ["gotta", ["got", "to"]], ["hadn't", ["had", "not"]], ["had've", ["had", "have"]], ["hasn't", ["has", "not"]], ["haven't", ["have", "not"]], ["he'd", ["he", "had", "would"]], ["he'll", ["he", "shall", "will"]], ["helluva", ["hell", "of", "a"]], ["he's", ["he", "has", "is"]], ["here's", ["here", "is"]], ["how'd", ["how", "did", "would"]], ["howdy", ["how", "do", "you", "fare"]], ["how'll", ["how", "will"]], ["how're", ["how", "are"]], ["how's", ["how", "has", "is", "does"]], ["I'd", ["I", "had", "would"]], ["I'd've", ["I", "would", "have"]], ["I'll", ["I", "shall", "will"]], ["I'm", ["I", "am"]], ["Imma", ["I", "am", "about", "to"]], ["I'm'o", ["I", "am", "going", "to"]], ["innit", ["is", "it", "not"]], ["Ion", ["I", "do", "not"]], ["I've", ["I", "have"]], ["isn't", ["is", "not"]], ["it'd", ["it", "would"]], ["it'll", ["it", "shall", "will"]], ["it's", ["it", "has", "is"]], ["Iunno", ["I", "know"]], ["kinda", ["kind", "of"]], ["let's", ["let", "us"]], ["ma'am", ["madam"]], ["mayn't", ["may", "not"]], ["may've", ["may", "have"]], ["methinks", ["I", "think"]], ["mightn't", ["might", "not"]], ["might've", ["might", "have"]], ["mustn't", ["must", "not"]], ["mustn't've", ["must", "not", "have"]], ["must've", ["must", "have"]], ["'neath", ["beneath"]], ["needn't", ["need", "not"]], ["nal", ["and", "all"]], ["ne'er", ["never"]], ["o'clock", ["of", "the", "clock"]], ["o'er", ["over"]], ["ol'", ["old"]], ["oughtn't", ["ought", "not"]], ["'round", ["around"]], ["'s", ["is,", "has,", "does,", "or", "us"]], ["shalln't", ["shall", "not"]], ["shan't", ["shall", "not"]], ["she'd", ["she", "had", "would"]], ["she'll", ["she", "shall", "will"]], ["she's", ["she", "has", "is"]], ["should've", ["should", "have"]], ["shouldn't", ["should", "not"]], ["shouldn't've", ["should", "not", "have"]], ["somebody's", ["somebody", "has", "is"]], ["someone's", ["someone", "has", "is"]], ["something's", ["something", "has", "is"]], ["so're", ["so", "are"]], ["so's", ["so", "is", "has"]], ["so've", ["so", "have"]], ["that'll", ["that", "shall", "will"]], ["that're", ["that", "are"]], ["that's", ["that", "has", "is"]], ["that'd", ["that", "would", "had"]], ["there'd", ["there", "had", "would"]], ["there'll", ["there", "shall", "will"]], ["there're", ["there", "are"]], ["there's", ["there", "has", "is"]], ["these're", ["these", "are"]], ["these've", ["these", "have"]], ["they'd", ["they", "had", "would"]], ["they'll", ["they", "shall", "will"]], ["they're", ["they", "are", "were"]], ["they've", ["they", "have"]], ["this's", ["this", "has", "is"]], ["those're", ["those", "are"]], ["those've", ["those", "have"]], ["'thout", ["without"]], ["'til", ["until"]], ["'tis", ["it", "is"]], ["to've", ["to", "have"]], ["'twas", ["it", "was"]], ["'tween", ["between"]], ["'twere", ["it", "were"]], ["wanna", ["want", "to"]], ["wasn't", ["was", "not"]], ["we'd", ["we", "had", "would/", "did"]], ["we'd've", ["we", "would", "have"]], ["we'll", ["we", "shall", "will"]], ["we're", ["we", "are"]], ["we've", ["we", "have"]], ["weren't", ["were", "not"]], ["whatcha", ["what", "are", "you", "about"]], ["what'd", ["what", "did"]], ["what'll", ["what", "shall", "will"]], ["what're", ["what", "are/what", "were"]], ["what's", ["what", "has", "is", "does"]], ["what've", ["what", "have"]], ["when's", ["when", "has", "is"]], ["where'd", ["where", "did"]], ["where'll", ["where", "shall", "will"]], ["where're", ["where", "are"]], ["where's", ["where", "has", "is", "does"]], ["where've", ["where", "have"]], ["which'd", ["which", "had", "would"]], ["which'll", ["which", "shall", "will"]], ["which're", ["which", "are"]], ["which's", ["which", "has", "is"]], ["which've", ["which", "have"]], ["who'd", ["who", "would", "had", "did"]], ["who'd've", ["who", "would", "have"]], ["who'll", ["who", "shall", "will"]], ["who're", ["who", "are"]], ["who's", ["who", "has", "is", "does"]], ["who've", ["who", "have"]], ["why'd", ["why", "did"]], ["why're", ["why", "are"]], ["why's", ["why", "has", "is", "does"]], ["willn't", ["will", "not"]], ["won't", ["will", "not"]], ["wonnot", ["will", "not"]], ["would've", ["would", "have"]], ["wouldn't", ["would", "not"]], ["wouldn't've", ["would", "not", "have"]], ["y'all", ["you", "all"]], ["y'all'd've", ["you", "all", "would", "have"]], ["y'all'd'n't've", ["you", "all", "would", "not", "have"]], ["y'all're", ["you", "all", "are"]], ["y'at", ["you", "at"]], ["yes'm", ["yes", "madam"]], ["yessir", ["yes", "sir"]], ["yesn't", ["yes", "not"]], ["you'd", ["you", "had", "would"]], ["you'll", ["you", "shall", "will"]], ["you're", ["you", "are"]], ["you've", ["you", "have"]]]);

    private _settings: Map<string, any> = new Map<string, any>([
        [EnglishTextContractionFilter.CONTRACTIONS_SETTING_KEY, EnglishTextContractionFilter._contractions]
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
        const result = new Map<string, Array<TokenDetail>>(tokens);

        const contractions: string[] = [...result.keys()].filter(key => EnglishTextContractionFilter._contractions.has(key));

        contractions.forEach(key => {
            const expandedContraction = EnglishTextContractionFilter._contractions.get(key)!;
            const value = result.get(key)!;
            expandedContraction.forEach(expansion => {
                const currentValue = result.get(expansion) || [];
                Array.prototype.push.apply(currentValue, value);
                result.set(expansion, value);
            });
        });

        return result;
    }
}