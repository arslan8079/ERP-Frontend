import { useState } from 'react'
import { CheckCircle2, ClipboardCheck, Clock3, Plus, Users } from 'lucide-react'
import * as Shared from '../shared'

const { today, formatDate, idFor, PageHeader, Button, Card, EmptyState, Table } = Shared
const clearanceNames = ['HR', 'Finance', 'IT', 'Assets']

export default function EmployeeExitClearance({
  data,
  updateData,
  employees,
  employeeName,
  onFinalizeExit,
  onNotify,
}) {
  const [exitForm, setExitForm] = useState({
    employeeId: employees.find((item) => item.status === 'Active')?.id || '',
    effectiveDate: today(),
    reason: '',
  })
  const [clearanceForm, setClearanceForm] = useState({
    caseId: data.exitCases.find((item) => item.status !== 'Completed')?.id || '',
    itemName: clearanceNames[0],
    status: 'Completed',
    note: '',
  })
  const eligibleEmployees = employees.filter(
    (employee) =>
      employee.status === 'Active' &&
      !data.exitCases.some(
        (item) => item.employeeId === employee.id && item.status !== 'Completed',
      ),
  )
  const openCases = data.exitCases.filter((item) => item.status !== 'Completed')
  const submitExit = (event) => {
    event.preventDefault()
    if (!exitForm.employeeId || !eligibleEmployees.some((item) => item.id === exitForm.employeeId))
      return onNotify('Choose an active employee without an open exit case.')
    if (!exitForm.effectiveDate || !exitForm.reason.trim())
      return onNotify('Enter an effective date and exit reason.')
    const now = new Date().toISOString()
    const record = {
      id: idFor('EXIT'),
      employeeId: exitForm.employeeId,
      effectiveDate: exitForm.effectiveDate,
      reason: exitForm.reason.trim(),
      status: 'In Progress',
      initiatedAt: now,
      clearances: clearanceNames.map((name) => ({
        name,
        status: 'Pending',
        note: '',
        updatedAt: '',
      })),
      history: [
        {
          id: idFor('EH'),
          action: 'Exit initiated',
          detail: `Effective ${formatDate(exitForm.effectiveDate)} · ${exitForm.reason.trim()}`,
          occurredAt: now,
        },
      ],
    }
    if (
      !updateData(
        (current) => ({ ...current, exitCases: [record, ...current.exitCases] }),
        'Employee exit case started',
      )
    )
      return
    setExitForm({ employeeId: '', effectiveDate: today(), reason: '' })
    setClearanceForm((current) => ({ ...current, caseId: record.id }))
  }
  const submitClearance = (event) => {
    event.preventDefault()
    if (!openCases.some((item) => item.id === clearanceForm.caseId))
      return onNotify('Choose an open exit case.')
    if (
      !clearanceNames.includes(clearanceForm.itemName) ||
      !['Completed', 'Pending'].includes(clearanceForm.status)
    )
      return onNotify('Choose a valid clearance area and state.')
    if (!clearanceForm.note.trim())
      return onNotify('Choose an exit case and enter a clearance note.')
    const now = new Date().toISOString()
    const saved = updateData(
      (current) => ({
        ...current,
        exitCases: current.exitCases.map((item) => {
          if (item.id !== clearanceForm.caseId || item.status === 'Completed') return item
          const clearances = item.clearances.map((clearance) =>
            clearance.name === clearanceForm.itemName
              ? {
                  ...clearance,
                  status: clearanceForm.status,
                  note: clearanceForm.note.trim(),
                  updatedAt: now,
                }
              : clearance,
          )
          const complete = clearances.every((clearance) => clearance.status === 'Completed')
          return {
            ...item,
            clearances,
            status: complete ? 'Clearance complete' : 'In Progress',
            history: [
              {
                id: idFor('EH'),
                action: `${clearanceForm.itemName} clearance ${clearanceForm.status.toLowerCase()}`,
                detail: clearanceForm.note.trim(),
                occurredAt: now,
              },
              ...(item.history || []),
            ],
          }
        }),
      }),
      'Clearance update saved',
    )
    if (saved) setClearanceForm((current) => ({ ...current, note: '' }))
  }
  const canFinalize = (item) =>
    item.status !== 'Completed' &&
    item.effectiveDate <= today() &&
    item.clearances.every((clearance) => clearance.status === 'Completed')

  return (
    <>
      <PageHeader
        title="Employee Exit & Clearance"
        subtitle="Track the effective exit date and HR, Finance, IT and Assets clearance before deactivation. Employees remain active in payroll until finalization."
        icon={ClipboardCheck}
      />
      <Card title="Start an employee exit" icon={Plus}>
        <form className="hr-inline-form" onSubmit={submitExit}>
          <label>
            <span>Active employee</span>
            <select
              required
              value={exitForm.employeeId}
              onChange={(event) => setExitForm({ ...exitForm, employeeId: event.target.value })}
            >
              <option value="">Select employee</option>
              {eligibleEmployees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.id}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Effective date</span>
            <input
              type="date"
              required
              value={exitForm.effectiveDate}
              onChange={(event) => setExitForm({ ...exitForm, effectiveDate: event.target.value })}
            />
          </label>
          <label>
            <span>Exit reason</span>
            <input
              required
              maxLength="400"
              value={exitForm.reason}
              onChange={(event) => setExitForm({ ...exitForm, reason: event.target.value })}
              placeholder="Record the reason"
            />
          </label>
          <Button type="submit" disabled={!eligibleEmployees.length}>
            <Plus size={15} />
            Start exit
          </Button>
        </form>
        {!eligibleEmployees.length && (
          <EmptyState text="No active employee is available for a new exit case." />
        )}
      </Card>
      <Card title="Update a clearance item" icon={CheckCircle2}>
        <form className="hr-inline-form" onSubmit={submitClearance}>
          <label>
            <span>Exit case</span>
            <select
              required
              value={clearanceForm.caseId}
              onChange={(event) =>
                setClearanceForm({ ...clearanceForm, caseId: event.target.value })
              }
            >
              <option value="">Select case</option>
              {openCases.map((item) => (
                <option key={item.id} value={item.id}>
                  {employeeName(item.employeeId)} · {item.id}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Clearance area</span>
            <select
              value={clearanceForm.itemName}
              onChange={(event) =>
                setClearanceForm({ ...clearanceForm, itemName: event.target.value })
              }
            >
              {clearanceNames.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>State</span>
            <select
              value={clearanceForm.status}
              onChange={(event) =>
                setClearanceForm({ ...clearanceForm, status: event.target.value })
              }
            >
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </label>
          <label>
            <span>Clearance note</span>
            <input
              required
              maxLength="400"
              value={clearanceForm.note}
              onChange={(event) => setClearanceForm({ ...clearanceForm, note: event.target.value })}
              placeholder="Record what was checked or why it was reopened"
            />
          </label>
          <Button type="submit" disabled={!openCases.length}>
            <CheckCircle2 size={15} />
            Save clearance
          </Button>
        </form>
        {!openCases.length && <EmptyState text="Start an exit case before recording clearance." />}
      </Card>
      <Card title={`Exit register · ${data.exitCases.length} cases`} icon={Users}>
        <Table
          headers={[
            'Employee / case',
            'Effective date',
            'Reason',
            'Clearance',
            'State',
            'History / action',
          ]}
        >
          {data.exitCases.map((item) => {
            const completed = item.clearances.filter(
              (clearance) => clearance.status === 'Completed',
            ).length
            return (
              <tr key={item.id}>
                <td>
                  <b>{employeeName(item.employeeId)}</b>
                  <small className="hr-cell-sub">{item.id}</small>
                </td>
                <td>{formatDate(item.effectiveDate)}</td>
                <td>{item.reason}</td>
                <td>
                  {completed} / {item.clearances.length}
                  {item.clearances.map((clearance) => (
                    <small className="hr-cell-sub" key={clearance.name}>
                      {clearance.name}: {clearance.status}
                      {clearance.note ? ` · ${clearance.note}` : ''}
                    </small>
                  ))}
                </td>
                <td>
                  <span className={`hr-status ${item.status.toLowerCase().replace(/ /g, '-')}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <details>
                    <summary>
                      <Clock3 size={14} /> {item.history?.length || 0} events
                    </summary>
                    <ul>
                      {(item.history || []).map((event) => (
                        <li key={event.id}>
                          <b>{event.action}</b> · {event.detail}
                          <small>{new Date(event.occurredAt).toLocaleString()}</small>
                        </li>
                      ))}
                    </ul>
                  </details>
                  {item.status !== 'Completed' && (
                    <Button
                      kind="secondary"
                      disabled={!canFinalize(item)}
                      onClick={() => onFinalizeExit(item.id)}
                    >
                      Finalize exit
                    </Button>
                  )}
                  {item.status !== 'Completed' && !canFinalize(item) && (
                    <small className="hr-cell-sub">
                      Finalization requires the effective date and all clearances.
                    </small>
                  )}
                </td>
              </tr>
            )
          })}
        </Table>
        {!data.exitCases.length && <EmptyState text="No employee exit cases have been started." />}
      </Card>
    </>
  )
}
