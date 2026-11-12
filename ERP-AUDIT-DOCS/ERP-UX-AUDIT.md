# GreenField ERP — Frontend UX Audit

**Scope:** Frontend UI/UX only — layout, navigation, workflow, content, interaction, accessibility, responsive behavior and user feedback. Backend, API, database, authentication and server architecture are intentionally excluded.

**Review method:** Static review of the seven module route maps, page components, shared UI and CSS, plus browser smoke review of the application shell, Dealer Management dashboard and Inventory product form. The browser was checked at 390px mobile width; the desktop dashboard was viewed; viewport metrics were also checked at narrow widths. This is a source-based audit, not a usability study or full keyboard/screen-reader certification. Page ratings and completion percentages are heuristic, used to prioritize UI work.

**Page coverage:** 201 declared route entries across seven modules. Module containers/shared components are reviewed as reusable patterns, not counted as separate pages. The separate [technical audit](./ERP-TECHNICAL-AUDIT.md) contains the detailed canonical route and field inventory; this report evaluates how those routes feel to use.

## Executive assessment

The ERP has a recognizable enterprise-style shell, clear module separation, page titles, reusable visual components, and a number of thoughtful form, validation and empty-state patterns. The largest production UX blockers are inconsistent interaction behavior across modules, page- and report-level demo data that is not consistently labeled, generic quick-action forms that imply completed work without creating a visible record, incomplete navigation orientation, uneven table tools, and accessibility/responsive gaps.

### Summary scores

| Measure | Score | Interpretation |
|---|---:|---|
| Overall UI completion | **73%** | Most areas have visible screens and a consistent broad visual direction; interaction details and content states remain uneven. |
| Overall UX completion | **61%** | Common tasks are recognizable, but flow continuity, recovery, empty states, navigation and responsive discoverability need substantial work. |
| Production UI readiness | **43%** | Not a backend/security assessment. UI still communicates misleading success/sample status in important flows and lacks consistent quality states. |
| Estimated frontend UX work remaining | **57%** | Approximate inverse of the readiness estimate; includes redesign, implementation and QA. |

These are not objective telemetry or a claim that a percentage of code is complete. They summarize the evidence below.

## Phase 1 — Module UX review

| Module | UX score | Strengths | Weaknesses | Recommendations |
|---|---:|---|---|---|
| Administration | **66** | Clear module categories; branch, department, user and approval screens are recognizable; unsaved company-profile changes are guarded. | Many independent page styles and custom tables; settings terminology and save behavior vary; pages such as edit states are not always in the menu; permission/configuration controls need context. | Normalize page headers, form footer and dirty-state behavior; group settings by task; add contextual definitions, scope labels and safe previews; provide a consistent return path. |
| Dealer Management | **69** | Dashboard gives an overview of work queues; order, dispatch, returns, territory and account concepts are grouped logically; status text helps distinguish work states. | High number of similar lists and reports; shared generic forms reduce task specificity; same “Dealer Reports” label exists in another module; account/order/dispatch progression is not always visible as one workflow. | Add a dealer/order workspace with step status and contextual next action; use task-specific forms and shared search/filter/grid patterns; clarify which report area is active. |
| Finance | **74** | Domain vocabulary and ledger subareas are familiar to finance users; journal form has meaningful debit/credit validation; shared page and empty components provide a base. | Financial tables are dense; search, filters, sorting, export and empty states are inconsistent; “Create Ledger Account” and “Account Form” nomenclature differs; source/status/period context can be hard to scan. | Use a consistent financial document header with period/status/reference; make balance state prominent; standardize tables and field help; distinguish draft, posted and reversal actions. |
| Human Resource | **72** | Employee, leave, shift and performance areas have a sensible hierarchy; shared headers, controls and some explicit empty states exist. | User/employee terminology overlaps; many report/queue pages have similar structures; list filters and actionable empty states vary; highly sensitive employee forms are long and easy to abandon. | Add employee context to all HR tasks; group forms by identity, employment and compensation; standardize list tools and status transitions; provide save/cancel and unsaved-change behavior consistently. |
| Inventory | **77** | Strongest visual/design-system consistency; product, batch, warehouse and stock operations are clearly separated; required labels and unit-specific fields are often concrete; table helper provides a no-records row. | Operational screens are still information-dense; movement/batch grids need predictable navigation at small widths; warning/quality/expiry signals need priority; task workflows need stronger step context. | Preserve the clear components; add batch/warehouse context panels, confirmation summaries for irreversible movements, consistent table tools, and responsive row/detail patterns. |
| Payroll | **71** | Salary setup → period → review → finalization → payment structure is recognizable; shared status and empty components exist. | Review, finalize and payment views can look like disconnected queues; next-step/status context and form cancellation are uneven; payroll period/employee scope is easy to lose. | Add one payroll-run timeline with current step, period, totals and owner; highlight blocked prerequisites and next action; use consistent confirm/undo language. |
| Reports & Analytics | **67** | Dashboard, operational reports, saved reports, schedules and exports are grouped; reports have filter controls and export history; useful report-level empty wording exists. | Dashboard/report data and static charts are not consistently identified as sample; broad report tables cap display at 100 without pagination; filter scope and row counts can be misleading. | Show date range, scope, last refresh and sample/live status; add pagination or explicit limit; explain no-result states; standardize saved/scheduled/export status. |

## Phase 2 — Page UX evaluation

### Reading the page matrix

The matrix lists every route and gives a heuristic UX rating (0–100), purpose clarity, page-specific concern and suggested improvement. `Yes` means the page’s task is reasonably clear from its title/heading; `Partial` means the title is broad, ambiguous or the UI context does not clearly set expectations. Ratings are static-source assessments; a page still needs task testing with representative users.

Issue shorthand:

- **D1:** dashboard metrics/chart sample-ness, timeframe or scope not explicit → identify illustrative data and show context.
- **L1:** list/grid tools inconsistent (search/filter/sort/page/export) → standardize a grid toolbar, persistent filter summary and row actions.
- **L2:** empty/no-result state or next-step CTA inconsistent → add distinct first-use, no-match and no-data states.
- **F1:** form cancel/reset/dirty behavior or field grouping inconsistent → use a repeatable grouped form and footer.
- **F2:** validation/required/error help is uneven → show requirements before submit, field-level errors and a summary/focus target.
- **W1:** workflow status/next step/confirmation unclear → show task progression, consequences and a safe review step.
- **N1:** page discoverability/context/back path weak → add breadcrumbs, contextual links and stable page identity.
- **A1:** keyboard/screen-reader/focus/announcement affordances inconsistent → apply common accessible interaction semantics.
- **R1:** narrow layouts, internal overflow or dense content → verify responsive collapse and provide intentional table/detail behavior.
- **C1:** terminology, labels, units or action verbs inconsistent → use shared glossary and naming conventions.
- **G1:** generic placeholder/dialog/action is not tailored to the task → replace with a page-specific experience and truthful outcome.

### Administration — 31 routes

| Page | Purpose | Obvious? | Rating | Issues → improvement |
|---|---|---:|---:|---|
| Dashboard | Organization-wide overview and admin shortcuts | Partial | 60 | D1, G1: distinguish sample metrics; make each action lead to the matching workflow. |
| Company Setup | Define company profile and logo | Yes | 78 | F1, F2: keep grouped sections, explain required/legal identifiers, show saved/unsaved state consistently. |
| Company Documents | Upload and track company documents | Yes | 72 | L1, L2, F2: clarify file type/size, expiry actions and first-use state; make filters removable. |
| Branch List | Find and manage branches | Yes | 74 | L1, L2: add predictable sort/page tools and a create-branch CTA when empty. |
| Create Branch | Add a company branch | Yes | 71 | F1, F2, N1: group location/contact/manager; make cancel and validation recovery explicit. |
| Branch Details | Review a selected branch | Partial | 69 | N1: show selected branch identity and clear actions back to the list/settings. |
| Branch Settings | Configure branch preferences | Partial | 65 | F1, C1: explain advanced fields, group operational vs numbering settings, distinguish restore/reset from save. |
| Branch Reports | Review branch performance | Yes | 73 | L1, D1: state report date/scope and apply consistent export/empty state. |
| Department List | Find and manage departments | Yes | 73 | L1, L2: standardize sort/filter/page, empty CTA and department context. |
| Create Department | Define a department and manager | Yes | 70 | F1, F2: organize branch/head/budget/contact, clarify required values and prevent accidental loss. |
| Edit Department | Update department details | Partial | 68 | F1, N1: use an explicit edit heading, selected department breadcrumb and cancel/dirty behavior. |
| Department Details | Review a department | Partial | 68 | N1: identify the selected department and expose relevant edit/assignment links. |
| Department Settings | Configure department behavior | Partial | 65 | F1, C1: explain what the threshold and toggles change; identify current scope. |
| Assign Employees | Assign employees to a department | Yes | 72 | L1, W1: show selected/available counts and clear save/cancel outcome. |
| Department Reports | Review department data | Yes | 72 | L1, D1: clarify filter scope, date basis and report totals. |
| Users List | Find and manage users | Yes | 75 | L1, W1: distinguish status and role actions; make row actions discoverable and confirmed. |
| Create User | Create a user record | Yes | 71 | F1, F2, C1: clarify employee-vs-user relationship and role/branch scope. |
| Edit User | Update user details | Partial | 69 | F1, N1: retain explicit edit context and warn on unsaved changes. |
| User Profile | Review a selected user | Yes | 71 | N1: show how to return to users and make available profile actions explicit. |
| Roles Management | Create/manage role definitions | Yes | 69 | F1, W1: describe scope and permission impact; group dangerous actions and use consistent confirmation. |
| Permission Matrix | Review and edit permissions | Partial | 67 | A1, W1: improve dense matrix navigation, explain inherited/selected permissions and show saved state. |
| Login History | Review sign-in events | Yes | 72 | L1, L2: standardize filters, sorting and export; clarify empty vs filtered-out events. |
| Pending Approvals | Review queued requests | Yes | 74 | W1, L1: surface approver/status/decision impact and retain a consistent decision panel. |
| Approval Rules | Configure approval flows | Partial | 65 | F1, F2, W1: explain stages/thresholds and preview the resulting route before saving. |
| Approval History | Review past decisions | Yes | 72 | L1, L2: identify filter scope and provide row details/empty-state reset. |
| Delegation & Limits | Set delegated authority and limits | Partial | 65 | F1, F2, W1: clearly show covered approver, active dates, limits and impact before save/revoke. |
| Company Settings | Configure company-level preferences | Partial | 65 | F1, C1: separate preferences from numbering and label each setting’s scope. |
| General Settings | Configure general application preferences | Partial | 64 | F1, C1: explain setting effects, group fields and show when changes apply. |
| Financial Year | Create/activate/close financial years | Yes | 72 | W1, F2: show overlap/current-year consequences inline before confirmation. |
| Document Numbering | Configure document sequences | Partial | 63 | F1, C1: preview a resulting number, clarify reset periods and dirty/save state. |
| Audit Logs | Review system actions | Yes | 72 | L1, L2: standardize filters, distinguish merged event sources and add clear event details. |

