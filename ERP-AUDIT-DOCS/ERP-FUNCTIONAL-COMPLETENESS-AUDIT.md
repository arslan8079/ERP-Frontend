# GreenField ERP — Frontend Functional Completeness Audit

**Review date:** 11 November 2026
**Scope:** Frontend business processes, functional flow, page journeys, cross-page data use, CRUD/action coverage, screens, reports and business readiness only. Backend, APIs, database design, authentication, authorization, roles/permissions and security architecture are excluded.

## Executive decision

> **NO — frontend development cannot yet be considered functionally complete before backend implementation.**

The application has a substantial screen catalogue and several usable end-to-end prototype flows. Dealer order/approval/dispatch/return/payment, inventory stock operations, HR leave/attendance, payroll review/finalize, Finance journal posting and reporting are represented. However, the page catalogue overstates business completion: some apparent actions are notification-only, some entity lifecycles stop at create/read, cross-module data is not consistently handed off, and some reports or recurring tasks are records of intent rather than completed business operations.

| Readiness measure | Estimate | Basis |
|---|---:|---|
| Frontend business readiness | **54%** | Core business concepts and many main screens exist, but lifecycle maintenance, exceptions and handoffs are incomplete. |
| Workflow completion | **55%** | Several individual flows work in prototype state; end-to-end handoffs and correction/resumption steps are missing. |
| Process completion | **58%** | Typical happy paths are represented better than exception, reversal, reconciliation and lifecycle-maintenance paths. |
| ERP completeness | **52%** | All seven modules have screens, but breadth is not equivalent to consistent functional coverage. |

These are heuristic audit estimates, not measured code-completion percentages or user-test results. They are based on declared routes and source-visible interactions. A single number should not be read as a count of pages implemented.

### Coverage and evidence

- Seven modules and **201 declared page-route entries** are represented: Administration 31 (including its landing/dashboard page), Dealer Management 33, Finance 32, Human Resource 27, Inventory 33, Payroll 24, and Reports & Analytics 21.
- The page-by-page matrix below carries over the page-purpose assessment from the prior route review. Its previous/next columns show the **expected business journey**, not proof that every link is implemented. Status describes purpose/duplication; detailed functional gaps appear in later sections.
- “Observed” means supported by frontend source behavior; “gap” means an absent or incomplete visible frontend step; “inferred” is a recommended process step that should be confirmed with business owners.
- This is a source-based review, not a fully clicked test of every route or validation of a deployed production workflow.

## Phase 1 — Page purpose and journey validation

All 201 declared pages are listed. `Questionable` indicates a broad/ambiguous purpose in the page inventory; `Duplicate` identifies the same business-facing page name used in more than one module. `Valid` means the page has a recognizable business purpose, not that its workflow is complete. Roles/permissions and sign-in history are listed only to preserve route coverage and are otherwise out of scope; their journeys and functionality are not assessed.

