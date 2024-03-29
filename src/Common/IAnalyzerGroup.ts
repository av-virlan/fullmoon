import { FieldValue } from './FieldValue';
import { TokenDetail } from './TokenDetail';

export interface IAnalyzerGroup {
    process(fieldValue: FieldValue, documentId: string): Promise<Map<string, Array<TokenDetail>>>;
}
