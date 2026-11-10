import { useState } from 'react'
import { ListChecks, Pencil, Plus } from 'lucide-react'
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

export default function AttendanceCorrections({
  data,
  updateData,
  employees,
  employeeName,
  onNotify,
}) {
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    date: today(),
    requestedStatus: 'Present',
    reason: '',
  })
  const submit = (event) => {
    event.preventDefault()
    if (!form.reason.trim()) return onNotify('Provide a reason for the attendance correction.')
    updateData(
      (current) => ({
        ...current,
        corrections: [
          {
            ...form,
            id: `AC-${String(Date.now()).slice(-6)}`,
            status: 'Pending',
            submittedAt: new Date().toISOString(),
          },
          ...current.corrections,
        ],
      }),
      'Correction request submitted',
    )
    setForm((current) => ({ ...current, reason: '' }))
  }
  const decide = (id, status) =>
    updateData((current) => {
      const correction = current.corrections.find((item) => item.id === id)
      if (!correction || correction.status !== 'Pending') return current
      const corrections = current.corrections.map((item) =>
        item.id === id ? { ...item, status } : item,
      )
      if (status !== 'Approved') return { ...current, corrections }
      const existing = current.attendance.find(
        (item) => item.employeeId === correction.employeeId && item.date === correction.date,
      )
      const record = {
        id: existing?.id || `${correction.date}-${correction.employeeId}`,
        employeeId: correction.employeeId,
        date: correction.date,
        status: correction.requestedStatus,
        checkIn: ['Present', 'Late'].includes(correction.requestedStatus)
          ? existing?.checkIn || '09:00'
          : '',
        checkOut: existing?.checkOut || '',
        note: `Correction ${correction.id}`,
      }
      return {
        ...current,
        corrections,
        attendance: existing
          ? current.attendance.map((item) => (item.id === existing.id ? record : item))
          : [record, ...current.attendance],
      }
    }, `Correction ${status.toLowerCase()}`)
  return (
    <>
      <PageHeader
        title="Attendance Corrections"
        subtitle="Review employee requests to correct an attendance record."
        icon={Pencil}
      />
      <Card title="Submit a correction request" icon={Pencil}>
        <form className="hr-inline-form" onSubmit={submit}>
          <label>
            <span>Employee</span>
            <select
              value={form.employeeId}
              onChange={(event) => setForm({ ...form, employeeId: event.target.value })}
            >
              {employees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Attendance date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </label>
          <label>
            <span>Correct status</span>
            <select
              value={form.requestedStatus}
              onChange={(event) => setForm({ ...form, requestedStatus: event.target.value })}
            >
              <option>Present</option>
              <option>Late</option>
              <option>Absent</option>
              <option>On Leave</option>
            </select>
          </label>
          <label>
            <span>Reason</span>
            <input
              required
              value={form.reason}
              onChange={(event) => setForm({ ...form, reason: event.target.value })}
              placeholder="Explain the correction"
            />
          </label>
          <Button type="submit">
            <Plus size={15} />
            Submit request
          </Button>
        </form>
      </Card>
      <Card title="Correction queue" icon={ListChecks}>
        <Table
          headers={[
            'Request',
            'Employee',
            'Date',
            'Requested status',
            'Reason',
            'Status',
            'Review',
          ]}
        >
          {data.corrections.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{employeeName(item.employeeId)}</td>
              <td>{formatDate(item.date)}</td>
              <td>{item.requestedStatus}</td>
              <td>{item.reason}</td>
              <td>
                <span className={`hr-status ${item.status.toLowerCase()}`}>{item.status}</span>
              </td>
              <td>
                {item.status === 'Pending' && (
                  <>
                    <button
                      className="hr-inline-action approve"
                      onClick={() => decide(item.id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="hr-inline-action reject"
                      onClick={() => decide(item.id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </Table>
        {!data.corrections.length && (
          <EmptyState text="No correction requests are waiting for review." />
        )}
      </Card>
    </>
  )
}