| Module | Page | Purpose | Expected previous page | Expected next page | Business value | Status |
|---|---|---|---|---|---|---|
| Administration | Dashboard | Organization-wide overview and admin shortcuts | Module entry / prior navigation context | Branch List / Department List | Organization-wide overview and admin shortcuts | Questionable |
| Administration | Company Setup | Define company profile and logo | Module dashboard or related list | Related record, decision or report | Define company profile and logo | Valid |
| Administration | Company Documents | Upload and track company documents | Module dashboard or related list | Related record, decision or report | Upload and track company documents | Valid |
| Administration | Branch List | Find and manage branches | Module dashboard or prior workflow step | Record detail, create action or next decision | Find and manage branches | Valid |
| Administration | Create Branch | Add a company branch | Related list, queue or source record | Created/updated record, review queue or history | Add a company branch | Valid |
| Administration | Branch Details | Review a selected branch | Related list or search results | Edit, related transaction or history | Review a selected branch | Questionable |
| Administration | Branch Settings | Configure branch preferences | Module setup or parent list | Affected operational list or workflow | Configure branch preferences | Questionable |
| Administration | Branch Reports | Review branch performance | Dashboard or source transaction/list | Export or source-record drill-through | Review branch performance | Valid |
| Administration | Department List | Find and manage departments | Module dashboard or prior workflow step | Record detail, create action or next decision | Find and manage departments | Valid |
| Administration | Create Department | Define a department and manager | Related list, queue or source record | Created/updated record, review queue or history | Define a department and manager | Valid |
| Administration | Edit Department | Update department details | Module dashboard or related list | Related record, decision or report | Update department details | Questionable |
| Administration | Department Details | Review a department | Related list or search results | Edit, related transaction or history | Review a department | Questionable |
| Administration | Department Settings | Configure department behavior | Module setup or parent list | Affected operational list or workflow | Configure department behavior | Questionable |
| Administration | Assign Employees | Assign employees to a department | Related list, queue or source record | Created/updated record, review queue or history | Assign employees to a department | Valid |
| Administration | Department Reports | Review department data | Dashboard or source transaction/list | Export or source-record drill-through | Review department data | Valid |
| Administration | Users List | Find and manage users | Module dashboard or prior workflow step | Record detail, create action or next decision | Find and manage users | Valid |
| Administration | Create User | Create a user record | Related list, queue or source record | Created/updated record, review queue or history | Create a user record | Valid |
| Administration | Edit User | Update user details | Module dashboard or related list | Related record, decision or report | Update user details | Questionable |
| Administration | User Profile | Review a selected user | Related list or search results | Edit, related transaction or history | Review a selected user | Valid |
| Administration | Roles Management | Not assessed (roles excluded by scope) | Out of scope | Out of scope | Not assessed | Not assessed |
| Administration | Permission Matrix | Not assessed (permissions excluded by scope) | Out of scope | Out of scope | Not assessed | Not assessed |
| Administration | Login History | Not assessed (authentication excluded by scope) | Out of scope | Out of scope | Not assessed | Not assessed |
| Administration | Pending Approvals | Review queued requests | Module dashboard or prior workflow step | Record detail, create action or next decision | Review queued requests | Valid |
| Administration | Approval Rules | Configure approval flows | Module setup or parent list | Affected operational list or workflow | Configure approval flows | Questionable |
| Administration | Approval History | Review past decisions | Module dashboard or prior workflow step | Record detail, create action or next decision | Review past decisions | Valid |
| Administration | Delegation & Limits | Set delegated authority and limits | Module dashboard or related list | Related record, decision or report | Set delegated authority and limits | Questionable |
| Administration | Company Settings | Configure company-level preferences | Module setup or parent list | Affected operational list or workflow | Configure company-level preferences | Questionable |
| Administration | General Settings | Configure general application preferences | Module setup or parent list | Affected operational list or workflow | Configure general application preferences | Questionable |
| Administration | Financial Year | Create/activate/close financial years | Module setup or parent list | Affected operational list or workflow | Create/activate/close financial years | Valid |
| Administration | Document Numbering | Configure document sequences | Module setup or parent list | Affected operational list or workflow | Configure document sequences | Questionable |
| Administration | Audit Logs | Review system actions | Module dashboard or related list | Related record, decision or report | Review system actions | Valid |
| Dealer Management | Dealer Management | Dealer operations dashboard | Module dashboard or related list | Related record, decision or report | Dealer operations dashboard | Questionable |
| Dealer Management | Dealer Dashboard | Dealer network snapshot | Module entry / prior navigation context | Add Dealer / Order List | Dealer network snapshot | Questionable (duplicate dashboard content) |
| Dealer Management | Dealer List | Search dealer records | Module dashboard or prior workflow step | Record detail, create action or next decision | Search dealer records | Valid |
| Dealer Management | Add Dealer | Register a dealer | Related list, queue or source record | Created/updated record, review queue or history | Register a dealer | Valid |
| Dealer Management | Dealer Profile | Review a dealer account | Related list or search results | Edit, related transaction or history | Review a dealer account | Valid |
| Dealer Management | Dealer Verification | Review verification items | Module dashboard or related list | Related record, decision or report | Review verification items | Valid |
| Dealer Management | Dealer Categories | Manage dealer classifications | Module setup or parent list | Affected operational list or workflow | Manage dealer classifications | Valid |
| Dealer Management | Dealer Reports | Dealer report overview | Dashboard or source transaction/list | Export or source-record drill-through | Dealer report overview | Duplicate |
| Dealer Management | Sales Territories | Create/manage territories | Module dashboard or related list | Related record, decision or report | Create/manage territories | Valid |
| Dealer Management | Dealer Assignments | Assign dealer to territory/officer | Module dashboard or related list | Related record, decision or report | Assign dealer to territory/officer | Valid |
| Dealer Management | Sales Officer Assignments | Assign sales officers | Module dashboard or related list | Related record, decision or report | Assign sales officers | Valid |
| Dealer Management | Assignment History | Review assignment changes | Module dashboard or prior workflow step | Record detail, create action or next decision | Review assignment changes | Valid |
| Dealer Management | Create Order | Create an order | Related list, queue or source record | Created/updated record, review queue or history | Create an order | Valid |
| Dealer Management | Order List | Find and review orders | Module dashboard or prior workflow step | Record detail, create action or next decision | Find and review orders | Valid |
| Dealer Management | Pending Orders | Process orders awaiting action | Module dashboard or related list | Related record, decision or report | Process orders awaiting action | Valid |
| Dealer Management | Approval Queue | Review order approvals | Module dashboard or prior workflow step | Record detail, create action or next decision | Review order approvals | Valid |
| Dealer Management | Order Details | Review an order | Related list or search results | Edit, related transaction or history | Review an order | Valid |
| Dealer Management | Order History | Review order changes | Module dashboard or prior workflow step | Record detail, create action or next decision | Review order changes | Valid |
| Dealer Management | Pending Dispatches | Find orders awaiting dispatch | Module dashboard or related list | Related record, decision or report | Find orders awaiting dispatch | Valid |
| Dealer Management | Create Dispatch | Record dispatch | Related list, queue or source record | Created/updated record, review queue or history | Record dispatch | Valid |
| Dealer Management | Delivery Records | Review deliveries | Module dashboard or prior workflow step | Record detail, create action or next decision | Review deliveries | Valid |
| Dealer Management | Sales Returns | Record a return | Module dashboard or related list | Related record, decision or report | Record a return | Valid |
| Dealer Management | Return Approvals | Review return requests | Module dashboard or prior workflow step | Record detail, create action or next decision | Review return requests | Valid |
| Dealer Management | Credit Limits | Review/update dealer limits | Module dashboard or related list | Related record, decision or report | Review/update dealer limits | Valid |
| Dealer Management | Dealer Statements | Review account activity | Module dashboard or related list | Related record, decision or report | Review account activity | Valid |
| Dealer Management | Outstanding Balances | Review receivables | Module dashboard or prior workflow step | Record detail, create action or next decision | Review receivables | Valid |
| Dealer Management | Dealer Payments | Record a receipt | Module dashboard or prior workflow step | Record detail, create action or next decision | Record a receipt | Valid |
| Dealer Management | Recovery History | Review account recovery | Module dashboard or prior workflow step | Record detail, create action or next decision | Review account recovery | Valid |
| Dealer Management | Dealer Sales Report | Review dealer sales | Dashboard or source transaction/list | Export or source-record drill-through | Review dealer sales | Valid |
| Dealer Management | Order Report | Review order metrics | Dashboard or source transaction/list | Export or source-record drill-through | Review order metrics | Valid |
| Dealer Management | Outstanding Report | Review dealer dues | Dashboard or source transaction/list | Export or source-record drill-through | Review dealer dues | Valid |
| Dealer Management | Territory Sales | Compare territory sales | Module dashboard or related list | Related record, decision or report | Compare territory sales | Valid |
| Dealer Management | Dealer Performance | Review dealer KPIs | Module dashboard or related list | Related record, decision or report | Review dealer KPIs | Questionable |
| Finance | Finance Dashboard | Review finance summary | Module entry / prior navigation context | Create Journal Entry / Cash Receipts | Review finance summary | Questionable |
| Finance | Account Groups | Review account categories | Module setup or parent list | Affected operational list or workflow | Review account categories | Valid |
| Finance | Create Ledger Account | Add a chart-of-accounts entry | Related list, queue or source record | Created/updated record, review queue or history | Add a chart-of-accounts entry | Valid |
| Finance | Account Directory | Search ledger accounts | Module dashboard or prior workflow step | Record detail, create action or next decision | Search ledger accounts | Valid |
| Finance | Account Details | Review a ledger account | Related list or search results | Edit, related transaction or history | Review a ledger account | Valid |
| Finance | Create Journal Entry | Enter a journal | Related list, queue or source record | Created/updated record, review queue or history | Enter a journal | Valid |
| Finance | Draft Entries | Review draft journals | Module dashboard or prior workflow step | Record detail, create action or next decision | Review draft journals | Valid |
| Finance | Posted Entries | Review posted journals | Module dashboard or prior workflow step | Record detail, create action or next decision | Review posted journals | Valid |
| Finance | Reversals | Reverse a journal | Module dashboard or related list | Related record, decision or report | Reverse a journal | Valid |
| Finance | Journal Report | Search journal activity | Dashboard or source transaction/list | Export or source-record drill-through | Search journal activity | Valid |
| Finance | Cash Accounts | Review cash accounts | Module dashboard or related list | Related record, decision or report | Review cash accounts | Valid |
| Finance | Cash Receipts | Record cash received | Module dashboard or related list | Related record, decision or report | Record cash received | Valid |
| Finance | Cash Payments | Record cash paid | Module dashboard or prior workflow step | Record detail, create action or next decision | Record cash paid | Valid |
| Finance | Bank Accounts | Review bank accounts | Module dashboard or related list | Related record, decision or report | Review bank accounts | Valid |
| Finance | Bank Transactions | Review bank activity | Module dashboard or related list | Related record, decision or report | Review bank activity | Valid |
| Finance | Bank Reconciliation | Match statement and ledger lines | Related list, queue or source record | Created/updated record, review queue or history | Match statement and ledger lines | Valid |
| Finance | Customer Balances | Review receivables by customer | Module dashboard or prior workflow step | Record detail, create action or next decision | Review receivables by customer | Valid |
| Finance | Outstanding Invoices | Create/find open invoices | Module dashboard or related list | Related record, decision or report | Create/find open invoices | Questionable |
| Finance | Receive Payment | Record customer receipt | Module dashboard or related list | Related record, decision or report | Record customer receipt | Valid |
| Finance | Payment Allocation | Apply a receipt to invoices | Module dashboard or related list | Related record, decision or report | Apply a receipt to invoices | Valid |
| Finance | Aging Report | Review customer aging | Dashboard or source transaction/list | Export or source-record drill-through | Review customer aging | Valid |
| Finance | Supplier Balances | Review payables by supplier | Module dashboard or prior workflow step | Record detail, create action or next decision | Review payables by supplier | Valid |
| Finance | Supplier Bills | Create/find supplier bills | Module dashboard or related list | Related record, decision or report | Create/find supplier bills | Questionable |
| Finance | Make Payment | Pay supplier bills | Module dashboard or related list | Related record, decision or report | Pay supplier bills | Valid |
| Finance | Outstanding Payables | Review unpaid bills | Module dashboard or related list | Related record, decision or report | Review unpaid bills | Valid |
| Finance | Payable Aging | Review payable aging | Module dashboard or related list | Related record, decision or report | Review payable aging | Valid |
| Finance | General Ledger | Review ledger lines | Module dashboard or related list | Related record, decision or report | Review ledger lines | Valid |
| Finance | Trial Balance | Review debit/credit totals | Dashboard or source transaction/list | Export or source-record drill-through | Review debit/credit totals | Valid |
| Finance | Profit & Loss | Review income statement | Dashboard or source transaction/list | Export or source-record drill-through | Review income statement | Valid |
| Finance | Balance Sheet | Review balances as of date | Dashboard or source transaction/list | Export or source-record drill-through | Review balances as of date | Valid |
| Finance | Cash Flow | Review cash movement | Dashboard or source transaction/list | Export or source-record drill-through | Review cash movement | Valid |
| Finance | Tax Reports | Review tax data | Dashboard or source transaction/list | Export or source-record drill-through | Review tax data | Questionable |
| Human Resource | Human Resource Dashboard | Review workforce snapshot | Module entry / prior navigation context | Daily Attendance / Leave Requests | Review workforce snapshot | Questionable |
| Human Resource | Employee Directory | Find employees | Module dashboard or prior workflow step | Record detail, create action or next decision | Find employees | Valid |
| Human Resource | Add Employee | Create employee profile | Related list, queue or source record | Created/updated record, review queue or history | Create employee profile | Valid |
| Human Resource | Edit Employee | Update employee profile | Module dashboard or related list | Related record, decision or report | Update employee profile | Questionable |
| Human Resource | Employee Profile | Review employee detail | Related list or search results | Edit, related transaction or history | Review employee detail | Valid |
| Human Resource | Employee Documents | Track employee documents | Module dashboard or related list | Related record, decision or report | Track employee documents | Valid |
| Human Resource | Transfers & Promotions | Change employee assignment/title | Related list, queue or source record | Created/updated record, review queue or history | Change employee assignment/title | Valid |
| Human Resource | Employee Reports | Review employee data | Dashboard or source transaction/list | Export or source-record drill-through | Review employee data | Valid |
| Human Resource | Daily Attendance | Review daily attendance | Module dashboard or related list | Related record, decision or report | Review daily attendance | Valid |
| Human Resource | Mark Attendance | Record attendance | Related list, queue or source record | Created/updated record, review queue or history | Record attendance | Questionable |
| Human Resource | Attendance Corrections | Review/correct attendance | Module dashboard or related list | Related record, decision or report | Review/correct attendance | Valid |
| Human Resource | Shift Assignments | Assign employee shifts | Module dashboard or related list | Related record, decision or report | Assign employee shifts | Valid |
| Human Resource | Attendance Reports | Review attendance metrics | Dashboard or source transaction/list | Export or source-record drill-through | Review attendance metrics | Valid |
| Human Resource | Leave Types | Configure leave categories | Module setup or parent list | Affected operational list or workflow | Configure leave categories | Valid |
| Human Resource | Leave Requests | Review leave requests | Module dashboard or prior workflow step | Record detail, create action or next decision | Review leave requests | Valid |
| Human Resource | Apply for Leave | Request leave | Related list, queue or source record | Created/updated record, review queue or history | Request leave | Valid |
| Human Resource | Leave Approvals | Decide leave requests | Module dashboard or prior workflow step | Record detail, create action or next decision | Decide leave requests | Valid |
| Human Resource | Leave Balances | Review leave entitlement | Module dashboard or prior workflow step | Record detail, create action or next decision | Review leave entitlement | Valid |
| Human Resource | Leave Reports | Review leave patterns | Dashboard or source transaction/list | Export or source-record drill-through | Review leave patterns | Valid |
| Human Resource | Shift List | Review/manage shifts | Module dashboard or prior workflow step | Record detail, create action or next decision | Review/manage shifts | Valid |
| Human Resource | Create Shift | Define a working shift | Related list, queue or source record | Created/updated record, review queue or history | Define a working shift | Valid |
| Human Resource | Employee Rosters | Review/assign roster | Module dashboard or prior workflow step | Record detail, create action or next decision | Review/assign roster | Valid |
| Human Resource | Shift Reports | Review shift coverage | Dashboard or source transaction/list | Export or source-record drill-through | Review shift coverage | Valid |
| Human Resource | Performance Reviews | Review performance records | Module dashboard or related list | Related record, decision or report | Review performance records | Questionable |
| Human Resource | Employee Evaluations | Record evaluation | Module dashboard or related list | Related record, decision or report | Record evaluation | Valid |
| Human Resource | Goals & KPIs | Set employee goals | Module dashboard or related list | Related record, decision or report | Set employee goals | Valid |
| Human Resource | Performance Reports | Review performance outcomes | Dashboard or source transaction/list | Export or source-record drill-through | Review performance outcomes | Valid |
| Inventory | Inventory Dashboard | Review stock overview | Module entry / prior navigation context | Warehouse List / Stock Opening | Review stock overview | Questionable |
| Inventory | Product List | Find product records | Module dashboard or prior workflow step | Record detail, create action or next decision | Find product records | Valid |
| Inventory | Add Product | Register a pesticide product | Related list, queue or source record | Created/updated record, review queue or history | Register a pesticide product | Valid |
| Inventory | Product Categories | Manage product categories | Module setup or parent list | Affected operational list or workflow | Manage product categories | Valid |
| Inventory | Units & Packaging | Manage stock units | Module setup or parent list | Affected operational list or workflow | Manage stock units | Valid |
| Inventory | Product Details | Review product and batches | Related list or search results | Edit, related transaction or history | Review product and batches | Valid |
| Inventory | Product Reports | Review product metrics | Dashboard or source transaction/list | Export or source-record drill-through | Review product metrics | Valid |
| Inventory | Warehouse List | Find warehouses | Module dashboard or prior workflow step | Record detail, create action or next decision | Find warehouses | Valid |
| Inventory | Create Warehouse | Add warehouse | Related list, queue or source record | Created/updated record, review queue or history | Add warehouse | Valid |
| Inventory | Storage Locations | Manage bins/locations | Module dashboard or related list | Related record, decision or report | Manage bins/locations | Valid |
| Inventory | Warehouse Stock | Review warehouse quantities | Module dashboard or prior workflow step | Record detail, create action or next decision | Review warehouse quantities | Valid |
| Inventory | Stock Opening | Enter opening inventory | Module dashboard or prior workflow step | Record detail, create action or next decision | Enter opening inventory | Valid |
| Inventory | Stock In (GRN) | Receive goods | Module dashboard or prior workflow step | Record detail, create action or next decision | Receive goods | Valid |
| Inventory | Stock Out (Issue) | Issue inventory | Module dashboard or prior workflow step | Record detail, create action or next decision | Issue inventory | Valid |
| Inventory | Stock Transfer | Move stock between warehouses | Related list, queue or source record | Created/updated record, review queue or history | Move stock between warehouses | Valid |
| Inventory | Stock Adjustments | Request a stock change | Related list, queue or source record | Created/updated record, review queue or history | Request a stock change | Valid |
| Inventory | Stock Movement History | Trace stock changes | Module dashboard or prior workflow step | Record detail, create action or next decision | Trace stock changes | Valid |
| Inventory | Batch Register | Find batch records | Module dashboard or prior workflow step | Record detail, create action or next decision | Find batch records | Valid |
| Inventory | Create Batch | Register a batch | Related list, queue or source record | Created/updated record, review queue or history | Register a batch | Valid |
| Inventory | Batch Stock | Review batch quantities | Module dashboard or prior workflow step | Record detail, create action or next decision | Review batch quantities | Valid |
| Inventory | Near Expiry Stock | Identify soon-to-expire stock | Module dashboard or prior workflow step | Record detail, create action or next decision | Identify soon-to-expire stock | Valid |
| Inventory | Expired Stock | Identify expired stock | Module dashboard or prior workflow step | Record detail, create action or next decision | Identify expired stock | Valid |
| Inventory | Batch Traceability | Trace batch movement | Module dashboard or related list | Related record, decision or report | Trace batch movement | Valid |
| Inventory | Physical Stock Count | Record a physical count | Module dashboard or prior workflow step | Record detail, create action or next decision | Record a physical count | Valid |
| Inventory | Stock Reconciliation | Review count variance | Related list, queue or source record | Created/updated record, review queue or history | Review count variance | Valid |
| Inventory | Damaged Stock | Record damaged quantities | Module dashboard or prior workflow step | Record detail, create action or next decision | Record damaged quantities | Valid |
| Inventory | Adjustment Approvals | Decide adjustments | Related list, queue or source record | Created/updated record, review queue or history | Decide adjustments | Valid |
| Inventory | Stock Summary | Review aggregate stock | Module dashboard or prior workflow step | Record detail, create action or next decision | Review aggregate stock | Valid |
| Inventory | Warehouse-wise Stock | Compare warehouse holdings | Module dashboard or prior workflow step | Record detail, create action or next decision | Compare warehouse holdings | Valid |
| Inventory | Product Movement | Review product flow | Module dashboard or related list | Related record, decision or report | Review product flow | Valid |
| Inventory | Low Stock Report | Find below-reorder products | Dashboard or source transaction/list | Export or source-record drill-through | Find below-reorder products | Valid |
| Inventory | Stock Valuation | Review inventory value | Module dashboard or prior workflow step | Record detail, create action or next decision | Review inventory value | Valid |
| Inventory | Expiry Report | Review expiry windows | Dashboard or source transaction/list | Export or source-record drill-through | Review expiry windows | Valid |
| Payroll | Payroll Dashboard | Review payroll cycle | Module entry / prior navigation context | Payroll Periods / Generate Payroll | Review payroll cycle | Questionable |
| Payroll | Salary Structures | Review compensation templates | Module dashboard or related list | Related record, decision or report | Review compensation templates | Valid |
| Payroll | Create Salary Structure | Define salary template | Related list, queue or source record | Created/updated record, review queue or history | Define salary template | Valid |
| Payroll | Allowances & Deductions | Configure pay components | Module dashboard or related list | Related record, decision or report | Configure pay components | Valid |
| Payroll | Employee Salary Assignment | Assign a structure | Module dashboard or related list | Related record, decision or report | Assign a structure | Valid |
| Payroll | Payroll Periods | Open/manage periods | Module dashboard or related list | Related record, decision or report | Open/manage periods | Valid |
| Payroll | Generate Payroll | Start payroll calculation | Related list, queue or source record | Created/updated record, review queue or history | Start payroll calculation | Valid |
| Payroll | Payroll Drafts | Review draft runs | Module dashboard or related list | Related record, decision or report | Review draft runs | Valid |
| Payroll | Review & Approval | Review a payroll batch | Module dashboard or related list | Related record, decision or report | Review a payroll batch | Valid |
| Payroll | Finalize Payroll | Finalize an approved batch | Module dashboard or related list | Related record, decision or report | Finalize an approved batch | Valid |
| Payroll | Payroll History | Review completed runs | Module dashboard or prior workflow step | Record detail, create action or next decision | Review completed runs | Valid |
| Payroll | Pending Salaries | Find unpaid salaries | Module dashboard or related list | Related record, decision or report | Find unpaid salaries | Valid |
| Payroll | Process Payments | Process salary payments | Related list, queue or source record | Created/updated record, review queue or history | Process salary payments | Valid |
| Payroll | Payment Records | Review salary payments | Module dashboard or prior workflow step | Record detail, create action or next decision | Review salary payments | Valid |
| Payroll | Salary Slips | View/print a salary slip | Module dashboard or prior workflow step | Record detail, create action or next decision | View/print a salary slip | Valid |
| Payroll | Advance Requests | Request an advance | Module dashboard or prior workflow step | Record detail, create action or next decision | Request an advance | Valid |
| Payroll | Approve Advances | Review advance requests | Module dashboard or related list | Related record, decision or report | Review advance requests | Valid |
| Payroll | Loan Records | Review employee loans | Module dashboard or prior workflow step | Record detail, create action or next decision | Review employee loans | Valid |
| Payroll | Installment Recovery | Review/pay deductions | Module dashboard or related list | Related record, decision or report | Review/pay deductions | Questionable |
| Payroll | Monthly Payroll Report | Review period payroll | Dashboard or source transaction/list | Export or source-record drill-through | Review period payroll | Valid |
| Payroll | Salary Register | Review employee salary totals | Module dashboard or prior workflow step | Record detail, create action or next decision | Review employee salary totals | Valid |
| Payroll | Deductions Report | Review deductions | Dashboard or source transaction/list | Export or source-record drill-through | Review deductions | Valid |
| Payroll | Payment Summary | Review payment totals | Module dashboard or related list | Related record, decision or report | Review payment totals | Valid |
| Payroll | Employee Salary History | Review employee pay history | Module dashboard or prior workflow step | Record detail, create action or next decision | Review employee pay history | Valid |
| Reports & Analytics | Reports & Analytics | Report hub | Module entry / prior navigation context | Operational report or source-module page | Report hub | Questionable |
| Reports & Analytics | Executive Overview | Executive summary | Module entry / prior navigation context | Operational report or source-module page | Executive summary | Questionable |
| Reports & Analytics | Sales Overview | Review sales measures | Module entry / prior navigation context | Operational report or source-module page | Review sales measures | Valid |
| Reports & Analytics | Finance Overview | Review finance measures | Module entry / prior navigation context | Operational report or source-module page | Review finance measures | Valid |
| Reports & Analytics | Inventory Overview | Review stock measures | Module entry / prior navigation context | Operational report or source-module page | Review stock measures | Valid |
| Reports & Analytics | HR Overview | Review workforce measures | Module entry / prior navigation context | Operational report or source-module page | Review workforce measures | Valid |
| Reports & Analytics | Administration Reports | Review admin metrics | Dashboard or source transaction/list | Export or source-record drill-through | Review admin metrics | Valid |
| Reports & Analytics | HRM Reports | Review HR reports | Dashboard or source transaction/list | Export or source-record drill-through | Review HR reports | Valid |
| Reports & Analytics | Payroll Reports | Review payroll reports | Dashboard or source transaction/list | Export or source-record drill-through | Review payroll reports | Valid |
| Reports & Analytics | Finance Reports | Review finance reports | Dashboard or source transaction/list | Export or source-record drill-through | Review finance reports | Valid |
| Reports & Analytics | Inventory Reports | Review inventory reports | Dashboard or source transaction/list | Export or source-record drill-through | Review inventory reports | Valid |
| Reports & Analytics | Dealer Reports | Review dealer reports | Dashboard or source transaction/list | Export or source-record drill-through | Review dealer reports | Duplicate |
| Reports & Analytics | Saved Reports | Open/manage saved reports | Dashboard or source transaction/list | Export or source-record drill-through | Open/manage saved reports | Valid |
| Reports & Analytics | Report Filters | Filter report records | Dashboard or source transaction/list | Export or source-record drill-through | Filter report records | Valid |
| Reports & Analytics | Scheduled Reports | Create/manage schedules | Dashboard or source transaction/list | Export or source-record drill-through | Create/manage schedules | Valid |
| Reports & Analytics | Export History | Review exports | Module dashboard or prior workflow step | Record detail, create action or next decision | Review exports | Valid |
| Reports & Analytics | Activity Reports | Review activity | Dashboard or source transaction/list | Export or source-record drill-through | Review activity | Valid |
| Reports & Analytics | Approval Reports | Review approval outcomes | Dashboard or source transaction/list | Export or source-record drill-through | Review approval outcomes | Valid |
| Reports & Analytics | Transaction Analysis | Analyze transactions | Dashboard or source transaction/list | Export or source-record drill-through | Analyze transactions | Questionable |
| Reports & Analytics | Comparative Reports | Compare periods/groups | Dashboard or source transaction/list | Export or source-record drill-through | Compare periods/groups | Questionable |
| Reports & Analytics | Data Audit Logs | Review data changes | Module dashboard or related list | Related record, decision or report | Review data changes | Valid |

