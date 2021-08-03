import { Document } from './Document'
import { IndexDefinition } from './IndexDefinition';

export interface IProcessingPipeline {
    (doc: Document, indexDefinition: IndexDefinition): void;
}
