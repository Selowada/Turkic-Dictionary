# Clauson: first 100 entries — OCR draft

The JSON contains the first 100 lexical entries, from **a:** to **avılku:**, in printed source order (printed pp. 1–11; PDF pp. 46–56). Cross-reference and error/ghost entries are included; numbered homographs are separate. Section titles and preliminary notes are excluded.

**Not a verified scholarly transcription.** All 100 entries are `needs-review`. OCR can substitute characters, corrupt words and omit lines. Headwords and boundaries were checked against page images; the complete definitions were not proofread. Do not cite the OCR without consulting the scanned original. Empty `gloss` fields are intentional: no synthetic definition or quotation has been invented.

## Portable format

`clauson-first100.json` is a UTF-8 array, with stable `id`, `headword`, `sourceHeadword`, `sourceSequence`, `variants`, and `definitions.Clauson`. Each definition includes display `text`, unchanged segmented `rawOcr`, `reference`, `isExample: false`, `reviewStatus`, and `provenance` (printed/PDF pages, column, OCR line, confidence, correction log). Confidence is a machine estimate, not a quality guarantee.

Source headwords retain colons, hyphens and homograph numbers. Plain search aliases are separate. `index.csv` provides a simple import index, not the full definitions. Other dictionary software may need a format-specific converter; this JSON is not claimed to be a universal import format.

`source.json` records the source PDF name and SHA-256. `pages/` holds reference images; `ocr/` stores original Vision observations. `scripts/boundaries.tsv` records entry boundaries, including entry 101 as the end marker. `scripts/export.py` rebuilds the dataset from `lines.json` and the boundary map. Two explicit opening-line repairs are logged in the corresponding entries; remaining text is OCR draft.

## App integration

The application imports `src/data/clauson-first100.json` and combines it with existing sample and manual entries. Samples remain labelled as examples. Manual localStorage records are not changed. No database or network service is added. Searching plain `avlat` can find `avlat-`; `ı` returns separate numbered homographs. Results remain hidden until Search is submitted.

In the project folder, run `npm run build` and `npm test -- src/data/clauson.test.ts src/core/search.test.ts`. For local use run `npm run dev` and open the address printed by Vite.

To add later entries, retain stable IDs and source sequence, store page provenance, and set full-text verification only after manual comparison with the scan.
