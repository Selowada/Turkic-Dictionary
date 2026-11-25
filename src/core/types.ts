export const sources = ['Clauson', 'Ergin', 'Caferoğlu', 'Eren'] as const;
export type Source = typeof sources[number] | string;
export interface Definition { text: string; isExample: boolean; reference?: string; reviewStatus?: string; rawOcr?: string }
export interface Lemma { id: string; headword: string; variants: string[]; category: string; gloss: string; definitions: Partial<Record<string, Definition>> }
