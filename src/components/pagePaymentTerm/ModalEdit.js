import { useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import { format } from 'date-fns'

import Input from 'components/base/Input'
import { Button, Modal } from 'components/base'

import { updatePaymentTerms } from 'API'

export default function ModalEdit({ open, setOpen, refetch, PaymentTermId, PaymentTerm }) {
  const [code, setCode] = useState(PaymentTerm.type)
  const [name, setName] = useState(PaymentTerm.name)
  const [daysDue, setDaysDue] = useState(PaymentTerm.days_due)

  const { mutate, isLoading, error, isError } = useMutation(
    'edit-flash-sale',
    (payload) => updatePaymentTerms(PaymentTermId, payload),
    {
      onSuccess() {
        setOpen(false)
        refetch()
      },
    }
  )

  function onSubmit(e) {
    e.preventDefault()
    mutate({
      name: name,
      days_due: parseInt(daysDue)
    })
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="my-3 text-center flex-1 sm:text-left">
        <div className="mt-2 w-full">
          <form className="space-y-8" onSubmit={onSubmit}>
            <Input id="code" label="Kode" type="text" defaultValue={code} onChange={setCode} readOnly disabled />
            <Input id="name" label="Nama" type="text" defaultValue={name} onChange={setName} />
            <Input id="days_due" label="Days Due" type="number" defaultValue={daysDue} onChange={setDaysDue} />

            <Button
              type={!code || !name || !daysDue ? 'disabled' : isLoading ? 'processing' : 'submit'}
              className="w-full mb-1"
            >
              Update Payment Term
            </Button>
            {isError ? <span className="text-red-500">{error.message}</span> : null}
          </form>
        </div>
      </div>
    </Modal>
  )
}
