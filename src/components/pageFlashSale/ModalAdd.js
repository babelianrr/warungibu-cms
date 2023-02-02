import {useState, useEffect} from 'react'
import {isError, useMutation, useQuery} from 'react-query'
import {zonedTimeToUtc} from 'date-fns-tz'
import {subHours} from 'date-fns'
import debounce from 'lodash.debounce'
import {SearchIcon} from '@heroicons/react/outline'

import Input from 'components/base/Input'
import {Button, Modal} from 'components/base'
import {LoadingTable} from 'components/table'

import {createFlashSale} from 'API'

export default function ModalAdd({open, setOpen, refetch}) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const {mutate, isLoading, error, isError} = useMutation('create-flash-sale', (payload) => createFlashSale(payload), {
    onSuccess() {
      setOpen(false)
      refetch()
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    mutate({
      start_date: startDate,
      end_date: endDate,
      notes: name,
    })
  }
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="my-3 text-center flex-1 sm:text-left">
        <Modal.Title as="h3" className="text-lg leading-6 font-dayOne text-gray-900 mb-5">
          Buat Flash Sale
        </Modal.Title>
        <div className="mt-2 w-full">
          <form className="space-y-8" onSubmit={onSubmit}>
            <Input id="name" label="Nama Flash Sale" type="text" onChange={setName} />
            <Input id="name" label="Waktu Mulai Flash Sale" type="date" onChange={setStartDate} />
            <Input id="name" label="Waktu Selesai Sale" type="date" onChange={setEndDate} />

            <Button
              type={!name || !startDate || !endDate ? 'disabled' : isLoading ? 'processing' : 'submit'}
              className="w-full mb-1"
            >
              Buat Flash Sale
            </Button>
            {isError ? <span className="text-red-500">{error.message}</span> : null}
          </form>
        </div>
      </div>
    </Modal>
  )
}
