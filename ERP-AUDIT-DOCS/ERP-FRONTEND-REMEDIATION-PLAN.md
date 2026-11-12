# GreenField ERP — Frontend Remediation Plan

This is the single working tracker for findings consolidated from the four audits. Work through one numbered task at a time; update its status only after implementation and the stated verification pass. Keep detailed evidence and full findings in the linked source audits rather than duplicating their reports here.

## Scope and working rules

- Frontend UI/UX and business-process completeness only.
- Do not implement backend, API, database, authentication, authorization, roles/permissions or security-architecture work from this tracker.
- Preserve unrelated user changes. Implement surgical changes and run the narrowest relevant tests/build.
- `Not started` → `In progress` → `Done` only after verification. Record the validation command/result beside a completed task.
- A proposed business field or workflow is a requirement to confirm with the functional owner when business rules are uncertain; do not silently invent policy.
- Complete P0 work before frontend freeze. P1 can proceed in parallel with backend planning; P2 is required for production polish/readiness.

## Audit sources

- [Technical Audit](../ERP-TECHNICAL-AUDIT.md)
- [UX Audit](../ERP-UX-AUDIT.md)
- [Functional Completeness Audit](../ERP-FUNCTIONAL-COMPLETENESS-AUDIT.md)
- [Gap Consolidation Report](../ERP-FRONTEND-GAP-CONSOLIDATION.md)

## Overall status

**Current phase:** P0 — Trust and core task completion  
**Frontend freeze:** Not ready  
**Backend work:** May start in parallel with frontend remediation  
**Completed tasks:** 7 / 29

## P0 — Trust and core task completion

### P0-01 — Remove generic fake-success actions

- **Status:** Done
- **Finding:** Unmapped quick actions open generic fields and can announce successful creation without a real task-specific record/result.
- **Scope:** `src/App.jsx` action fallback and modal; map only to existing real screens, otherwise show an explicit unavailable/not-created state.
- **Acceptance:** No generic modal can submit or show a create-success message; each fallback clearly says no record was created; existing mapped routes still open.
- **Verification:** **PASS — browser:** clicked the Production quick action; it clearly states that no task-specific workflow is connected and no record was created. Clicked the mapped New Order action and verified it opened the real Create Order form. Final `npm.cmd run build`, `npm.cmd run format:check`, and `git diff --check` passed.
- **Audit refs:** UX P0; functional dead-end audit; technical audit quick-action findings.

### P0-02 — Complete Branch Edit

- **Status:** Done
- **Finding:** Branch-list edit action only notifies; no edit form/save route exists.
- **Scope:** Add branch selection/edit UI consistent with current branch state and create/list patterns.
- **Acceptance:** User can open a selected branch, edit supported fields, save, cancel, and return to the correct branch/list; edits are visible in details/list.
- **Verification:** **PASS — browser:** edited the seeded Head Office branch from list/details, verified prefilled branch/code, cancel without changes, save and updated detail/list visibility; restored the original branch name. Final production build, formatting check, and diff check passed.
- **Audit refs:** Functional Administration lifecycle; consolidation P0.

### P0-03 — Identify demo and empty data

- **Status:** Done
- **Finding:** Dashboard/report fallback examples can be mistaken for real records.
- **Scope:** Mark illustrative/fallback content as sample and distinguish it from empty live/user-entered data.
- **Acceptance:** A user can tell sample rows/metrics from actual UI-created records; empty states are not populated with plausible demo facts without a visible label.
- **Verification:** **PASS — browser:** checked the initial sample fallback, then filtered a populated report to isolate `APR-DEMO-001`; it showed the sample-only explanation plus `Sample` and `Illustrative` labels. Searching `ZZZQA-NO-RESULT-XY` returned 0 records and the explicit “No matching records for the selected filters” state, with no sample banner. Final production build, formatting check, and diff check passed.
- **Audit refs:** UX P0; reporting/data-flow audits.

### P0-04 — Connect dealer orders, inventory fulfillment and returns

