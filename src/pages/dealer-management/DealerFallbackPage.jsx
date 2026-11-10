import { ArrowRight, BarChart3, FileText } from 'lucide-react'
import { dealerGroups } from './dealerNavigation'
import { PageHeader } from './DealerComponents'

export default function DealerFallbackPage({ onNavigate }) {
  const availablePages = (items) =>
    items.map((item) => (
      <button key={item} onClick={() => onNavigate(item)}>
        {item}
        <ArrowRight size={14} />
      </button>
    ))

  return (
    <div className="dealer-page">
      <PageHeader
        page="Dealer Management"
        subtitle="Explore dealer operations and sales performance."
        icon={BarChart3}
      />
      <div className="dealer-report-links">
        {dealerGroups.map((group) => (
          <section className="dealer-card" key={group.title}>
            <header>
              <span>
                <FileText size={16} />
                {group.title}
              </span>
            </header>
            <div className="dealer-report-link-list">{availablePages(group.items)}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
