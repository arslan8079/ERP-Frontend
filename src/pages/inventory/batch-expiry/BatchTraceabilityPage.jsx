import {
  ArrowLeftRight,
  Boxes,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  ShieldCheck,
  Warehouse,
} from 'lucide-react'
import { Card, Stat, Table } from '../InventoryComponents'

export default function BatchTraceabilityPage({ context }) {
  const {
    data,
    search,
    warehouse,
    filtered,
    lookup,
    searchBox,
    tableExport,
    batchHeaders,
    batchRows,
    movementHeaders,
    movementRows,
    pageHeader,
  } = context
  const page = 'Batch Traceability'

  const records = filtered(
    data.movements,
    (item) =>
      `${item.batchNo} ${lookup(item.productId)} ${item.reference} ${item.note} ${warehouse(item.warehouseId)?.name}`,
  ).sort((a, b) => b.date.localeCompare(a.date))

  const batchMatches = data.batches.filter(
    (item) =>
      !search ||
      `${item.batchNo} ${lookup(item.productId)}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="inv-page">
      {pageHeader(
        page,
        'Trace a pesticide lot from receipt/opening through every warehouse, issue, transfer, and adjustment.',
        ShieldCheck,
        null,
        tableExport(
          page,
          movementHeaders,
          records.map((item) => [
            item.date,
            item.reference,
            item.type,
            lookup(item.productId),
            item.batchNo,
            warehouse(item.warehouseId)?.name,
            item.qty,
            item.note,
          ]),
        ),
      )}
      <div className="inv-toolbar">
        {searchBox}
        <span>{batchMatches.length} matching batch record(s)</span>
      </div>
      <div className="inv-stats compact">
        <Stat
          icon={FlaskConical}
          label="Matching lots"
          value={new Set(batchMatches.map((item) => item.batchNo)).size}
          note="Manufacturer lot numbers"
        />
        <Stat
          icon={Boxes}
          label="On hand"
          value={batchMatches.reduce((sum, item) => sum + Number(item.qty), 0)}
          note="All matching locations"
          tone="blue"
        />
        <Stat
          icon={ArrowLeftRight}
          label="Movement records"
          value={records.length}
          note="Complete transaction trail"
          tone="purple"
        />
        <Stat
          icon={CalendarDays}
          label="Earliest expiry"
          value={batchMatches.map((item) => item.expiry).sort()[0] || '—'}
          note="Check label before issue"
          tone="amber"
        />
      </div>
      <Card title={`Batch transaction lineage · ${records.length}`} icon={ClipboardList}>
        <Table headers={movementHeaders}>{movementRows(records)}</Table>
      </Card>
      <Card title="Current lot locations & status" icon={Warehouse}>
        <Table headers={batchHeaders}>{batchRows(batchMatches)}</Table>
      </Card>
    </div>
  )
}
