import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import debounce from 'lodash.debounce'
import { SearchIcon } from '@heroicons/react/outline'
import { useHistory } from 'react-router-dom'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'
import usePagination from 'hooks/usePagination'
import { fetchPPOB, syncProduct } from 'API'
import { formatCurrency } from 'helpers/formatter'

import ErrorPage from 'components/base/ErrorPage'
import Button from 'components/base/Button'
import { ReactTable, ActionRow, LoadingTable, ActionRowPpob } from 'components/table'
import { ModalConfirmation, StatusItem } from 'components/ppob'
import InfoModal from 'components/base/InfoModal'
import Sync from '../../assets/sync.svg'

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

export default function PpobPage() {
  const history = useHistory()
  const [totalPage, setTotalPage] = useState(1)
  const { page, nextPage, prevPage } = usePagination(totalPage)
  const [search, setSearch] = useState('')
  const debounceSearch = debounce((e) => setSearch(e.target.value), 250)
  const [data, setData] = useState(undefined)
  const [activeFilter, setActiveFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [message, setMessage] = useState('')
  const productPPOB = ['Token Listrik', 'Pulsa', 'Paket Data']

  const { isLoading, isError, refetch, error } = useQuery(
    ['ppob', page, search, activeFilter],
    // () => fetchPPOB({ page: page, limit: 30, name: search, status: activeFilter }),
    () => fetchPPOB(),
    {
      onSuccess: (res) => {
        const products = res.data.map((product) => ({
          namaPaket: product?.product_name ?? '-',
          harga: formatCurrency(product?.price ?? 0),
          hargaJual: formatCurrency(product?.sell_price ?? 0),
          status: <StatusItem status={product?.active} />,
          action: <ActionRowPpob product={product} refetch={refetch} />,
        }))

        setData(products)
        // setTotalPage(res.totalPage)
      },
    }
  )

  const columns = useMemoColumnsTable([
    'namaPaket',
    'harga',
    'hargaJual',
    'status',
    'action'
  ])

  if (isError) return <ErrorPage error={error} />
  return (
    <>
      <ModalConfirmation open={openConfirm} setOpen={setOpenConfirm} title="Sinkronisasi" 
        message="Apakah anda yakin untuk sinkronisasi data"  
        url="/admin/ppob/sync" refetch={refetch}
      />
      <InfoModal open={open} setOpen={setOpen} title="Berhasil sinkronisasi PPOB" message={message} />
      <div className="px-8 flex justify-start items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">PPOB</h1>
        <img src={Sync} className="h-5 w-5 mr-2" onClick={() => setOpenConfirm(true)} />
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            <div>
              <div className="flex space-x-2 text-sm">
                {productPPOB.map((product, index) => (
                  <>
                  {
                    product === 'Token Listrik' ? 
                      <div
                        key={index}
                        className={`${activeFilter === product
                            ? 'bg-wi-dark-wi border-wi-blue text-white '
                            : 'bg-white border-wi-blue text-wi-blue'
                          } rounded-md  px-2 py-2 my-auto hover:bg-wi-dark-wi hover:text-white transition-colors ease-in-out cursor-pointer border`}
                        onClick={() => setActiveFilter(product)}
                      >
                        <span>{product}</span>
                      </div>
                    :
                      <div
                        key={index}
                        className={`bg-gray-400 border border-gray-500 text-white rounded-md  px-2 py-2 my-auto hover:bg-wi-dark-wi hover:text-white transition-colors ease-in-out cursor-pointer border`}
                      >
                        <span>{product}</span>
                      </div>
                  }
                  </>
                ))}
              </div>
            </div>
            <div className="flex-1 mb-4">
              <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={debounceSearch}
                  className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block w-full pr-10 sm:text-sm placeholder-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white focus:text-gray-900"
                  placeholder="Cari PPOB"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                </div>
              </form>
            </div>
          </div>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {isLoading || data === undefined ? (
              <LoadingTable />
            ) : (
              <ReactTable
                columns={columns}
                data={data}
                pagination={false}
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