### Dealer Management — 33 routes

| Page | Purpose | Obvious? | Rating | Issues → improvement |
|---|---|---:|---:|---|
| Dealer Management | Dealer operations dashboard | Partial | 72 | D1, W1: label the time basis and make queues open the corresponding task. |
| Dealer Dashboard | Dealer network snapshot | Partial | 70 | D1, N1: distinguish it from the Management dashboard and explain its intended audience. |
| Dealer List | Search dealer records | Yes | 73 | L1, L2: ensure visible search/status filters, sorting, paging and first-dealer CTA. |
| Add Dealer | Register a dealer | Yes | 72 | F1, F2: group legal/contact/territory/credit data and explain optional credit details. |
| Dealer Profile | Review a dealer account | Yes | 72 | N1, W1: provide a consistent dealer context header and links to orders, statements and credit. |
| Dealer Verification | Review verification items | Yes | 70 | W1, L1: expose required documents, decision reasons and next state. |
| Dealer Categories | Manage dealer classifications | Yes | 70 | F1, L2: make duplicate/empty states clear and show category usage before removal. |
| Dealer Reports | Dealer report overview | Partial | 60 | N1, D1: distinguish from Reports & Analytics’ Dealer Reports and define scope. |
| Sales Territories | Create/manage territories | Yes | 72 | F1, L1: preview covered area and show assignment usage before edit/delete. |
| Dealer Assignments | Assign dealer to territory/officer | Yes | 72 | F1, W1: show current vs proposed assignment and effective date clearly. |
| Sales Officer Assignments | Assign sales officers | Yes | 71 | F1, W1: clarify whether an assignment replaces or adds to current coverage. |
| Assignment History | Review assignment changes | Yes | 69 | L1, L2: provide filters, chronological sorting and empty-state explanation. |
| Create Order | Create an order | Yes | 73 | F1, F2, W1: clarify unit price/line totals/stock context and add a review-before-submit step. |
| Order List | Find and review orders | Yes | 74 | L1, W1: standardize filters and expose next step/status actions. |
| Pending Orders | Process orders awaiting action | Yes | 73 | W1, L1: surface age, decision authority and reason/decision feedback. |
| Approval Queue | Review order approvals | Yes | 72 | W1, A1: make approval/rejection accessible, explain consequences and require decision reason where appropriate. |
| Order Details | Review an order | Yes | 72 | N1, W1: show status timeline, line-level quantities and contextual next action. |
| Order History | Review order changes | Yes | 69 | L1, L2: differentiate full history from order list and add event detail. |
| Pending Dispatches | Find orders awaiting dispatch | Yes | 72 | W1, L1: identify dispatch prerequisites and expose create-dispatch CTA. |
| Create Dispatch | Record dispatch | Yes | 71 | F1, F2, W1: summarize the source order and validate all dispatch details before action. |
| Delivery Records | Review deliveries | Yes | 70 | L1, L2: show delivery progress/exceptions and a clear no-record state. |
| Sales Returns | Record a return | Yes | 71 | F1, F2, W1: expose original order/batch/quantity context and expected disposition. |
| Return Approvals | Review return requests | Yes | 71 | W1, L1: show credit/stock implications and decision rationale. |
| Credit Limits | Review/update dealer limits | Yes | 70 | F2, W1: explain existing exposure, proposed limit and confirmation impact. |
| Dealer Statements | Review account activity | Yes | 71 | L1, D1: include statement period, opening/closing balance and export. |
| Outstanding Balances | Review receivables | Yes | 72 | L1, W1: show aging and payment next action with consistent balance labels. |
| Dealer Payments | Record a receipt | Yes | 72 | F1, F2: clarify allocation, payment reference and posting outcome. |
| Recovery History | Review account recovery | Yes | 69 | L1, L2: explain status and link each event to its source transaction. |
| Dealer Sales Report | Review dealer sales | Yes | 70 | L1, D1: make dates/territory/status scope visible and exportable. |
| Order Report | Review order metrics | Yes | 70 | L1, D1: clarify metric definitions and period. |
| Outstanding Report | Review dealer dues | Yes | 70 | L1, D1: add aging context, date basis and clear payment route. |
| Territory Sales | Compare territory sales | Yes | 69 | L1, D1: clarify officer/territory coverage and make comparisons legible. |
| Dealer Performance | Review dealer KPIs | Partial | 68 | D1, C1: explain KPI definitions, date basis and status colors. |

### Finance — 32 routes

| Page | Purpose | Obvious? | Rating | Issues → improvement |
|---|---|---:|---:|---|
| Finance Dashboard | Review finance summary | Partial | 73 | D1: make reporting period and illustrative/live context explicit. |
| Account Groups | Review account categories | Yes | 72 | L2, N1: add group usage context and a clear account-directory path. |
| Create Ledger Account | Add a chart-of-accounts entry | Yes | 71 | F1, C1: use terminology consistent with “Account Form”; explain account type/group/control. |
| Account Directory | Search ledger accounts | Yes | 76 | L1, L2: standardize sorting and empty state; clearly identify account hierarchy. |
| Account Details | Review a ledger account | Yes | 73 | L1, N1: show selected account and period context persistently. |
| Create Journal Entry | Enter a journal | Yes | 74 | F1, F2, W1: keep balance summary visible, explain line errors inline and confirm posting intent. |
| Draft Entries | Review draft journals | Yes | 72 | L1, W1: distinguish editable drafts from ready-to-post items. |
| Posted Entries | Review posted journals | Yes | 73 | L1, W1: make immutable/posted state and reversal route clear. |
| Reversals | Reverse a journal | Yes | 71 | F2, W1: show original entry and reversal preview before confirm. |
| Journal Report | Search journal activity | Yes | 71 | L1, D1: standardize date/status/account filters and page controls. |
| Cash Accounts | Review cash accounts | Yes | 70 | L1, L2: clarify balance as-of and available actions. |
| Cash Receipts | Record cash received | Yes | 73 | F1, F2: group payer, amount, date, account and reference; show post-submit summary. |
| Cash Payments | Record cash paid | Yes | 73 | F1, F2: clarify payee/purpose and duplicate-safe review before submit. |
| Bank Accounts | Review bank accounts | Yes | 70 | L1, L2: show balance-as-of and reconciliation state; add empty CTA. |
| Bank Transactions | Review bank activity | Yes | 72 | L1: standardize transaction date/account/status filtering and export. |
| Bank Reconciliation | Match statement and ledger lines | Yes | 74 | W1, L1: persist difference/count summary and explain unmatched rows. |
| Customer Balances | Review receivables by customer | Yes | 71 | L1, D1: add aging/date scope and direct invoice/payment actions. |
| Outstanding Invoices | Create/find open invoices | Partial | 69 | F1, L1: separate invoice creation from outstanding list; clarify mode and customer context. |
| Receive Payment | Record customer receipt | Yes | 73 | F1, F2: make invoice/deposit/amount allocation relationship explicit. |
| Payment Allocation | Apply a receipt to invoices | Yes | 73 | F2, W1: show unapplied amount and remaining invoice balance continuously. |
| Aging Report | Review customer aging | Yes | 71 | L1, D1: define aging buckets and report as-of date. |
| Supplier Balances | Review payables by supplier | Yes | 71 | L1, D1: distinguish balance from due amount and add aging scope. |
| Supplier Bills | Create/find supplier bills | Partial | 69 | F1, L1: clarify create vs browse and separate line-level bill entry from list. |
| Make Payment | Pay supplier bills | Yes | 72 | F1, F2, W1: display remaining bill balance and payment confirmation summary. |
| Outstanding Payables | Review unpaid bills | Yes | 71 | L1, L2: standardize aging/search and no-result recovery. |
| Payable Aging | Review payable aging | Yes | 71 | L1, D1: label bucket definitions and as-of date. |
| General Ledger | Review ledger lines | Yes | 74 | L1: persistent account/date scope, readable running balance and page controls. |
| Trial Balance | Review debit/credit totals | Yes | 73 | D1, L1: make selected date/financial period explicit and emphasize totals. |
| Profit & Loss | Review income statement | Yes | 74 | D1: show reporting period and comparison basis. |
| Balance Sheet | Review balances as of date | Yes | 74 | D1: emphasize as-of date and balance equation/total. |
| Cash Flow | Review cash movement | Yes | 72 | D1, L1: clarify period/method and make inflow/outflow labels scannable. |
| Tax Reports | Review tax data | Partial | 68 | D1, L1: name report basis and include clear date/filter summary. |

### Human Resource — 27 routes

