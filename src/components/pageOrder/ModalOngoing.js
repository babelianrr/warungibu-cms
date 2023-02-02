import { useState } from 'react'
import { useMutation } from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'
import Input from 'components/base/Input'

function FakturInput({ onChange }) {
  return (
    <div className="mt-4">
      <Input id="noFaktur" label="Nomor Faktur" type="text" onChange={onChange} />
    </div>
  )
}

export default function ModalOngoing({ open, setOpen, order, refetch }) {
  const [noFaktur, setNoFaktur] = useState('')

  const { mutate, isLoading } = useMutation(
    'ongoing-transaction',
    (noFaktur) =>
      serverAuthAPI({
        url: `/admin/orders/${order.transaction_number}/ongoing`,
        method: 'POST',
        payload: {
          faktur: noFaktur,
        },
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
      title="Konfirmasi Pengiriman"
      message="Apakah anda yakin untuk mengkonfirmasi pengiriman pesanan ini"
      confirmLabel="Konfirmasi"
      type="information"
      processing={isLoading}
      onConfirm={() => mutate(noFaktur)}
      Body={<FakturInput onChange={setNoFaktur} />}
    />
  )
}