## Phase 2 — Data flow and downstream usefulness

The table follows visible frontend state only: form/page input → frontend state or browser persistence → pages that read the same state → report/dashboard consumers. It does not imply durable or cross-user storage.

| Module / inputs and entry pages | Frontend state and next use | Reporting/dashboard visibility | Data-flow finding |
|---|---|---|---|
| Administration: Company Setup/Documents; Create Branch; Create/Edit Department; Assign Employees; Create/Edit User; approval requests/rules; Financial Year and settings | Company/branch/department state is consumed in lists, details, assignments and selected admin screens. User, approval and selected settings state is retained in browser storage. Branch creation returns to Branch List; department creation selects the new department and returns to its list. | Branch, department, approval and administration report/log screens exist; summary widgets use selected shared state. | Branch edit is a notification-only action, so changed branch data cannot be entered through that apparent path. Branch state does not have the same persistence behavior as user/approval settings. Department assignment and employee linkage are present, but employee onboarding is not consistently one guided handoff into user setup. |
| Dealer Management: Add Dealer; Dealer Verification; Dealer Categories; Territory/Sales Officer Assignments; Create Order; approval; Create Dispatch/delivery; Sales Returns/approval; Dealer Payments | Dealer module state is kept in its own browser-storage key. Created records feed the dealer directory/profile, order queues/details/history, dispatch/delivery, return and account pages. Order and selected decision/payment actions add history entries. | Dealer dashboard/account pages and dealer sales/order/outstanding/territory/performance reports read dealer state; Reports & Analytics also aggregates dealer records. | Dealer happy-path stages exist. Dealer order product selection uses a hard-coded product catalogue instead of the Inventory product state; dispatch does not reserve/consume stock; approved returns do not restock inventory. Add Dealer collects address information not shown on Dealer Profile. Dealer master changes/deactivation and comprehensive change history are missing. |
| Inventory: Add Product; Create Warehouse/Storage Locations; Create Batch; Stock Opening; Stock In (GRN); Stock Out; Transfer; Physical Stock Count; Reconciliation; Adjustment/Damage/Approval | Inventory state uses its own browser-storage key. Product, batch, warehouse, location and movement records feed stock views, batch traceability, count/approval queues and inventory reports. Several stock operations update movements and derived balances. | Inventory dashboard, product details, Warehouse Stock, movement/batch views and inventory reports use inventory state. Reports & Analytics aggregates batches and movements. | Core stock transaction flow exists, including released/unexpired batch checks and FEFO issue behavior. No distinct QC inspection/release flow is evident; GRN quality can be set directly. Count/reconciliation continuation and exception resolution are incomplete. GRN is not linked to purchasing/supplier bills; there is no dealer order-to-stock fulfillment handoff. |
| Human Resource: Add/Edit Employee; Employee Documents; Transfers & Promotions; Mark Attendance/Corrections; Shift/Leave forms; Evaluations and Goals | HR maintains employee, attendance, leave and related state in a separate browser-storage key. Directory/profile, daily attendance, leave balances/approvals, employee/shift views consume HR module state. | HR-local employee, attendance and leave reports exist; HRM Reports and HR Overview consume selected employee/attendance/leave data. | HR record entry is visible to HR pages and reports. The shell/Payroll receives an initial employee collection separately from HR's saved employee state, so a newly added/edited employee may not flow consistently into Payroll after reload. Attendance marking is a batch for today's statuses; no attendance/leave-to-payroll calculation is evidenced. |
| Payroll: Salary Structures/Components; Employee Salary Assignment; Payroll Periods; Generate Payroll; Review/Approve/Finalize; Process Payments; Advances/Loans | Payroll state uses a separate browser-storage key. Assignments and salary/loan configuration feed generated batches; reviewed/finalized batches feed payments, salary slips, history and payroll pages. | Payroll dashboard, module reports and Reports & Analytics show batches/payments/advances. | Main run stages are connected in the UI (Draft → In Review → approved/rework → Finalized → Paid). Calculation consumes salary assignments, structures and loan data, but not HR attendance/leave. Payment is marked paid in the UI without a payment reconciliation/confirmation stage; independent period close/reopen and run correction/regeneration are not evident. |
| Finance: Accounts; Journal Entry/Drafts/Posting/Reversal; Cash Receipts/Payments; invoices/bills; Receive Payment/Allocation; bank reconciliation | Finance state uses a finance-specific browser-storage key. Posted journals, invoices, bills, receipts, payments and reconciliation state feed finance lists, balances and ledger/report views. | Finance dashboard plus General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging reports read finance state. | Journal validation/posting/reversal and invoice/bill posting flows are present. Cash Receipts can create unallocated receipts, whereas Receive Payment links to AR invoices; these are distinct paths with overlap in terminology. In-progress bank reconciliation is stored but cannot be resumed from its history list. No customer/supplier master screens or invoice/bill edit/void path is evident. |
| Reports & Analytics: Report Filters; Save Report; Schedule; Export | Reporting reads module-specific browser-storage keys, builds a cross-module activity list, and stores saved report definitions, schedules and export-history entries in a reporting key. | Five overview dashboards and operational/audit reports aggregate the source rows available to the report module. | CSV export and saved filter definitions work in the frontend. A schedule creates a local record with `nextRun` set to today; there is no visible execution/delivery lifecycle. Demo rows can appear when a module has no represented data, so report output can look like live business activity. Several detail reports and source-record drill-through links are missing. |

