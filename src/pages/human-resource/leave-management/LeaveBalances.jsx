import { useState } from 'react'
import { CalendarDays, Filter, ListChecks } from 'lucide-react'
import * as Shared from '../shared'

const {
  today,
  formatDate,
  daysBetween,
  PageHeader,
  Button,
  Stat,
  Card,
  EmptyState,
  Table,
  MetricBar,
  LeaveRequestTable,
  downloadCsv,
} = Shared

export default function LeaveBalancesPage({ data, employees }) {
  const [typeId, setTypeId] = useState('All leave types')
  const rows = employees.flatMap((employee) =>
    data.leaveTypes
      .filter(
        (type) => type.status === 'Active' && (typeId === 'All leave types' || type.id === typeId),
      )
      .map((type) => {
        const used = data.leaveRequests
          .filter(
            (request) =>
              request.employeeId === employee.id &&
              request.typeId === type.id &&
              request.status === 'Approved',
          )
          .reduce((sum, request) => sum + request.days, 0)
        return { employee, type, used, remaining: Math.max(0, type.days - used) }
      }),
  )
  return (
    <>
      <PageHeader
        title="Leave Balances"
        subtitle="Annual entitlements and approved leave used by employee."
        icon={CalendarDays}
      />
      <Card
        title="Balance register"
        icon={ListChecks}
        action={
          <label className="hr-select-employee">
            <Filter size={15} />
            <select value={typeId} onChange={(event) => setTypeId(event.target.value)}>
              <option>All leave types</option>
              {data.leaveTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        }
      >
        <Table headers={['Employee', 'Leave type', 'Entitlement', 'Used', 'Available']}>
          {rows.map(({ employee, type, used, remaining }) => (
            <tr key={`${employee.id}-${type.id}`}>
              <td>
                {employee.name}
                <small className="hr-cell-sub">{employee.id}</small>
              </td>
              <td>{type.name}</td>
              <td>{type.days} days</td>
              <td>{used} days</td>
              <td>
                <b className={remaining < 3 ? 'hr-warning-text' : ''}>{remaining} days</b>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
