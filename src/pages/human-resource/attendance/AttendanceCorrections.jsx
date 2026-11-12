import { useState } from 'react'
import { ListChecks, Pencil, Plus } from 'lucide-react'
import * as Shared from '../shared'

const {
  today,
  formatDate,
  daysBetween,
  idFor,
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
    if (!form.employeeId || !employees.some((item) => item.id === form.employeeId))
      return onNotify('Choose a valid employee.')
    if (!form.date || form.date > today())
      return onNotify('Attendance corrections cannot be future-dated.')
    if (!form.reason.trim()) return onNotify('Provide a reason for the attendance correction.')
    if (
      data.corrections.some(
        (item) =>
          item.employeeId === form.employeeId &&
          item.date === form.date &&
          item.status === 'Pending',
      )
    )
      return onNotify('A correction for this employee and date is already awaiting review.')
    const previousRecord = data.attendance.find(
      (item) => item.employeeId === form.employeeId && item.date === form.date,
    )
    if (
      updateData(
        (current) => ({
          ...current,
          corrections: [
            {
              ...form,
              id: idFor('AC'),
              previousStatus: previousRecord?.status || 'No record',
              previousCheckIn: previousRecord?.checkIn || '',
              previousCheckOut: previousRecord?.checkOut || '',
              status: 'Pending',
              submittedAt: new Date().toISOString(),
            },
            ...current.corrections,
          ],
        }),
        'Correction request submitted',
      )
    )
      setForm((current) => ({ ...current, reason: '' }))
  }
  const decide = (id, status) => {
    const correction = data.corrections.find((item) => item.id === id)
    if (!correction || correction.status !== 'Pending')
      return onNotify('This correction has already been reviewed.')
    const existing = data.attendance.find(
      (item) => item.employeeId === correction.employeeId && item.date === correction.date,
    )
    const currentStatus = existing?.status || 'No record'
    if (status === 'Approved' && currentStatus !== correction.previousStatus) {
      return updateData(
        (current) => ({
          ...current,
          corrections: current.corrections.map((item) =>
            item.id === id && item.status === 'Pending'
              ? {
                  ...item,
                  status: 'Stale',
                  currentStatusAtReview: currentStatus,
                  reviewedAt: new Date().toISOString(),
                  decisionNote: 'Attendance changed after this correction was submitted.',
                }
              : item,
          ),
        }),
        'Attendance changed after submission; submit a new correction request',
      )
    }
    updateData((current) => {
      const currentCorrection = current.corrections.find((item) => item.id === id)
      if (!currentCorrection || currentCorrection.status !== 'Pending') return current
      const currentRecord = current.attendance.find(
        (item) =>
          item.employeeId === currentCorrection.employeeId && item.date === currentCorrection.date,
      )
      const reviewedAt = new Date().toISOString()
      const corrections = current.corrections.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              currentStatusAtReview: currentRecord?.status || 'No record',
              reviewedAt,
            }
          : item,
      )
      if (status !== 'Approved') return { ...current, corrections }
      const record = {
        id: currentRecord?.id || `${currentCorrection.date}-${currentCorrection.employeeId}`,
        employeeId: currentCorrection.employeeId,
        date: currentCorrection.date,
        status: currentCorrection.requestedStatus,
        checkIn: ['Present', 'Late'].includes(currentCorrection.requestedStatus)
          ? currentRecord?.checkIn || '09:00'
          : '',
        checkOut: currentRecord?.checkOut || '',
        note: `Correction ${currentCorrection.id}`,
        correctionId: currentCorrection.id,
      }
      return {
        ...current,
        corrections,
        attendance: currentRecord
          ? current.attendance.map((item) => (item.id === currentRecord.id ? record : item))
          : [record, ...current.attendance],
      }
    }, `Correction ${status.toLowerCase()}`)
  }
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
              max={today()}
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
            'Recorded → requested',
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
              <td>
                {item.previousStatus || 'Legacy'} → {item.requestedStatus}
                {(item.previousCheckIn || item.previousCheckOut) && (
                  <small className="hr-cell-sub">
                    Prior times: {item.previousCheckIn || '—'} / {item.previousCheckOut || '—'}
                  </small>
                )}
                {item.currentStatusAtReview &&
                  item.currentStatusAtReview !== item.previousStatus && (
                    <small className="hr-cell-sub">At review: {item.currentStatusAtReview}</small>
                  )}
              </td>
              <td>{item.reason}</td>
              <td>
                <span className={`hr-status ${item.status.toLowerCase()}`}>{item.status}</span>
                {item.reviewedAt && (
                  <small className="hr-cell-sub">
                    Reviewed {formatDate(item.reviewedAt.slice(0, 10))}
                  </small>
                )}
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
