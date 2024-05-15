import { useState } from 'react'
import { useHistory } from 'react-router'
import { useMutation, useQuery } from 'react-query'
import { PlusIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'

import { ReactTable, LoadingTable } from 'components/table'
import { LoadingPage, ErrorPage } from 'components/base'
import ColoredLabel from 'components/base/ColoredLabel'
import ModalProductFlashSale from 'components/pageFlashSale/ModalProductFlashSale'
import ModalEditFlashSale from 'components/pageFlashSale/ModalEditFlashSale'
import ModalEdit from 'components/pageFlashSale/ModalEdit'
import ModalAdd from 'components/pageFlashSale/ModalAdd'

import { fetchFlashsale } from 'API'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'

function FlashSaleAction({ flashSaleId, flashSale, refetch }) {
  const [open, setOpen] = useState(false)
  const [editFlashSale, setEditFlashSale] = useState(false)
  const [edit, setEdit] = useState(false)

  return (
    <>
      <ModalProductFlashSale
        open={open}
        setOpen={setOpen}
        flashSaleId={flashSaleId}
        flashSale={flashSale}
        refetch={refetch}
      />

      <ModalEditFlashSale
        open={editFlashSale}
        setOpen={setEditFlashSale}
        flashSaleId={flashSaleId}
        status={flashSale.status}
        refetch={refetch}
      />

      <ModalEdit open={edit} setOpen={setEdit} flashSale={flashSale} refetch={refetch} />

      <div className="space-y-2">
        <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setOpen(true)}>
          Lihat product
        </div>

        <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setEdit(true)}>
          Edit
        </div>

        {flashSale.status === 'INACTIVE' && new Date() > new Date(flashSale.start_date) ? (
          <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setEditFlashSale(true)}>
            Aktivasi
          </div>
        ) : flashSale.status === 'ACTIVE' ? (
          <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setEditFlashSale(true)}>
            Deaktivikasi
          </div>
        ) : null}
      </div>
    </>
  )
}

export default function FlashSale() {
  const history = useHistory()
  const [openAddModal, setOpenAddModal] = useState(false)

  const { data, isLoading, isError, error, refetch } = useQuery('flash-sale-list', fetchFlashsale, {
    select(response) {
      return response.map((flashSale) => ({
        name: <span className="text-dnr-dark-orange hover:underline cursor-pointer">{flashSale.notes}</span>,
        start_date: format(new Date(flashSale.start_date), 'dd/MM/yyyy'),
        end_date: format(new Date(flashSale.end_date), 'dd/MM/yyyy'),
        status: <ColoredLabel color={flashSale.status === 'ACTIVE' ? 'green' : 'red'} text={flashSale.status} />,
        action: <FlashSaleAction flashSaleId={flashSale.id} flashSale={flashSale} refetch={() => refetch()} />,
      }))
    },
  })

  // define columns
  const columns = useMemoColumnsTable(['name', 'start_date', 'end_date', 'status', 'action'])

  if (isError) return <ErrorPage error={error} refetch={refetch} />

  return (
    <>
      <div className="px-8 flex justify-between">
        <ModalAdd open={openAddModal} setOpen={setOpenAddModal} refetch={refetch} />
        <h1 className="text-2xl font-semibold text-gray-900">Flash Sale</h1>
        <button
          className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
          onClick={() => setOpenAddModal(true)}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Flash Sale
        </button>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {isLoading ? <LoadingTable col={2} row={5} /> : <ReactTable columns={columns} data={data} />}
          </div>
        </div>
      </div>
    </>
  )
}
