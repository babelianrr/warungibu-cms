import {useState, useEffect} from 'react'
import {useMutation} from 'react-query'
import {format} from 'date-fns'

import Input from 'components/base/Input'
import {Button, Modal} from 'components/base'

import {editFlashSale} from 'API'

export default function ModalEdit({open, setOpen, refetch, flashSale}) {
  const [name, setName] = useState(flashSale.notes)
  const [startDate, setStartDate] = useState(format(new Date(flashSale.start_date), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(flashSale.end_date), 'yyyy-MM-dd'))

  const {mutate, isLoading, error, isError} = useMutation(
    'edit-flash-sale',
    (payload) => editFlashSale(flashSale.id, payload),
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
      start_date: startDate,
      end_date: endDate,
      notes: name,
    })
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="my-3 text-center flex-1 sm:text-left">
        <Modal.Title as="h3" className="text-lg leading-6 font-dayOne text-gray-900 mb-5">
          Edit Flash Sale
        </Modal.Title>
        <div className="mt-2 w-full">
          <form className="space-y-8" onSubmit={onSubmit}>
            <Input id="name" label="Nama Flash Sale" type="text" defaultValue={name} onChange={setName} />
            <Input
              id="name"
              label="Waktu Mulai Flash Sale"
              type="date"
              defaultValue={startDate}
              onChange={setStartDate}
            />
            <Input id="name" label="Waktu Selesai Sale" type="date" defaultValue={endDate} onChange={setEndDate} />

            <Button
              type={!name || !startDate || !endDate ? 'disabled' : isLoading ? 'processing' : 'submit'}
              className="w-full mb-1"
            >
              Edit Flash Sale
            </Button>
            {isError ? <span className="text-red-500">{error.message}</span> : null}
          </form>
        </div>
      </div>
    </Modal>
  )
}
