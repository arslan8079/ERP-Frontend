import {
  BadgeDollarSign,
  CheckCircle2,
  ChevronRight,
  ListChecks,
  Plus,
  Users,
  Wallet,
} from 'lucide-react'
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

export default function SalaryStructuresPage({
  data,
  onNavigate,
  editStructure,
  toggleStructureStatus,
}) {
  return (
    <>
      <PageHeader
        title="Salary Structures"
        subtitle="Manage reusable compensation templates applied to employee payroll."
        icon={BadgeDollarSign}
        action={
          <Button onClick={() => onNavigate('Create Salary Structure')}>
            <Plus size={16} />
            Create structure
          </Button>
        }
      />
      <div className="pr-stats compact">
        <Stat icon={ListChecks} label="Total structures" value={data.structures.length} />
        <Stat
          icon={CheckCircle2}
          label="Active"
          value={data.structures.filter((item) => item.status === 'Active').length}
          tone="green"
        />
        <Stat icon={Users} label="Employees assigned" value={data.assignments.length} tone="blue" />
      </div>
      <Card title={`Compensation templates · ${data.structures.length}`} icon={Wallet}>
        <Table
          headers={[
            'Structure',
            'Basic pay',
            'Allowances',
            'Deductions',
            'Assigned staff',
            'Status',
            '',
          ]}
        >
          {data.structures.map((item) => {
            const assigned = data.assignments.filter((row) => row.structureId === item.id).length
            return (
              <tr key={item.id}>
                <td>
                  <b>{item.name}</b>
                  <small className="pr-cell-sub">{item.id}</small>
                </td>
                <td>{item.basicPercent}% of gross base</td>
                <td>{item.allowances.map((value) => value.name).join(', ') || '—'}</td>
                <td>{item.deductions.map((value) => value.name).join(', ') || '—'}</td>
                <td>{assigned}</td>
                <td>
                  <Status>{item.status}</Status>
                </td>
                <td>
                  <button
                    className="pr-link"
                    onClick={() => onNavigate('Employee Salary Assignment')}
                  >
                    Assign <ChevronRight size={14} />
                  </button>
                  <button className="pr-link" onClick={() => editStructure(item.id)}>
                    Edit
                  </button>
                  <button className="pr-link" onClick={() => toggleStructureStatus(item.id)}>
                    {item.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            )
          })}
        </Table>
      </Card>
      <Card title="Salary structure change history" icon={ListChecks}>
        <Table headers={['Date', 'Structure', 'Change', 'Details']}>
          {(data.masterHistory || [])
            .filter((item) => item.entityType === 'Salary structure')
            .slice(0, 20)
            .map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.entityName}</td>
                <td>{item.action}</td>
                <td>{item.details}</td>
              </tr>
            ))}
        </Table>
      </Card>
      <Callout
        title="Compensation workflow"
        text="Create a structure, assign it to employees with an effective date, then open a pay period to calculate their gross pay, deductions and net salary."
      />
    </>
  )
}
