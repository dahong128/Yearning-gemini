Changelog
=========

All notable changes to this project will be documented in this file.

## [2.4.1] - 2025-09-12

### Added
- Extensive i18n coverage across management and audit modules:
  - Manage: Settings (`manage_settings.*`), Users (`manage_user.*`), Databases (`manage_db.*`), Groups (`manage_group.*`), Roles page (`manage_role.*`) and Role args (`manage_role.args.*`).
  - Auto Tasks (`manage_auto.*`) including type labels (Insert/Update/Delete).
  - Audit modals: OSC progress and Reject dialog (`audit_order.osc.*`, `audit_order.reject.*`).
  - Order profile results table headers (`order_profile.results.columns.*`).
- Server message → i18n mapping expanded in `src/libs/requests.ts`:
  - “工单已同意”, “审核完成”, “所有工单已终止” now localized.

### Changed
- Login page: language switcher styling and header/footer layout refined (no overflow scrollbars), footer info removed, GitHub icon hidden.
- Unify common labels: `common.open|close|save|delete|detail|select_all|verified`.
- Normalize form labels/placeholders, buttons, and table headers to use `$t()` for live locale switching.

### Fixed
- Various hard-coded Chinese strings replaced with i18n keys across Settings, Users, DB, Groups, AutoTask, Role pages.
- JSON structure issues in language files corrected; added missing keys for new UI texts.

### Notes
- Remaining Chinese in comments and language picker labels are intentional (not user-facing or are language names).
- Further enhancements: switch StepDetail action matching to server enums when backend supports; refine some pt-osc arg descriptions.

## [2.4.0] - 2025-09-11

### Added
- Internationalization (i18n) support for Simplified Chinese (`zh`), English (`en`), and Japanese (`ja`).
- Central i18n bootstrap and UI locale switch for View-Design: `src/language/index.ts`.
- LanguageSwitcher component and integration in headers:
  - `src/components/LanguageSwitcher.vue`
  - Injected into `src/main.vue` (app header) and `src/views/login/login.vue` (login header).
- Route titles use i18n keys (`nav.*`) and browser title resolves via i18n in `src/main.ts`.
- Per-page i18n for major modules (see Changed section for scope and files).
- Common empty-state messages:
  - `common.no_match` for Select `:not-found-text`.
  - `common.no_data` for Table `:no-data-text`.
- Node version pinning for development:
  - `.nvmrc`, `.node-version`, `package.json.engines`, and `package.json.volta` (Node 16).

### Changed
- Replaced hard-coded Chinese with `$t()` across core modules:
  - Login: `src/views/login/login.vue`, `src/views/login/render.ts`.
  - Dashboard & Greetings: `src/main.vue`, `src/views/home/home.vue`.
  - Query (Apply/SQL/Multi-source/Progress):
    - `src/views/query/workFlow.vue` (step titles/descriptions now computed for live switching)
    - `src/views/query/querySql.vue`
    - `src/views/query/multiSource.vue`
    - `src/views/query/refer.vue` (computed i18n)
  - Orders (My orders, submit flow, confirm):
    - `src/views/order/basicList.vue`, `src/views/order/myOrder.vue`
    - `src/components/order/orderSteps.vue`, `src/components/order/orderForm.vue`, `src/components/order/orderSQLs.vue`, `src/components/order/orderConfirm.vue`
  - Audit:
    - Orders: `src/views/audit/order/audit.vue`
    - Queries: `src/views/audit/query/audit.vue`
  - Records:
    - Orders: `src/views/records/order.vue`
    - Queries: `src/views/records/query.vue`
  - Profile details & execution:
    - `src/components/profile/profile.vue`, `src/components/profile/collapse.vue`, `src/components/profile/queryProfile.vue`, `src/components/profile/stepDetail.vue`, `src/components/profile/testing.vue`
  - Permissions modal: `src/components/modal/rulesLimits.vue`
  - Common libs & store messages: `src/libs/requests.ts`, `src/libs/libs.ts`, `src/store/modules/general.ts`, `src/interface/render.ts`
- Navigation and breadcrumb now use i18n route keys and `$t()`:
  - `src/components/sidebarMenu.vue`, `src/components/breadcrumbNav.vue`, `src/router.ts`.
- Select placeholders normalized to `common.select`; common search placeholders localized.
- Header layouts adjusted to consistent flex-based alignment:
  - App header: `src/styles/main.less` + `src/main.vue`
  - Login header: `src/views/login/login.vue`
- README updated with i18n details and dev notes.

### Removed
- Sponsor/Donation UI and modal from headers and login:
  - `src/main.vue` sponsor dropdown & modal removed.
  - `src/views/login/login.vue` sponsor button & modal removed.
- Sponsorship-related strings from language files (retained unrelated statement text only).

### Fixed
- Language switcher text not updating issue (now reads from `$i18n.locale`).
- Tabs in query SQL no longer use localized names for `name` value to prevent switching bugs.
- Mixed hard-coded messages in validators replaced with i18n (see `validate.*`).
- Various Select/Table empty prompts localized across modules.

### Notes
- Some specialized texts remain in Chinese and will be handled in future passes (see TASKS.md).
- Japanese UI fallback uses English View-Design locale for UI components; full JA UI set requires custom locale.

---

## [2.3.x] - Previous
- Historical baseline prior to i18n overhaul.