- **Status:** Done
- **Finding:** Dealer order products are separate from Inventory; dispatch does not visibly consume allocated batches; approved returns have no stock disposition.
- **Scope:** Define and implement order-line allocation/pick, batch/warehouse selection, dispatch/delivery continuation, and return inspection/disposition outcomes in the frontend.
- **Acceptance:** A user can trace order → selected stock → dispatch/delivery; return disposition updates the visible inventory/account journey without implying an unimplemented outcome.
- **Verification:** **PASS — browser:** with no saved Inventory data, dispatch had no eligible stock; recorded a verified 60 L opening lot, selected it for approved order `ORD-2026-0145`, and created dispatch `DN-2026-0084`. The lot went from 60 L to 0 L and delivery was confirmed. An approved 10 L restock return credited Rs 18,500 and restored the lot to 10 L; a rejected 5 L return left that stock and the dealer balance unchanged after reload. Final production build, formatting check, and diff check passed. The QA opening lot and resulting transactions remain in browser localStorage; this is not backend integration.
- **Audit refs:** Dealer and Inventory flow audits; consolidation P0/P1.

### P0-05 — Connect HR inputs to payroll run basis

- **Status:** Done
- **Finding:** Payroll generation does not visibly consume HR attendance/leave; employee state can diverge between modules.
- **Scope:** Show approved period attendance/leave basis and employee source in payroll review/generation; resolve frontend data handoff.
- **Acceptance:** Payroll preview shows the same current employees and the approved attendance/leave inputs used for the selected period, or explicitly identifies excluded inputs pending a confirmed policy decision.
- **Verification:** **PASS — browser:** saved attendance and inspected payroll generation/draft/review. The run showed 19 active employees, 19 attendance records, and 2 approved leave days; the estimate remained Rs 1,980,938 before and after the attendance save. Draft and review explicitly state attendance/leave are excluded from salary calculations pending policy confirmation, satisfying the accepted explicit-exclusion outcome without inventing payroll policy. Final production build, formatting check, and diff check passed.
- **Audit refs:** HR/Payroll data-flow audits; consolidation P0.

### P0-06 — Resume bank reconciliation

- **Status:** Done
- **Finding:** In-progress reconciliation is recorded but not reopenable.
- **Scope:** Add a continuation path to saved reconciliation state, unmatched rows and difference.
- **Acceptance:** User can reopen an in-progress reconciliation, continue matching, save progress and complete it with a visible outcome.
- **Verification:** **PASS — browser:** started and saved an in-progress reconciliation, exited and reopened it, verified the Rs 3,000 difference and unmatched rows were restored, and confirmed completion was blocked. Matched the statement lines, aligned statement and book balances at Rs 3,743,000, then completed; the UI showed Reconciled and the cleared rows persisted. Final production build, formatting check, and diff check passed. State is localStorage-backed.
- **Audit refs:** Finance workflow audit; consolidation P0.

### P0-07 — Make payment and schedule outcomes truthful

- **Status:** Done
- **Finding:** Payroll payment UI marks records paid without a complete result path; report schedules are stored but not executed/delivered.
- **Scope:** Represent pending/planned vs completed outcomes accurately; add visible result states or clearly label prototype-only definitions.
- **Acceptance:** No action claims payment/delivery completed without a represented outcome; planned schedule is not presented as an executed delivery.
- **Verification:** **PASS — browser and code-level:** finalized the November payroll batch and recorded 19 payment instructions; the UI showed “Pending bank confirmation,” kept the batch finalized/unpaid, blocked duplicate instructions, and retained the records after reload. Created a weekly Sales Overview plan and verified after reload it remained “Planned (not executed)” / “Not executed”; no report or email was generated. Focused code-level checks for partial/duplicate payment instructions and planned schedules also passed. Final production build, formatting check, and diff check passed. This is localStorage prototype state, not bank integration or an executing scheduler.
- **Audit refs:** Payroll, reporting, UX error-state audits; consolidation P0.

## P1 — Complete business lifecycles

### P1-01 — Master-data maintenance and history

- **Status:** Done
- **Scope:** Added edit, deactivate/reactivate, archive, and visible history journeys for supported dealer, product, warehouse/location, batch, salary structure/component, and account masters. Records retain their IDs; status changes replace destructive deletion where references or stock exist.
- **Acceptance:** **PASS — browser/UI:** edited and reverted dealer, product, warehouse/location, batch, payroll structure/component, and account records; verified change history. Verified batch archive/reactivation, payroll component status transitions, and account deactivate/reactivate. Safety checks blocked dealer deactivation with a pending order, inventory deactivation/reduction while stock/capacity constraints applied, payroll structure deactivation while assigned, and account deactivation/code changes when posted journals referenced the account. A saved account-name edit remained after browser reload. Restored the pre-QA browser-storage baseline and confirmed QA edits/data were absent afterward.
- **Verification:** **PASS — code-level:** production build and targeted formatting/diff checks passed. **PASS — browser/UI:** real local-app interactions and reload persistence were exercised; these are localStorage-backed prototype flows, not server-side audit storage.
- **Audit refs:** CRUD matrix and module checklists.

