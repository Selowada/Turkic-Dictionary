import { describe, expect, it } from 'vitest';
import entries from './clauson-first100.json';
import { createSearch } from '../core/search';

describe('Clauson OCR import', () => {
  it('keeps exactly 100 ordered, unique source entries', () => {
    expect(entries).toHaveLength(100);
    expect(new Set(entries.map(e => e.id)).size).toBe(100);
    expect(entries.map(e => e.sourceSequence)).toEqual(Array.from({length:100},(_,i)=>i+1));
    expect(entries[0].sourceHeadword).toBe('a:');
    expect(entries[99].sourceHeadword).toBe('avılku:');
  });
  it('keeps unverified OCR and traceable source pages for every entry', () => {
    for (const entry of entries) {
      const d=entry.definitions.Clauson;
      expect(d.reviewStatus).toBe('needs-review');
      expect(d.isExample).toBe(false);
      expect(d.text.trim().length).toBeGreaterThan(0);
      expect(d.rawOcr).toBe(d.provenance.segments.map(s=>s.text).join('\n'));
      expect(d.provenance.fullTextVerified).toBe(false);
      expect(d.provenance.pdfPages).toEqual(d.provenance.printedPages.map(p=>p+45));
    }
  });
  it('finds plain spellings without collapsing numbered homographs', () => {
    const search=createSearch(entries);
    expect(search('avlat')[0].headword).toBe('avlat-');
    expect(search('avılku')[0].id).toBe('clauson-1972-0100');
    expect(search('ı').filter(e=>e.headword==='ı:')).toHaveLength(3);
    expect(search('avla').filter(e=>e.headword==='avla:-')).toHaveLength(2);
    expect(search('nonexistent-word')).toEqual([]);
  });
  it('joins entries that continue on the next printed page', () => {
    const entry=entries.find(e=>e.sourceSequence===11)!;
    expect(entry.definitions.Clauson.provenance.printedPages).toEqual([2,3]);
    expect(entries[99].definitions.Clauson.text).not.toContain('See 2 avla:');
  });
});
