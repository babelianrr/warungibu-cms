import {useState} from 'react'
import {useMutation} from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'
import Input from 'components/base/Input'

export default function ModalEditFlashSale({open, setOpen, flashSaleId, status = 'ACTIVE', refetch}) {
  const {
    mutate: activateFlashSale,
    isLoading,
    isError,
  } = useMutation(
    'activate-flashsale',
    () =>
      serverAuthAPI({
        url: `/admin/flash-sales/${flashSaleId}/activate`,
        method: 'POST',
      }),
    {
      onSuccess() {
        setOpen(false)
        refetch()
      },
    }
  )

  const {mutate: deactivateFlashSale, isLoading: deactivateIsloading} = useMutation(
    'deactivate-flashsale',
    () =>
      serverAuthAPI({
        url: `/admin/flash-sales/${flashSaleId}/deactivate`,
        method: 'POST',
      }),
    {
      onSuccess() {
        setOpen(false)
        refetch()
      },
    }
  )

  const table = {
    ACTIVE: {
      mutate: deactivateFlashSale,
      title: 'Konfirmasi deaktifasi flash sale',
      message: 'Apakah anda yakin untuk deaktifasi flash sale ini',
      processing: deactivateIsloading,
    },
    INACTIVE: {
      mutate: activateFlashSale,
      title: 'Konfirmasi aktifasi flash sale',
      message: 'Apakah anda yakin untuk aktifasi flash sale ini',
      processing: isLoading,
    },
  }

  const {title, mutate, processing, message} = table[status]

  return (
    <ConfirmationModal
      open={open}
      setOpen={setOpen}
      title={title}
      message={message}
      type="information"
      confirmLabel="Konfirmasi"
      processing={processing}
      onConfirm={() => mutate()}
    />
  )
}
