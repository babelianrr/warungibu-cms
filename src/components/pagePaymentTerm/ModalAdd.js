import { useState, useEffect } from 'react'
import { isError, useMutation, useQuery } from 'react-query'
import { zonedTimeToUtc } from 'date-fns-tz'
import { subHours } from 'date-fns'
import debounce from 'lodash.debounce'
import { SearchIcon } from '@heroicons/react/outline'

import Input from 'components/base/Input'
import { Button, Modal } from 'components/base'
import { LoadingTable } from 'components/table'

import { createPaymentTerm } from 'API'

export default function ModalAdd({ open, setOpen, refetch }) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [daysDue, setDaysDue] = useState('')

  const { mutate, isLoading, error, isError } = useMutation('create-payment-term', (payload) => createPaymentTerm(payload), {
    onSuccess() {
      setOpen(false)
      refetch()
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    mutate({
      type: code,
      name: name,
      days_due: parseInt(daysDue),
      status: 'INACTIVE'
    })
  }
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="my-3 text-center flex-1 sm:text-left">
        <div className="mt-2 w-full">
          <form className="space-y-8" onSubmit={onSubmit}>
            <Input id="name" label="Kode" type="text" onChange={setCode} />
            <Input id="name" label="Nama" type="text" onChange={setName} />
            <Input id="name" label="Days Due" type="number" onChange={setDaysDue} />

            <Button
              type={!code || !name || !daysDue ? 'disabled' : isLoading ? 'processing' : 'submit'}
              className="w-full mb-1"
            >
              Save Payment Term
            </Button>
            {isError ? <span className="text-red-500">{error.message}</span> : null}
          </form>
        </div>
      </div>
    </Modal>
  )
}
