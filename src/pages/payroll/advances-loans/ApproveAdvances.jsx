import { ChevronRight, ClipboardCheck, ShieldCheck } from 'lucide-react'
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

export default function ApproveAdvancesPage({ data, employees, decideAdvance, onNavigate }) {
  const employeeName = (id) => employees.find((item) => item.id === id)?.name || 'Unknown employee'
  return (
    <>
      <PageHeader
        title="Approve Advances"
        subtitle="Review employee requests and authorize a payroll-recovered loan schedule."
        icon={ClipboardCheck}
        action={
          <Button kind="secondary" onClick={() => onNavigate('Loan Records')}>
            Loan records <ChevronRight size={15} />
          </Button>
        }
      />
      <Card
        title={`Pending approval · ${data.advances.filter((item) => item.status === 'Pending').length}`}
        icon={ShieldCheck}
      >
        <AdvanceTable
          advances={data.advances}
          employeeName={employeeName}
          actions={decideAdvance}
        />
        {!data.advances.length && <Empty>There are no advance requests to review.</Empty>}
      </Card>
    </>
  )
}