### P1-02 — Dealer order amendment, cancellation and status timeline

- **Status:** Done — frontend prototype workflow; server-side authorization deferred
- **Rules:** Amend and cancel only while an order is Pending Approval. An amendment requires a reason and remains Pending Approval for review; a cancellation requires a reason and closes the order. Rejected decisions require a reason. Approved, dispatched, delivered, rejected, and cancelled orders cannot be amended or cancelled through this flow.
- **Acceptance:** **PASS — browser/UI:** created a multi-line order, amended quantities/products with a required reason, verified it stayed Pending Approval and persisted after reload, then rejected it with a required reason. Created and cancelled a separate pending order with a required reason; verified the terminal status/reason persisted and appeared in Order History. Approved a third order and exercised dispatch and delivery; the details timeline recorded submission, approval, dispatch, and delivery and showed the stage-specific next action. Verified approved/terminal orders expose no amend/cancel controls. Restored the saved browser-storage baseline and confirmed QA orders, dispatch and stock movement were removed. Existing orders without saved event history are explicitly labeled as predating timeline tracking rather than showing fabricated events.
- **Verification:** **PASS — code-level:** production build, targeted Prettier check, and diff check passed. **PASS — browser/UI:** real local-app interactions and reload persistence were exercised. The UI runs in the existing Admin prototype context; authenticated user/role enforcement is not available in this frontend and remains deferred to backend authorization.
- **Audit refs:** Dealer lifecycle and UX workflow findings.

### P1-03 — Return inspection and financial/stock outcome

- **Status:** Done — localStorage-backed frontend prototype; no Finance journal is posted
- **Rules:** Review records physically received, accepted, and rejected whole-unit quantities; accepted plus rejected must equal received. Only accepted units are restocked and only for the final Restock disposition. Approved local credit is capped by both the request and accepted quantity × order unit price, gets a local credit reference, and reduces the local dealer balance. A decision reason and explicit stock/account outcomes are saved. Legacy returns missing traceable order product/price details cannot be approved.
- **Acceptance:** **PASS — browser/UI:** created a four-unit return, approved three and rejected one, verified the split-sum guard and a credit above the accepted-quantity cap were blocked, then approved PKR 5,550 against a PKR 7,400 request. The source batch increased by exactly three and the local dealer balance decreased by PKR 5,550. Reload preserved the decision; Dealer Statements showed credit reference `CRN-2026-0001`. Approved a second return for PKR 2,000 using Credit without restock and verified no additional stock movement, the local balance update, and `CRN-2026-0002`. A legacy return missing product/price details was blocked from approval and could be rejected with zero stock/credit effects. Finance storage was unchanged; no Finance journal was posted. Restored the pre-QA browser-storage baseline and confirmed QA records/movements were absent afterward.
- **Verification:** **PASS — code-level:** production build, targeted Prettier check, and diff check passed. **PASS — browser/UI:** real local-app form interaction, validation, inventory/account outcomes, statement references, and reload persistence were exercised. The workflow is localStorage-backed; it does not create Finance ledger entries.
- **Audit refs:** Dealer/Inventory/Finance audits.

### P1-04 — Inventory QC workflow

- **Status:** Done
- **Acceptance:** **PASS — browser/UI:** Supplier GRNs now record an intake condition separately and always enter Quarantine. A failed result could not be released; a passing result released the batch without changing its on-hand quantity. Hold preserved the quantity and quarantine state, retained the selected batch for follow-up, and a later passing inspection released it with both inspections retained. Reject preserved the quantity as on-hand Rejected stock, blocked issue eligibility, and kept disposal/write-off separate. The issue form listed only released batches. Batch Register and Batch Traceability showed the receipt condition, latest QC result/decision/reason, and complete inspection history. Reload preserved the results; the pre-QA browser-storage baseline was restored exactly.
- **Verification:** **PASS — code-level:** production build, targeted Prettier check, and diff check passed. **PASS — browser/UI:** exercised GRN → quarantine → invalid release guard → release, hold → follow-up release, reject, issue eligibility, traceability, and persistence in the local browser.
- **Audit refs:** Inventory lifecycle audit.

