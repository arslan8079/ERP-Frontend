import { employeePaidAmount } from './shared'

export function buildPaymentInstructions(batch, existingPayments, createId, date) {
  return batch.payslips.flatMap((slip) => {
    const employeePayments = existingPayments.filter(
      (payment) => payment.batchId === batch.id && payment.employeeId === slip.employeeId,
    )
    if (employeePayments.some((payment) => payment.status === 'Pending bank confirmation'))
      return []
    const amount = Math.max(
      0,
      Number(slip.net) - employeePaidAmount(batch.id, slip.employeeId, existingPayments),
    )
    if (!amount) return []
    const attempt = employeePayments.length + 1
    const id = createId()
    return [
      {
        id,
        batchId: batch.id,
        periodId: batch.periodId,
        employeeId: slip.employeeId,
        employeeName: slip.employeeName,
        amount,
        paidAmount: 0,
        method: 'Bank transfer instruction',
        reference: `PAYMENT-INSTRUCTION-${batch.periodId.replace('-', '')}-${slip.employeeId}-${String(attempt).padStart(2, '0')}`,
        date,
        status: 'Pending bank confirmation',
        attempt,
      },
    ]
  })
}