### Form and business-action page data-flow matrix

The inputs below are described at business-purpose level, not as a field-by-field form specification. “Consumers” name the visible frontend pages/reports that should reuse the result; they are the expected downstream path, and the findings above call out where the actual source is disconnected or incomplete.

| Module | Form / business-action page | User input or action (purpose-level) | Frontend state used | Next consuming screens | Reports / dashboards |
|---|---|---|---|---|---|
| Administration | Company Documents | Upload and track company documents | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Create Branch | Add a company branch | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Branch Settings | Configure branch preferences | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Create Department | Define a department and manager | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Edit Department | Update department details | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Department Settings | Configure department behavior | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Assign Employees | Assign employees to a department | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Create User | Create a user record | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Edit User | Update user details | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Pending Approvals | Review queued requests | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Approval Rules | Configure approval flows | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Approval History | Review past decisions | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Delegation & Limits | Set delegated authority and limits | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Company Settings | Configure company-level preferences | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | General Settings | Configure general application preferences | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Financial Year | Create/activate/close financial years | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Administration | Document Numbering | Configure document sequences | App state for branch/department records plus browser-local company, user, approval and settings state (not uniform persistence) | Branch/Department lists and details; assignment and user/approval pages; branch/department/admin reports and dashboard | Administration, branch and department reports; Reports & Analytics |
| Dealer Management | Add Dealer | Register a dealer | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Dealer Categories | Manage dealer classifications | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Sales Territories | Create/manage territories | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Dealer Assignments | Assign dealer to territory/officer | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Sales Officer Assignments | Assign sales officers | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Assignment History | Review assignment changes | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Create Order | Create an order | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Approval Queue | Review order approvals | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Pending Dispatches | Find orders awaiting dispatch | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Create Dispatch | Record dispatch | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Sales Returns | Record a return | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Return Approvals | Review return requests | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Credit Limits | Review/update dealer limits | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Dealer Payments | Record a receipt | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Dealer Management | Territory Sales | Compare territory sales | Dealer module browser-local state | Dealer profile/list; order and approval queues; dispatch/delivery; return/account pages; dealer dashboard and sales/order/outstanding reports | Dealer sales, order, outstanding, territory and performance reports; Reports & Analytics |
| Finance | Account Groups | Review account categories | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Create Ledger Account | Add a chart-of-accounts entry | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Account Directory | Search ledger accounts | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Account Details | Review a ledger account | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Create Journal Entry | Enter a journal | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Cash Accounts | Review cash accounts | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Cash Receipts | Record cash received | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Cash Payments | Record cash paid | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Bank Accounts | Review bank accounts | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Bank Reconciliation | Match statement and ledger lines | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Outstanding Invoices | Create/find open invoices | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Receive Payment | Record customer receipt | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Payment Allocation | Apply a receipt to invoices | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Supplier Bills | Create/find supplier bills | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Finance | Make Payment | Pay supplier bills | Finance module browser-local state | Account directory/details; draft/posted journals; cash/bank, AR/AP and reconciliation pages; finance dashboard and ledger/financial statements | General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax and AR/AP aging; Finance Overview and Reports & Analytics |
| Human Resource | Add Employee | Create employee profile | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Edit Employee | Update employee profile | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Employee Documents | Track employee documents | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Transfers & Promotions | Change employee assignment/title | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Daily Attendance | Review daily attendance | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Mark Attendance | Record attendance | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Attendance Corrections | Review/correct attendance | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Shift Assignments | Assign employee shifts | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Attendance Reports | Review attendance metrics | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Leave Types | Configure leave categories | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Leave Requests | Review leave requests | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Apply for Leave | Request leave | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Leave Approvals | Decide leave requests | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Shift List | Review/manage shifts | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Create Shift | Define a working shift | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Employee Rosters | Review/assign roster | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Shift Reports | Review shift coverage | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Performance Reviews | Review performance records | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Employee Evaluations | Record evaluation | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Human Resource | Goals & KPIs | Set employee goals | HR module browser-local state | Employee directory/profile; attendance, leave, shift and performance pages; HR dashboard and employee/attendance/leave reports | Employee, attendance, leave, shift and performance reports; HR Overview and Reports & Analytics |
| Inventory | Add Product | Register a pesticide product | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Product Categories | Manage product categories | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Units & Packaging | Manage stock units | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Warehouse List | Find warehouses | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Create Warehouse | Add warehouse | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Storage Locations | Manage bins/locations | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Warehouse Stock | Review warehouse quantities | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Stock Opening | Enter opening inventory | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Stock In (GRN) | Receive goods | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Stock Out (Issue) | Issue inventory | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Stock Transfer | Move stock between warehouses | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Stock Adjustments | Request a stock change | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Batch Register | Find batch records | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Create Batch | Register a batch | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Batch Stock | Review batch quantities | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Batch Traceability | Trace batch movement | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Physical Stock Count | Record a physical count | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Stock Reconciliation | Review count variance | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Adjustment Approvals | Decide adjustments | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Inventory | Warehouse-wise Stock | Compare warehouse holdings | Inventory module browser-local state | Product/warehouse stock, batches and movements; count/approval queues; inventory dashboard and stock/valuation/expiry reports | Stock, warehouse, movement, valuation, low-stock and expiry reports; Inventory Overview and Reports & Analytics |
| Payroll | Salary Structures | Review compensation templates | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Create Salary Structure | Define salary template | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Employee Salary Assignment | Assign a structure | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Payroll Periods | Open/manage periods | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Generate Payroll | Start payroll calculation | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Review & Approval | Review a payroll batch | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Process Payments | Process salary payments | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Payment Records | Review salary payments | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Salary Slips | View/print a salary slip | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Advance Requests | Request an advance | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Approve Advances | Review advance requests | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Loan Records | Review employee loans | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Salary Register | Review employee salary totals | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Payment Summary | Review payment totals | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Payroll | Employee Salary History | Review employee pay history | Payroll module browser-local state | Salary assignments/periods/runs; review/finalize/payment/slip/history pages; payroll dashboard and reports | Payroll batch/payment/slip reports; Payroll dashboard and Reports & Analytics |
| Reports & Analytics | Report Filters | Filter report records | Reports module browser-local saved views/schedules/export history | Saved Reports, Report Filters, Scheduled Reports and Export History; module/overview reports | Saved report/export/schedule views; Executive/module overview and operational reports |
| Reports & Analytics | Scheduled Reports | Create/manage schedules | Reports module browser-local saved views/schedules/export history | Saved Reports, Report Filters, Scheduled Reports and Export History; module/overview reports | Saved report/export/schedule views; Executive/module overview and operational reports |
| Reports & Analytics | Approval Reports | Review approval outcomes | Reports module browser-local saved views/schedules/export history | Saved Reports, Report Filters, Scheduled Reports and Export History; module/overview reports | Saved report/export/schedule views; Executive/module overview and operational reports |