### P1-05 — Supplier purchasing, receipt and payable workflow

- **Status:** Not started
- **Acceptance:** Supplier/PO/GRN and bill matching can show expected vs received vs billed quantities/amounts and resolve discrepancies.
- **Audit refs:** Inventory/Finance integration findings.

### P1-06 — Stock-count exception lifecycle

- **Status:** Not started
- **Acceptance:** Count can be resumed/recounted, variance resolved/approved and resulting adjustment/history viewed.
- **Audit refs:** Inventory lifecycle audit.

### P1-07 — HR employee lifecycle, leave and attendance corrections

- **Status:** Not started
- **Acceptance:** Employee exit/clearance, leave amend/withdraw/accrual and historical attendance correction have clear screens, state transitions and downstream context.
- **Audit refs:** HR lifecycle and CRUD audit.

### P1-08 — Payroll correction, variance, period and payment lifecycle

- **Status:** Not started
- **Acceptance:** Run review shows calculation detail/variance; correction/reversal, period close/reopen and partial/failed payments have truthful transitions.
- **Audit refs:** Payroll lifecycle audit.

### P1-09 — Finance document correction and master journeys

- **Status:** Not started
- **Acceptance:** Customer/supplier maintenance, invoice/bill correction/void and credit/refund paths preserve source-document context and resulting balances in UI.
- **Audit refs:** Finance lifecycle audit.

### P1-10 — Bank statement matching and exception resolution

- **Status:** Not started
- **Acceptance:** User can work from statement rows, match/unmatch, resolve exceptions, resume and see the completed reconciliation.
- **Audit refs:** Finance workflow audit.

### P1-11 — Saved report restoration and schedule execution clarity

- **Status:** Not started
- **Acceptance:** Saved view reopens with its filters; schedule is either clearly a definition or has a visible run/delivery history.
- **Audit refs:** Reports & Analytics audit.

### P1-12 — Source drill-through and contextual return paths

- **Status:** Not started
- **Acceptance:** Major KPI/report rows and related transactions navigate to source details and back while retaining useful list/report context.
- **Audit refs:** UX navigation; functional dead-end audit.

## P2 — Consistency, usability and production polish

### P2-01 — Breadcrumbs and return-to-results patterns

- **Status:** Not started
- **Acceptance:** Every major workflow page has a clear parent/context and reliable return destination.

### P2-02 — Shared form behavior

- **Status:** Not started
- **Acceptance:** Required indicators, field errors, error summary, cancel/reset, dirty state and save outcome are consistent.

### P2-03 — Shared grid behavior

- **Status:** Not started
- **Acceptance:** Search/filter/sort/pagination/export/row-actions and empty/no-match states are predictable across modules.

### P2-04 — Clarify transaction naming and create-vs-browse modes

- **Status:** Not started
- **Acceptance:** Receipt/payment terminology and invoice/bill creation vs listing are unambiguous in navigation and headings.

### P2-05 — Consolidate duplicate dashboards and reports

- **Status:** Not started
- **Acceptance:** Dealer Reports ownership and module dashboard vs cross-module overview purposes are clearly distinct or consolidated.

### P2-06 — Report context and export preview

- **Status:** Not started
- **Acceptance:** Period, scope, as-of date, filters, sample/live marker, row count and exported content are clear.

### P2-07 — Responsive shell, actions and tables

- **Status:** Not started
- **Acceptance:** Mobile navigation does not obscure the page; overflow is discoverable; forms/tables remain usable at supported widths.

### P2-08 — Keyboard, focus and assistive feedback

- **Status:** Not started
- **Acceptance:** Keyboard flow, focus management, dialog/tab semantics, live status/error announcements and readable interaction targets pass review.

### P2-09 — Empty, error and confirmation states

- **Status:** Not started
- **Acceptance:** No-data/no-match/prerequisite/error/success/destructive states are distinct, actionable and truthful.

### P2-10 — Help, glossary and onboarding

- **Status:** Not started
- **Acceptance:** Key workflows explain terms, prerequisites, field purpose and next steps; shortcut hints work or are removed.

## Additional audit-aligned frontend requirements

The current plan has no P3 section. These supplementary tasks follow the existing P0–P2 backlog without changing its task IDs, statuses, priorities, acceptance criteria, or implementation notes. They cover frontend recommendations from the four audits that were missing or not explicit enough in the existing tasks.

