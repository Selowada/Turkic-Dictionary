# Turkic Dictionary

Standalone frontend dictionary, React + TypeScript + Vite. No backend or database. Begre Clone is a separate project and is unchanged.

## Run

From this folder run `npm run dev -- --port 5173`, then open the Local URL printed by Vite. Keep the terminal open. Do not open source index.html directly. For static hosting run `npm run build` and serve `dist/`. Run `npm run preview` to check the build locally.

## Data

Initial data is `src/data/approved-entries.json`, copied unchanged from Begre Clone on 2026-11-07 (14 entries). Old demo data and the first-100 OCR dataset remain as archived source files but are not loaded by the application. On first launch, legacy manual entries from this browser origin are merged by ID. Subsequent edits use the separate `turkoloji-sozluk:standalone:v1` browser storage key. No existing legacy storage is overwritten.

Search stays empty until submitted. Type ng and press 1 to insert ŋ. Definitions are grouped under their source. Add/edit supports choosing a source or entering Other.

All loaded entries can be edited. Export JSON saves the full current collection. Import JSON merges by ID and asks before replacing matching entries. Browser changes do not modify the source JSON. To persist edits as project defaults, replace the source JSON with the downloaded backup. Browser data is specific to browser and origin (including port); data saved in the Begre browser tab is not accessible automatically across ports. Use JSON backups to transfer such data.

## Definition formatting

Use `**bold**` and `*italic*` in definition text. Paragraph breaks and historic characters are preserved. This is deliberately limited emphasis syntax, not a full Markdown renderer. HTML is displayed as text and never executed. No typography was guessed or added to the copied source definitions.

## Validation

`npm run build` and `npm test`.
