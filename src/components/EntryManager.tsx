import { useMemo, useState, type FormEvent } from 'react';
import { normalize } from '../core/search';
import { sources, type Definition, type Lemma } from '../core/types';

const STORAGE_KEY = 'turkoloji-sozluk:manual-entries:v1';
type DefinitionRow = { source: string; customSource: string; text: string; reference: string };
const OTHER_SOURCE = '__other__';
const emptyRow = (): DefinitionRow => ({ source: sources[0], customSource: '', text: '', reference: '' });

export function loadManualEntries(): Lemma[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed as Lemma[] : [];
  } catch { return []; }
}

export function EntryManager({ entries, onChange }: { entries: Lemma[]; onChange: (entries: Lemma[]) => void }) {
  const knownScholars = useMemo(() => [...new Set([...sources, ...entries.flatMap(entry => Object.keys(entry.definitions))])], [entries]);
  const [headword, setHeadword] = useState('');
  const [variants, setVariants] = useState('');
  const [category, setCategory] = useState('');
  const [gloss, setGloss] = useState('');
  const [rows, setRows] = useState<DefinitionRow[]>([emptyRow()]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');



  function resetForm() {
    setHeadword(''); setVariants(''); setCategory(''); setGloss(''); setRows([emptyRow()]); setEditingId(null); setError('');
  }

  function edit(entry: Lemma) {
    setHeadword(entry.headword); setVariants(entry.variants.join(', ')); setCategory(entry.category); setGloss(entry.gloss); setEditingId(entry.id); setError('');
    const definitionRows = Object.entries(entry.definitions).map(([source, definition]) => ({ source: knownScholars.includes(source) ? source : OTHER_SOURCE, customSource: knownScholars.includes(source) ? '' : source, text: definition?.text ?? '', reference: definition?.reference ?? '' }));
    setRows(definitionRows.length ? definitionRows : [emptyRow()]);
    document.getElementById('entry-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const cleanHeadword = headword.trim();
    if (!cleanHeadword) { setError('Enter a headword.'); return; }
    const definitions: Record<string, Definition> = {};
    for (const row of rows) {
      if (!row.text.trim()) continue;
      const scholar = (row.source === OTHER_SOURCE ? row.customSource : row.source).trim();
      if (!scholar) { setError('Enter a source name for the definition marked “Other”.'); return; }
      if (definitions[scholar]) { setError(`There is more than one definition for ${scholar}. Use one row per source.`); return; }
      definitions[scholar] = { ...entries.find(entry => entry.id === editingId)?.definitions[scholar], text: row.text.trim(), isExample: false, ...(row.reference.trim() ? { reference: row.reference.trim() } : {}) };
    }
    if (!Object.keys(definitions).length) { setError('Add at least one source and definition.'); return; }
    const id = editingId ?? `${normalize(cleanHeadword).replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const updated: Lemma = { ...entries.find(entry => entry.id === editingId), id, headword: cleanHeadword, variants: variants.split(',').map(item => item.trim()).filter(Boolean), category: category.trim() || 'Entry', gloss: gloss.trim(), definitions };
    onChange(editingId ? entries.map(entry => entry.id === editingId ? updated : entry) : [...entries, updated]);
    resetForm();
  }

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'turkoloji-sozluk-maddeleri.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <section>
    <h2>Entry editor</h2>
    <p>Entries are saved in this browser. You can download a JSON backup.</p>
    <form id="entry-form" onSubmit={save}>
      <p><label>Headword<br/><input required value={headword} onChange={event => setHeadword(event.target.value)} /></label></p>
      <p><label>Spelling variants (comma-separated)<br/><input value={variants} onChange={event => setVariants(event.target.value)} placeholder="e.g. kun, küng" /></label></p>
      <p><label>Part of speech (optional)<br/><input value={category} onChange={event => setCategory(event.target.value)} placeholder="e.g. Noun" /></label></p>
      <p><label>Short gloss (optional)<br/><input value={gloss} onChange={event => setGloss(event.target.value)} /></label></p>
      <h3>Sources and definitions</h3>
      {rows.map((row, index) => <fieldset key={index}>
        <legend>Definition {index + 1}</legend>
        <p><label>Scholar / source<br/><select value={row.source} onChange={event => setRows(current => current.map((item, i) => i === index ? { ...item, source: event.target.value } : item))}>{knownScholars.map(scholar => <option key={scholar}>{scholar}</option>)}<option value={OTHER_SOURCE}>Other…</option></select></label></p>
        {row.source === OTHER_SOURCE && <p><label>Scholar / source name<br/><input value={row.customSource} onChange={event => setRows(current => current.map((item, i) => i === index ? { ...item, customSource: event.target.value } : item))} placeholder="Enter a source name" /></label></p>}
        <p><label>Definition<br/><textarea rows={3} value={row.text} onChange={event => setRows(current => current.map((item, i) => i === index ? { ...item, text: event.target.value } : item))} /></label></p>
        <p><label>Work / page reference (optional)<br/><input value={row.reference} onChange={event => setRows(current => current.map((item, i) => i === index ? { ...item, reference: event.target.value } : item))} /></label></p>
        {rows.length > 1 && <button type="button" onClick={() => setRows(current => current.filter((_, i) => i !== index))}>Remove this definition row</button>}
      </fieldset>)}
      <p><button type="button" onClick={() => setRows(current => [...current, emptyRow()])}>Add another source</button></p>
      {error && <p role="alert">{error}</p>}
      <button type="submit">{editingId ? 'Save changes' : 'Save entry'}</button>{editingId && <> <button type="button" onClick={resetForm}>Cancel editing</button></>}
    </form>
    <hr/>
    <h2>Your entries ({entries.length})</h2>
    {entries.length === 0 ? <p>No entries added yet.</p> : <ul>{entries.map(entry => <li key={entry.id}><strong>{entry.headword}</strong> — {entry.gloss || 'No gloss provided'} <button type="button" onClick={() => edit(entry)}>Edit</button> <button type="button" onClick={() => { if (window.confirm(`Remove the entry “${entry.headword}”?`)) onChange(entries.filter(item => item.id !== entry.id)); }}>Remove</button></li>)}</ul>}
    <p><button type="button" onClick={downloadBackup}>Download JSON backup</button></p>
  </section>;
}
