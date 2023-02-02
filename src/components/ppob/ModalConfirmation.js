import {useState} from 'react'
import {useMutation} from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'

export default function ModalConfirmation({open, setOpen, product, status, title, message, refetch, url}) {
  const {mutate, isLoading} = useMutation(
    'ppob-status',
    () =>
      serverAuthAPI({
        url: `/admin/ppob/update`,
        method: 'PATCH',
        payload: {
          id: product.id,
          product_name: product.product_name,
          sell_price: product.sell_price,
          active:!status
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
      title={title}
      message={message}
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={() => mutate()}
    />
  )
}
