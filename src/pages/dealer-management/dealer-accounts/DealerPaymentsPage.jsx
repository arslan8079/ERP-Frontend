export default function DealerPaymentsPage({ context }) {
  const { recordPayment, dealerOptions, formPage, field, Banknote, today } = context
  const page = 'Dealer Payments'

  if (page === 'Dealer Payments')
    return formPage(
      'Receive dealer payment',
      'Post a receipt against a dealer account and keep the bank or cash reference for reconciliation.',
      Banknote,
      [
        field('Dealer', 'dealerId', {
          required: true,
          options: dealerOptions,
          placeholder: 'Select dealer',
        }),
        field('Receipt date', 'date', { required: true, type: 'date', value: today() }),
        field('Amount received (PKR)', 'amount', {
          required: true,
          type: 'number',
          min: 1,
          step: 1,
        }),
        field('Payment method', 'method', {
          required: true,
          options: (
            <>
              <option>Bank transfer</option>
              <option>Cash</option>
              <option>Cheque</option>
              <option>Online payment</option>
            </>
          ),
        }),
        field('Bank / instrument reference', 'reference', {
          required: true,
          placeholder: 'Transaction / cheque number',
        }),
        field('Notes', 'notes', {
          wide: true,
          textarea: true,
          placeholder: 'Optional payment notes',
        }),
      ],
      recordPayment,
      'Post receipt',
    )

  return null
}
