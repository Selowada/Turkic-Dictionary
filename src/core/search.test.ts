import { describe, expect, it } from 'vitest';
import { createSearch, normalize } from './search';
import { lemmas } from '../data/lemmas';
describe('dictionary search', () => {
  const search = createSearch(lemmas);
  it.each(['kun','kün','küng','KÜNG',' küŋ '])('matches explicit variant %s', query => expect(search(query)[0]?.id).toBe('kun'));
  it('normalizes transcription and Turkish letters', () => {expect(normalize(' TEŊRİ ')).toBe('tengri');expect(search('tengri')[0].id).toBe('tengri');});
  it('returns prefix suggestions', () => expect(search('b').map(e => e.id)).toEqual(['bilge','bodun']));
  it('returns no entries for missing or empty input', () => {expect(search('xyz')).toEqual([]);expect(search(' ')).toEqual([]);});
  it('accepts a custom normalization policy', () => expect(createSearch(lemmas, t => t.replace(/X/g, 'k'))('Xun')[0].id).toBe('kun'));
  it('looks up a standalone letter and its numbered homographs before considering prefixes', () => {
    const entries = [
      { ...lemmas[0], id: 'third', headword: 'ı:', variants: [], category: '3' },
      { ...lemmas[0], id: 'second', headword: 'ı:', variants: [], category: '2' },
      { ...lemmas[0], id: 'first', headword: 'ı:', variants: [], category: '1' },
      { ...lemmas[0], id: 'two', headword: '*ékkeğü:', variants: ['ikegü'], category: '' },
      { ...lemmas[0], id: 'dotted', headword: 'i:', variants: [], category: '' },
      { ...lemmas[0], id: 'long', headword: 'ığar', variants: [], category: '' },
    ];
    const lookup = createSearch(entries);
    for (const query of ['ı', 'ı:', 'I', '2 ı:']) {
      expect(lookup(query).map(entry => entry.id)).toEqual(['first', 'second', 'third']);
    }
    expect(lookup('i').map(entry => entry.id)).toEqual(['dotted']);
    expect(lookup('ike').map(entry => entry.id)).toEqual(['two']);
  });
  it('distinguishes dotted and dotless i in prefixes and preserves explicit spelling variants', () => {
    const entries = [
      { ...lemmas[0], id: 'two', headword: '*ékkeğü:', variants: ['ikegü'], category: '' },
      { ...lemmas[0], id: 'dotless', headword: 'ıkı:la:ç', variants: ['ikilac'], category: '' },
    ];
    const lookup = createSearch(entries);
    expect(lookup('ık').map(entry => entry.id)).toEqual(['dotless']);
    expect(lookup('IK').map(entry => entry.id)).toEqual(['dotless']);
    expect(lookup('İKE').map(entry => entry.id)).toEqual(['two']);
    expect(lookup('ikegü').map(entry => entry.id)).toEqual(['two']);
    expect(lookup('ikilac').map(entry => entry.id)).toEqual(['dotless']);
  });
  it('browses written headwords for a single letter and still finds full spelling variants', () => {
    const entries = [
      { ...lemmas[0], id: 'deficient', headword: 'egsük', variants: ['öksük'], category: '' },
      { ...lemmas[0], id: 'surety', headword: 'o:', variants: ['o'], category: '1' },
      { ...lemmas[0], id: 'learn', headword: '*öğre:-', variants: [], category: '' },
      { ...lemmas[0], id: 'think', headword: 'ö:-', variants: ['ö-'], category: '' },
    ];
    const lookup = createSearch(entries);
    expect(lookup('ö').map(entry => entry.id)).toEqual(['think', 'learn']);
    expect(lookup('O\u0308').map(entry => entry.id)).toEqual(['think', 'learn']);
    expect(lookup('ö:').map(entry => entry.id)).toEqual(['think']);
    expect(lookup('o').map(entry => entry.id)).toEqual(['surety']);
    expect(lookup('öksük').map(entry => entry.id)).toEqual(['deficient']);
  });
  it('does not globally discard g', () => expect(normalize('bag')).not.toBe(normalize('ba')));
  it('ranks exact matches ahead of prefixes', () => {const entries=[{...lemmas[0],id:'long',headword:'kuna',variants:[]},lemmas[0]];expect(createSearch(entries)('kun')[0].id).toBe('kun');});
});
