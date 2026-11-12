import { useState } from 'react'
import fieldBanner from '../../../field-banner.svg'
import {
  Building2,
  ArrowLeft,
  MapPin,
  Users,
  Phone,
  Mail,
  Check,
  Info,
  GitBranch,
} from 'lucide-react'

export default function CreateBranchPage({
  branches,
  onNavigate,
  onCreateBranch,
  onUpdateBranch,
  branch,
}) {
  const isEditMode = Boolean(branch)
  const [branchName, setBranchName] = useState(branch?.name || '')
  const [city, setCity] = useState(branch?.location?.split(',')[0]?.trim() || '')
  const [province, setProvince] = useState(branch?.location?.split(',')[1]?.trim() || 'Punjab')
  const [manager, setManager] = useState(branch?.manager || '')
  const [phone, setPhone] = useState(branch?.phone || '')
  const [email, setEmail] = useState(branch?.email || '')
  const [address, setAddress] = useState(branch?.address || '')
  const [status, setStatus] = useState(branch?.status || 'Active')
  const nextNumber =
    branches.reduce((max, item) => Math.max(max, Number(item.code.replace('BR-', '')) || 0), 0) + 1
  const branchCode = branch?.code || `BR-${String(nextNumber).padStart(3, '0')}`

  const submitBranch = (event) => {
    event.preventDefault()
    const normalizedBranch = {
      name: branchName.trim(),
      location: `${city.trim()}, ${province}`,
      manager: manager.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      status,
      employees: branch?.employees || 0,
    }
    if (isEditMode) {
      onUpdateBranch(branch.code, normalizedBranch)
      return
    }
    onCreateBranch(normalizedBranch)
  }

  return (
    <div className="branch-list-page branch-create-page">
      <header className="branch-list-banner">
        <img src={fieldBanner} alt="" />
        <div className="branch-list-banner-content">
          <Building2 size={39} strokeWidth={2.2} />
          <div>
            <h1>{isEditMode ? 'Edit Branch' : 'Create Branch'}</h1>
            <p>
              {isEditMode
                ? 'Update branch details and maintain the current company network.'
                : 'Add a new location to your company network'}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="branch-back-button"
          onClick={() => onNavigate(isEditMode ? 'Branch Details' : 'Branch List')}
        >
          <ArrowLeft size={16} />
          {isEditMode ? 'Branch Details' : 'Branch List'}
        </button>
      </header>
      <div className="branch-create-layout">
        <form className="branch-form-card" onSubmit={submitBranch}>
          <div className="branch-form-heading">
            <div className="branch-form-heading-icon">
              <Building2 size={19} />
            </div>
            <div>
              <h2>Branch information</h2>
              <p>Enter the details for this company location.</p>
            </div>
          </div>
          <div className="branch-form-grid">
            <label className="branch-form-field">
              <span>
                Branch Name <b>*</b>
              </span>
              <input
                autoFocus
                required
                maxLength="80"
                value={branchName}
                onChange={(event) => setBranchName(event.target.value)}
                placeholder="e.g. Faisalabad Branch"
              />
            </label>
            <label className="branch-form-field">
              <span>Branch Code</span>
              <input value={branchCode} readOnly aria-readonly="true" />
              <small>{isEditMode ? 'Current branch identifier' : 'Generated automatically'}</small>
            </label>
            <label className="branch-form-field">
              <span>
                City <b>*</b>
              </span>
              <span className="branch-input-with-icon">
                <MapPin size={16} />
                <input
                  required
                  maxLength="60"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Enter city"
                />
              </span>
            </label>
            <label className="branch-form-field">
              <span>
                Province / Region <b>*</b>
              </span>
              <select
                required
                value={province}
                onChange={(event) => setProvince(event.target.value)}
              >
                <option>Punjab</option>
                <option>Sindh</option>
                <option>Khyber Pakhtunkhwa</option>
                <option>Balochistan</option>
                <option>Islamabad Capital Territory</option>
                <option>Azad Jammu and Kashmir</option>
                <option>Gilgit-Baltistan</option>
              </select>
            </label>
            <label className="branch-form-field branch-form-full">
              <span>Street Address</span>
              <textarea
                rows="3"
                maxLength="240"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Building, street, industrial area (optional)"
              />
            </label>
          </div>
          <div className="branch-form-section-heading">
            <Users size={17} />
            <div>
              <h2>Branch contact</h2>
              <p>Set a manager and contact details for this location.</p>
            </div>
          </div>
          <div className="branch-form-grid">
            <label className="branch-form-field">
              <span>
                Branch Manager <b>*</b>
              </span>
              <input
                required
                maxLength="80"
                value={manager}
                onChange={(event) => setManager(event.target.value)}
                placeholder="Manager full name"
              />
            </label>
            <label className="branch-form-field">
              <span>Contact Number</span>
              <span className="branch-input-with-icon">
                <Phone size={15} />
                <input
                  type="tel"
                  maxLength="30"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+92 300 1234567"
                />
              </span>
            </label>
            <label className="branch-form-field">
              <span>Email Address</span>
              <span className="branch-input-with-icon">
                <Mail size={15} />
                <input
                  type="email"
                  maxLength="120"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="branch@company.com"
                />
              </span>
            </label>
            <label className="branch-form-field">
              <span>Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
          </div>
          <div className="branch-form-actions">
            <span>
              <b>*</b> Required fields
            </span>
            <div>
              <button
                type="button"
                className="branch-cancel-button"
                onClick={() => onNavigate(isEditMode ? 'Branch Details' : 'Branch List')}
              >
                Cancel
              </button>
              <button type="submit" className="branch-save-button">
                <Check size={17} />
                {isEditMode ? 'Save Changes' : 'Create Branch'}
              </button>
            </div>
          </div>
        </form>
        <aside className="branch-create-aside">
          <section className="branch-create-tip">
            <div>
              <Info size={17} />
              <h3>Before you create</h3>
            </div>
            <p>
              {isEditMode
                ? 'Branch identity and contact details are updated in place and kept traceable.'
                : 'Branch codes are assigned automatically and cannot be changed after creation.'}
            </p>
            <p>Inactive branches remain in your records and can be reactivated at any time.</p>
          </section>
          <section className="branch-create-preview">
            <span>{isEditMode ? 'CURRENT BRANCH CODE' : 'NEW BRANCH CODE'}</span>
            <strong>
              <GitBranch size={16} />
              {branchCode}
            </strong>
            <small>{isEditMode ? 'Branch identifier' : 'Next available code'}</small>
          </section>
        </aside>
      </div>
    </div>
  )
}