### Data usefulness classification

- **Visible and reused:** departments ↔ employee assignments; dealer orders/payments ↔ dealer balances/statements; inventory batches/movements ↔ warehouse/product/report pages; payroll batches ↔ payment/slip/report pages; Finance postings ↔ balances and financial statements.
- **Partially reused:** employee records across HR and Payroll; finance AR/AP entities across operational modules; reports across all source modules. Separate local state and incomplete handoffs can make views diverge.
- **Collected but weakly surfaced:** dealer address on the profile; company/employee document metadata on related workflows; fields captured in generic actions without a resulting business record; configuration values that lack an obvious preview or operational consumer.
- **Not evidenced as consumed in the next process:** attendance/leave in payroll calculations; inventory stock/lot availability in dealer order fulfillment; approved dealer returns in inventory stock; GRNs in purchasing/AP matching; supplier master records shared between inventory procurement and Finance.

## Phase 3 — CRUD and lifecycle completeness

Legend: **Yes** = visible frontend action/page; **Partial** = available for a subset of records or as a state transition, not general lifecycle maintenance; **No** = no corresponding action/page evidenced. Archive/restore are distinguished from active/inactive toggles.

| Entity | Create | View | Edit | Delete | Archive / Restore | History | Search / Filter | Export | Missing operations and business impact |
|---|---|---|---|---|---|---|---|---|---|
| Branches | Yes | Yes | **No** (edit pencil only notifies) | No | Partial (activate/deactivate) / No | Partial | Search/list | Report-level only | Correct branch details cannot be maintained; hard deletion is intentionally disallowed in the UI. |
| Departments | Yes | Yes | Yes | No | Partial (activate/deactivate) / No | Partial | List filters | Reports | No safe retirement/merge/delete flow; history is not a full change timeline. |
| Users (business records only) | Yes | Yes | Yes | No | Partial (suspend/activate) / No | Partial | Search/list | Partial | No lifecycle cleanup or full profile history; permission/role design is outside this audit. |
| Dealers | Yes | Yes | No general edit evidenced | No | No / No | Partial | Search and selected filters | Partial (selected account/order/report pages; not directory) | Master corrections, deactivation/reactivation, directory export and complete history are absent. |
| Orders | Yes | Yes | No amendment path evidenced | No | No / No | Yes (selected order history) | List/queue filtering | Partial | Amend/cancel/reopen and change reason are not evident; downstream stock reservation is missing. |
| Dispatches / deliveries | Yes | Yes | No | No | No / No | Partial | Queue/list filters | Partial | Corrections, proof-of-delivery detail and reverse/exception workflow are not evident. |
| Returns | Yes | Yes | No | No | No / No | Partial | Queue/filter | Partial | Inspection, disposition, credit note/refund and stock-restock steps are incomplete. |
| Dealer payments | Yes | Yes | No | No | No / No | Partial | Account filters | Partial | Reversal/correction and cross-linked Finance receipt/allocation journey are incomplete. |
| Products | Yes | Yes | No general edit evidenced | No | No / No | No | Search/filter | Yes (selected inventory lists/reports) | Product master maintenance and lifecycle retire/restore are missing; dealer order uses a separate catalogue. |
| Warehouses / locations | Yes | Yes | Limited/unclear | No | No / No | No | List/search | Partial | No complete location maintenance, archive or history lifecycle. |
| Batches | Yes | Yes | No general edit evidenced | No | Status workflow only / No | Partial (traceability/movements) | Filters | Yes (selected reports) | QC hold/release as separate process, corrections and retirement are incomplete. |
| Stock counts | Yes | Yes | Limited to count workflow | No | No / No | Partial | Count/approval views | Partial | Recount, recount variance, reopen and full adjustment audit are incomplete. |
| Employees | Yes | Yes | Yes | No | No / No | Partial | Directory and report filters | Yes (selected reports) | Termination/reactivation and full employment history are not evident; HR-to-Payroll data handoff is inconsistent. |
| Attendance | Yes (mark/correct) | Yes | Partial (correction approval) | No | No / No | Partial | Date/employee reports | Yes | Bulk historical correction, audit/undo and payroll reconciliation are incomplete. |
| Leave requests | Yes | Yes | No edit/withdraw path | No | No / No | Partial | Status/date views | Yes (selected reports) | Amend/withdraw, cancellation and accrual carry-forward processing are not evident. |
| Salary structures/components | Yes | Yes | No | No | No / No | No | Limited/list | Partial | Changes to active structures cannot be maintained through a clear version/effective-date lifecycle. |
| Payroll periods | Yes | Yes | Limited/unclear | No | No / No | Partial via runs | Period list | Partial | No explicit close/reopen or period correction/retirement lifecycle. |
| Payroll runs | Yes (generate) | Yes | No general edit/regenerate | No | No / No | Partial (run status) | Run/review lists | Yes (reports/slips) | Rework exists, but run amendment, reversal, regeneration and payment reconciliation are incomplete. |
| Reports | Yes (saved definition/schedule) | Yes | No saved-definition edit | Yes (remove) | No / No | Export history only | Yes (filters) | Yes (CSV) | Saved report edit/reopen does not consistently restore filters; schedules are not executed; no delivery history or report versioning. |

