import type { Lemma } from './types';
export type Normalizer = (text: string) => string;
// Fold diacritics and ng/ŋ while preserving the Turkish dotted and dotless i.
export const normalize: Normalizer = text => text.trim().toLocaleLowerCase('tr').replace(/ŋ/g, 'ng').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export function homographNumber(entry: Lemma): string {
  return /^\d+$/.test(entry.category) ? entry.category : '';
}

export function lemmaLabel(entry: Lemma): string {
  const number = homographNumber(entry);
  return number ? `${number} ${entry.headword}` : entry.headword;
}

export function createSearch(entries: readonly Lemma[], normalizer: Normalizer = normalize) {
  const indexed = entries.map(entry => {
    const keys = [entry.headword, ...entry.variants];
    const number = homographNumber(entry);
    if (number) {
      keys.push(...keys.filter(key => !/^\d+\s/.test(key)).map(key => `${number} ${key}`));
    }
    const writtenHeadword = entry.headword.trim().normalize('NFC').toLocaleLowerCase('tr').replace(/^\*/, '');
    return { entry, keys: keys.map(normalizer), writtenHeadword };
  });
  return (query: string): Lemma[] => {
    const key = normalizer(query);
    if (!key) return [];
    const singleLetter = /^(?:(\d+)\s+)?(\p{L})(:)?$/u.exec(query.trim().normalize('NFC').toLocaleLowerCase('tr'));
    if (singleLetter) {
      const [, number, letter, lengthMark = ''] = singleLetter;
      const standalone = indexed.filter(({ writtenHeadword }) =>
        writtenHeadword === letter || writtenHeadword === letter + ':'
      );
      const candidates = standalone.some(({ entry }) => !number || homographNumber(entry) === number)
        ? standalone
        : indexed.filter(({ entry, writtenHeadword }) =>
          writtenHeadword.startsWith(letter + lengthMark) && (!number || homographNumber(entry) === number)
        );

      return candidates.sort((a, b) =>
        (candidates === standalone ? 0 : a.writtenHeadword.localeCompare(b.writtenHeadword, 'tr')) ||
        homographNumber(a.entry).localeCompare(homographNumber(b.entry), 'tr', { numeric: true })
      ).map(({ entry }) => entry);
    }

    const groupKey = (entry: Lemma) => normalizer(entry.headword.split('/', 1)[0]).replace(/^\*|:/g, '');
    const matchedGroups = new Map(
      indexed.filter(({ entry, keys }) => homographNumber(entry) && keys.includes(key))
        .map(({ entry }) => [groupKey(entry), entry.headword] as const)
    );

    return indexed.map(({ entry, keys }) => {
      const groupHeadword = matchedGroups.get(groupKey(entry));
      const sameGroup = homographNumber(entry) && groupHeadword !== undefined;
      const rank = sameGroup || keys.includes(key) ? 0 : keys.some(k => k.startsWith(key)) ? 1 : 2;
      return { entry, rank, sortHeadword: groupHeadword ?? entry.headword };
    }).filter(item => item.rank < 2).sort((a, b) =>
      a.rank - b.rank ||
      a.sortHeadword.localeCompare(b.sortHeadword, 'tr') ||
      homographNumber(a.entry).localeCompare(homographNumber(b.entry), 'tr', { numeric: true }) ||
      a.entry.headword.localeCompare(b.entry.headword, 'tr')
    ).map(item => item.entry);
  };
}
