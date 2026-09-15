# Talal Tailor

An applicant tracking system, built as a proof of concept with **Svelte 5**.

Two views over one dataset:

- **Candidate portal** — browse five open roles at a fictional company, then apply with an email
  address, a PDF CV and a photo.
- **Hiring workspace** — an inbox of applications, a drag-and-drop pipeline, structured scorecards,
  notes, email templates and funnel analytics.

An application submitted on the candidate side lands in the hiring inbox immediately. The first
screen is a selector for which side you want to see.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run build:artifact` | Single self-contained HTML file in `dist-artifact/` |
| `npm run check` | `svelte-check` over the source |
| `npm run gen:avatars` | Re-fetch the CC0 candidate avatars |
| `npm run gen:metrics` | Re-extract the PDF font metrics |

The mascot images in `src/assets/` are committed renditions of a source photo that is not in the
repository; regenerate them with `sharp` if the source changes.

The build is fully static with relative asset paths, so it runs from a domain root, a GitHub Pages
sub-path, or a sandboxed embed without configuration.

---

## What is genuinely implemented

**PDF generation, from scratch.** `src/lib/pdf/` is a small PDF writer — object table, cross-reference
table, content streams, WinAnsi text encoding, standard-font metrics for real line wrapping, JPEG
XObjects via `DCTDecode`, and link annotations. Every seeded candidate's CV is generated in the
browser on demand from the same record the profile page renders, so the download always matches
what is on screen. Roughly 10 KB per CV, no runtime dependency.

**Uploads.** Drag-and-drop or browse, with MIME and size validation. Photos are downscaled and
re-encoded to a square JPEG client-side before being stored, so a 4 MB upload does not become a
4 MB record.

**Pipeline.** Seven stages, drag-and-drop between columns, plus a per-card stage select so the board
works from the keyboard. Bulk triage from the inbox.

**Scorecards.** Five criteria per review, averaged per scorecard and across scorecards, feeding the
candidate score, the sort order and the funnel.

**Activity log.** Append-only per candidate. Every stage change, note, scorecard and email writes an
entry; the seeded histories are derived so they stay internally consistent (a review never predates
the interview it reviews).

**Email templates.** Merge fields resolved against the real candidate record, with a preview.
Sending logs the message to the timeline — there is no mail transport.

**Search.** Full-text across names, headlines, skills, tags and locations, plus a ⌘K command palette.

**Storage.** A pluggable adapter behind one interface. Browser storage is the default, with
cross-tab sync via the `storage` event; `createMemoryAdapter` covers blocked storage, and
`createRestAdapter` in `src/lib/store/adapters.js` is a working reference implementation for a real
backend — swapping it is a one-line change in `createAtsStore`.

**Accessibility and theming.** Keyboard paths throughout, focus styles, `prefers-reduced-motion`,
and a full light/dark token system that respects an explicit choice over the OS setting.

## What is deliberately faked

- **The company and everyone in it.** Helio does not exist. Neither do any of the 16 candidates,
  their employers, or their referees. The CV bodies are written out in full so the generated PDFs
  have real content.
- **Sending email.** Nothing leaves the browser.
- **Accounts.** No sign-in. Everyone who opens the link is Talal.
- **Sharing.** Data lives in each viewer's browser, so two people open their own copy. Point the
  store at a REST adapter to change that.

---

## Layout

```
src/
├── app.css                     design tokens, base styles, both themes
├── App.svelte                  shell, routing, global keyboard
├── assets/                     mascot renditions, CC0 candidate avatars
├── components/                 Avatar, Rating, Modal, FileDrop, CvDocument, …
├── routes/
│   ├── Landing.svelte          the view selector
│   ├── apply/                  careers portal, application form, confirmation
│   └── …                       Inbox, Pipeline, CandidateDetail, Jobs, Insights, About
└── lib/
    ├── router.svelte.js        hash router
    ├── downloads.js            host-capability save, with a browser fallback
    ├── cv-download.js          generate-or-serve a candidate's CV
    ├── pdf/                    the PDF writer, text metrics, CV layout, rasteriser
    ├── data/                   jobs, personas, avatars, seed builder
    ├── email/                  templates and merge-field rendering
    └── store/                  schema, storage adapters, reactive store
```

Dependencies at runtime: none. Svelte and Vite are build-time only; there is no UI framework, no
chart library and no PDF library.

---

## Deploying

**GitHub Pages.** `.github/workflows/pages.yml` builds and deploys on every push to the default
branch, and enables Pages itself on the first run — no manual step in repository settings.
Live at **https://marcuseinar.github.io/Talal-tailor/**.

**Anything else.** `npm run build` and serve `dist/` as static files.

**A single file.** `npm run build:artifact` inlines the CSS and JS into `dist-artifact/index.html`
for hosts that take one HTML document.

---

## Credits

- Candidate avatars: **Notionists** by Zoish, released under
  [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (public domain), via DiceBear.
  Illustrations rather than photographs on purpose — the people are invented, so their faces
  should be too.
- Typefaces: Archivo, Instrument Serif, and Cairo for Arabic. All open licence.
- Built with Svelte 5 and Vite.
