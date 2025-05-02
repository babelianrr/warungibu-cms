/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { useMutation } from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'

export default function ModalConfirmationSync({ open, setOpen, product, status, title, message, refetch }) {
  const { mutate, isLoading } = useMutation(
    'sinkronisasi',
    () =>
      serverAuthAPI({
        url: `/admin/ppob/sync`,
        method: 'POST',
        // payload: {
        //   id: product.id,
        //   product_name: product.product_name,
        //   sell_price: product.sell_price,
        //   active:!status
        // },
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
      title={title}
      message={message}
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={() => mutate()}
    />
  )
}
