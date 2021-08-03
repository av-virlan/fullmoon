//We could be more restrictive but we want to support sub-fields as well like:
//{ id: doc1, content { type: 'text', length: 250, value: '...'} }
export type FieldValue = any;