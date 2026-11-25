import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Dictionary} from './components/Dictionary';
import {EntryManager,loadManualEntries} from './components/EntryManager';
import approved from './data/approved-entries.json';
import type {Lemma} from './core/types';
import './style.css';
const key = 'turkoloji-sozluk:standalone:v2';
const legacyKey = 'turkoloji-sozluk:standalone:v1';
const bundledIds = approved.map(entry => entry.id);
// The v1 snapshot did not record which bundled entries existed when it was saved.
const addedAfterV1 = new Set(['kod-clauson', 'u-sleep-clauson', 'evuk-clauson', 'opke-clauson', 'od-time-clauson', 'atalig-clauson', 'atasiz-clauson', 'agrigsiz-clauson', 'etrek-clauson', 'udurtlug-clauson', 'i-refusal-clauson', 'etci-clauson', 'otus-clauson', 'ugan-clauson', 'idisci-clauson', 'adaslik-clauson', 'oglan-clauson', 'idislig-clauson', 'itis-clauson', 'utus-clauson', 'atiz-clauson', 'ediz-clauson', 'evrek-clauson', 'iti-clauson', 'oturu-clauson', 'okil-clauson', 'it-stray-clauson', 'ihla-clauson', 'aglat-clauson', 'uglit-clauson', 'aklis-clauson', 'iglas-clauson', 'ikilac-clauson', 'ogulcuk-clauson', 'agilik-clauson', 'akilik-clauson', 'agulug-clauson', 'ogullug-clauson', 'ogulluk-clauson', 'oglagu-clauson', 'ogulmuk-clauson', 'oglanlig-clauson', 'oglansig-clauson', 'akila-clauson', 'agula-clauson', 'agim-clauson', 'akim-clauson', 'agan-penance-clauson', 'agan-nasal-clauson', 'agin-clauson', 'akin-clauson', 'agan-verb-clauson', 'okin-clauson', 'ugun-clauson', 'ukun-clauson', 'agna-roll-clauson', 'agna-tongue-clauson', 'agnat-tongue-clauson', 'agnat-roll-clauson', 'akinci-clauson', 'uganca-clauson', 'agincsiz-clauson', 'akindi-clauson', 'agingac-clauson', 'agir-clauson', 'akur-clauson', 'igar-clauson', 'ogar-clauson', 'ogur-clauson', 'ugur-clauson', 'akru-clauson', 'ogri-clauson', 'agrig-clauson', 'agruk-clauson', 'ugrag-clauson', 'ogrug-clauson', 'ukruk-clauson', 'akrun-clauson', 'ogrin-clauson', 'agrus-clauson', 'ogur-verb-clauson', 'agri-verb-clauson', 'ugra-verb-clauson', 'okra-verb-clauson', 'agrit-clauson', 'ugrat-clauson', 'ugral-clauson', 'ogrul-clauson', 'agrin-clauson', 'agris-clauson', 'ugras-clauson', 'okras-clauson', 'ogrus-clauson', 'akuru-clauson', 'agircak-clauson', 'ogurga-clauson', 'agriglig-clauson', 'agirlig-clauson', 'agirlik-clauson', 'ugurlug-clauson', 'ogurluk-exchange-clauson', 'ogurluk-crossref-clauson', 'ogrilik-clauson', 'agirsak-clauson', 'ugrayu-clauson', 'ugraklat-clauson', 'agruklan-clauson', 'agrikan-clauson', 'agirla-clauson', 'ogurla-clauson', 'ugurla-clauson', 'ogrila-crossref-clauson', 'agirlal-clauson', 'agirlan-clauson', 'ogurlan-clauson', 'ugurlan-clauson', 'ugramsin-clauson', 'axsak-clauson', 'axsum-clauson', 'oksiz-clauson', 'agsa-clauson', 'axsa-clauson', 'uksa-clauson', 'axsat-clauson', 'oxsin-clauson', 'axsur-clauson', 'aksirak-clauson', 'agusuz-clauson', 'axsumla-clauson', 'agis-clauson', 'ugus-clauson', 'ukus-clauson', 'oxsag-clauson', 'axsam-clauson', 'agis-verb-clauson', 'akis-verb-clauson', 'okis-verb-clauson', 'ukus-verb-clauson', 'oxsa-note-clauson', 'oxsa-resemble-clauson', 'oxsa-caress-clauson', 'uxsa-clauson', 'oxsat-clauson', 'oxsati-clauson', 'oxsatguluksuz-clauson', 'oxsatigsiz-clauson', 'oxsagu-clauson', 'uguslug-clauson', 'ukuslug-clauson', 'oxsancig-clauson', 'ukussuz-clauson', 'uguslan-clauson', 'agiz-clauson', 'aguj-aguz-clauson', 'agzan-clauson', 'agizlig-clauson', 'agizla-clauson', 'agizlan-clauson', 'ig-illness-clauson', 'ig-spindle-crossref-clauson', 'ik-spindle-clauson', 'og-mother-clauson', 'og-thought-clauson', 'og-animal-clauson', 'ok-crossref-clauson', 'eg-bend-clauson', 'ek-sow-clauson', 'og-praise-clauson', 'og-grind-crossref-clauson', 'uk-heap-clauson', 'eke-clauson', 'eki-crossref-clauson', 'ekki-clauson', 'ige-crossref-clauson', 'iki-ikki-crossref-clauson', 'oge-counsellor-clauson', 'ugi-owl-clauson', 'ege-file-clauson', 'ige-obstinate-clauson', 'ogi-grind-clauson', 'ekec-clauson', 'igcil-clauson', 'eget-clauson', 'egit-drug-clauson', 'igid-lie-clauson', 'ogit-grain-clauson', 'ogut-advice-clauson', 'egdi-slaughterhouse-clauson', 'egdu-knife-clauson', 'iktu-animal-clauson', 'ogdi-praise-clauson', 'igduk-clauson', 'oktem-clauson', 'ogdir-clauson', 'igdis-clauson', 'ogdes-clauson', 'ekit-clauson', 'igid-feed-clauson', 'ogit-grind-clauson', 'ogut-praise-clauson', 'okte-clauson', 'igdil-clauson', 'ogdil-clauson', 'egtur-clauson', 'ektur-clauson', 'ogtur-clauson', 'uktur-clauson', 'egetlig-clauson', 'egetlik-clauson', 'ogdilig-clauson', 'igidsiz-clauson', 'ogdisiz-clauson', 'igdisci-clauson', 'igide-clauson', 'igidil-clauson', 'egetle-clauson', 'ogutle-clauson', 'iktule-clauson', 'iktulet-clauson', 'egetlen-clauson', 'iktulen-clauson', 'ogitse-clauson', 'ekek-clauson', 'ogek-oguk-clauson', 'ukek-clauson', 'ekkegu-clauson', 'ekeklik-clauson', 'ukeklig-clauson', 'ukeklik-clauson', 'ikegun-ikigun-clauson', 'ekekle-clauson', 'ukekle-clauson', 'egil-clauson', 'ukil-clauson', 'ogli-clauson', 'iglig-clauson', 'iglik-clauson', 'oglug-clauson', 'egil-verb-clauson', 'ekil-clauson', 'ogul-passive-clauson', 'ukul-clauson', 'igle-clauson', 'ikle-crossref-clauson', 'ogle-crossref-clauson', 'ukli-clauson', 'iglet-clauson', 'iklet-crossref-clauson', 'uklit-clauson', 'iglel-clauson', 'iglen-clauson', 'oglen-clauson', 'uklun-clauson', 'igles-clauson', 'ikles-crossref-clauson', 'ogles-clauson', 'uklus-clauson', 'ogelik-clauson', 'ekele-clauson', 'ekkile-clauson', 'ogele-clauson', 'oglentur-clauson', 'egim-clauson', 'ekim-clauson', 'ukum-clauson', 'egme-clauson', 'ukme-clauson', 'ekmek-crossref-clauson', 'ukmek-clauson', 'egeme-clauson', 'ukmeklen-clauson', 'egin-clauson', 'ekin-clauson', 'ogen-clauson', 'ogin-ogun-clauson', 'ukun-heap-clauson', 'igne-clauson', 'ekkinc-clauson', 'ogunc-clauson', 'okunc-clauson', 'ekin-verb-clauson', 'igen-clauson', 'ogun-boast-clauson', 'okun-repent-clauson', 'ukun-verb-clauson', 'ikinci-crossref-clauson', 'okunclug-clauson', 'okuncsiz-clauson', 'ekindi-clauson', 'ekkinti-clauson', 'ogundi-clauson', 'ekinlig-clauson', 'okundur-clauson', 'eger-crossref-clauson', 'egir-root-clauson', 'ogur-herd-clauson', 'ugur-crossref-clauson', 'egri-clauson', 'ugre-clauson', 'egrik-clauson', 'ugrug-clauson', 'egrim-clauson', 'ogren-brook-clauson', 'ogrunc-clauson', 'egir-verb-clauson', 'ogir-rejoice-clauson', 'ogre-reconstructed-clauson', 'ogret-clauson', 'ugrit-clauson', 'egril-clauson', 'ugril-clauson', 'egrin-clauson', 'igren-crossref-clauson', 'ogren-learn-clauson', 'ogrun-clauson', 'egris-clauson', 'ugris-clauson', 'ikircgu-clauson', 'egri-teve-clauson', 'ogretig-clauson', 'ugrugen-clauson', 'ogurlug-clauson', 'ugurlug-millet-clauson', 'ugurluk-millet-clauson', 'egrilik-clauson', 'ugrumuk-clauson', 'ogrunclug-clauson', 'ekkirer-clauson', 'ogreyuk-clauson', 'ogretin-clauson', 'ogurlen-clauson', 'egrimlen-clauson', 'ogrunc-len-clauson', 'ogrundur-clauson', 'egirse-root-clauson', 'egirse-spin-clauson', 'egsuk-clauson', 'igsiz-clauson', 'ogsuz-note-clauson', 'ogsuz-motherless-clauson', 'ogsuz-witless-clauson', 'egse-clauson', 'egsu-clauson', 'ogse-clauson', 'ukse-clauson', 'egsut-clauson', 'eksil-clauson', 'egsuklug-clauson', 'egsuksuz-clauson', 'ogsire-clauson', 'egis-filings-clauson', 'igis-quarrel-clauson', 'ukus-many-clauson', 'eksig-clauson', 'eges-file-clauson', 'egis-bend-clauson', 'ekis-sow-clauson', 'iges-quarrel-clauson', 'iges-rely-clauson', 'ogus-praise-clauson', 'ogus-grind-clauson', 'eksi-sour-clauson', 'ukusti-clauson', 'uksurug-clauson', 'ukusle-clauson', 'ogey-clauson', 'ekkiz-twin-clauson', 'oguz-river-clauson', 'okuz-ox-clauson', 'okuzlen-clauson', 'al-note-clauson', 'al-device-clauson', 'al-scarlet-clauson', 'al-front-clauson', 'el-realm-clauson', 'el-crossref-clauson', 'il-year-crossref-clauson', 'il-vile-clauson', 'ol-demonstrative-clauson', 'ul-foundation-clauson', 'ol-moist-clauson', 'al-take-clauson', 'il-verbs-note-clauson', 'il-descend-clauson', 'il-catch-clauson', 'ol-ripe-clauson', 'ol-bol-crossref-clauson', 'ol-die-clauson', 'ala-dappled-clauson', 'ele-crossref-clauson', 'ile-crossref-clauson', 'ili-hanging-clauson', 'ula-landmark-clauson', 'ele-calm-clauson', 'ele-elge-crossref-clauson', 'elle-clauson', 'ula-join-clauson', 'uli-howl-clauson', 'uli-crossref-clauson', 'ule-divide-clauson', 'oli-moist-clauson', 'alplik-clauson', 'alvir-clauson', 'alpagut-clauson', 'alawan-clauson', 'alpirkan-clauson', 'aluc-clauson', 'olic-clauson', 'alci-clauson', 'elci-clauson', 'alcak-clauson', 'alacu-tent-clauson', 'alucin-clauson', 'alaculan-clauson', 'alt-clauson', 'elt-crossref-clauson', 'olut-clauson', 'olut-killing-clauson', 'alti-six-clauson', 'altag-clauson', 'olduk-clauson', 'altmis-clauson', 'altin-below-clauson', 'altun-gold-clauson', 'uldan-sole-clauson', 'altinc-clauson', 'oldrug-clauson', 'ildruk-clauson', 'oldrum-clauson', 'elet-clauson', 'ulat-clauson', 'ulit-howl-clauson', 'ulit-twist-clauson', 'ulet-clauson', 'olit-moisten-clauson', 'a-vocative-clauson', 'i-bush-clauson', 'i-brocade-clauson', 'o-surety-clauson', 'o-reply-clauson', 'o-ol-crossref-clauson', 'u-refusal-clauson', 'u-able-clauson', 'o-think-clauson', 'ap-intensive-clauson', 'ap-neither-clauson', 'av-game-clauson', 'ep-crossref-clauson', 'ev-dwelling-clauson', 'ip-yip-crossref-clauson', 'ob-boast-clauson', 'op-threshing-clauson', 'op-exclamation-clauson', 'up-intensifier-crossref-clauson', 'up-uple-crossref-clauson', 'ab-misreading-clauson', 'av-surround-clauson', 'ev-hurry-clauson', 'op-swallow-clauson', 'uv-crush-clauson', 'op-kiss-clauson', 'op-swallow-crossref-clauson', 'apa-bear-clauson', 'ava-pain-clauson', 'oba-clan-clauson', 'uva-food-clauson', 'opo-cosmetic-clauson']);
const legacyBundledIds = bundledIds.filter(id => !addedAfterV1.has(id));
function validate(value:unknown):Lemma[]{
 if(!Array.isArray(value))throw Error('Expected a JSON array of entries.');
 const ids=new Set<string>();
 for(const e of value){
  if(!e||typeof e.id!=='string'||!e.id||ids.has(e.id)||typeof e.headword!=='string'||!e.headword.trim()||!Array.isArray(e.variants)||!e.variants.every((v:unknown)=>typeof v==='string')||typeof e.category!=='string'||typeof e.gloss!=='string'||!e.definitions||typeof e.definitions!=='object'||Array.isArray(e.definitions))throw Error('Invalid or duplicate entry.');
  for(const d of Object.values(e.definitions) as any[])if(!d||typeof d.text!=='string'||typeof d.isExample!=='boolean')throw Error('Invalid definition.');
  ids.add(e.id);
 }
 return value;
}
// Refresh bundled formatting when the saved wording still matches the bundled text.
const updatedClausonIds = new Set([
 'apa-clauson',
 'kuncuy-clauson',
 'bung-clauson',
 'katiglan-clauson',
 'erdem-clauson',
 'alp-clauson',
 'tevey-clauson',
 'kazgan-clauson',
 'bars-clauson',
 'kokmek-clauson',
 'kukmek-clauson',
 'az-clauson',
 'ot-fire-clauson',
 'kod-clauson',
 'u-sleep-clauson',
 'i-refusal-clauson'
]);
const updatedClausonText = new Map(approved
 .filter(entry => updatedClausonIds.has(entry.id))
 .map(entry => [entry.id, entry.definitions.Clauson?.text] as const));