## Phase 4 — Administration lifecycle

**Requested journey:** Company Setup → Branch Creation → Department Creation → Employee Assignment → User Creation → Approval Rules → Operational Usage.

| Step | Frontend status | Finding |
|---|---|---|
| Company Setup | Present | Company profile and documents pages exist. Save/dirty behavior is not uniform across settings. |
| Branch Creation | Present | Create Branch returns to Branch List; details/settings/reports pages exist. |
| Branch Maintenance | **Broken** | Branch list edit control only reports that a branch was selected; no Edit Branch form/route is present. Branch contact/address correction is a dead end. |
| Department Creation/Edit | Present | Create/Edit, details, settings, reports and status transition exist. |
| Employee Assignment | Partial | Department assignment page exists; employee onboarding and assignment do not form one consistently guided sequence from the new branch/department. |
| User Creation | Present, separate | User create/edit/profile/list exist. It is not a required linked step from employee profile/assignment; user records are not the same as employee records. |
| Approval Rules | Present, partial | Rules, pending queue, decisions/history and delegations exist; previewing a sample request’s route and operational handoff is not evident. |
| Operational Usage | Partial | Branch/department/employee/user values appear in some operational pages, but not every business flow consumes the same current set. |

**Broken journey:** after selecting Branch “Edit,” the user receives a notification and remains without a saveable editor.

**Missing links/actions:** Branch Details → Edit Branch; Employee Profile → create/link user account; Department Details → assignment and active work; approval rule preview → test request/queue; consistent “return to source” links after setup.

## Phase 5 — Dealer Management lifecycle

**Requested journey:** Create Dealer → Verification → Category → Territory → Sales Officer → Order → Approval → Dispatch → Delivery → Return → Payment → Statement → Performance Report.

