import { useState } from 'react'
import { useQuery } from 'react-query'
import debounce from 'lodash.debounce'
import {
  SearchIcon,
  PlusIcon
} from '@heroicons/react/outline'

import useMemoColumnsTable from 'hooks/useMemoColumnsTable'
import usePagination from 'hooks/usePagination'
import { getPaymentTerm, createPaymentTerm } from 'API'

import ErrorPage from 'components/base/ErrorPage'
import Button from 'components/base/Button'
import { ReactTable, ActionRow, LoadingTable } from 'components/table'
import InfoModal from 'components/base/InfoModal'
import ModalAdd from 'components/pagePaymentTerm/ModalAdd'
import ModalEdit from 'components/pagePaymentTerm/ModalEdit'
import ModalChangeStatus from 'components/pagePaymentTerm/ModalChangeStatus'
import { AUTH, SUPER_USER } from 'helpers/utils'
import { authenticatedUser } from 'helpers/isAuthenticated'

const Users = authenticatedUser()

function DiscountValue({ product }) {
  if (product.promotions[0] === undefined) {
    return <p>-</p>
  } else {
    return (
      <p className="text-red-500">
        {`${product.promotions[0].percentage}%`}
      </p>
    )
  }
}

function StatusItem({ status }) {
  if (status === 'INACTIVE') {
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800`}>
        InActive
      </span>
    )
  } else if (status === 'ACTIVE') {
    return (
      <p>
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}>
          Active
        </span>
      </p>
    )
  } else {
    return (
      <p>-</p>
    )
  }


}

function PaymentTermAction({ payment, refetch }) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openChangeStatus, setOpenChangeStatus] = useState(false)

  return (
    <>
      <ModalEdit
        open={openEdit}
        setOpen={setOpenEdit}
        PaymentTermId={payment.id}
        PaymentTerm={payment}
        refetch={refetch}
      />

      <ModalChangeStatus
        open={openChangeStatus}
        setOpen={setOpenChangeStatus}
        PaymentTermId={payment.id}
        PaymentTermStatus={payment.status}
        refetch={refetch}
      />

      <div className="space-y-2">
        {Users.role_status !== SUPER_USER &&
        <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setOpenEdit(true)}>
          Edit
        </div>
        }

        {
          payment.status === 'INACTIVE' ? (
            <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setOpenChangeStatus(true)}>
              Aktivasi
            </div>
          ) : payment.status === 'ACTIVE' ? (
            <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setOpenChangeStatus(true)}>
              Deaktivasi
            </div>
          ) : null
        }
      </div>
    </>
  )
}

export default function PaymentPage() {
  const [totalPage, setTotalPage] = useState(1)
  const { page, nextPage, prevPage } = usePagination(totalPage)
  const [search, setSearch] = useState('')
  const debounceSearch = debounce((e) => setSearch(e.target.value), 250)
  const [data, setData] = useState(undefined)
  const [activeFilter, setActiveFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const productStatus = ['ACTIVE', 'INACTIVE']
  const [openAddModal, setOpenAddModal] = useState(false)

  const { isLoading, isError, error, refetch } = useQuery(
    ['payment_terms', page, search, activeFilter],
    () => getPaymentTerm({ page: page, limit: 15, name: search, status: activeFilter }),
    {
      onSuccess: (res) => {
        const paymentTerms = res.map((payment, k) => ({
          // no: k += 1,
          nama: payment.name,
          kode: payment.type,
          days_due: payment.days_due,
          status: <StatusItem status={payment.status} refetch={() => refetch()} />,
          action: <PaymentTermAction payment={payment} refetch={() => refetch()} />
        }))

        setData(paymentTerms)
        setTotalPage(res.totalPage)
      },
    }
  )

  const columns = useMemoColumnsTable([
    // 'no',
    'nama',
    'kode',
    'days_due',
    'status',
    'action',
  ])

  if (isError) return <ErrorPage error={error} />

  return (
    <>

      <ModalAdd open={openAddModal} setOpen={setOpenAddModal} refetch={() => refetch()} />

      <InfoModal open={open} setOpen={setOpen} title="Berhasil sinkronisasi produk" message={message} />
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Payment Terms</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            <div>
              <h5 className="text-gray-900 mb-2">Status Payment Terms</h5>
              <div className="flex space-x-2 text-sm">
                <div
                  onClick={() => setActiveFilter('')}
                  className={`${activeFilter === ''
                    ? 'bg-wi-dark-wi border-wi-blue text-white '
                    : 'bg-white border-wi-blue text-dnr-dark-bicart'
                    } rounded-md  px-2 py-2 my-auto hover:bg-wi-dark-wi hover:text-white transition-colors ease-in-out cursor-pointer border`}
                >
                  <span>Semua</span>
                </div>
                {productStatus.map((status, index) => (
                  <div
                    key={index}
                    className={`${activeFilter === status
                      ? 'bg-wi-dark-wi border-wi-blue text-white '
                      : 'bg-white border-wi-blue text-dnr-dark-bicart'
                      } rounded-md  px-2 py-2 my-auto hover:bg-wi-dark-wi hover:text-white transition-colors ease-in-out cursor-pointer border`}
                    onClick={() => setActiveFilter(status)}
                  >
                    <span>{status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 mb-4">
              <h5 className="text-gray-900 mb-2">Cari Payment Term</h5>

              <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={debounceSearch}
                  className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block w-full pr-10 sm:text-sm placeholder-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white focus:text-gray-900"
                  placeholder="Search Payment Term By Name"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                </div>
              </form>
            </div>
            {Users.role_status !== SUPER_USER && 
            <div>
              <h5 className="text-gray-900 mb-2"></h5>
              <Button
                color="bicart"
                padding="px-2 py-2 mt-6"
                className="text-sm"
                onClick={() => setOpenAddModal(true)}
              >
                <div className='flex'>
                  <PlusIcon className="h-4 w-4 mr-1" /> Payment Term
                </div>
              </Button>
            </div>
            }
          </div>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {isLoading || data === undefined ? (
              <LoadingTable />
            ) : (
              <ReactTable
                columns={columns}
                data={data}
                pagination={true}
                page={page}
                totalPage={totalPage}
                nextPage={nextPage}
                prevPage={prevPage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