| Page | Purpose | Obvious? | Rating | Issues → improvement |
|---|---|---:|---:|---|
| Human Resource Dashboard | Review workforce snapshot | Partial | 73 | D1: label date range and make metrics actionable. |
| Employee Directory | Find employees | Yes | 76 | L1, L2: standardize sort/page and useful filters; add first-employee CTA. |
| Add Employee | Create employee profile | Yes | 72 | F1, F2, C1: group identity/employment/contact/pay; clarify employee number and optional fields. |
| Edit Employee | Update employee profile | Partial | 70 | F1, N1: make edit state and current employee identity persistently clear. |
| Employee Profile | Review employee detail | Yes | 73 | N1, W1: provide direct contextual links and selected employee identity. |
| Employee Documents | Track employee documents | Yes | 71 | F1, L2: explain required metadata, upload outcome, expiry and empty state. |
| Transfers & Promotions | Change employee assignment/title | Yes | 71 | F2, W1: show before/after details and effective-date consequences. |
| Employee Reports | Review employee data | Yes | 70 | L1, D1: expose report scope and filters consistently. |
| Daily Attendance | Review daily attendance | Yes | 72 | L1, D1: show selected date/shift scope and attendance exceptions. |
| Mark Attendance | Record attendance | Partial | 68 | F2, W1: label the dynamic selection and provide confirmation/recovery. |
| Attendance Corrections | Review/correct attendance | Yes | 71 | W1, F2: make original vs corrected status and decision reason visible. |
| Shift Assignments | Assign employee shifts | Yes | 70 | F1, W1: show existing assignment and effective period. |
| Attendance Reports | Review attendance metrics | Yes | 71 | L1, D1: label time range and define attendance rate. |
| Leave Types | Configure leave categories | Yes | 70 | F1, F2: clarify entitlement units, carry-forward rules and save outcome. |
| Leave Requests | Review leave requests | Yes | 71 | L1, W1: show employee/date/status and direct approve/reject path. |
| Apply for Leave | Request leave | Yes | 72 | F1, F2: show available balance/date overlap and request summary. |
| Leave Approvals | Decide leave requests | Yes | 72 | W1, L1: surface balance and coverage impact and decision result. |
| Leave Balances | Review leave entitlement | Yes | 71 | L1, D1: distinguish used, available and pending amounts and as-of date. |
| Leave Reports | Review leave patterns | Yes | 70 | L1, D1: expose date scope, filters and no-result state. |
| Shift List | Review/manage shifts | Yes | 70 | L1, L2: show active/inactive state and create-shift CTA. |
| Create Shift | Define a working shift | Yes | 71 | F1, F2: explain overnight shifts, break time and working-day selection. |
| Employee Rosters | Review/assign roster | Yes | 71 | L1, W1: show date range and conflict feedback. |
| Shift Reports | Review shift coverage | Yes | 70 | L1, D1: show coverage calculation and filters. |
| Performance Reviews | Review performance records | Partial | 68 | L1, W1: clarify review cycle, owner and next step. |
| Employee Evaluations | Record evaluation | Yes | 70 | F1, F2: group rating and narrative; provide guidance/rubric. |
| Goals & KPIs | Set employee goals | Yes | 70 | F1, F2: define measurable target and progress scale. |
| Performance Reports | Review performance outcomes | Yes | 69 | L1, D1: explain score definitions and reporting period. |

### Inventory — 33 routes

| Page | Purpose | Obvious? | Rating | Issues → improvement |
|---|---|---:|---:|---|
| Inventory Dashboard | Review stock overview | Partial | 76 | D1: make as-of and alert thresholds clear. |
| Product List | Find product records | Yes | 77 | L1, L2: provide sorting, filters and first-product CTA. |
| Add Product | Register a pesticide product | Yes | 78 | F1, F2: strong grouping; explain regulatory identifiers, units and optional fields. |
| Product Categories | Manage product categories | Yes | 75 | F1, L2: show category usage and empty/add guidance. |
| Units & Packaging | Manage stock units | Yes | 75 | F2, C1: explain base vs display/conversion unit. |
| Product Details | Review product and batches | Yes | 76 | N1, L1: keep selected product visible and link to stock actions. |
| Product Reports | Review product metrics | Yes | 73 | L1, D1: expose report range/filter/empty state. |
| Warehouse List | Find warehouses | Yes | 76 | L1, L2: standardize filters and new-warehouse CTA. |
| Create Warehouse | Add warehouse | Yes | 74 | F1, F2: group location/capacity/owner and explain capacity units. |
| Storage Locations | Manage bins/locations | Yes | 74 | F1, L1: maintain selected-warehouse context and clarify location hierarchy. |
| Warehouse Stock | Review warehouse quantities | Yes | 76 | L1, R1: prioritize product/batch/available quantity and provide intentional narrow-screen table behavior. |
| Stock Opening | Enter opening inventory | Yes | 73 | F1, F2, W1: add review summary and make source/reference clear. |
| Stock In (GRN) | Receive goods | Yes | 76 | F1, F2, W1: good field specificity; show QC/expiry warnings and receipt summary. |
| Stock Out (Issue) | Issue inventory | Yes | 74 | F2, W1: explain batch choice, available amount and reason before commit. |
| Stock Transfer | Move stock between warehouses | Yes | 74 | F1, F2, W1: show from/to and resulting quantities before confirm. |
| Stock Adjustments | Request a stock change | Yes | 73 | W1, F2: distinguish request from approved posting and expose reason. |
| Stock Movement History | Trace stock changes | Yes | 74 | L1, L2: consistent date/product/batch filters and long-history navigation. |
| Batch Register | Find batch records | Yes | 76 | L1, L2: make quality and expiry status quick to filter. |
| Create Batch | Register a batch | Yes | 77 | F1, F2: preserve clear regulatory fields; explain date limits inline. |
| Batch Stock | Review batch quantities | Yes | 76 | L1, R1: keep batch, warehouse, expiry and usable quantity visible on narrow screens. |
| Near Expiry Stock | Identify soon-to-expire stock | Yes | 77 | D1, L1: show threshold and date basis as filterable values. |
| Expired Stock | Identify expired stock | Yes | 76 | W1, L1: provide disposition action and clearly distinguish blocked/available quantities. |
| Batch Traceability | Trace batch movement | Yes | 75 | N1, L1: present ordered trace timeline with source/destination and export. |
| Physical Stock Count | Record a physical count | Yes | 74 | F2, W1: explain count-vs-book variance and preserve partial progress. |
| Stock Reconciliation | Review count variance | Yes | 73 | W1, L1: show variance, reason, approval state and next action. |
| Damaged Stock | Record damaged quantities | Yes | 73 | F2, W1: highlight resulting available balance and approval path. |
| Adjustment Approvals | Decide adjustments | Yes | 73 | W1, L1: show before/after balances and decision rationale. |
| Stock Summary | Review aggregate stock | Yes | 75 | L1, D1: clarify valuation/quantity basis and as-of date. |
| Warehouse-wise Stock | Compare warehouse holdings | Yes | 74 | L1, D1: show selected warehouse scope and export/page controls. |
| Product Movement | Review product flow | Yes | 74 | L1, D1: clearly separate receipt/issue/transfer and date basis. |
| Low Stock Report | Find below-reorder products | Yes | 75 | L1, D1: show threshold and actionable reorder link. |
| Stock Valuation | Review inventory value | Yes | 73 | D1, C1: state valuation method/currency and period. |
| Expiry Report | Review expiry windows | Yes | 74 | L1, D1: provide thresholds and sort by earliest expiry. |

### Payroll — 24 routes

| Page | Purpose | Obvious? | Rating | Issues → improvement |
|---|---|---:|---:|---|
| Payroll Dashboard | Review payroll cycle | Partial | 73 | D1, W1: identify current period and the next required action. |
| Salary Structures | Review compensation templates | Yes | 72 | L1, L2: show component summary and create CTA. |
| Create Salary Structure | Define salary template | Yes | 71 | F1, F2: group earnings/deductions and show calculated example. |
| Allowances & Deductions | Configure pay components | Yes | 70 | F1, F2: explain calculation mode, tax treatment and units. |
| Employee Salary Assignment | Assign a structure | Yes | 71 | F1, W1: show current assignment and effective-date history. |
| Payroll Periods | Open/manage periods | Yes | 71 | W1, L1: distinguish open/closed and explain duplicate-period outcomes. |
| Generate Payroll | Start payroll calculation | Yes | 72 | W1, F2: explain run basis, prerequisites and estimate-vs-final amounts. |
| Payroll Drafts | Review draft runs | Yes | 71 | L1, W1: expose period/owner/status and route to review. |
| Review & Approval | Review a payroll batch | Yes | 72 | W1, L1: make differences, decision and return reason clear. |
| Finalize Payroll | Finalize an approved batch | Yes | 72 | W1: add impact summary and explicit confirmation before finalization. |
| Payroll History | Review completed runs | Yes | 71 | L1, L2: standard filters, period scope and useful no-data CTA. |
| Pending Salaries | Find unpaid salaries | Yes | 71 | L1, W1: explain payment readiness and affected employees. |
| Process Payments | Process salary payments | Yes | 70 | W1, F2: show batch summary, payment method and recoverable failures. |
| Payment Records | Review salary payments | Yes | 71 | L1, L2: standardize search, status and period filters. |
| Salary Slips | View/print a salary slip | Yes | 72 | N1, F2: retain employee/period context and handle missing slip clearly. |
| Advance Requests | Request an advance | Yes | 70 | F1, F2: show repayment estimate and eligibility context. |
| Approve Advances | Review advance requests | Yes | 70 | W1, L1: show impact on net pay and decision reason. |
| Loan Records | Review employee loans | Yes | 70 | L1, L2: make remaining balance and repayment status easy to scan. |
| Installment Recovery | Review/pay deductions | Partial | 68 | L1, W1: explain scheduled vs recovered and next payroll period. |
| Monthly Payroll Report | Review period payroll | Yes | 71 | L1, D1: identify selected month and report completeness. |
| Salary Register | Review employee salary totals | Yes | 71 | L1, D1: standard filters, totals and export. |
| Deductions Report | Review deductions | Yes | 70 | L1, D1: define categories and selected period. |
| Payment Summary | Review payment totals | Yes | 70 | L1, D1: distinguish gross/net/paid/pending and report scope. |
| Employee Salary History | Review employee pay history | Yes | 70 | L1, N1: persist employee identity, effective dates and navigation. |

### Reports & Analytics — 21 routes