const withoutEmphasis = (text: string) => text.replace(/\\?\*/g, '');

function refreshClausonEntry(entry: Lemma): Lemma {
 if (entry.id === 'apa-clauson' && entry.category === '') entry = { ...entry, category: '1' };
 const definition = entry.definitions.Clauson;
 const updated = updatedClausonText.get(entry.id);
 if (!definition || updated === undefined || updated === definition.text ||
     withoutEmphasis(definition.text) !== withoutEmphasis(updated)) {
  return entry;
 }
 return {
  ...entry,
  definitions: { ...entry.definitions, Clauson: { ...definition, text: updated } }
 };
}
// Older browser snapshots and backups can contain a separate oba: preliminary note.
function mergeObaNote(entries: Lemma[]): Lemma[] {
 const note = entries.find(entry => entry.id === 'oba-note-clauson');
 if (!note) return entries;

 const bundled = approved.find(entry => entry.id === 'oba-clan-clauson')!;
 const main = entries.find(entry => entry.id === bundled.id) ?? bundled;
 const originalNote = bundled.definitions.Clauson.text.split('\n\n', 1)[0];
 const definitions: Lemma['definitions'] = { ...main.definitions };

 for (const [source, noteDefinition] of Object.entries(note.definitions)) {
  const mainDefinition = definitions[source];
  if (!noteDefinition) continue;
  if (!mainDefinition) {
   definitions[source] = noteDefinition;
   continue;
  }

  const noteText = noteDefinition.text.trimEnd();
  const mainText = mainDefinition.text.trimStart();
  const notePrefix = noteText + '\n\n';
  const bundledPrefix = originalNote + '\n\n';
  const body = source === 'Clauson' && mainText.startsWith(bundledPrefix)
   ? mainText.slice(bundledPrefix.length)
   : mainText;

  if (body === noteText || body.startsWith(notePrefix)) continue;
  const noteReference = source === 'Clauson' && noteDefinition.reference === 'Clauson (1972), p. 5, headword oba:. Preliminary note.'
   ? undefined
   : noteDefinition.reference;
  const references = [...new Set([mainDefinition.reference, noteReference].filter(Boolean))];
  definitions[source] = { ...mainDefinition, text: notePrefix + body, reference: references.join(' · ') || undefined };
 }

 const combined = { ...main, variants: [...new Set([...main.variants, ...note.variants])], definitions };
 return entries
  .filter(entry => entry.id !== main.id)
  .map(entry => entry.id === note.id ? combined : entry);
}

