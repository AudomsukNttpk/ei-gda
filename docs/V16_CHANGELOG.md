# V16 changelog

## Unreleased

### Added
- Collapsible sidebar. On screens 992px and wider, the menu button in the top bar folds the sidebar to a 72px icon rail and back. The choice is remembered in the browser (`localStorage` key `eigda.sidebar`) and applied from the page head before first paint, so a folded menu does not flash open. The motion keeps icons still (the rail width puts them at the centre already, and no padding or alignment changes between the two states) and fades labels while the sidebar clips them so they never wrap or pop. Menu labels stay in the page for screen readers. On the folded rail, hovering or keyboard-focusing an icon shows its name at once in a dark label beside it (one floating element made by `app.js`, so the sidebar's clipping cannot cut it). The button reports `aria-expanded`. On narrower screens the menu is still the slide-in drawer and the saved choice is ignored. `app.js` sends `eigda:layout-start` and `eigda:layout-end` around the width change, for pages that need to re-align after it.
- Spacing, border and radius standard (see `docs/V16_UI_SPACING.md`): a 4px-based scale (`--sp-1` to `--sp-7`), one border width, three radii and fixed sizes as tokens at the top of `v16.css`, applied to the app shell and the sidebar. Visible effects: top bar 72px high with the same side padding as the page (it was 28 against 32), page padding 24 / 32 / 48 (was 28 / 32 / 64), 40px logo, 24px menu icons. A test fails when the covered CSS uses a raw pixel value for padding, margin, gap or radius.

## 16.0-beta.1 (2026-11-05)

### Added
- Domain engine: applicability rules with reasons, inherent risk, configuration snapshots.
- Domain packs v2: 42 controls across 5 domains, each with evidence requirements and its own rubric. EMS taxonomy marked provisional.
- Regulatory Registry with 35 references, class and verification status, admin verification, and audit log.
- Taxonomy Explorer with tree, search, 7 filters, breadcrumb, and node details.
- 7-step guided assessment with save and resume.
- Rubric scoring with critical gates, human review, and five separate measures.
- Domain-aware KG export and finding traces.
- Portal, domain pages, assessments, evidence library, registry, reports, global search, notifications.
- Print report, CSV, and JSON exports. E2E suite using system Chrome.

### Changed
- Navigation and shell redesigned. The default landing page is `/overview`.
- Default `DEBUG` is False. Registration needs 10 or more characters. The `adminbuu` alias is now opt-in.
- The local model client splits a batch that returns no content. `LOCAL_MODEL_TOKEN_CAP` makes the former fixed 3500 cap configurable.
- `.env` for V16 leaves `LOCAL_MODEL_NAME` empty. The endpoint now reports a different model from the Gemma name configured before.

### Fixed
- Plaintext passwords shown on `/admin/users`.
- Thai text missing from generated PDFs.
- CSRF protection missing on most forms.
- Reloading `run-compliance` resending documents to a model.

### Removed
- V15 templates `user/domains.html` and `user/domain_workspace.html`, replaced by the new pages. The warning box you asked to remove from the Domain page stays removed.

### Unchanged by design
- The V14 hybrid formula and all historical scores.