### ADD-01 — Correct misleading shell actions and labels

- **Priority:** P1
- **Status:** Not started
- **Scope:** Align shell action labels, ribbon groups, and feedback with the destination and actual behavior. In particular, correct the misleading Close outcome and misplaced Payment/Dealer List actions; unavailable actions must not imply that work or a session was completed.
- **Acceptance:** Each visible shell action is grouped and named for its real destination; invoking it either opens that workflow or clearly states that it is unavailable. Feedback never claims a session was closed securely or a task completed unless that outcome actually occurred.
- **Audit refs:** UX navigation and error-state audits; technical audit feature/action gaps.

### ADD-02 — Complete employee and approval setup handoffs

- **Priority:** P2
- **Status:** Not started
- **Scope:** Connect employee profiles to user-account setup/linking without conflating employee records with login accounts, and add an approval-rule route preview.
- **Acceptance:** An authorized user can navigate from an employee profile to create or link its user account and return to the employee context. Before saving an approval rule, the UI can preview a representative request's applicable threshold, approval stages, and next approver; it does not imply a real approval was submitted.
- **Audit refs:** Functional Administration lifecycle; UX form/navigation audit.

### ADD-03 — Complete HR history and follow-up journeys

- **Priority:** P2
- **Status:** Not started
- **Scope:** Add document-expiry follow-up, review-cycle due/overdue and employee-acknowledgement/action-plan states, and a contextual employee timeline across profile, attendance, leave, shifts, and payroll history.
- **Acceptance:** Expiring or expired employee documents and due/overdue reviews are identifiable with a clear next action. Review acknowledgement and follow-up status are visible. The employee timeline links to available source records and distinguishes unavailable or untracked history from completed events.
- **Audit refs:** Functional HR lifecycle and reporting audits; UX user-guidance and navigation audits.

### ADD-04 — Add Finance receipt and reconciliation reporting

- **Priority:** P2
- **Status:** Not started
- **Scope:** Provide dedicated receipt/payment registers and bank-reconciliation report/detail views, with links to their source documents and statement rows.
- **Acceptance:** Users can filter and review receipts/payments and reconciliations by relevant party, date, reference, amount, and status; open the linked invoice, bill, ledger entry, or statement row where available; and distinguish matched, unmatched, and unresolved items without implying a ledger posting that did not occur.
- **Audit refs:** Functional Finance and reporting audits; gap consolidation missing-pages and reporting lists.

### ADD-05 — Make report row limits and export scope explicit

- **Priority:** P2
- **Status:** Not started
- **Scope:** Ensure report results that exceed the current display limit can be paginated or otherwise navigated, and make the displayed versus total result count and export scope clear.
- **Acceptance:** For a result set above 100 rows, users can reach all matching rows through pagination or an equivalent supported control, or the UI clearly identifies the limit and provides an appropriate way to access the full result. The report and export state the active filters, visible/total row counts, and whether export contains visible rows or all matching rows.
- **Audit refs:** UX table/grid audit; functional reporting completeness audit.

### ADD-06 — Verify responsive and accessible behavior at audited boundaries

- **Priority:** P2
- **Status:** Not started
- **Scope:** Supplement P2-07 and P2-08 with explicit narrow-screen, zoom, chart, status, and interaction checks identified by the UX audit.
- **Acceptance:** At 320px and 390px widths the shell does not obscure the page or cause avoidable document-wide horizontal overflow; navigation overflow is discoverable and keyboard-operable. At 200% zoom, essential content and actions remain usable. Charts have a textual interpretation or equivalent data view; status is not communicated by color alone; controls have persistent accessible names and visible focus.
- **Audit refs:** UX responsiveness and accessibility audits.

### ADD-07 — Provide recoverable loading, stale, partial, and page-error states

- **Priority:** P2
- **Status:** Not started
- **Scope:** Define visible states for loading, stale or partial content, unavailable page content, and recoverable rendering errors, preserving user-entered work where possible.
- **Acceptance:** Users can distinguish loading, stale, partial, empty, and failed states; recoverable errors offer a clear retry or return path; retry does not silently discard valid input; a failed action never displays success feedback.
- **Audit refs:** UX empty-state and error/recovery audits; technical audit error-handling recommendations.

### ADD-08 — Establish one canonical frontend route and navigation registry

