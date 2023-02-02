import { useMutation } from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import { formatCurrency } from 'helpers/formatter'
import serverAuthAPI from 'API/serverAuthAPI'

// function BodyPayment({ order: { payment } }) {
//   return (
//     <dl className="sm:divide-y sm:divide-gray-200">
//       <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
//         <dt className="text-sm font-medium text-gray-500">Nama Bank</dt>
//         <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{payment.account_bank}</dd>
//       </div>
//       <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
//         <dt className="text-sm font-medium text-gray-500">Nomor Rekening</dt>
//         <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{payment.account_number}</dd>
//       </div>
//       <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
//         <dt className="text-sm font-medium text-gray-500">Nama Akun</dt>
//         <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{payment.account_name}</dd>
//       </div>
//       <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
//         <dt className="text-sm font-medium text-gray-500">Total Pembayaran</dt>
//         <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(payment.total_amount)}</dd>
//       </div>
//     </dl>
//   )
// }

export default function ModalPaymentConfirmation({ open, setOpen, order, refetch }) {
  const { mutate, isLoading } = useMutation(
    'confirm-payment',
    (payload) =>
      serverAuthAPI({
        url: `/admin/orders/${order.transaction_number}/complete_payment`,
        method: 'POST',
      }),
    {
      onSuccess() {
        setOpen(false)
        refetch()
      },
    }
  )
  return (
    <ConfirmationModal
      open={open}
      setOpen={setOpen}
      title="Konfirmasi Pembayaran"
      message="Apakah anda yakin untuk mengkonfirmasi pembayaran pesanan ini"
      confirmLabel="Konfirmasi"
      type="information"
      processing={isLoading}
      onConfirm={mutate}
      // Body={<BodyPayment order={order} />}
    />
  )
}