function includeNewBundledEntries(saved: Lemma[], previousBundledIds: string[]): Lemma[] {
 const knownIds = new Set([...previousBundledIds, ...saved.map(entry => entry.id)]);
 return mergeObaNote([...saved.map(refreshClausonEntry), ...approved.filter(entry => !knownIds.has(entry.id))]);
}
function initial() {
 try {
  const raw = localStorage.getItem(key);
  if (raw) {
   const snapshot = JSON.parse(raw);
   if (!Array.isArray(snapshot.bundledIds) || !snapshot.bundledIds.every((id: unknown) => typeof id === 'string')) {
    throw Error('Invalid dictionary snapshot.');
   }
   return {entries: includeNewBundledEntries(validate(snapshot.entries), snapshot.bundledIds), error: ''};
  }
  const legacyRaw = localStorage.getItem(legacyKey);
  if (legacyRaw) {
   return {entries: includeNewBundledEntries(validate(JSON.parse(legacyRaw)), legacyBundledIds), error: ''};
  }
  const legacy = validate(loadManualEntries());
  return {entries: mergeObaNote([...new Map([...approved, ...legacy.map(refreshClausonEntry)].map(entry => [entry.id, entry])).values()]), error: ''};
 } catch {
  return {entries: approved as Lemma[], error: 'Saved entries could not be loaded. They have not been overwritten. Export a backup before saving changes.'};
 }
}
export function App(){
 const [state]=useState(initial);const [entries,setEntries]=useState<Lemma[]>(state.entries);const [editing,setEditing]=useState(false);const [error,setError]=useState(state.error);const [notice,setNotice]=useState('');
 const [guideOpen, setGuideOpen] = useState(false);
 const guideFrame = useRef<HTMLIFrameElement>(null);

 useEffect(() => {
  if (!guideOpen) return;
  function dismissGuideTooltip() {
   guideFrame.current?.contentWindow?.postMessage('clauson-guide:dismiss', window.location.origin);
  }
  window.addEventListener('click', dismissGuideTooltip);
  return () => window.removeEventListener('click', dismissGuideTooltip);
 }, [guideOpen]);

 function showDictionary(editing: boolean) {
  setGuideOpen(false);
  setEditing(editing);
 }

 function save(next:Lemma[]){setEntries(next);try{localStorage.setItem(key, JSON.stringify({entries: next, bundledIds}));setError('');setNotice('Saved in this browser.');}catch{setError('Could not save in this browser. Download a JSON backup to keep your changes.');}}
 async function importFile(file:File|undefined){if(!file)return;try{const incoming=validate(JSON.parse(await file.text()));const conflicts=incoming.filter(e=>entries.some(x=>x.id===e.id));if(conflicts.length&&!window.confirm(`Replace ${conflicts.length} entries with matching IDs?`))return;save(mergeObaNote([...new Map([...entries,...incoming].map(e=>[e.id,e])).values()]));setNotice(`Imported ${incoming.length} entries.`);}catch(e){setError(e instanceof Error?e.message:'Could not import JSON.');}}

 return (
  <main className="dictionary-app">
   <header><h1>Turkic Dictionary</h1><p>{entries.length} entries · Local dictionary</p></header>
   <nav aria-label="Dictionary views">
    <button aria-pressed={!guideOpen && !editing} onClick={() => showDictionary(false)}>Search</button>
    <button aria-pressed={!guideOpen && editing} onClick={() => showDictionary(true)}>Add / edit entries</button>
    <button aria-pressed={guideOpen} onClick={() => setGuideOpen(true)}>Clauson Guide</button>
   </nav>
   {guideOpen && (
    <iframe ref={guideFrame} className="clauson-guide" title="Clauson Guide" src="./clauson-guide.html"/>
   )}
   <div hidden={guideOpen}>
    {error && <p role="alert">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {editing ? <>
     <p>Use <code>**bold**</code> and <code>*italic*</code> in definitions. Changes are stored in this browser; download JSON to back them up or move them to another browser.</p>
     <label className="import-label">Import JSON <input type="file" accept=".json,application/json" onChange={e => {void importFile(e.target.files?.[0]); e.target.value = '';}}/></label>
     <EntryManager entries={entries} onChange={save}/>
    </> : <Dictionary entries={entries}/>}
   </div>
  </main>
 );
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
