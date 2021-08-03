import { CodeAnalyzer } from "../Analyzers/CodeAnalyzer";
import { TextAnalyzer } from "../Analyzers/TextAnalyzer";
import * as RJSON from 'relaxed-json';
import { AnalyzerSettings } from "./AnalyzerSettings";
import { IAnalyzerGroup } from "./IAnalyzerGroup";

export class AnalyzerFactory {
    private parseSettings(analyzerSettings: AnalyzerSettings): Map<string, any> {
        return new Map<string, any>(Object.entries(analyzerSettings));
    }

    get(analyzer: string): IAnalyzerGroup {
        let analyzerSettings: AnalyzerSettings = {};
        // Using RJSON (relaxed-json) because it is more compact
        //  No quotes around keys or values so no need to escape them either
        //  No commas between properties unless they have complex values
        //  See: http://www.relaxedjson.org/
        //
        // Settings comparison:
        //  For code analyzer:
        //      JSON: code:{\"type\":\"typescript\",\"splitCamelCase\":true}
        //      RJSON: code:{type:typescript splitCamelCaseIdentifier:true}
        //  Similar for text analyer:
        //      JSON: text:{\"type\": \"markdown\", \"parseLinks\":false}
        //      RSON: text:{type:markdown parseLinks:false}
        if(analyzer.indexOf(':') < 0) {
            analyzer = `${analyzer}:{}`;
        }

        analyzerSettings = RJSON.parse(`{${analyzer}}`);
        
        let analyzerTypes = Object.keys(analyzerSettings);
        if(analyzerTypes.length > 1) {
            console.warn(`Multiple analyzers detected ${analyzerTypes} - only first one will be used`);
        }

        let settings = this.parseSettings(analyzerSettings);
        
        switch (analyzerTypes[0].toLowerCase()) {
            case 'code':
                return new CodeAnalyzer(settings);
            case 'text':
                return new TextAnalyzer(settings);
            default:
                console.log(`Warning: Analyzer '${analyzerTypes[0]}' does not exist. Using text analyzer with default settings instead`);
                return new TextAnalyzer({});
        }
    }
}