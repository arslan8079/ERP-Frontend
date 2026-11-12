export function buildPaymentInstructions(batch, existingPayments, createId, date) {
  const pendingSlips = batch.payslips.filter(
    (slip) =>
      !existingPayments.some(
        (payment) => payment.batchId === batch.id && payment.employeeId === slip.employeeId,
      ),
  )
  return pendingSlips.map((slip) => ({
    id: createId(),
    batchId: batch.id,
    periodId: batch.periodId,
    employeeId: slip.employeeId,
    employeeName: slip.employeeName,
    amount: slip.net,
    method: 'Bank transfer instruction',
    reference: `PAYMENT-INSTRUCTION-${batch.periodId.replace('-', '')}-${slip.employeeId}`,
    date,
    status: 'Pending bank confirmation',
  }))
}
