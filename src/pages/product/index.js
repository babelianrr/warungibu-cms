import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import debounce from 'lodash.debounce'
import { SearchIcon } from '@heroicons/react/outline'
import { useHistory } from 'react-router-dom'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'
import usePagination from 'hooks/usePagination'
import { fetchProducts, syncProduct } from 'API'
import { formatCurrency } from 'helpers/formatter'

import ErrorPage from 'components/base/ErrorPage'
import Button from 'components/base/Button'
import { ReactTable, LoadingTable } from 'components/table'
import { ProductRow, StatusItem } from 'components/pageProduct'
import InfoModal from 'components/base/InfoModal'
import ActionRow from 'components/pageProduct/ActionRow'

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

export default function ProductPage() {
  const history = useHistory()
  const [totalPage, setTotalPage] = useState(1)
  const { page, nextPage, prevPage } = usePagination(totalPage)
  const [search, setSearch] = useState('')
  const debounceSearch = debounce((e) => setSearch(e.target.value), 250)
  const [data, setData] = useState(undefined)
  const [activeFilter, setActiveFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const productStatus = ['ACTIVE', 'INACTIVE']

  const { isLoading, isError, error } = useQuery(
    ['products', page, search, activeFilter],
    () => fetchProducts({ page: page, limit: 15, name: search, status: activeFilter }),
    {
      onSuccess: (res) => {
        const products = res.products.map((product) => ({
          product: <ProductRow product={product} />,
          price: formatCurrency(product.price - (product.discount_price || 0)),
          sap_price: formatCurrency(product.sap_price),
          average_rating: <p>{product.average_rating || '-'}</p>,
          sold: (
            <p>
              {product.sold} {product.unit}
            </p>
          ),
          status: <StatusItem valid_to={product.valid_to} />,
          discount: <DiscountValue product={product} />,
          action: <ActionRow editPath={`/products/${product.id}/edit`} detailPath={`/products/${product.id}/detail`} />,
        }))

        setData(products)
        setTotalPage(res.totalPage)
      },
    }
  )

  const { isLoading: loadingSyncProduct, mutate } = useMutation(['sync-product'], () => syncProduct(), {
    onSuccess(response) {
      setOpen(true)
      setMessage(response.message)
    },
  })

  const columns = useMemoColumnsTable([
    'product',
    // 'sap_price',
    'price',
    'discount',
    'sold',
    'average_rating',
    'status',
    'action',
  ])

  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <InfoModal open={open} setOpen={setOpen} title="Berhasil sinkronisasi produk" message={message} />
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Product</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            <div>
              <h5 className="text-gray-900 mb-2">Status Pesanan</h5>
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
                        : 'bg-white border-wi-blue text-wi-blue'
                      } rounded-md  px-2 py-2 my-auto hover:bg-wi-dark-wi hover:text-white transition-colors ease-in-out cursor-pointer border`}
                    onClick={() => setActiveFilter(status)}
                  >
                    <span>{status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-gray-900 mt-8"></h5>
              <Button
                color="bicart"
                padding="px-2 py-2"
                className="text-sm"
                onClick={() => history.push('/products/create')}>
                Tambah Produk
              </Button>
            </div>
            {/*             <div>
              <h5 className="text-gray-900 mb-2">Sinkronisasi Produk</h5>
              <Button
                color="bicart"
                padding="px-2 py-2"
                type={loadingSyncProduct ? 'processing' : ''}
                className="text-sm"
                onClick={mutate}
              >
                Sinkronisasi Produk
              </Button>
            </div> */}
            <div className="flex-1 mb-4">
              <h5 className="text-gray-900 mb-2">Cari Produk</h5>

              <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={debounceSearch}
                  className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block w-full pr-10 sm:text-sm placeholder-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white focus:text-gray-900"
                  placeholder="Search Product By Name"
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