- **Priority:** P2
- **Status:** Not started
- **Scope:** Replace independently maintained route maps, navigation sets, and page-label fallbacks with one route registry containing stable unique page IDs, module ownership, component, navigation metadata, and breadcrumb/return context.
- **Acceptance:** Every registered route resolves to one page and has intentional navigation or a documented direct-entry purpose; labels are not used as ambiguous identifiers; automated checks detect route/navigation drift and duplicate IDs, including the Dealer Reports collision.
- **Audit refs:** Technical audit refactoring recommendations; UX hidden/duplicate navigation findings.

### ADD-09 — Centralize form metadata and reduce shell coupling

- **Priority:** P3
- **Status:** Not started
- **Scope:** Introduce reusable typed form metadata for labels, input types, required rules, and validation, and separate unrelated shell/controller responsibilities from the oversized `App.jsx` as the affected features are maintained.
- **Acceptance:** New or refactored forms use shared typed metadata and consistent validation; the application shell remains focused on shell concerns, with module workflows owned by their feature areas. Existing route and workflow behavior remains unchanged.
- **Audit refs:** Technical audit refactoring and maintainability recommendations; UX form-consistency audit.

### ADD-10 — Reduce initial frontend payload and contain style ownership

- **Priority:** P3
- **Status:** Not started
- **Scope:** Measure the production bundle, lazy-load suitable large feature areas, and reduce global stylesheet coupling through scoped/module styles and removal of superseded rules where safe.
- **Acceptance:** Production build no longer emits an unexplained initial JavaScript chunk warning above the configured 500 kB threshold, or any documented exception has measured justification. Style changes do not introduce module or responsive regressions in the affected screens.
- **Audit refs:** Technical audit performance and refactoring recommendations; UX styling-ownership findings.

### ADD-11 — Add focused frontend route, workflow, and accessibility checks

- **Priority:** P2
- **Status:** Not started
- **Scope:** Add automated checks for route/link coverage, key form validation, business invariants and cross-module frontend journeys, plus repeatable accessibility checks for high-risk workflows.
- **Acceptance:** Tests detect broken registered routes and navigation links, invalid key workflow transitions, and regression in the agreed accessibility checks. Coverage includes representative dealer/inventory, HR/payroll, finance/reconciliation, and saved-report journeys; tests do not treat localStorage prototype state as backend integration.
- **Audit refs:** Technical audit delivery-assurance recommendations; UX verification notes; functional audit high-risk workflow recommendations.

## Completion log

| Date | Task | Change summary | Validation | Result |
|---|---|---|---|---|
| 11 Nov 2026 | P0-01 | Removed generic fake-create form and success toast from unmapped quick actions; fallback now clearly reports that no record was created. | Browser check on Production fallback and mapped New Order route; final `npm.cmd run build`; `npm.cmd run format:check`; `git diff --check` | PASS |
| 12 Nov 2026 | P0-02 | Completed branch edit and restored the seeded branch after browser QA. | Browser edit/cancel/save/list checks; final production build; `npm.cmd run format:check`; `git diff --check` | PASS |
| 12 Nov 2026 | P0-03 | Made sample-only, mixed, and no-result report states distinguishable. | Browser sample-only `APR-DEMO-001` labels and zero-result filter; final production build; `npm.cmd run format:check`; `git diff --check` | PASS |
| 12 Nov 2026 | P0-04 | Completed order allocation, dispatch, delivery, stock deduction, and return disposition checks. | Browser dispatch/delivery, approved restock and rejected return; reload persistence; final production build; `npm.cmd run format:check`; `git diff --check` | PASS |
| 12 Nov 2026 | P0-05 | Exposed attendance/leave context and explicit exclusion from salary calculations pending policy confirmation. | Browser HR save and payroll generation/draft/review checks; final production build; `npm.cmd run format:check`; `git diff --check` | PASS |
| 12 Nov 2026 | P0-06 | Added reopen/continue/save behavior for in-progress reconciliations. | Browser save/exit/reopen/match/complete with unmatched rows and difference; final production build; `npm.cmd run format:check`; `git diff --check` | PASS |
| 12 Nov 2026 | P0-07 | Made payment instructions pending and report schedules explicitly planned, not executed. | Browser payment and schedule creation/reload checks; focused code checks; final production build; `npm.cmd run format:check`; `git diff --check` | PASS |
