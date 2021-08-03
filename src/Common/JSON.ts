import { FieldValue } from "./FieldValue";
import { IProcessingPipeline } from "./IProcessingPipeline";
import { TokenLocation } from "./TokenDetail";

export type FieldDefinitionJSON = { name: string, store: boolean, analyzer: string };
export type IndexDefinitionJSON = { fields: Array<FieldDefinitionJSON>, pipeline?: Array<IProcessingPipeline>};
export type IndexStatsJSON = { name: string, change: number, ver: number, count: number };
export type TokenDetailJSON = { docId: string, loc: Array<TokenLocation> };
export type DocumentJSON = { _id: string, fields: { [k: string]: FieldValue } };
export type InvertedIndexJSON = { [k:string]: Array<TokenDetailJSON> };
export type PerFieldInvertedIndexJSON = { [k: string]: InvertedIndexJSON};
export type IndexJSON = { doc: Array<DocumentJSON>, idx: PerFieldInvertedIndexJSON, def: IndexDefinitionJSON, stat: IndexStatsJSON };
export type SearchIndexJSON = { lt: number, si: IndexJSON };