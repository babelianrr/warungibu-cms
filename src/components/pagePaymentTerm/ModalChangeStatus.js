import { useState } from 'react'
import { useMutation } from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'
import Input from 'components/base/Input'

export default function ModalChangeStatus({ open, setOpen, PaymentTermId, PaymentTermStatus, refetch }) {

  const {
    mutate: activatePaymentTerm,
    isLoading,
    isError,
  } = useMutation(
    'activate-payment-term',
    () =>
      serverAuthAPI({
        url: `/payment_terms/${PaymentTermId}`,
        method: 'PATCH',
        payload: {
          status: 'ACTIVE'
        }
      }),
    {
      onSuccess() {
        setOpen(false)
        refetch()
      },
    }
  )

  const {
    mutate: deactivatePaymentTerm,
    isLoading: deactivateIsloading
  } = useMutation(
    'deactivate-payment-term',
    () =>
      serverAuthAPI({
        url: `/payment_terms/${PaymentTermId}`,
        method: 'PATCH',
        payload: {
          status: 'INACTIVE'
        }
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
      mutate: deactivatePaymentTerm,
      title: 'Konfirmasi deaktivasi Payment Term',
      message: 'Apakah Anda yakin untuk deaktivasi payment term ini?',
      processing: deactivateIsloading,
    },
    INACTIVE: {
      mutate: activatePaymentTerm,
      title: 'Konfirmasi aktivasi Payment Term',
      message: 'Apakah Anda yakin untuk aktivasi payment term ini Hehe?',
      processing: isLoading,
    },
  }

  const { title, mutate, processing, message } = table[PaymentTermStatus]

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
