import { FieldValue } from './FieldValue';
import { TokenDetail } from './TokenDetail';

export interface IAnalyzer {
    supports(type: string): boolean;
    process(fieldValue: FieldValue, documentId: string): Map<string, Array<TokenDetail>>;
}

