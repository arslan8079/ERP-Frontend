import { useState } from 'react'
import { FileText, Plus, X } from 'lucide-react'
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

export default function EmployeeDocuments({ data, updateData, employees, employeeName, onNotify }) {
  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    name: '',
    category: 'Identity',
    issueDate: today(),
    expiryDate: '',
  })
  const add = (event) => {
    event.preventDefault()
    if (!form.name.trim()) return onNotify('Enter a document name before adding it.')
    updateData(
      (current) => ({
        ...current,
        documents: [
          {
            ...form,
            name: form.name.trim(),
            id: `DOC-${String(Date.now()).slice(-6)}`,
            status: 'Verified',
          },
          ...current.documents,
        ],
      }),
      'Employee document added',
    )
    setForm((current) => ({ ...current, name: '' }))
  }
  return (
    <>
      <PageHeader
        title="Employee Documents"
        subtitle="Keep identity, employment and certification records organized."
        icon={FileText}
      />
      <Card title={`Document register · ${data.documents.length}`} icon={FileText}>
        <form className="hr-inline-form" onSubmit={add}>
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
            <span>Document name</span>
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Degree certificate"
            />
          </label>
          <label>
            <span>Category</span>
            <select
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              <option>Identity</option>
              <option>Contract</option>
              <option>Education</option>
              <option>Training</option>
              <option>Other</option>
            </select>
          </label>
          <Button type="submit">
            <Plus size={15} />
            Add document
          </Button>
        </form>
        <Table
          headers={['Document', 'Employee', 'Category', 'Issue date', 'Expiry date', 'Status', '']}
        >
          {data.documents.map((document) => (
            <tr key={document.id}>
              <td>
                <b>{document.name}</b>
                <small className="hr-cell-sub">{document.id}</small>
              </td>
              <td>{employeeName(document.employeeId)}</td>
              <td>{document.category}</td>
              <td>{formatDate(document.issueDate)}</td>
              <td>{formatDate(document.expiryDate)}</td>
              <td>
                <span className="hr-status active">{document.status}</span>
              </td>
              <td>
                <button
                  className="hr-icon-button"
                  aria-label="Remove document"
                  onClick={() =>
                    updateData(
                      (current) => ({
                        ...current,
                        documents: current.documents.filter((item) => item.id !== document.id),
                      }),
                      'Document removed',
                    )
                  }
                >
                  <X size={15} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