| Page | Purpose | Obvious? | Rating | Issues → improvement |
|---|---|---:|---:|---|
| Reports & Analytics | Report hub | Partial | 69 | D1, N1: make the available report families and data freshness obvious. |
| Executive Overview | Executive summary | Partial | 70 | D1: label timeframe, comparison and illustrative data. |
| Sales Overview | Review sales measures | Yes | 69 | D1: state period and metric definitions. |
| Finance Overview | Review finance measures | Yes | 70 | D1: show report basis and include navigable source metrics. |
| Inventory Overview | Review stock measures | Yes | 70 | D1: label as-of date and alert thresholds. |
| HR Overview | Review workforce measures | Yes | 69 | D1: state employee population and date range. |
| Administration Reports | Review admin metrics | Yes | 69 | L1, D1: use common report filter and export conventions. |
| HRM Reports | Review HR reports | Yes | 69 | L1, D1: show employee/date scope and no-result recovery. |
| Payroll Reports | Review payroll reports | Yes | 69 | L1, D1: make period and payroll status explicit. |
| Finance Reports | Review finance reports | Yes | 70 | L1, D1: show financial-year/period and report basis. |
| Inventory Reports | Review inventory reports | Yes | 70 | L1, D1: clarify quantity/valuation basis and as-of date. |
| Dealer Reports | Review dealer reports | Partial | 61 | N1, C1: distinguish from Dealer Management’s same-named report page. |
| Saved Reports | Open/manage saved reports | Yes | 69 | L1, L2: make save/open/remove state and no-saved-report CTA clear. |
| Report Filters | Filter report records | Yes | 72 | F1, F2: show applied filters, validation and reset semantics. |
| Scheduled Reports | Create/manage schedules | Yes | 70 | F1, F2: explain frequency, recipient and next-run schedule before saving. |
| Export History | Review exports | Yes | 69 | L1, L2: offer clear download/status details and empty-state CTA. |
| Activity Reports | Review activity | Yes | 68 | L1, D1: show event range and filters. |
| Approval Reports | Review approval outcomes | Yes | 68 | L1, D1: define statuses and period. |
| Transaction Analysis | Analyze transactions | Partial | 66 | D1, L1: explain metric/filters and distinguish report from operational lists. |
| Comparative Reports | Compare periods/groups | Partial | 65 | D1, F1: explain comparison dimensions and clearly label chart/table axes. |
| Data Audit Logs | Review data changes | Yes | 68 | L1, D1: make event filters and detail view consistent with system audit. |

## Phase 3 — Form experience audit

### Shared strengths

- Most forms use visible labels, native input types and clear page titles.
- Several workflows show required markers, date constraints and domain-specific units.
- Journal entry checks for at least two valid lines, debit/credit exclusivity and a balanced total.
- Company Setup detects unsaved changes, and some dangerous role/financial-year actions use confirmation.
- Inventory, HR, Finance, Payroll and Dealer use reusable form components, giving each module a workable foundation.

### Common form problems

- A star/required marker is not accompanied by a consistent explanation of which fields are required; visual markers and native required validation are not uniform. Some custom required indicators are not programmatically associated with native required state.
- Forms vary between single-column, inline and multi-column layouts, and Save/Create/Submit labels do not consistently communicate whether the action saves a draft, submits for review or completes a transaction.
- Cancel and Reset behavior is inconsistent. Only selected flows guard unsaved changes; the user cannot rely on a common exit/reset pattern.
- Validation feedback varies between inline text, browser-native constraints and a short toast. Error focus, correction instructions and persistence of valid entries are not consistently handled.
- Generic `ActionModal` derives fields from the action name. It offers broad placeholder fields, then closes and displays a success message. It is not a suitable substitute for task-specific forms and may communicate completion without showing an actual created record.
- Form ordering and grouping need consistent conventions, especially where identity, branch/department, money, dates and approvals appear on one screen.
- A source audit of the full control list is available in [ERP-TECHNICAL-AUDIT.md](./ERP-TECHNICAL-AUDIT.md); this section concentrates on usability rather than repeating every field.

### Form-by-form assessment (grouped where the same pattern repeats)

| Form/page(s) | What is good? | What is confusing? | What is missing? | Improvement |
|---|---|---|---|---|
| Company Setup | Clear edit/save state; unsaved-change warning; logo upload is visible. | Required/legal fields and logo behavior could be clearer. | Consistent cancel/revert behavior across the rest of the ERP. | Use grouped legal/contact sections, inline validation and a consistent draft/dirty-state footer. |
| Company Documents | File selection and document list/filter structure are visible. | Upload, view, download and expiry status need distinct explanations. | Empty upload guidance and file constraints before selection. | State accepted formats/size, show selected-file summary/progress/result, and distinguish “no documents” from “no filter matches.” |
| Create Branch; Create/Edit Department | The business task is apparent and fields include labels. | Manager/head, branch and generated code may not explain how they relate. | Consistent cancel, unsaved warning and field-level errors. | Group identity/location/ownership; show generated values as preview; use standard form footer. |
| Branch Settings; Department Settings; Company/General Settings; Document Numbering | Existing values are visible and save actions exist. | Settings are technical and may be split across similar pages; some controls need more explicit labels and consequences. | Clear reset scope, change summary and preview. | Add section descriptions, current scope, preview of resulting behavior, reset confirmation and a uniform save bar. |
| Create User; Edit User; Roles Management; Permission Matrix | Identity/role fields and permission matrix map to admin tasks. | Employee vs User, Role vs Permission, and branch scope can be misunderstood; dense permission matrix. | Inline explanation of each permission, role scope and save outcome. | Use a guided role/user flow, group access scope, show inherited/selected permissions and keyboard-test the matrix. |
| Approval Rules; Delegation & Limits; Pending Approvals | Stage and approver concepts are visible. | Thresholds, optional stages, date windows and authority impact need explanation. | Preview of who approves a sample request; decision consequence summary. | Add examples, validation beside each field, active-window summary and review-before-save. |
| Add Dealer; Sales Territories; Dealer/Sales Officer Assignments | Forms map to dealer/territory work. | Assignment can mean add vs replace; requested credit and territory are not self-explanatory to new users. | Existing relationship and after-save destination. | Display current assignment, requested vs approved credit, reason/help text and confirmation summary. |
| Create Order; Create Dispatch; Sales Returns | Core transaction fields and status workflow are recognizable. | Order line/dispatch/return consequences are easy to miss in a long form. | A concise “review before submit” summary and progress/next step. | Use steps: select source → enter details → review totals/stock/credit → submit; show explicit post-submit status. |
| Dealer Payments | Required amount/date/method/reference fields are present. | Receipt vs allocation/statement impact may be unclear. | Confirmation with amount, dealer, reference and destination. | Add a pre-submit receipt summary and success link to the resulting account entry. |
| Account Form; Journal Form; Reversals | Finance terminology and journal balancing feedback are useful. | Create Ledger Account naming conflicts with Account Form; line-level errors may rely on toast. | Inline line errors, clear draft/post action distinction, reversal impact preview. | Normalize labels and units, show sticky debit/credit totals, focus the failing line and summarize consequences. |
| Cash Receipts/Payments; Supplier Bills/Payments; Outstanding Invoices; Receive Payment; Allocation | Core transaction controls use appropriate types and shared presentation. | Creation forms and records/list views can share one named page; allocation amount context is easy to lose. | A clear selected party/document summary and after-save destination. | Separate “create” vs “browse” modes; show remaining/unapplied amounts live and review before posting. |
| Add/Edit Employee; Employee Documents; Transfers & Promotions | Required identity fields and employee-related fields are visible. | Long forms mix personal, employment and compensation information. | Section navigation, progress, conditional fields and a reliable cancel/dirty warning. | Group identity/contact/employment/pay, save-and-continue, explain sensitive fields and retain selected employee context. |
| Apply for Leave; Leave Types; Attendance Corrections; Employee Evaluations; Goals & KPIs; Create Shift; Mark Attendance; Shift Assignments | Forms use dates, selects and labels; some pages include clear reason/narrative controls. | Eligibility, date conflicts, time spans, scoring and scales need interpretation. | Live balance/overlap/coverage feedback and standardized field errors. | Explain constraints inline; show before/after values and calculated totals; provide a form summary before submit. |
| Add Product; Create Batch; Stock Opening; Stock In (GRN); Stock Out; Transfer; Adjustment; Physical Count; Create Warehouse; Storage Locations | Product and batch labels are domain-specific; units and expiry constraints are strengths. | High-stakes stock changes need source/destination context and clear distinction between requested, approved and posted. | Consistent review step, warnings for expired/quarantined/low stock, partial-save recovery. | Add a movement preview, show available vs entered quantity, make units explicit, and confirm the exact batch/warehouse effect. |
| Create Salary Structure; Allowances/Deductions; Employee Salary Assignment; Advance Requests; Generate Payroll; Process Payments | Compensation elements and payroll stages are present; some actions are disabled when prerequisites fail. | Calculation formula, estimate vs final, and downstream period effects may be opaque. | Explain blocked prerequisites, calculation preview, cancel/save-draft and final confirmation. | Make the run wizard show period, employees, gross/deductions/net, warnings and next step before calculation/posting. |
| Report Filters; Scheduled Reports | Filter fields, reset/apply and schedule fields are recognizable. | Applied vs draft filters and scheduled delivery timing can be unclear. | Filter chip summary and preview of next run/recipient. | Show active scope above results, explicit reset behavior and schedule review before save. |

## Phase 4 — Navigation audit

### Severity-ranked findings

#### Critical

1. **Misleading task completion:** generic quick-action forms can present a broad placeholder form, close on submit and show “created successfully,” without a task-specific visible result. A production user may believe an order/payment/production task is complete. Replace these with truthful destination-specific interactions or clearly mark them as unavailable/prototype.
2. **Mobile first impression obscured:** at 390px the module panel opens by default as an overlay over most of the workspace. A user lands on a dimmed, partially obscured page and must discover/tap the menu control before working. Start collapsed at narrow breakpoints or render it as a clearly managed drawer with focus and escape handling.
3. **Horizontal navigation hidden without cue:** on mobile the top navigation, action ribbon and status bar are horizontally scrollable with hidden scrollbars; measured scroll widths at 390px were 916px, 970px and 797px. Users may not discover modules/actions/status beyond the visible portion. Replace the ribbon with responsive grouped actions and expose menu/overflow affordances.

#### Major

- No persistent breadcrumb trail on most page headers; tabs and sidebar indicate page identity but not parent/list return path.
- Module navigation is split among top tabs, a long ribbon, sidebar tree and open-page tabs, multiplying choices and learning effort.
- The sidebar search says “Find a module…” although it filters page names and group names. The displayed `⌘ K` hint has no matching shortcut handler found.
- Page tabs use `role=tab` inside a tablist but lack corresponding tabpanel relationship/ID semantics and a documented keyboard interaction pattern.
- Some valid pages are not in the visible module tree (e.g. edit and dashboard routes); this makes direct-link/related-flow access inconsistent.
- “Dealer Reports” is a duplicate page title in the Dealer and Reports modules; current navigation context is needed to disambiguate.
- No common Back-to-list link or contextual return destination is established across all detail/form pages.
- At tablet widths, the top-level module strip itself overflows horizontally. On laptop widths it fits better but the ribbon remains wide.
- “Close” is placed beside system actions but only displays “Session closed securely”; it does not visibly close the workspace. The label/feedback is misleading even without considering any session behavior.
- “Production” opens a generic modal rather than a production workflow; several ribbon sections also miscategorize actions (e.g. Payment under Inventory; Dealer List under Finance).

