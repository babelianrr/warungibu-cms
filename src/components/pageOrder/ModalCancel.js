import {useState} from 'react'
import {useMutation} from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'
import Input from 'components/base/Input'

export default function ModalCancel({open, setOpen, order, refetch}) {
  const {mutate, isLoading} = useMutation(
    'cancel-order',
    () =>
      serverAuthAPI({
        url: `/admin/orders/${order.transaction_number}/cancel`,
        method: 'POST',
        payload: {},
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
      title="Konfirmasi pembatalan pesanan"
      message="Apakah anda yakin untuk membatalkan pesanan ini"
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={() => mutate()}
    />
  )
}
