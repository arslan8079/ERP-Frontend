import { CalendarCheck, Clock3 } from 'lucide-react'
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

export default function ShiftAssignments({ data, updateData, employees, employeeName, onNotify }) {
  const activeShifts = data.shifts.filter((item) => item.status === 'Active')
  const assign = (employeeId, shiftId) =>
    updateData(
      (current) => ({
        ...current,
        rosters: current.rosters.some((item) => item.employeeId === employeeId)
          ? current.rosters.map((item) =>
              item.employeeId === employeeId ? { ...item, shiftId } : item,
            )
          : [...current.rosters, { employeeId, shiftId }],
      }),
      'Shift assignment saved',
    )
  return (
    <>
      <PageHeader
        title="Shift Assignments"
        subtitle="Assign active shifts to employees and maintain daily coverage."
        icon={Clock3}
      />
      <Card title="Employee shift assignments" icon={CalendarCheck}>
        <Table headers={['Employee', 'Job title', 'Assigned shift', 'Shift hours', 'Work days']}>
          {employees.map((employee) => {
            const shiftId =
              data.rosters.find((item) => item.employeeId === employee.id)?.shiftId || ''
            const shift = activeShifts.find((item) => item.id === shiftId)
            return (
              <tr key={employee.id}>
                <td>
                  {employeeName(employee.id)}
                  <small className="hr-cell-sub">{employee.id}</small>
                </td>
                <td>{employee.role}</td>
                <td>
                  <select
                    className="hr-table-select"
                    aria-label={`Shift for ${employee.name}`}
                    value={shiftId}
                    onChange={(event) => assign(employee.id, event.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {activeShifts.map((item) => (
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
        {!activeShifts.length && (
          <EmptyState text="Create an active shift before assigning employees." />
        )}
      </Card>
    </>
  )
}
