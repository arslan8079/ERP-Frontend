import { useState } from 'react'
import { ChevronRight, ClipboardCheck, ReceiptText, ShieldCheck } from 'lucide-react'
import * as Shared from '../shared'
const {
  today,
  monthKey,
  monthLabel,
  money,
  idFor,
  activeEmployees,
  calculateSalary,
  PageHeader,
  Button,
  Stat,
  Card,
  Table,
  Status,
  Empty,
  SalarySlip,
  AdvanceTable,
  PayslipTable,
  Field,
  Toolbar,
  Callout,
  ExportButton,
  downloadCsv,
  payrollVariances,
  varianceRequiresReason,
} = Shared

export default function ReviewPage({
  data,
  setBatchStatus,
  saveVarianceReason,
  periodName,
  onNavigate,
}) {
  const batches = data.batches.filter((item) => ['In Review', 'Reviewed'].includes(item.status))
  const [selectedId, setSelectedId] = useState('')
  const selected = batches.find((item) => item.id === selectedId) || batches[0]
  const variances = selected ? payrollVariances(selected, data.batches) : []
  return (
    <>
      <PageHeader
        title="Review & Approval"
        subtitle="Validate headcount and payroll totals before a run can be finalized."
        icon={ClipboardCheck}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Payroll Drafts')}>
            Open drafts <ChevronRight size={15} />
          </Button>
        }
      />
      <Card
        title={`Batches awaiting review · ${batches.filter((item) => item.status === 'In Review').length}`}
        icon={ShieldCheck}
      >
        <Table
          headers={[
            'Batch / period',
            'Employees',
            'Gross',
            'Deductions',
            'Net payable',
            'Variances to explain',
            'Status',
            'Decision',
          ]}
        >
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td>
                <button className="pr-table-link" onClick={() => setSelectedId(batch.id)}>
                  {batch.id}
                  <small>{periodName(batch.periodId)}</small>
                </button>
              </td>
              <td>{batch.employeeCount}</td>
              <td>{money(batch.gross)}</td>
              <td>{money(batch.deductions)}</td>
              <td>
                <b>{money(batch.net)}</b>
              </td>
              <td>
                {
                  payrollVariances(batch, data.batches).filter(
                    (item) => varianceRequiresReason(item) && !String(item.reason || '').trim(),
                  ).length
                }{' '}
                reason(s) required
              </td>
              <td>
                <Status>{batch.status}</Status>
              </td>
              <td>
                {batch.status === 'In Review' ? (
                  <div className="pr-row-actions">
                    <button
                      className="pr-inline-action approve"
                      disabled={payrollVariances(batch, data.batches).some(
                        (item) => varianceRequiresReason(item) && !String(item.reason || '').trim(),
                      )}
                      title="Select the batch and enter a reason for each variance before approval."
                      onClick={() => setBatchStatus(batch.id, 'Reviewed')}
                    >
                      Approve
                    </button>
                    <button
                      className="pr-inline-action reject"
                      onClick={() => setBatchStatus(batch.id, 'Draft')}
                    >
                      Return
                    </button>
                  </div>
                ) : (
                  <span className="pr-muted">Approved</span>
                )}
              </td>
            </tr>
          ))}
        </Table>
        {!batches.length && <Empty>Submit a payroll draft to start the approval review.</Empty>}
      </Card>
      {selected && (
        <Card title={`Payroll detail · ${selected.id}`} icon={ReceiptText}>
          <p className="pr-card-note">
            {periodName(selected.periodId)} · Review each employee’s gross pay, deductions, and net
            salary before approval.
          </p>
          <p className="pr-card-note">
            <b>HR context:</b>{' '}
            {selected.basis?.sourceText || 'No period HR basis was recorded for this batch.'}
            <br />
            <b>Calculation policy:</b>{' '}
            {selected.basis?.calculationPolicy ||
              'HR attendance/leave inputs are excluded pending policy confirmation.'}
          </p>
          <Card
            title={
              selected.type === 'Adjustment' ? 'Adjustment review' : 'Employee variance review'
            }
            icon={ReceiptText}
          >
            <p className="pr-card-note">
              {selected.type === 'Adjustment'
                ? `Adjustment against source batch ${selected.adjustmentOf}. The source payroll remains unchanged.`
                : 'Each employee is compared with their most recent previous paid run. Explain every change; employees without a prior paid run need a first-payroll reason.'}
            </p>
            <Table
              headers={
                selected.type === 'Adjustment'
                  ? ['Employee', 'Source net', 'Adjustment', 'Recovery due', 'Reason']
                  : ['Employee', 'Previous paid net', 'Current net', 'Variance', 'Reason']
              }
            >
              {variances.map((variance) => {
                const requiresReason = varianceRequiresReason(variance)
                return (
                  <tr key={variance.employeeId}>
                    <td>
                      <b>{variance.employeeName}</b>
                      <small className="pr-cell-sub">{variance.employeeId}</small>
                    </td>
                    {selected.type === 'Adjustment' ? (
                      <>
                        <td>{money(variance.previousNet)}</td>
                        <td>{money(Math.abs(variance.varianceAmount))}</td>
                        <td>
                          {variance.varianceAmount < 0
                            ? money(Math.abs(variance.varianceAmount))
                            : '—'}
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          {variance.previousNet === null
                            ? 'No previous paid run'
                            : money(variance.previousNet)}
                        </td>
                        <td>{money(variance.currentNet)}</td>
                        <td>
                          {variance.varianceAmount === null
                            ? 'No baseline'
                            : `${variance.varianceAmount > 0 ? '+' : ''}${money(variance.varianceAmount)}`}
                        </td>
                      </>
                    )}
                    <td>
                      {requiresReason ? (
                        <input
                          aria-label={`Reason for variance ${variance.employeeName}`}
                          value={variance.reason || ''}
                          onChange={(event) =>
                            saveVarianceReason(selected.id, variance.employeeId, event.target.value)
                          }
                        />
                      ) : (
                        <span className="pr-muted">No net change</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </Table>
          </Card>
          <Card title="Calculation detail" icon={ReceiptText}>
            <PayslipTable slips={selected.payslips} />
          </Card>
        </Card>
      )}
    </>
  )
}