| Stage | Status | Gap / continuation |
|---|---|---|
| Create Dealer → verification | Connected | New dealer enters verification workflow; decision actions exist. |
| Category and territory/officer assignment | Present, partial | Assignment pages exist, but current vs proposed assignment and effective dates are not consistently surfaced. |
| Order → approval | Connected | Order creation, queues and approve/reject paths exist; order amendment/cancellation is not evident. |
| Approval → dispatch → delivery | Connected within module | Dispatch and delivery records exist; there is no inventory reservation/lot pick/stock-out handoff. |
| Delivery → return → approval | Partial | Return and decision pages exist; inspection, disposition, restock/credit/refund continuation is missing. |
| Payment → statement/balance | Connected within dealer accounts | Dealer payment and statement/balance/history pages exist. Finance cash receipt/AR allocation is a separate path and not a complete shared handoff. |
| Performance report | Present | Dealer report pages exist, but no universal drill-through from KPI/report row to source transactions. |

**Overall:** the dealer happy path is mostly navigable within the module, but cannot represent end-to-end fulfillment and financial settlement across the ERP. Two distinct pages named **Dealer Reports** also create ambiguous report ownership.

## Phase 6 — Inventory lifecycle

**Requested journey:** Product → Warehouse → Location → Batch → Opening/GRN → Transfer → Issue → Count → Reconciliation → Adjustment → Reports.

| Stage | Status | Gap / continuation |
|---|---|---|
| Product, warehouse and location setup | Present | Master list/create/detail pages exist; general edit/archive/history lifecycle is weak or absent. |
| Batch/QC | Partial | Batch creation and quarantine/released states exist; a distinct inspection, hold/release decision and QC evidence step is not evident. |
| Opening stock and GRN | Present, partial | Stock-in movement is recorded; no purchase order/supplier bill matching flow is represented. |
| Transfer and stock out | Present | Transfer/issue flows and batch/expiry controls exist; stock is not visibly linked to dealer order pick/dispatch. |
| Count and reconciliation | Partial | Count/variance and reconciliation pages exist; recount, reopen/resume and complete exception resolution are not evident. |
| Adjustment and approval | Present, partial | Adjustments/damage/approval are represented; strong before/after, reason and full audit continuity should be made a required journey. |
| Reporting | Present | Stock, movement, valuation and expiry reports exist; add traceable drill-through and explicit valuation basis/as-of date. |

**Missing business connection:** dealer orders do not allocate stock and dispatch/delivery do not consume batches; approved sales returns do not add a dispositioned batch back into inventory.

## Phase 7 — Human Resource lifecycle

**Requested journey:** Add Employee → Profile → Documents → Attendance → Correction → Shift → Leave → Approval → Review → Goals/KPIs → Reports.

- Employee create/read/edit/profile/document and transfer/promotion pages are present. Employee lifecycle termination/reactivation and complete employment history are not evident.
- Daily attendance, today’s marking, correction request/decision, shift assignment and attendance reporting exist. Mark Attendance is scoped to today’s batch; historical correction/undo is not a complete lifecycle.
- Leave types, application, request list, approvals, balances and reports exist. Request amendment/withdrawal and a continuous leave accrual/carry-forward process are missing or unclear.
- Performance reviews, evaluations, goals/KPIs and reports exist, but review cycle setup, due/overdue transitions and employee acknowledgement are not evident.
- Employee, attendance and leave source state feeds HR reports; Payroll does not consume attendance/leave for calculation. HR’s separately saved employee changes may not update the employee list passed to Payroll.

**Missing business steps:** employee exit and clearance; document expiry follow-up; attendance period lock/reconciliation; leave withdrawal/accrual; review acknowledgement/action plan; one employee timeline connecting profile, attendance, leave, shifts and pay history.

## Phase 8 — Payroll lifecycle

**Requested journey:** Salary Structure/Components → Assignment → Period → Generate → Review → Approve → Finalize → Pay → Slip → History → Reports.

- Structures/components can be created and viewed; active structure editing/versioning and assignment effective-date history are not evident.
- Payroll periods and generation exist. Runs follow Draft → In Review → approved or returned to Draft → Finalized → Paid.
- Salary slips, payment views/history and reports exist and use generated batch/payment state.
- **Critical process gap:** payroll generation consumes salary assignment, structure and loan data, but does not use HR attendance or leave. An operator cannot complete the requested attendance/leave-informed payroll journey.
- Process Payments records a fixed bank-transfer method/reference and marks items Paid in the UI; a payment confirmation, failed payment, partial payment, reconciliation and reversal lifecycle is not evident.
- No explicit period close/reopen operation, independent of run progress, is shown. Run amendment/regeneration after correction is also not evident.

**Recommended missing screens:** payroll variance/reconciliation; failed/partial payment queue; payroll run detail with employee-level calculation breakdown; period close/reopen confirmation; run reversal/correction; salary structure effective-date history.

## Phase 9 — Finance lifecycle

**Requested journey:** Account → Journal → Posting → Cash Receipt/Payment → Customer Invoice/Payment → Supplier Bill/Payment → Bank Reconciliation → Financial Reports.

- Chart of accounts create/directory/details, journal draft/post/reversal and financial statements are represented.
- Customer invoices and supplier bills are created inline in list pages; receive/allocate customer payments and pay supplier bills update balances and ledger state.
- Cash Receipts/Payments are generic transactions; Receive Payment/Make Payment are account-linked flows. Users need an explicit distinction and contextual route between them.
- Bank reconciliation matches visible ledger lines against a statement balance; completed reconciliations appear in history. An in-progress reconciliation cannot be reopened to continue. Statement import and exception/adjustment resolution are not evident.
- No edit/void path for invoices/bills or general ledger accounts is evident. Finance does not show customer/supplier master screens.
- General Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow, Tax, and AR/AP aging reports exist. Dedicated receipt/payment register and bank reconciliation report/detail are not among Finance routes.

**Missing/weak processes:** customer/supplier master maintenance; invoice/bill correction/void; credit note/refund; supplier bill-to-GRN match; bank statement import; resumable reconciliation and unmatched item resolution; payment receipt detail and history; explicit post/reverse confirmation and drill-through from statements to source document.

## Phase 10 — Reporting completeness

| Module | Dashboard | Operational reports | Entity coverage and export | Missing/reporting gap |
|---|---|---|---|---|
| Administration | Yes | Branch/department/admin/approval/audit views | Some lists/report views; selected exports | No consistent change-history report or all-master lifecycle reporting. |
| Dealer Management | Yes (two similarly named dashboards) | Sales, order, outstanding, territory, performance | Selected account/order/report export | Dealer directory export and end-to-end order-to-delivery/return/settlement drill-through. |
| Inventory | Yes | Stock, warehouse, movement, low stock, valuation, expiry, product | Export in selected pages/reports | QC, count variance/reconciliation and supplier receipt matching reports; drill-through to originating dealer order absent. |
| Human Resource | Yes | Employee, attendance, leave, shift and performance reports | Selected reports/export | Employee change history, payroll reconciliation, leave accrual and correction audit. |
| Payroll | Yes | Payroll batch/payment/report/slips | Reports/export | Run variance and payment reconciliation; reports do not cover every salary structure/assignment lifecycle. |
| Finance | Yes | Financial statements and AR/AP aging | Reports available | Receipt/payment register, reconciliation report and source transaction detail. |
| Reports & Analytics | Yes (executive and module overviews) | Six operational report groupings and analysis pages | CSV export, saved reports, schedules/export history | Schedules are not executed; no schedule-run history; some reports cap visible rows at 100; sample rows may appear; saved filters do not consistently reopen as applied filters. |

Every major module has at least one dashboard and report screen. That is not equivalent to every important record being reportable. Report coverage is strongest for transaction summaries and weaker for master-data changes, exception resolution, audit history, and cross-module source drill-through.

## Phase 11 — Dead ends and weak continuation paths

