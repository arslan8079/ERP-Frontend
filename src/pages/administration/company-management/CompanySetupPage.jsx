import { useState, useRef, useEffect } from 'react'
import { loadCompanySetup, companySetupStorageKey } from '../../../App.jsx'
import {
  Building2,
  Printer,
  ArrowDownToLine,
  FileText,
  Leaf,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  Save,
  Pencil,
} from 'lucide-react'

export default function CompanySetupPage({ onSaved, onDirtyChange, onOpenDocuments }) {
  const [loadedSetup] = useState(loadCompanySetup)
  const [profile, setProfile] = useState(loadedSetup.profile)
  const [logo, setLogo] = useState(loadedSetup.logo)
  const [savedProfile, setSavedProfile] = useState(loadedSetup.profile)
  const [savedLogo, setSavedLogo] = useState(loadedSetup.logo)
  const [hasSavedProfile, setHasSavedProfile] = useState(loadedSetup.hasSavedProfile)
  const [editing, setEditing] = useState(!loadedSetup.hasSavedProfile)
  const [formError, setFormError] = useState(loadedSetup.error)
  const logoReader = useRef(null)
  const hasUnsavedChanges =
    JSON.stringify(profile) !== JSON.stringify(savedProfile) || logo !== savedLogo

  useEffect(() => {
    onDirtyChange(editing && hasUnsavedChanges)
  }, [editing, hasUnsavedChanges, onDirtyChange])

  const updateProfile = (event) => {
    const { name, value, checked, type } = event.target
    setProfile((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setFormError('')
  }
  const handleLogo = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ''
    logoReader.current?.abort()
    if (!file.type.startsWith('image/')) {
      setFormError('Please choose a valid image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setFormError('The logo must be 2 MB or smaller.')
      return
    }
    const reader = new FileReader()
    logoReader.current = reader
    reader.onload = () => {
      if (logoReader.current !== reader) return
      logoReader.current = null
      if (typeof reader.result !== 'string') {
        setFormError('The selected logo could not be read. Please try another image.')
        return
      }
      setLogo(reader.result)
      setFormError('')
    }
    reader.onerror = () => {
      if (logoReader.current !== reader) return
      logoReader.current = null
      setFormError('The selected logo could not be read. Please try another image.')
    }
    reader.readAsDataURL(file)
  }
  const cancelChanges = () => {
    logoReader.current?.abort()
    logoReader.current = null
    setProfile(savedProfile)
    setLogo(savedLogo)
    setEditing(false)
    setFormError('')
  }
  const saveForm = (event) => {
    event.preventDefault()
    const requiredFields = [
      ['companyName', 'Company name'],
      ['shortName', 'Short name'],
      ['phone', 'Phone'],
      ['email', 'Email'],
      ['address', 'Address'],
    ]
    const missingField = requiredFields.find(([field]) => !profile[field].trim())
    if (missingField) {
      setFormError(`${missingField[1]} is required.`)
      event.currentTarget.elements.namedItem(missingField[0])?.focus()
      return
    }

    try {
      window.localStorage.setItem(companySetupStorageKey, JSON.stringify({ profile, logo }))
    } catch (error) {
      console.error('Unable to save company settings:', error)
      setFormError(
        'Company details could not be saved. Check available browser storage and try again.',
      )
      return
    }
    setSavedProfile(profile)
    setSavedLogo(logo)
    setHasSavedProfile(true)
    setEditing(false)
    setFormError('')
    onDirtyChange(false)
    onSaved('Company settings saved')
  }
  const exportProfile = () => {
    const rows = [
      ['Company Name', profile.companyName],
      ['Short Name', profile.shortName],
      ['NTN / Tax Number', profile.taxNumber],
      ['Registration Number', profile.registrationNumber],
      ['Phone', profile.phone],
      ['Email', profile.email],
      ['Registered Address', profile.address],
    ]
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\r\n')
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'company-profile.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <form
      className="company-setup-page"
      aria-labelledby="company-details-heading"
      onSubmit={saveForm}
    >
      <div className="company-settings-grid">
        <section
          className="company-card company-profile-card"
          aria-labelledby="company-details-heading"
        >
          <div className="company-profile-heading">
            <h2 id="company-details-heading">
              <Building2 size={20} />
              Company Profile
            </h2>
            <div className="company-profile-toolbar">
              <button type="button" onClick={() => window.print()}>
                <Printer size={15} />
                Print
              </button>
              <button type="button" onClick={exportProfile}>
                <ArrowDownToLine size={15} />
                Export
              </button>
              <button type="button" onClick={onOpenDocuments}>
                <FileText size={15} />
                View Documents
              </button>
            </div>
          </div>
          {formError && (
            <p className="company-form-error" role="alert">
              {formError}
            </p>
          )}
          <div className="company-profile-content">
            <div className="company-fields">
              <div className="company-field-grid">
                <label className="company-field">
                  <span>
                    Company Name <b>*</b>
                  </span>
                  <input
                    name="companyName"
                    value={profile.companyName}
                    onChange={updateProfile}
                    autoComplete="organization"
                    required
                    disabled={!editing}
                  />
                </label>
                <label className="company-field">
                  <span>
                    Short Name <b>*</b>
                  </span>
                  <input
                    name="shortName"
                    value={profile.shortName}
                    onChange={updateProfile}
                    required
                    disabled={!editing}
                  />
                </label>
                <label className="company-field">
                  <span>NTN / Tax Number</span>
                  <input
                    name="taxNumber"
                    value={profile.taxNumber}
                    onChange={updateProfile}
                    disabled={!editing}
                  />
                </label>
                <label className="company-field">
                  <span>Registration Number</span>
                  <input
                    name="registrationNumber"
                    value={profile.registrationNumber}
                    onChange={updateProfile}
                    disabled={!editing}
                  />
                </label>
                <label className="company-field">
                  <span>
                    Phone <b>*</b>
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={updateProfile}
                    autoComplete="tel"
                    required
                    disabled={!editing}
                  />
                </label>
                <label className="company-field">
                  <span>
                    Email <b>*</b>
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={updateProfile}
                    autoComplete="email"
                    required
                    disabled={!editing}
                  />
                </label>
              </div>
            </div>
            <aside className="company-logo-column">
              <span className="logo-column-title">Company Logo</span>
              <div className="company-logo-preview">
                {logo ? (
                  <img src={logo} alt="Uploaded company logo" />
                ) : (
                  <div className="default-company-logo">
                    <Leaf size={45} fill="currentColor" />
                    <strong>GreenField</strong>
                    <span>Agrochemicals (Pvt.) Ltd.</span>
                  </div>
                )}
              </div>
              <input
                id="company-logo-upload"
                className="logo-file-input"
                type="file"
                accept="image/*"
                aria-label="Upload company logo"
                onChange={handleLogo}
                disabled={!editing}
              />
              <label
                className={`logo-upload-button ${!editing ? 'is-disabled' : ''}`}
                htmlFor="company-logo-upload"
              >
                <Upload size={16} />
                {logo ? 'Change Logo' : 'Upload Logo'}
              </label>
              <button
                type="button"
                className="logo-remove-button"
                disabled={!editing || !logo}
                onClick={() => {
                  logoReader.current?.abort()
                  logoReader.current = null
                  setLogo('')
                  setFormError('')
                }}
              >
                <Trash2 size={16} />
                Remove Logo
              </button>
              <span className="logo-help">
                Recommended: 400 × 200 px
                <br />
                (JPG, PNG, up to 2 MB)
              </span>
            </aside>
          </div>
          <label className="company-address-section">
            <span>
              Registered Address <b>*</b>
            </span>
            <textarea
              name="address"
              value={profile.address}
              onChange={updateProfile}
              autoComplete="street-address"
              rows="2"
              required
              disabled={!editing}
            />
          </label>
        </section>
      </div>

      <footer className="company-form-actions">
        <span
          className={`company-saved-state ${editing && hasUnsavedChanges ? 'is-unsaved' : ''}`}
          role="status"
          aria-live="polite"
        >
          {editing && hasUnsavedChanges ? (
            <>
              <AlertTriangle size={16} />
              Unsaved changes
            </>
          ) : hasSavedProfile ? (
            <>
              <CheckCircle2 size={16} />
              Saved
            </>
          ) : null}
        </span>
        <div className="company-form-buttons">
          {editing ? (
            <>
              <button type="button" className="company-cancel-button" onClick={cancelChanges}>
                <X size={16} />
                Cancel
              </button>
              <button type="submit" className="company-save-button" disabled={!hasUnsavedChanges}>
                <Save size={17} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              className="company-edit-button"
              onClick={() => {
                setEditing(true)
                setFormError('')
              }}
            >
              <Pencil size={16} />
              Edit Details
            </button>
          )}
        </div>
      </footer>
    </form>
  )
}
