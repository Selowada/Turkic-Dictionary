import { useId, useMemo, useRef, useState } from 'react';
import { createSearch, homographNumber, lemmaLabel, type Normalizer } from '../core/search';
import { sources, type Lemma } from '../core/types';
import './dictionary.css';
import { DefinitionText } from './DefinitionText';
const letterChoices = new Map([
  ['ng', 'ŋ'],
  ['sh', 'ş'],
  ['ny', 'ñ'],
  ['ch', 'ç'],
  ['oe', 'ö'],
  ['ue', 'ü'],
]);

export interface DictionaryProps { entries: readonly Lemma[]; normalizer?: Normalizer; initialQuery?: string }
export function Dictionary({ entries, normalizer, initialQuery = '' }: DictionaryProps) {
  const search = useMemo(() => createSearch(entries, normalizer), [entries, normalizer]);
  const [query, setQuery] = useState(initialQuery);
  const [selected, setSelected] = useState<Lemma | null>(null);
  const [searched, setSearched] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [active, setActive] = useState(-1);
  const [caret, setCaret] = useState(initialQuery.length);
  const [letterDismissed, setLetterDismissed] = useState(false);
  const letterStart = Math.max(0, caret - 2);
  const pair = query.slice(letterStart, caret);
  const lowerPair = pair.toLowerCase();
  const replacement = letterChoices.get(lowerPair);
  const letter = replacement && pair[0] !== lowerPair[0]
    ? replacement.toLocaleUpperCase('tr')
    : replacement;
  const showLetterChoice = suggesting && !letterDismissed && !!letter;
  const letterLabel = lowerPair === 'ng' ? `${letter} (nasal n)` : letter;
  const letterHint = lowerPair === 'ng'
    ? `Did you mean nasal n? Press 1 for ${letter}.`
    : `Press 1 for ${letter}.`;

  function insertLetter() {
    if (!letter) return;
    const nextCaret = letterStart + letter.length;
    setQuery(query.slice(0, letterStart) + letter + query.slice(caret));
    setCaret(nextCaret); setSelected(null); setSearched(false); setActive(-1); setLetterDismissed(false);
    requestAnimationFrame(() => { input.current?.focus(); input.current?.setSelectionRange(nextCaret, nextCaret); });
  }
  const id = useId(); const input = useRef<HTMLInputElement>(null);
  const results = search(query); const suggestions = results.slice(0, 6);
  const scholarNames = useMemo(() => [...new Set([...sources, ...entries.flatMap(entry => Object.keys(entry.definitions))])].filter(source => !/^(?:muharrem\s+)?ergin$|^(?:hasan\s+)?eren$/i.test(source.trim())), [entries]);
  const choose = (entry: Lemma) => { setQuery(lemmaLabel(entry)); setSelected(entry); setSearched(false); setSuggesting(false); setActive(-1); };
  const displayed = selected ? [selected] : results;
  return <div className="sozce-dictionary">
    <label htmlFor={id}>Search for a word</label>
    <form className="search-box" onSubmit={e => { e.preventDefault(); if (active >= 0 && suggestions[active]) { const entry = suggestions[active]; setQuery(lemmaLabel(entry)); setSelected(homographNumber(entry) ? null : entry); } else { setSelected(null); } setSearched(true); setSuggesting(false); setActive(-1); }}>
      <div className={`letter-input${showLetterChoice ? ' has-letter-choice' : ''}`}>
      {showLetterChoice && <button
        type="button"
        className="letter-choice"
        style={{left: `min(calc(${letterStart}ch + 8px), calc(100% - 64px))`}}
        aria-label={`1: Insert ${letterLabel}`}
        title={letterHint}
        onMouseDown={e => e.preventDefault()}
        onClick={insertLetter}
      ><sup>1</sup> · {letter}</button>}
      <input ref={input} id={id} role="combobox" aria-autocomplete="list" aria-expanded={suggesting && suggestions.length > 0} aria-controls={`${id}-list`} aria-activedescendant={suggesting && active >= 0 ? `${id}-${active}` : undefined} placeholder="Enter a word…" autoComplete="off" value={query} onClick={() => setSuggesting(true)} onFocus={() => setSuggesting(true)} onSelect={e => {setCaret(e.currentTarget.selectionStart ?? query.length);}} onBlur={() => {setSuggesting(false); setActive(-1);}} onChange={e => {setQuery(e.target.value);setCaret(e.target.selectionStart ?? e.target.value.length);setLetterDismissed(false);setSelected(null);setSearched(false);setSuggesting(true);setActive(-1);}} onKeyDown={e => { if (e.key === '1' && showLetterChoice && !e.nativeEvent.isComposing && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) { e.preventDefault(); insertLetter(); return; } if(e.key === 'ArrowDown' || e.key === 'ArrowUp') {e.preventDefault();setSuggesting(true);setActive(n => suggestions.length ? (n + (e.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length : -1);} if(e.key === 'Escape') {setLetterDismissed(true);setSuggesting(false);setActive(-1);} }} />
      {showLetterChoice && <span className="letter-hint" role="status">{letterHint}</span>}
      </div>
      {query && <button type="button" className="clear" aria-label="Clear search" onClick={() => {setQuery('');setSelected(null);setSearched(false);setActive(-1);input.current?.focus();}}>Clear</button>}
      <button className="search-button" type="submit">Search</button>
      {suggesting && suggestions.length > 0 && <ul id={`${id}-list`} role="listbox" className="suggestions">{suggestions.map((entry,i) => <li key={entry.id} id={`${id}-${i}`} role="option" aria-selected={active === i} className={active === i ? 'active' : ''} onMouseDown={e => e.preventDefault()} onClick={() => choose(entry)}><strong>{lemmaLabel(entry)}</strong><span>{entry.gloss || (!homographNumber(entry) && entry.category)}</span></li>)}</ul>}
    </form>
    {!searched ? <p>{query.trim() ? 'Press Search to view results.' : 'Enter a word to search.'}</p> : !query.trim() ? <p>Enter a word to search.</p> : <section aria-label="Search results"><div className="result-bar" role="status"><span>{displayed.length ? `${displayed.length} ${displayed.length === 1 ? 'entry' : 'entries'} found` : 'Not found'}</span></div>{!displayed.length ? <div className="empty"><h2>Not found</h2><p>No entry for “{query}”. Try another spelling or a shorter word.</p></div> : displayed.map(entry => <article className="entry" key={entry.id}><div className="entry-heading"><div><h2>{lemmaLabel(entry)}{!homographNumber(entry) && entry.category && <small>{entry.category}</small>}</h2><p>{entry.gloss}</p></div></div><p className="variants">Spelling variants <span>{entry.variants.join(' · ') || 'No variants recorded'}</span></p><div className="definitions">{scholarNames.filter(source => entry.definitions[source]).map((source,i) => {const definition = entry.definitions[source];
      const legacySuffix = '; summary based on the online transcription.';
      const hasLegacySuffix = definition?.reference?.endsWith(legacySuffix);
      const reference = hasLegacySuffix
        ? definition?.reference?.slice(0, -legacySuffix.length) + '.'
        : definition?.reference;
      const isSummary = definition?.reviewStatus === 'source-summary' || hasLegacySuffix;
      const isOcrDraft = definition?.reviewStatus === 'needs-review' && !isSummary;
      return <details key={source} open={i === 0}><summary><strong>{source}</strong><span className="source-status">{definition ? '1 definition' : 'No entry'}</span></summary><div className="definition">{definition ? <><span className="example-badge">{definition.isExample ? 'EXAMPLE DATA · NOT A QUOTATION' : isSummary ? 'SOURCE SUMMARY' : isOcrDraft ? 'OCR DRAFT · NEEDS REVIEW' : 'SOURCE TEXT'}</span>{isOcrDraft && <p className="ocr-notice">Unverified OCR transcription. Characters, words or lines may be misread or missing. Check the cited page before quoting.</p>}<DefinitionText text={definition.text}/>{reference && <cite>{reference}</cite>}</> : <p>No definition has been added for this source.</p>}</div></details>;})}</div></article>)}</section>}
  </div>;
}