| Page/action | Problem | Suggested frontend completion |
|---|---|---|
| Branch List → Edit pencil | Notification only; user cannot change branch data. | Implement Branch Details/Edit form with save/cancel and return to the same list context. |
| Generic shell quick actions (for actions without a destination) | Generic modal can report “created successfully” without a task-specific record/continuation. | Link to a real page/form or clearly state the action is unavailable; never show false completion. |
| Dealer order → dispatch | No visible inventory allocation/stock decrement link. | Add order fulfillment/pick list and batch allocation; carry source order to dispatch and delivery. |
| Dealer return approval → stock/account | Decision ends without inventory disposition and linked credit/refund continuation. | Add inspect/disposition step and show resulting stock/credit/payment outcome. |
| In-progress Bank Reconciliation | History row is not a resume action. | Open and continue the saved reconciliation; expose unmatched items and balance difference. |
| Payroll payment → completion | Paid status is assigned with limited payment outcome detail. | Show resulting payment reference, failed/partial state handling and reconciliation/history. |
| Saved Reports → open saved item | Navigation reopens the report page but does not reliably apply the saved filter set. | Restore saved filters and show the saved report identity/state. |
| Scheduled Reports → scheduled execution | Schedule can be created/deleted, but no run/delivery occurs in frontend. | Treat it as a clearly labeled schedule definition until execution and run history exist. |
| Any list/details/edit route without parent return | User may have no route back to the originating filtered list. | Add contextual Back to list and source links preserving the user's place. |
| Dashboard/summary cards | Some metrics have no source-record drill-through or scope. | Link each KPI/alert to the exact filtered operational queue. |

## Phase 12 — Module business completeness

Scores use a 0–100 heuristic scale. They measure visible frontend business coverage only, not software architecture or backend readiness.

| Module | Business objective supported | Not fully supported | Missing screens/actions/reports | Process completeness | Workflow completeness | CRUD completeness | User journey completeness | Navigation completeness |
|---|---|---|---|---:|---:|---:|---:|---:|
| Administration | Company setup, branches, departments, employee assignment, user records, approvals and settings | Branch maintenance and linked employee/user onboarding | Branch edit; branch history; linked employee/user handoff; approval-route preview | 58 | 56 | 48 | 54 | 62 |
| Dealer Management | Dealer onboarding, order review, dispatch/delivery, returns, payments and statements | Inventory and Finance handoff; master maintenance; return disposition | Dealer edit/deactivation; stock allocation; return inspection/restock/credit; directory export | 62 | 63 | 49 | 57 | 65 |
| Inventory | Product/warehouse/batch and stock movement/count control | QC, purchasing link, dealer fulfillment, count exception resolution | QC inspection/release; PO/GRN match; order pick/dispatch; resumable reconciliation | 62 | 60 | 52 | 57 | 68 |
| Human Resource | Employee, attendance, shifts, leave and performance | End-to-end employee lifecycle and payroll input continuity | Exit/clearance; leave edit/withdraw/accrual; historical attendance reconciliation; cross-module employee timeline | 59 | 57 | 54 | 58 | 64 |
| Payroll | Salary configuration, period generation, review, finalization and payment records | Attendance/leave input; actual payment outcome/reconciliation | Variance/reconciliation; failed/partial payment; period close/reopen; run correction/reversal | 57 | 60 | 49 | 53 | 62 |
| Finance | Ledger, journals, AR/AP, cash/bank and financial statements | Complete bank reconciliation, document corrections and operational source handoffs | Resumable reconciliation; invoice/bill edit/void; customer/supplier maintenance; receipt/reconciliation reports | 65 | 62 | 52 | 60 | 68 |
| Reports & Analytics | Dashboard and summary/operational/analysis reports; CSV and saved views | Full report execution lifecycle, source traceability and complete entity coverage | Schedule execution/history; filter restore; source drill-through; exception/change history | 54 | 46 | 55 | 50 | 63 |

## Phase 13 — Duplicate and redundant features

- **Dealer Reports** appears in Dealer Management and Reports & Analytics. Keep module-specific transaction reports under Dealer Management and cross-module synthesis under Reports & Analytics; rename the latter or label the owner in breadcrumbs.
- **Dealer Management** and **Dealer Dashboard** resolve to the same dashboard component/content. Consolidate to one landing page or give each a distinct audience and purpose.
- **HRM Reports** duplicates/overlaps employee, attendance, leave, shift and performance report pages. Define module-level operational reports vs cross-module executive reports and avoid equivalent filters/tables under two labels.
- **Finance Overview / Finance Dashboard**, **Inventory Overview / Inventory Dashboard**, and **HR Overview / Human Resource Dashboard** overlap in purpose. Keep one canonical operational dashboard per module; use Reports & Analytics for cross-module/executive overview.
- **Cash Receipts vs Receive Payment**, and **Cash Payments vs Make Payment**, are both valid business concepts but are confusingly adjacent. Distinguish unallocated cash movement from customer-invoice allocation and supplier-bill settlement in names and navigation.
- **Outstanding Invoices / Supplier Bills** combine create and browse patterns. Separate transaction entry from the record list to avoid mode ambiguity.
- **Report save/export controls** repeat across many report pages, while saved views and the Report Filters builder overlap. Standardize a single report-view lifecycle and restore behavior.

## Phase 14 — Final missing-functionality backlog

### Missing pages / forms

1. Edit Branch.
2. Dealer Edit/Profile maintenance and active/inactive history.
3. Product, warehouse/location, batch and salary-structure maintenance/version pages.
4. Dealer order amendment/cancellation and order allocation/picking.
5. Return inspection, stock disposition, credit/refund and linked accounting outcome.
6. Inventory QC inspection, quarantine/release evidence and supplier receipt matching.
7. Stock count recount/reopen and reconciliation continuation/exception resolution.
8. Employee termination/clearance and full employment history.
9. Leave request edit/withdrawal and leave accrual/carry-forward workflow.
10. Payroll variance review, payment failure/partial/reconciliation, period close/reopen and run correction/reversal.
11. Invoice/bill edit/void/credit note; customer/supplier master maintenance.
12. Bank statement import, resumable matching and unmatched/adjustment resolution.
13. Report schedule execution/run history; source transaction detail and drill-through.

### Missing actions and user journeys

- Branch Edit; general edit/deactivate/history for key master entities; safe correction/void/reversal for business transactions.
- Contextual “next step” actions after every create, approve, reject, deliver, pay, reconcile and finalize action.
- Cross-module source links that retain the original dealer order, batch, invoice, employee, payroll run or bank statement context.
- Search/filter/export consistency for master lists and queues; CSV export is only available in selected lists.
- Distinct cancel/withdraw, undo/reopen/rework and error-recovery paths for submitted transactions.
- Status timeline that identifies current state, prior state, blocking prerequisite and next expected owner/action (without implying an action has occurred).
- Source-record report drill-through, report parameter restoration, schedule run history and clear sample-data labeling.

## Prioritized delivery recommendations

### P0 — Remove false completion and unblock broken paths

1. Replace notification-only Branch Edit and generic success modals with real task screens or honest unavailable states.
2. Label demo/report fallback data and distinguish it from user-created records.
3. Make dealer order ↔ inventory allocation/dispatch and return ↔ inventory/credit outcomes explicit.
4. Make Payroll consume and display the intended HR attendance/leave inputs before generation.
5. Make saved reports reapply filters; clearly label schedules as definitions until run execution exists.

### P1 — Complete business lifecycles

1. Add edit/cancel/archive/history patterns for master data, with clear distinction between deactivate and delete.
2. Complete invoice/bill corrections, bank reconciliation continuation, stock count reconciliation, and payroll run/payment exception handling.
3. Add source-linked detail pages and preserve parent-list context.
4. Add supplier/PO/GRN/AP and dealer order/stock/return/Finance handoffs.

### P2 — Complete reporting and operational guidance

1. Add missing exception/change reports and drill-through to source transactions.
2. Provide report scope, as-of date, status, row count and sample/live labeling consistently.
3. Add workflow guidance and actionable empty states that identify the exact prerequisite or next step.
4. Validate the highest-risk workflows with representative clerks, managers, finance users and HR/payroll users.

## Final answer

**Can frontend development be considered functionally complete before backend implementation? NO.** The frontend is a broad prototype with several credible module-local happy paths, but business-critical end-to-end continuity is not complete. In particular, branch editing is visibly broken, dealer sales are not linked to inventory fulfillment and return disposition, HR attendance/leave do not feed payroll calculation, bank reconciliation cannot resume, payment/report schedules do not represent complete outcome lifecycles, and important entities lack maintenance/history/correction actions. Backend work can proceed against documented workflows, but frontend business-process definition and validation should continue in parallel; the UI is not a complete functional specification or a production-ready process blueprint.

**Basis disclaimer:** findings about screens/actions/data handoffs describe only behavior evidenced in this frontend repository. Recommendations are process-completeness needs, not assertions about unreviewed services or deployed capabilities.
