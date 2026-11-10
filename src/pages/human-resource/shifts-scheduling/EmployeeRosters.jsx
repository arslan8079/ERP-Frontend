import { useState } from 'react'
import { CalendarCheck, CalendarDays, Users } from 'lucide-react'
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

export default function RosterPage({ data, updateData, employees, employeeName }) {
  const [date, setDate] = useState(today())
  const assign = (employeeId, shiftId) =>
    updateData(
      (current) => ({
        ...current,
        rosters: current.rosters.some((item) => item.employeeId === employeeId)
          ? current.rosters.map((item) =>
              item.employeeId === employeeId ? { ...item, shiftId, date } : item,
            )
          : [...current.rosters, { employeeId, shiftId, date }],
      }),
      'Employee roster updated',
    )
  return (
    <>
      <PageHeader
        title="Employee Rosters"
        subtitle="Review team shift coverage and assign employees to a schedule."
        icon={CalendarCheck}
        action={
          <label className="hr-select-employee">
            <CalendarDays size={15} />
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
        }
      />
      <Card title={`Roster · ${formatDate(date)}`} icon={Users}>
        <Table
          headers={['Employee', 'Department', 'Shift assignment', 'Working hours', 'Shift days']}
        >
          {employees.map((employee) => {
            const roster = data.rosters.find((item) => item.employeeId === employee.id)
            const shift = data.shifts.find((item) => item.id === roster?.shiftId)
            return (
              <tr key={employee.id}>
                <td>
                  {employeeName(employee.id)}
                  <small className="hr-cell-sub">{employee.id}</small>
                </td>
                <td>{employee.departmentCode}</td>
                <td>
                  <select
                    className="hr-table-select"
                    value={shift?.id || ''}
                    onChange={(event) => assign(employee.id, event.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {data.shifts
                      .filter((item) => item.status === 'Active')
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </td>
                <td>{shift ? `${shift.start}–${shift.end}` : '—'}</td>
                <td>{shift?.days || '—'}</td>
              </tr>
            )
          })}
        </Table>
      </Card>
    </>
  )
}
