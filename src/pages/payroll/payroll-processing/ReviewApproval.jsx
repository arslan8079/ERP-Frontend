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
} = Shared

export default function ReviewPage({ data, setBatchStatus, periodName, onNavigate }) {
  const batches = data.batches.filter((item) => ['In Review', 'Reviewed'].includes(item.status))
  const [selectedId, setSelectedId] = useState('')
  const selected = batches.find((item) => item.id === selectedId) || batches[0]
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
                <Status>{batch.status}</Status>
              </td>
              <td>
                {batch.status === 'In Review' ? (
                  <div className="pr-row-actions">
                    <button
                      className="pr-inline-action approve"
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
          <PayslipTable slips={selected.payslips} />
        </Card>
      )}
    </>
  )
}