#### Minor

- Group accordion buttons do not announce `aria-expanded`/controlled content.
- Page tabs can accumulate, making the strip crowded; no close-all or overflow menu is visible.
- “Company Profile” is the sidebar label while the canonical page is “Company Setup.”
- Active module/page highlighting is useful, but color and icon are relied upon in addition to the text; active states need consistent contrast.
- The floating/mobile sidebar close affordance and backdrop should have explicit focus return and Escape behavior.

### Orphan/hidden/duplicate/dead-end inventory

| Type | Observation | Severity | Recommendation |
|---|---|---|---|
| Hidden pages | Dashboard/edit states and some module landing pages are routeable but absent from visible tree. | Major | Link them from the relevant list/parent and make direct-route context visible. |
| Duplicate labels | “Dealer Reports” exists in two modules; related operational reports also overlap their module-specific report areas. | Major | Use distinct labels such as “Dealer Reports (Operations)” vs “Dealer Performance Reports,” with a clear owner. |
| Dead-end action | Generic quick-action modal can announce success without a specific task result. | Critical | Route to the real form or state “Not available” and do not display success. |
| Dead-end navigation | Detail and report pages do not consistently offer back/list/related-work links. | Major | Add breadcrumbs and a context-specific return action. |
| Misleading shortcut | Search displays `⌘ K`, but no shortcut handler is implemented. | Minor | Implement a cross-platform shortcut or remove the hint. |
| Hard-to-discover actions | Horizontal strips conceal additional top modules/actions on narrow screens with no visible cue. | Critical | Replace with responsive navigation/overflow indicator. |

## Phase 5 — UI consistency audit

| Area | Observed inconsistency | Effect | Recommendation |
|---|---|---|---|
| Buttons | “Add”, “Create”, “Save”, “Submit”, “Post”, “Process”, “Finalize” vary by module and sometimes same kind of data operation. | Users cannot predict whether an action stores a draft, submits a request or completes a transaction. | Publish action verb rules: Save draft, Submit for approval, Post/Finalize only for irreversible commit. |
| Form layout | Administration uses bespoke layouts; Dealer/Finance/HR/Inventory/Payroll use different wrappers and spacing. | Task patterns do not transfer cleanly between modules. | Establish a shared field, section, error, footer and dirty-state pattern while allowing domain-specific content. |
| Required indicators | Stars are used but explanation and native validation semantics vary. | Users may miss requirements or learn only after submit. | Use consistent “* Required” legend and field-level accessible required/invalid state. |
| Terminology | “User” vs “Employee”; “Company Profile” vs “Company Setup”; “Account Form” vs “Create Ledger Account”; “Receipt” vs “Payment” in several contexts. | Similar records/actions sound like different concepts. | Create product glossary and canonical page/action names; distinguish workforce member from login account. |
| Tables | Module helpers differ in empty row, toolbar, density, status badge and horizontal scroll behavior. | Users relearn table interactions and miss capabilities. | Shared grid with caption, search/filter, sort, pagination, row actions, loading/empty/error states. |
| Colors/icons | Modules use colored accents, icons and custom styling; status color rules can differ. | Same status can appear different, and color-only distinctions impair scanning/accessibility. | Use semantic color tokens and always pair status color with text/icon/accessible label. |
| Cards/KPIs | Card sizes, labels, units and supplementary hints vary. | Dashboard comparison and hierarchy are inconsistent. | Standardize KPI title, value, unit, period, source/drill-down and status. |
| Modals | Generic shell modal differs from module-specific pages and presents non-domain fields. | A modal appears like a real transaction form while lacking task context. | Reserve modal for focused reversible tasks; use dedicated full-page forms for business transactions. |
| Filters | Search may be global text, field-specific search, select chips or report-only apply form. | Users do not know which filters are active or how to clear them. | Shared filter toolbar, active-filter chips, count and Reset. |
| Date/number format | Dates and currency display formats/labels vary across modules; some controls show PKR while others do not. | Risks misreading period and amount. | Align date, timezone, currency/UOM display and formatting; show explicit units. |
| State feedback | Some actions use inline status, others toast, native confirm or immediate state changes. | Success/error confidence varies. | Shared feedback taxonomy, focus management, undo where safe and explicit confirmation for destructive/irreversible work. |
| Typography | Shared base is 13px and styles use many 9–12px values in dense interface regions. | Small labels, table text and status details are hard to read, especially on mobile. | Set readable type scale and test zoom/contrast; avoid sub-12px for essential content. |
| Styling ownership | Large global stylesheet contains many appended/overlapping module rules plus separate module CSS. | Overrides are difficult to reason about and responsive regressions are likely. | Consolidate tokens/components, scope styles by module and remove superseded selectors after visual regression checks. |

## Phase 6 — Table & grid audit

| Module | Search/filter | Sorting/pagination | Export | Row actions and labels | UX assessment |
|---|---|---|---|---|---|
| Administration | Present on several lists, reports and audit views; not uniform on all grids. | No common sort/page interaction found across page components. | Some reports/history/document areas provide export; coverage varies. | Lists have contextual actions; dense audit and permission tables need clear focus. | Good domain tables, inconsistent table contract and empty-state behavior. |
| Dealer Management | A module-level search exists, but filter/tooling varies by page. | No common sort/pagination pattern established; dashboard lists are intentionally capped previews. | Exports are available through some shared report controls; not all list pages expose it. | Orders, approvals, returns and accounts include important actions, but next step can be hard to infer. | Work-queue and transaction lists need stronger status/age/next-action conventions. |
| Finance | Shared search toolbar and empty component exist; actual use differs by page. | No common sortable/paginated grid found. | Report/export controls are not consistently shared among financial lists. | Posting/reversal/allocation rows need clear action labels and source references. | Financial density is appropriate but requires excellent scoping, totals, period labels and stable grid behavior. |
| Human Resource | Some directory/report filters exist; other views have limited controls. | Table helper does not itself provide sorting/pagination or a no-rows fallback. | Export availability is limited/inconsistent by page. | Attendance, leave and evaluation queues need clear employee/date context. | Provide a common empty row and search/sort controls, especially for employee-scale lists. |
| Inventory | Search/filter available in module controller and many operational screens; shared table supports empty row. | No common sort/page behavior found. | Export CSV is available in selected lists/reports, not consistent across the inventory menu. | Batch/product/warehouse row actions need visible status and concise action names. | Strong base component; improve long-grid navigation and select context. |
| Payroll | Search and shared empty component exist on selected pages; varying list controls. | No consistent sort/page pattern found. | Report/export coverage varies. | Batch review/finalize/payment actions should identify current step and affected employees. | A single payroll run table/timeline would reduce context switching. |
| Reports & Analytics | Filters and search exist in shared report screen and filter page. | The shared report table shows record count but renders at most 100 records; no pagination or “showing 100 of N” cue. | CSV export and export history exist. | Saved reports and schedule actions exist but result scope needs to remain visible. | Add page controls, row-count context, export scope summary and responsive column controls. |

### Cross-grid findings

- Search is not a universal affordance, and the same search may apply only to one dataset or route. Label scope and active query.
- No shared sortable header behavior was found; do not make users infer that column labels are interactive.
- Pagination is not consistently exposed; several dashboards intentionally show only a small recent subset and must label it “recent”/“top” with a route to the full list.
- Tables generally use horizontal wrappers, but hidden columns/actions can still be difficult on mobile. Prefer responsive row details or explicit column priority over silent clipping.
- Row actions need consistent placement, accessible names, disabled state explanation and confirmation for destructive/irreversible changes.
- Add empty, no-match, loading, error, stale and partial-result states as separate states, with useful recovery actions.
- Use visible column headings with scope, date/time and units. Keep table width, row height and text size usable at 200% zoom.

## Phase 7 — Dashboard audit

| Dashboard | What works | Missing/confusing | Priority improvements |
|---|---|---|---|
| Administration Dashboard | Strong visual landing with KPIs, chart panels, quick actions, recent activity, approvals and alerts. | Snapshot/alert/chart values include fixed examples and are not consistently labeled as illustrative; quick actions do not all route to complete workflows; “Connected” in the footer presents as live status. | Add an “as of” timestamp and sample-data badge where appropriate; make all KPI/alert values drill into matching filtered pages; remove misleading status/action feedback. |
| Dealer Management Dashboard | Work queues, order statuses, verification and receivables are prominent; the live browser view made the module purpose apparent after load. | “Dealer Dashboard” is a separate route and not clearly distinguished; queue totals and recent rows can be mistaken for complete lists. | Define dashboard audience; label preview counts and links (“View all 4”); expose a status timeline for order → approval → dispatch → delivery. |
| Dealer Dashboard | Dealer-focused KPIs and recent order context. | Similar name/overlap with Dealer Management dashboard creates duplicate entry points. | Consolidate or make audience/purpose explicit and route to one canonical dashboard. |
| Finance Dashboard | Provides shortcuts to ledger, receivables/payables and cash/bank. | Period, freshness and metric definitions need to be prominent; financial totals need clear drill-down. | Put financial period in title bar, provide linked totals and explain draft vs posted figures. |
| Human Resource Dashboard | Workforce overview and links to attendance, leave and employee tasks. | Timeframe/employee scope and sample data are not apparent; limited next-action prioritization. | Show date range and branch scope, priority tasks, open absences/expiring documents and direct actions. |
| Inventory Dashboard | Stock/expiry/low-stock information and recent movement concepts are useful. | Thresholds and as-of date need to be obvious; operational alerts should lead to resolution. | Add filterable threshold definitions, batch/warehouse drill-down and one-step action links. |
| Payroll Dashboard | Payroll status/period and quick links support the cycle. | Current period and blocked prerequisites can be hard to distinguish from historical/demo batches. | Show cycle timeline, owner, approval state and a single next action; call out blockers. |
| Reports & Analytics Dashboard | Broad module navigation and summary cards. | Report catalog, refresh date and data limitations are unclear; static executive views lack evident filter context. | Provide searchable catalog, scope/date chips, freshness and accessible chart descriptions. |
| Executive Overview | Consolidated view is a useful starting point. | Metric definitions/time comparison and drill-through need reinforcement. | Add definitions and “view underlying records” links. |
| Sales Overview | Sales-oriented metrics are recognizable. | Needs explicit period, geography and comparison basis. | Add persistent report context and drill-through. |
| Finance Overview | Finance summaries are logically grouped. | Balance basis, periods and whether values are illustrative need explicit labeling. | Show period/unit in every card and link totals to ledger reports. |
| Inventory Overview | Stock-focused metrics align with the module. | Expiry/stock threshold and units need explanation. | Show UOM and threshold dates; make alert resolution a primary action. |
| HR Overview | Workforce summary is a useful module entry. | Population/date scope and metric definitions are missing or subtle. | Show branch/employee scope, timeframe and linked source list. |

