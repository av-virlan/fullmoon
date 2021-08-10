import { FieldValue } from './FieldValue';
import { TokenDetail } from './TokenDetail';

export interface IAnalyzer {
    supports(type: string): boolean;
    process(fieldValue: FieldValue, documentId: string): Promise<Map<string, Array<TokenDetail>>>;
}

