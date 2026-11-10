import { useState, useRef } from 'react'
import { initialCompanyDocuments } from '../../../App.jsx'
import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  FileText,
  Upload,
  Download,
  BadgeCheck,
  Filter,
  ArrowDownToLine,
  ChevronDown,
  ShieldCheck,
  CalendarDays,
  Search,
  RotateCcw,
  Eye,
  ClipboardList,
} from 'lucide-react'

export default function CompanyDocumentsPage({ onNotify }) {
  const [documents, setDocuments] = useState(initialCompanyDocuments)
  const [selectedId, setSelectedId] = useState(initialCompanyDocuments[0].id)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [department, setDepartment] = useState('All Departments')
  const [status, setStatus] = useState('All Status')
  const [showFilters, setShowFilters] = useState(true)
  const uploadRef = useRef(null)
  const selectedDocument = documents.find((document) => document.id === selectedId) || documents[0]
  const categories = [...new Set(documents.map((document) => document.category))]
  const departments = [...new Set(documents.map((document) => document.department))]
  const normalizedSearch = appliedSearch.toLowerCase()
  const filteredDocuments = documents.filter(
    (document) =>
      (!normalizedSearch ||
        `${document.name} ${document.reference} ${document.category} ${document.department}`
          .toLowerCase()
          .includes(normalizedSearch)) &&
      (category === 'All Categories' || document.category === category) &&
      (department === 'All Departments' || document.department === department) &&
      (status === 'All Status' || document.status === status),
  )
  const verifiedCount = documents.filter((document) => document.status === 'Verified').length
  const expiringCount = documents.filter((document) => document.status === 'Expiring Soon').length
  const pendingCount = documents.filter((document) =>
    ['Pending', 'Rejected'].includes(document.status),
  ).length
  const resetFilters = () => {
    setSearch('')
    setAppliedSearch('')
    setCategory('All Categories')
    setDepartment('All Departments')
    setStatus('All Status')
  }
  const downloadDocument = (document) => {
    if (!document?.file) return
    const url = URL.createObjectURL(document.file)
    const link = window.document.createElement('a')
    link.href = url
    link.download = document.file.name
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }
  const exportDocuments = () => {
    const rows = [
      [
        'Document Name',
        'Category',
        'Reference No.',
        'Uploaded On',
        'Expiry Date',
        'Department',
        'Status',
        'Version',
      ],
      ...filteredDocuments.map((document) => [
        document.name,
        document.category,
        document.reference,
        document.uploaded,
        document.expiry,
        document.department,
        document.status,
        document.version,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = window.document.createElement('a')
    link.href = url
    link.download = 'company-documents.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }
  const addFiles = (event) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    const uploadedOn = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date())
    const nextId = Math.max(0, ...documents.map((document) => document.id)) + 1
    const addedDocuments = files.map((file, index) => ({
      id: nextId + index,
      name: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
      category: 'Other',
      reference: `DOC-${String(nextId + index).padStart(4, '0')}`,
      uploaded: uploadedOn,
      expiry: '—',
      department: 'Administration',
      status: 'Pending',
      version: 'v1.0',
      note: 'New document uploaded and awaiting verification.',
      file,
    }))
    setDocuments((current) => [...addedDocuments, ...current])
    setSelectedId(addedDocuments[0].id)
    onNotify(`${files.length} document${files.length === 1 ? '' : 's'} uploaded`)
  }
  const verifySelected = () => {
    if (!selectedDocument || selectedDocument.status === 'Rejected') return
    setDocuments((current) =>
      current.map((document) =>
        document.id === selectedDocument.id
          ? { ...document, status: 'Verified', note: 'Document verified and approved.' }
          : document,
      ),
    )
    onNotify('Document verified')
  }
  const statusClass = (value) => value.toLowerCase().replaceAll(' ', '-')
  const statusIcon = (value) => {
    if (value === 'Verified') return <CheckCircle2 size={15} />
    if (value === 'Expiring Soon') return <Clock3 size={15} />
    return <AlertTriangle size={15} />
  }

  return (
    <div className="company-documents-page">
      <header className="documents-heading">
        <div className="documents-title">
          <span className="documents-title-icon">
            <FileText size={25} />
          </span>
          <div>
            <h1>Company Documents</h1>
            <p>Manage company records, licenses, certificates, and compliance documents.</p>
          </div>
        </div>
        <div className="documents-toolbar">
          <button
            type="button"
            className="documents-primary-action"
            onClick={() => uploadRef.current?.click()}
          >
            <Upload size={17} />
            Upload Document
          </button>
          <input
            ref={uploadRef}
            className="documents-file-input"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            multiple
            onChange={addFiles}
            aria-label="Upload company documents"
          />
          <button
            type="button"
            onClick={() => downloadDocument(selectedDocument)}
            disabled={!selectedDocument?.file}
          >
            <Download size={17} />
            Download
          </button>
          <button
            type="button"
            onClick={verifySelected}
            disabled={
              !selectedDocument ||
              selectedDocument.status === 'Verified' ||
              selectedDocument.status === 'Rejected'
            }
          >
            <BadgeCheck size={17} />
            Verify
          </button>
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            aria-pressed={showFilters}
          >
            <Filter size={17} />
            Filter
          </button>
          <button type="button" onClick={exportDocuments}>
            <ArrowDownToLine size={17} />
            Export <ChevronDown size={14} />
          </button>
        </div>
      </header>

      <section className="documents-summary" aria-label="Document summary">
        <article className="document-stat document-stat-total">
          <span className="document-stat-icon">
            <FileText size={22} />
          </span>
          <div>
            <span>Total Documents</span>
            <strong>{documents.length}</strong>
          </div>
        </article>
        <article className="document-stat document-stat-verified">
          <span className="document-stat-icon">
            <ShieldCheck size={23} />
          </span>
          <div>
            <span>Verified Documents</span>
            <strong>{verifiedCount}</strong>
          </div>
        </article>
        <article className="document-stat document-stat-expiring">
          <span className="document-stat-icon">
            <CalendarDays size={22} />
          </span>
          <div>
            <span>Expiring Soon</span>
            <strong>{expiringCount}</strong>
          </div>
        </article>
        <article className="document-stat document-stat-pending">
          <span className="document-stat-icon">
            <AlertTriangle size={22} />
          </span>
          <div>
            <span>Pending / Rejected</span>
            <strong>{pendingCount}</strong>
          </div>
        </article>
      </section>

      {showFilters && (
        <section className="documents-filters" aria-label="Filter documents">
          <label className="documents-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') setAppliedSearch(search.trim().toLowerCase())
              }}
              placeholder="Search document name, reference no. or keyword..."
            />
          </label>
          <label>
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>All Categories</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Department</span>
            <select value={department} onChange={(event) => setDepartment(event.target.value)}>
              <option>All Departments</option>
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All Status</option>
              {['Verified', 'Expiring Soon', 'Pending', 'Rejected'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="documents-search-button"
            onClick={() => setAppliedSearch(search.trim().toLowerCase())}
          >
            <Search size={16} />
            Search
          </button>
          <button type="button" className="documents-reset-button" onClick={resetFilters}>
            <RotateCcw size={16} />
            Reset
          </button>
        </section>
      )}

      <div className="documents-workspace">
        <section className="documents-list-card">
          <h2>
            <FileText size={17} />
            Documents List <span>{filteredDocuments.length} records</span>
          </h2>
          <div className="documents-table-wrap">
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Category</th>
                  <th>Reference No.</th>
                  <th>Uploaded On</th>
                  <th>Expiry Date</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document) => (
                  <tr
                    key={document.id}
                    className={document.id === selectedId ? 'selected' : ''}
                    onClick={() => setSelectedId(document.id)}
                  >
                    <td>
                      <span className="document-name-cell">
                        <FileText size={16} />
                        <span title={document.name}>{document.name}</span>
                      </span>
                    </td>
                    <td>{document.category}</td>
                    <td>{document.reference}</td>
                    <td>{document.uploaded}</td>
                    <td>{document.expiry}</td>
                    <td>{document.department}</td>
                    <td>
                      <span className={`document-status ${statusClass(document.status)}`}>
                        {statusIcon(document.status)}
                        {document.status}
                      </span>
                    </td>
                    <td>
                      <span className="document-row-actions">
                        <button
                          type="button"
                          aria-label={`View ${document.name}`}
                          title="View details"
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedId(document.id)
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Download ${document.name}`}
                          title="Download file"
                          disabled={!document.file}
                          onClick={(event) => {
                            event.stopPropagation()
                            downloadDocument(document)
                          }}
                        >
                          <Download size={15} />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
                {!filteredDocuments.length && (
                  <tr>
                    <td className="documents-empty" colSpan="8">
                      No documents match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="document-details-card">
          <h2>
            <FileText size={17} />
            Document Details
          </h2>
          {selectedDocument ? (
            <>
              <div className="document-detail-heading">
                <span className="document-file-icon">
                  <FileText size={31} />
                  <b>{selectedDocument.file?.name.split('.').pop()?.toUpperCase() || 'PDF'}</b>
                </span>
                <div>
                  <h3>{selectedDocument.name}</h3>
                  <span>
                    <FileText size={14} />
                    {selectedDocument.reference}
                  </span>
                  <span>{selectedDocument.category}</span>
                </div>
              </div>
              <dl className="document-detail-list">
                <div>
                  <dt>Uploaded On</dt>
                  <dd>{selectedDocument.uploaded}</dd>
                </div>
                <div>
                  <dt>Expiry Date</dt>
                  <dd>{selectedDocument.expiry}</dd>
                </div>
                <div>
                  <dt>Department</dt>
                  <dd>{selectedDocument.department}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={`document-status ${statusClass(selectedDocument.status)}`}>
                      {statusIcon(selectedDocument.status)}
                      {selectedDocument.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Version</dt>
                  <dd>
                    {selectedDocument.version}
                    {selectedDocument.status === 'Verified' ? ' (Latest)' : ''}
                  </dd>
                </div>
              </dl>
              <section className="document-note">
                <h3>
                  <ClipboardList size={16} />
                  Note
                </h3>
                <p>{selectedDocument.note}</p>
              </section>
              {selectedDocument.file && (
                <button
                  type="button"
                  className="document-detail-download"
                  onClick={() => downloadDocument(selectedDocument)}
                >
                  <Download size={16} />
                  Download attached file
                </button>
              )}
            </>
          ) : (
            <p className="document-empty-detail">Select a document to view its details.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