## Phase 8 — Empty-state audit

| Surface | Observed pattern | UX gap | Needed behavior |
|---|---|---|---|
| Inventory tables | Shared `Table` renders “No records match this view.” | It can conflate first use with filters yielding no match; message has no built-in create/reset CTA. | Differentiate “No stock yet” from “No results”; offer Create, Clear filters and what-to-do guidance. |
| Finance | Shared `Empty` helper exists. | Its presence does not guarantee every finance grid uses it; zero-valued reports are not the same as absent records. | Standardize per screen; distinguish zero balance, no posted data and no filter match. |
| HR | Shared `EmptyState` exists, but shared `Table` renders children directly and can yield a blank table body. | Blank grid is ambiguous and offers no recovery. | Make empty row a required shared table behavior and include context-sensitive CTA. |
| Payroll | Shared `Empty` message is used on some workflows. | Some tables rely on row availability without a consistent first-use/no-results distinction. | Add screen-specific setup instructions and links to missing prerequisites. |
| Dealer | Shared controller table helper has a generic no-records message. | Generic wording does not explain how to create a dealer/order/assignment or clear filters. | Add table-specific guidance and a task CTA. |
| Reports | Report screens can show a filter-specific no-match message. | Empty report can still be confused with empty data source; report action context is not always retained. | Show active filters, Clear all, date range and source/sample indicator. |
| Administration | Some pages have custom empty messages; implementation varies. | Search, no-data and unconfigured states are not consistently separate; some empty screens may lack a CTA. | Apply a shared empty-state component across branches, departments, users, approvals and audit. |
| Dashboard previews | Several panels show recent subsets. | Empty preview does not necessarily mean no total records; preview cap may be hidden. | Say “No recent items” and retain “View all”; label preview counts. |

**Per-page disposition:** The page matrix flags list/report/queue routes with `L2`/`D1` where empty-state behavior matters. A strict per-route runtime matrix of all empty states requires clearing or filtering every seeded dataset; this was not represented as a browser test for all 201 routes. Shared helper coverage is not proof every page calls the helper.

## Phase 9 — Error, warning and confirmation states

- **Validation:** Good examples exist (journal line and balance checks; required fields; product/batch date constraints). Feedback style varies between inline messages, native constraints and toast. Add a consistent field-level message and summary; move focus to the first error; retain valid entries.
- **Warnings:** Approval, expiry, stock and financial-year warnings need severity, cause, scope and a direct resolution link. Do not rely on color or transient banners alone.
- **Info:** Toasts auto-dismiss after about 2.6 seconds and have no `aria-live`/status role in the shared shell. Important status can disappear before a user reads it and may not be announced. Use persistent inline status for important outcomes and accessible live region for transient feedback.
- **Save confirmation:** Many pages notify after save, but messages do not consistently identify the affected record or next location. Show “Saved [record]” with a link to it; keep failure actionable.
- **False success:** Generic quick-action modal submit closes the dialog and displays a success notification. Its generic field set is inferred from action name. It does not show a task-specific created record. This is a critical UX trust issue; do not show completion until the task has a credible visible result.
- **Delete/irreversible confirmation:** Native `window.confirm` is present for role deletion and financial-year activation/closure, and for leaving dirty Company Setup. Confirmation behavior is inconsistent across the UI. Use one accessible dialog pattern with consequence, affected record and explicit Cancel/Confirm; do not confirm routine reversible actions.
- **Cancel/reset:** No universal unsaved-change or reset convention. Add clear Cancel, Reset-to-saved and Save Draft patterns; do not silently discard unsaved user-entered work.
- **Error boundaries/recovery:** Provide a page-level recoverable error state for rendering or unavailable content; preserve the user’s input where possible. Avoid blank tables or no-op buttons.

## Phase 10 — Responsiveness audit

### Browser-checked evidence

- At **390px CSS viewport width**, the document remained 390px wide but `.top-nav`, `.ribbon` and `.status-bar` measured scroll widths of about **916px**, **970px** and **797px**. Their scrollbars are visually hidden, so several destinations are offscreen without an obvious cue.
- At this width, `sidebarOpen` initializes `true`; screenshot showed the module drawer overlay covering most of the workspace until the user closed it.
- At **320px**, `body` has a 360px minimum width, causing at least 40px horizontal document overflow.
- A 390px mobile screenshot of Add Product confirmed the form can fit the viewport after closing the sidebar, though the page is vertically long and requires scroll.
- Tablet/short viewport metrics showed horizontal overflow in top navigation/status and chart content; tables use local horizontal wrappers. These observations do not constitute a visual QA pass of every route at every breakpoint.

### Device assessment

| Device class | Assessment | Main risk | Recommendation |
|---|---|---|---|
| Desktop | Broad shell and module areas fit; dense ribbon and stacked dashboard panels dominate height. | At short viewport heights, useful dashboard detail is below the fold; global content relies on nested scroll areas. | Test at 1280×720 and 1366×768; prioritize content and reduce ribbon height when space is constrained. |
| Laptop | Generally workable; many top-level nav/ribbon items compete for horizontal space. | Hidden overflow, dense type and nested scroll make task controls easy to miss. | Use compact responsive navigation and visible overflow cues; increase table readability. |
| Tablet | Top module bar, ribbon and status bar exceed viewport width; landscape/portrait needs differ. | Users must discover horizontal scrolling in multiple independent bars; two-column forms/grids may compress. | Collapse ribbon into action menu, use collapsible navigation, reflow forms and prioritize table columns. |
| Mobile | Sidebar starts open as overlay; horizontal strips remain desktop-like; 360px body minimum overflows narrow devices. | Workspace is obscured at first load; touch targets/text are small; wide tables and footer data are clipped/scrollable. | Default drawer closed, add clear overlay close/escape/focus return, remove hard min-width overflow, provide card/detail table layout and accessible overflow indicators. |

## Phase 11 — Accessibility audit

### Strengths

- Main navigation and open-page tablist have accessible labels; mobile module toggle has `aria-expanded`/`aria-controls`; many icon-only controls use `aria-label`.
- Many forms use visible labels via wrapping `<label>` and native input types.
- The approval trend chart has `role="img"` and an accessible label.
- Some selected buttons and fields have explicit `:focus-visible` styles.
- Company Setup uses an alert role for form errors and a live status message.

### Gaps and risks

- Focus-visible styles are explicitly defined for some module components, but no consistent global focus-visible system was found. Focus resets such as `outline: 0` make affected controls depend on a replacement style that may be limited to selected states.
- Open tabs are marked as tabs but lack a corresponding `tabpanel` and `aria-controls` relationship; keyboard arrow/Home/End behavior was not evident.
- Toasts have no live-region role, so important save/error results may not be announced.
- Modal uses dialog semantics, but focus entry/return, keyboard trap and Escape close were not evident in source; the mobile drawer also needs focus management.
- Some required indicators are visual stars without a consistent required legend or native/programmatic required state.
- A few search controls rely on placeholder text and a decorative icon rather than a persistent accessible name (Finance shared search is an example).
- Navigation accordion buttons do not consistently announce expanded state.
- Small 9–12px text appears in styles, especially shell/table/ribbon details; verify text scaling and contrast at 200%.
- Charts and status badges should provide textual interpretation, units, non-color cues and accessible table alternatives.
- Keyboard-only and screen-reader testing has not been completed. Do not treat source attributes as WCAG conformance.

### Accessibility acceptance checklist

1. Keyboard reach and visible focus for every actionable control; no keyboard traps outside modal dialogs.
2. Predictable tab order; arrow-key tablist behavior or use of simpler button semantics.
3. Dialog open/close with Escape where appropriate; focus moves into dialog and returns to trigger.
4. Form labels, help, required and invalid state programmatically associated.
5. Live feedback for save/error/status, with enough time and no sole reliance on color.
6. Table headers associated with cells; responsive alternative remains navigable.
7. 200% zoom/reflow, contrast and minimum text/touch-target review.

## Phase 12 — User-friendliness and readiness scores

| Module | User friendliness | Navigation | Consistency | Usability | Production UI readiness |
|---|---:|---:|---:|---:|---:|
| Administration | 66 | 72 | 63 | 65 | 42 |
| Dealer Management | 69 | 70 | 70 | 66 | 43 |
| Finance | 74 | 76 | 79 | 69 | 47 |
| Human Resource | 72 | 74 | 77 | 69 | 45 |
| Inventory | 77 | 75 | 83 | 74 | 49 |
| Payroll | 71 | 73 | 77 | 67 | 43 |
| Reports & Analytics | 67 | 68 | 70 | 62 | 38 |
| **Heuristic mean** | **71** | **73** | **74** | **67** | **44** |

## Final prioritized findings

### Top 100 UI/UX problems

Severity guide: **Critical** means the UI can mislead or block a core user; **Major** materially slows or confuses tasks; **Moderate** is recurring friction; **Minor** is polish/discoverability. Similar cross-module issues are intentionally listed separately where they affect different user tasks.

