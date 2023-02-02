import {useState} from 'react'
import {useMutation} from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'
import Input from 'components/base/Input'

function ReceiverInput({onChange}) {
  return (
    <div className="mt-4">
      <Input id="receiverName" label="Nama Penerima" type="text" onChange={onChange} />
    </div>
  )
}

export default function ModalDelivered({open, setOpen, order, refetch}) {
  const [receiverName, setReceiverName] = useState('')

  const {mutate, isLoading} = useMutation(
    'delivered-transaction',
    (receiverName) =>
      serverAuthAPI({
        url: `/admin/orders/${order.transaction_number}/delivered${
          order.payment.type === 'CASH_ON_DELIVERY' ? '?paid=true' : ''
        }`,
        method: 'POST',
        payload: {
          receiver_name: receiverName,
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
      title="Konfirmasi barang telah sampai"
      message="Apakah anda yakin untuk mengkonfirmasi barang telah sampai tujuan"
      confirmLabel="Konfirmasi"
      type="information"
      processing={isLoading}
      onConfirm={() => mutate(receiverName)}
      Body={<ReceiverInput onChange={setReceiverName} />}
    />
  )
}
