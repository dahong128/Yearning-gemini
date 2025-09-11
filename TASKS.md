Tasks Overview
==============

This document tracks what was done in this i18n pass and what remains for follow‑up.

Completed
---------
- Core i18n scaffolding and language packs (zh/en/ja); persistent locale + View-Design UI locale.
- LanguageSwitcher component and header integration (app + login).
- Route/Navigation/Breadcrumb i18n (route meta `nav.*`, `$t(item.meta.title)`).
- Modules localized (UI text, validators, prompts, placeholders):
  - Login, Dashboard, Permissions modal, Profile (details/testing/collapse).
  - Query: Apply (workflow), SQL, Multi-source, Progress.
  - Orders: My Orders, Submit wizard (steps/form/SQLs/confirm).
  - Audit: Order audit, Query audit.
  - Records: Order records, Query records.
  - Manage: Users, DB, Flow (partial), Role (table empty text), AutoTask.
- Unified empty states:
  - Select `:not-found-text="$t('common.no_match')"`.
  - Table `:no-data-text="$t('common.no_data')"`.
- Removed sponsor UI and related strings; kept unrelated statement text.
- Header layout fixes (app + login).
- Node 16 pinning; README rewrite.

Next / Follow‑ups
-----------------
- Localize remaining Chinese strings in management views:
  - `src/views/manage/flow/flow.vue`: labels, tips, modal titles, step labels, button texts.
  - `src/views/manage/settings/setting.vue`: many labels/placeholders for LDAP/SMTP/flags.
  - `src/views/manage/user/user.vue`: remaining placeholders/labels outside of search.
- Localize profile/basic info texts:
  - `src/components/profile/basic.vue` static labels (备份、提交人、提交时间等)。
- Localize role rules descriptions if they surface in UI:
  - `src/views/manage/role/role_args.ts` (desc fields are Chinese).
- Unify remaining Table/Select empty/placeholder texts where missed.
- Browser title on language switch: add a small watcher to update `document.title` when `$i18n.locale` changes (currently updates on navigation).
- Clean up statement text referring to sponsorship in `banner.statement.text_8` if no longer desired.
- Optional: add JA View-Design UI translations (currently falls back to EN for UI components).
- Optional: add E2E checks or a lint script to catch hard-coded CJK in `.vue/.ts` files.

How to Continue
---------------
1. Pick a target view (e.g., `manage/flow/flow.vue`).
2. Replace hard-coded strings with `$t('...')` keys and add them to all three language files.
3. For dynamic content (steps, columns, validators), prefer computed getters over static `data` to ensure instant updates on locale change.
4. Run `rg -n "[\u4e00-\u9fa5]" src` to spot remaining Chinese hard-codes.
5. Keep empty states consistent (`common.select`, `common.no_match`, `common.no_data`).