1. **Critical — Quick-action submit can announce a successful creation without a task-specific result.**
2. **Critical — Mobile opens with the module drawer covering the work area.**
3. **Critical — Top navigation, ribbon and status information are horizontally hidden without visible scroll cues.**
4. **Critical — The generic action modal infers labels/fields from the action title instead of expressing a real task.**
5. **Critical — The UI can communicate success before showing a resulting record or next step.**
6. **Major — The “Close” action reports a secure close while leaving the workspace unchanged.**
7. **Major — “Production” opens a generic interaction rather than a production task.**
8. **Major — Payment and Dealer List ribbon sections suggest the wrong functional group.**
9. **Major — Dashboard KPI/chart/activities are fixed example values without consistent illustrative-data labeling.**
10. **Major — Footer “Connected” reads as an actual current state but is always presented as a fixed green status.**
11. **Major — Page orientation depends on title, open tabs and sidebar rather than breadcrumbs.**
12. **Major — Contextual back-to-list links are not consistent across detail pages.**
13. **Major — The shell offers four simultaneous navigation systems (module tabs, ribbon, sidebar, open-page tabs).**
14. **Major — The “Find a module…” search actually filters page names and groups.**
15. **Moderate — `⌘ K` is shown as a search shortcut without a matching shortcut implementation found.**
16. **Major — Several dashboard/edit pages are routeable but not discoverable from their module tree.**
17. **Major — “Dealer Reports” title is ambiguous across two different module contexts.**
18. **Moderate — Sidebar group toggles do not consistently expose expanded state to assistive technology.**
19. **Moderate — Hidden horizontal strips conceal actions and modules from keyboard/mouse users unless scrolled.**
20. **Moderate — Many open page tabs can accumulate with limited overflow management.**
21. **Moderate — Active tab semantics lack a complete tabpanel relationship and interaction pattern.**
22. **Major — Generic success toast provides too little context about which record changed.**
23. **Major — Toasts disappear quickly and are not announced by a live region.**
24. **Major — Error feedback is split between inline messages, native browser validation and toasts.**
25. **Major — Validation does not consistently focus or summarize the first invalid field.**
26. **Moderate — Required stars lack a consistent legend and accessible required state.**
27. **Major — Cancel/reset/dirty-state behavior differs across forms.**
28. **Major — Unsaved-change warnings are present only on selected flows.**
29. **Moderate — Many forms lack a clear Cancel action or safe exit path.**
30. **Moderate — Reset actions do not consistently explain whether they clear filters or discard edits.**
31. **Major — Save, Create, Submit, Post, Process and Finalize are not consistently distinguished.**
32. **Moderate — “User” and “Employee” can be read as interchangeable entities.**
33. **Moderate — Company Profile and Company Setup label the same general destination differently.**
34. **Moderate — Account Form and Create Ledger Account use different naming for the same task.**
35. **Moderate — Receipt, payment, allocation and posting labels need stronger distinction.**
36. **Moderate — Field grouping differs between modules and similar forms.**
37. **Moderate — Required/optional fields and help text are not consistently communicated.**
38. **Moderate — Placeholder text is used where a persistent accessible search label is preferable.**
39. **Moderate — System/numbering settings expose technical concepts without consistent explanations.**
40. **Major — Approval rules lack a clear workflow preview for the configured stages and thresholds.**
41. **Major — Delegation/limit forms need clearer coverage window and authority summary.**
42. **Major — Order workflows do not consistently show a full order → approval → dispatch → delivery timeline.**
43. **Major — Returns need a more explicit connection between original sale, batch, credit and disposition.**
44. **Major — Stock movements need a consistent before/after review summary.**
45. **Major — Payroll review/finalize/payment screens can feel like separate queues without a continuous run timeline.**
46. **Major — Journal errors may be transient rather than placed next to the failing line.**
47. **Moderate — Finance date/period and currency context are not consistently prominent.**
48. **Moderate — Report date range, refresh point and metric definition are not consistently visible.**
49. **Major — Shared report table silently limits display to 100 rows without pagination or “showing 100 of N”.**
50. **Major — List tables do not share a predictable sorting and pagination behavior.**
51. **Major — Search availability and search scope vary across similar lists.**
52. **Moderate — Active filters are not consistently summarized as removable chips.**
53. **Moderate — Export coverage is inconsistent across list/report screens.**
54. **Moderate — Some dashboard lists show a limited subset without a consistent preview label.**
55. **Moderate — Table headers/row actions can be hard to use at narrow widths.**
56. **Moderate — Report tables with many columns encourage horizontal scrolling without clear column priority.**
57. **Moderate — No consistent row density or column visibility options are present.**
58. **Moderate — Empty, no-match and no-data states are not uniformly distinct.**
59. **Moderate — Some shared tables render a blank body when there are no rows.**
60. **Moderate — Empty states do not consistently offer a task-specific create/reset CTA.**
61. **Moderate — Dashboard preview emptiness can be mistaken for an empty dataset.**
62. **Moderate — Confirmation dialog style varies between browser-native and custom interactions.**
63. **Moderate — Destructive and irreversible confirmations do not share a consistent consequence summary.**
64. **Moderate — Success results do not consistently link to the updated record.**
65. **Moderate — Disabled controls may not explain which prerequisite blocks the action.**
66. **Moderate — Loading messages vary in wording and do not establish progress or preserve page identity.**
67. **Moderate — Error/recovery states are not consistently provided at page level.**
68. **Moderate — Warnings need clearer severity, cause and resolution link.**
69. **Moderate — Status meaning sometimes depends on color palette consistency across modules.**
70. **Moderate — Small 9–12px typography makes dense controls and labels harder to scan.**
71. **Moderate — The 360px body minimum creates horizontal overflow below that width.**
72. **Major — Tablet navigation overflows as multiple independent horizontal strips.**
73. **Moderate — The desktop-style ribbon consumes substantial vertical space on short screens.**
74. **Moderate — Mobile sidebar lacks the discoverability of a standard drawer (focus return/Escape not evident).**
75. **Moderate — Responsive behavior is only defined separately for some module stylesheets.**
76. **Moderate — The mobile product form is vertically long and relies on a single scroll without section navigation.**
77. **Moderate — Status footer can hide company/branch/user context on small viewports.**
78. **Moderate — Touch targets in compact tree/ribbon areas may be undersized.**
79. **Moderate — There is no consistent global focus-visible style.**
80. **Major — Dialog focus entry/return and keyboard trapping are not evident.**
81. **Moderate — Toast announcements are inaccessible to screen readers.**
82. **Moderate — Search field names rely on placeholder/icon in selected components.**
83. **Moderate — Tabs lack complete keyboard support and associated panel semantics.**
84. **Moderate — Chart descriptions/alternatives are not consistent across all dashboard charts.**
85. **Moderate — Required, invalid and help states are not consistently programmatically associated.**
86. **Moderate — Accordion expanded/collapsed state is not consistently exposed.**
87. **Moderate — Some action buttons are icon-only or terse without consistent accessible names.**
88. **Moderate — Table heading association/announcements need assistive-technology verification.**
89. **Moderate — Color, icon and text usage differs in status/alert components.**
90. **Moderate — Keyboard-only navigation was not demonstrated for all module flows.**
91. **Moderate — Module page headers and breadcrumbs differ in hierarchy across custom admin pages and shared modules.**
92. **Moderate — The global stylesheet contains extensive overlapping/late overrides that raise visual-regression risk.**
93. **Moderate — Shared visual patterns are split among global CSS and three module-specific stylesheets.**
94. **Moderate — Cards, filters and field spacing vary by module, increasing relearning.**
95. **Moderate — Form fields for HR, dealer and finance may combine unrelated data without section-level orientation.**
96. **Moderate — Mobile quick actions are icon/text dense and rely on scrolling.**
97. **Moderate — The page title alone does not always explain the intended audience or record scope.**
98. **Moderate — Sample/example activities may be interpreted as current organizational events.**
99. **Moderate — Print/export controls do not consistently state what data/filters will be included.**
100. **Moderate — No discoverable in-product help, glossary, onboarding or contextual task guidance is evident.**

### Top 100 UX improvements

Each improvement ID maps to the problem of the same number above.

1. Replace the generic submit with a real task-specific flow or clearly unavailable-state message; never report false completion.
2. Default the mobile drawer closed; expose a menu trigger and keep the active page visible at first load.
3. Replace overflowing strips with responsive menus, visible overflow indicators and keyboard-operable controls.
4. Remove title-derived field guessing; provide a dedicated form for each quick action.
5. On success, show the resulting record/reference and next action; show errors without success styling.
6. Rename “Close” to its actual outcome or implement the visible close behavior; do not claim a session action occurred.
7. Link Production to a real screen or mark it clearly unavailable; remove generic create semantics.
8. Place each quick action in its correct group and use labels reflecting destination.
9. Mark illustrative data as sample and show scope, period and last-updated context.
10. Replace fixed “Connected” with a truthful, useful UI status or remove it.
11. Add a breadcrumb: module → group → current page, with a working parent link.
12. Give detail/edit pages a “Back to [list]” action that preserves prior filters/selection.
13. Consolidate navigation into module switcher, contextual side navigation and page tabs; remove redundant shortcuts.
14. Rename the search “Search pages and groups” and display what matches.
15. Implement Ctrl/Cmd+K (with platform detection) or remove the hint.
16. Add each hidden dashboard/edit route to its parent page flow and contextual menus; test every route has an inbound link.
17. Rename one Dealer Reports destination and add a clear parent breadcrumb to both.
18. Set and announce `aria-expanded` on every accordion button and associate the controlled region.
19. Show scroll shadows/overflow buttons and ensure all hidden controls are reachable by keyboard.
20. Add tab overflow menu and Close All; preserve the active tab when pruning.
21. Use buttons with selected state if tabs are not true tabs; otherwise implement tabpanel IDs and keyboard navigation.
22. Name the affected record and link to it in save status messages.
23. Add an `aria-live` status region; keep high-priority errors inline until corrected.
24. Standardize validation UI (inline field error + summary + native attributes where appropriate).
25. Focus the first invalid control and associate the error using `aria-describedby`.
26. Use a “* Required” legend and proper required state, not star-only signals.
27. Standardize Cancel, Save Draft, Submit and Reset; guard all dirty forms consistently.
28. Use a shared dirty-state hook/pattern and browser navigation guard where appropriate.
29. Provide a visible Cancel/back action on every create/edit flow.
30. Label filter reset separately from form reset and confirm only when unsaved values will be lost.
31. Adopt verbs by state transition and show an explicit consequence for post/finalize.
32. Use “Employee” for workforce profile and “User account” for application access.
33. Choose one canonical “Company Profile” label and use it in navigation, title and route.
34. Align “Create Ledger Account” and “Account Form” terminology across actions and heading.
35. Distinguish cash receipt, dealer receipt, customer payment and allocation with full business context.
36. Use shared field sections, labels, widths, footer and spacing across all modules.
37. Add helper text and optional markers; group fields by identity, contact, details and review.
38. Give every search input a persistent label (visually hidden where needed) and a scoped placeholder.
39. Add plain-language help and examples to settings and numbering controls.
40. Add a workflow preview/sample request and show exactly which role/stage receives it.
41. Display delegation period, document scope, per-decision limits and resulting effective authority before save.
42. Add order lifecycle progress with approver, stock, dispatch and delivery states and links.
43. Add return review summary including original order, batch, qty, credit and disposition.
44. Add before/after stock preview with warehouse/bin and batch, then confirm.
45. Add one payroll-run detail page/timeline covering generated → review → approved → finalized → paid.
46. Show journal validation beside line rows and preserve entered amounts after correction.
47. Pin financial period, transaction date, currency and account scope in finance views.
48. Put date range, data scope, definitions and freshness above each report.
49. Add pagination/page-size controls; explicitly display “Showing 1–100 of N” until pagination exists.
50. Implement shared sortable grid with keyboard-operable headers and sort direction announcements.
51. Standardize search/filter placement and scope across all lists in each module.
52. Show applied filters as removable chips with a single Clear all action.
53. Make CSV/print availability predictable and document export scope/row count before download.
54. Label dashboard subsets “Recent 5” or “Top 10” and link to all records.
55. Provide responsive row-detail cards or prioritized columns with sticky key identifiers.
56. Let users hide low-priority columns and pin important columns; announce horizontal scroll affordance.
57. Add shared page-size and density settings for long-running register grids.
58. Create separate first-use, no-match and no-data states with different recovery guidance.
59. Require table helpers to render an explicit empty row rather than blank `<tbody>`.
60. Provide a contextual CTA (Create, Clear filters, Set up first…) from empty views.
61. For dashboard emptiness, say “No recent items in this period” and link to full register.
62. Standardize a focus-managed confirmation dialog with consistent labels and consequences.
63. Use confirmation only for irreversible/destructive actions; name the record and effect, with Cancel as safe default.
64. Include a detail link and a concise changed-field summary after success.
65. Pair disabled controls with a visible explanation and link to the missing prerequisite.
66. Use stable page title during lazy loading and a skeleton/progress cue that does not cause layout shift.
67. Add recoverable page-level error/empty states with Retry or Return to list, preserving entered data.
68. Classify alerts by severity and cause; include a route to resolve the problem.
69. Define shared semantic status tokens and use text plus icon, never color alone.
70. Set a readable type scale, especially for essential labels/table data, and verify 200% zoom.
71. Remove fixed body minimum-width overflow; test 320px and reflow content.
72. Collapse module navigation and ribbon at tablet widths instead of stacking horizontal carousels.
73. Reduce shell chrome when viewport height is short; prioritize work content over decorative ribbon.
74. Implement drawer dialog semantics, initial focus, Escape close, backdrop button and focus return.
75. Establish breakpoints/tokens in shared styles and run visual regression on representative screens.
76. Add section anchors/progress for long product/employee forms and keep Save/Cancel reachable.
77. Collapse footer details into a status menu on mobile while retaining essential company/branch context.
78. Increase small touch targets to comfortable sizes and preserve spacing between destructive actions.
79. Define global `:focus-visible` for buttons, links, inputs, selects, tabs and tree controls; test contrast.
80. Move focus into dialogs, trap it while modal, close on Escape where safe, and restore trigger focus.
81. Use polite/assertive live regions according to message severity and make errors persistent.
82. Audit every control for a programmatic label; include search role and field scope.
83. Use a semantic tab pattern with arrow navigation and associated panels, or use ordinary selected buttons.
84. Add concise chart descriptions, units, series values and data-table alternative.
85. Programmatically associate required/help/error with each control and announce invalid state.
86. Add `aria-expanded`, `aria-controls`, and keyboard operation to groups/menus.
87. Give every icon-only action a record-specific name and tooltips where helpful.
88. Test tables with screen readers; set caption, header scopes and responsive row context.
89. Define shared status palette, contrast thresholds, text labels and icon meanings.
90. Add keyboard-only QA scripts for module switch, page open/close, form submit, table actions and dialogs.
91. Standardize page headers with module eyebrow, breadcrumb, title, description and primary action.
92. Consolidate duplicate CSS overrides and add component visual regression snapshots.
93. Move shared patterns into scoped design tokens/components; keep module CSS for true variants only.
94. Establish common card, form, filter and grid primitives with documented usage.
95. Split long forms into coherent sections and use conditional fields to reduce cognitive load.
96. Replace scrolling ribbon actions with a prioritized mobile action menu and accessible labels.
97. Add a one-line audience/scope description to ambiguous pages and distinguish configuration from transaction screens.
98. Add “Sample data” labels and a visible demo-data legend to any fixture-driven view.
99. Show exact report name, applied filters, period, columns and row count before export/print.
100. Add contextual help/definitions, first-run tours, search help, keyboard shortcut list and a feedback link.

## Most confusing screens and workflows

### Screens

1. **Administration Dashboard** — polished and dense, but fixed-looking KPI/activity/chart examples and mixed quick actions can be mistaken for live operational state.
2. **Generic Action Modal** — action title suggests a real business form, but fields are generic and submit feedback can imply success without a task-specific record.
3. **Mobile shell** — default-open drawer covers the page and multiple horizontal strips hide controls.
4. **Document Numbering / Company Settings** — technical options and overlapping responsibilities need plain-language scope and preview.
5. **Permission Matrix** — dense permission toggles require a better explanation of scope and keyboard movement.
6. **Dealer Reports** — same title in two modules.
7. **Journal Form / Reversals** — high-impact finance tasks need in-context validation and preview of consequences.
8. **Stock Transfer / Adjustments / Count Reconciliation** — source/destination, variance and approval context should remain visible throughout.
9. **Payroll Review → Finalize → Payments** — separate screens make current cycle state and next action harder to understand.
10. **Report filters and comparative views** — scope, filters and metric basis are not consistently visible.

### Workflows

- **Quick action → modal → “success”:** generic fields, no actual task-specific summary, false-completion risk.
- **Create/edit → save → return:** inconsistent cancel, dirty warning, destination and resulting-record navigation.
- **Approval decision:** request context, consequences, reason and next owner need a consistent review/decision flow.
- **Order → approval → inventory → dispatch → return → account:** no single lifecycle view; records are spread across module groups.
- **Stock movement → approval → resulting balance:** before/after and approval/posting stages need stronger continuity.
- **Payroll period → generate → review → finalize → pay:** a single run timeline and explicit prerequisite blockers are missing.
- **Report filters → results → export/schedule:** applied scope and total-vs-visible row count need to remain visible.

## Missing UI components and user guidance

### Components

- Breadcrumbs and consistent page-header component across Administration and all modules.
- Common filter toolbar, sortable/paginated grid, column chooser, bulk action bar and sticky key columns.
- Shared empty/no-match/loading/error/stale/partial-state components for all modules.
- Shared form section, required legend, inline field errors, error summary, sticky footer and unsaved-change guard.
- Focus-managed confirmation dialog, modal focus return and mobile drawer interaction.
- Consistent live-region toast/status component and persistent inline save result.
- Timeline/stepper components for approval, order/dispatch, inventory movement and payroll lifecycle.
- Metric/KPI card with unit, period, scope and drill-down.
- Mobile overflow menu and responsive table/card transformation.

### User guidance and help

- Plain-language glossary for terms such as account group, control account, QC status, base unit, reconciliation, allocation, financial period and approval delegation.
- Contextual “why this field is needed” help for regulatory, financial, approval and payroll settings.
- Examples and formatting guidance for document numbering, bank references, batch codes and effective dates.
- Short onboarding tour for the navigation, tab strip, search, filters and module conventions.
- Page-level help with role-relevant tasks, expected prerequisites and “what happens next.”
- Action-specific confirmation explaining the record/status change and how to find it afterward.
- Visible “sample data” explanation for illustrative dashboard/report examples.
- Keyboard shortcuts help only after the shortcuts are implemented.

## Missing empty states and confirmations

- Empty states need explicit variant and CTA on every list/report/queue: no records, no matching filters, prerequisites missing, unavailable data, and zero-value result.
- First-use states need a clear “Create first …” action and concise setup steps.
- No-search-match states need a one-click Clear filters action and an active-filter summary.
- Dashboard cards need “no recent data in this period” rather than a blank chart/table.
- Confirmation is particularly needed before posting/reversing journals, finalizing payroll, approving/rejecting orders/returns, stock adjustment/transfer, changing financial-year state, deleting roles and discarding edits.
- Confirmations should not overuse blocking dialogs for reversible edits; use inline undo where safe.
- In the inspected source, some destructive/financial-year/company-dirty actions use `window.confirm`; use a consistent accessible dialog rather than mixing native and custom confirmation styles.

## Missing navigation links

- Breadcrumb links from every page to module, section and parent list.
- “Back to results” links preserving filters/sort/selection for details/edit pages.
- Links from dashboard alerts/KPIs to correctly filtered queues.
- Related-record links among dealer, order, dispatch, return, payment and statement views.
- Related-record links among product, batch, warehouse, movement and count views.
- Related-record links between employee profile, attendance, leave and payroll history.
- Payroll run navigation across draft, review, finalization and payment.
- Report result → source-record drill-through and report → saved/scheduled/export history.
- Inbound links for dashboard/edit pages absent from module trees.
- A visible explanation and link when a top-level ribbon action is not available.

## Recommended delivery order

### P0 — Trust and task completion

1. Remove generic fake-success quick actions or route them to real task-specific screens.
2. Correct “Close” and other misleading action labels/outcomes.
3. Label sample dashboard data and clarify fixed status indicators.
4. Fix mobile initial state so the active page is not obscured.

### P1 — Navigation, forms and tables

1. Add responsive module switcher, visible horizontal overflow affordances and breadcrumbs.
2. Standardize form sections, required/error state, cancel/reset and dirty-state behavior.
3. Add shared grid sorting, pagination, filters, empty/no-match states and row-action patterns.
4. Resolve duplicate/hidden page labels and link every route into a workflow.
5. Make transaction lifecycle steps visible for approvals, stock, dealer orders and payroll.

### P2 — Accessibility and polish

1. Complete focus management, tab/dialog semantics and live-region feedback.
2. Improve type scale, table reflow, touch targets and contrast.
3. Consolidate design tokens and CSS overrides; add visual regression coverage.
4. Add help, glossary, onboarding and metric definitions.

## Verification notes

- Live browser checks confirmed the shell renders and a module dashboard resolves; the mobile module drawer overlay and horizontal overflow were observed at 390px.
- A mobile Add Product screenshot showed a coherent vertically scrollable form after closing the drawer.
- Static source review covered all seven route maps and 201 declared pages; the page matrix records each route and a heuristic assessment.
- This is not a full click-through of 201 routes, an assistive-technology certification, or moderated usability research. Validate the highest-risk tasks with representative users before sign-off.
- No source UI was modified as part of this audit.
