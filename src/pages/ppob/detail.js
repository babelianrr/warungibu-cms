import {useState} from 'react'
import {useQuery} from 'react-query'
import {useParams, useHistory} from 'react-router'

import {Button} from 'components/base'
import LoadingPage from 'components/base/LoadingPage'
import ErrorPage from 'components/base/ErrorPage'
import {ReactTable, LoadingTable} from 'components/table'
import ModalRemovedReview from 'components/pageProduct/ModalRemoveReview'

import {fetchProductById, fetchProductReview} from 'API'
import {formatCurrency, formatSentenceCase} from 'helpers/formatter'
import usePagination from 'hooks/usePagination'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'

function ReviewAction({id, refetch}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-2">
      <ModalRemovedReview open={open} setOpen={setOpen} id={id} refetch={refetch} />
      <div className="text-red-500 hover:underline cursor-pointer" onClick={() => setOpen(true)}>
        Hapus Review
      </div>
    </div>
  )
}

export default function PpobDetail() {
  const {id} = useParams()
  const history = useHistory()
  const [totalPage, setTotalPage] = useState(1)
  const {page, nextPage, prevPage} = usePagination(totalPage)
  const [data, setData] = useState([])

  const {data: product, isLoading, isError, error} = useQuery(['product', id], () => fetchProductById(id))

  const {isLoading: isLoadingReview, refetch} = useQuery(['review', 'id'], () => fetchProductReview(id), {
    onSuccess: (res) => {
      const reviews = res.reviews.map((review) => ({
        user: review.user.name,
        rating: review.rating,
        notes: review.notes,
        action: <ReviewAction id={review.id} refetch={() => refetch()} />,
      }))
      setData(reviews)
      setTotalPage(res.totalPage)
    },
  })

  const columns = useMemoColumnsTable(['user', 'rating', 'notes', 'action'])

  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Detail Product</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-4 grid grid-cols-2">
            {/* Images Content */}
            <div className="p-4 flex flex-col justify-center items-center">
              <div id="main-image">
                <img
                  className="w-72"
                  src={product?.images[0]?.url || 'https://via.placeholder.com/300/F7FFFC'}
                  alt={product?.slug}
                />
              </div>
              <div id="list-image" className="flex space-x-2">
                {product?.images.map((image) => (
                  <div key={image.id} className="border shadow-sm">
                    <img
                      key={image.id}
                      className="w-32"
                      src={image.url[0] === '/' ? `${process.env.REACT_APP_PUBLIC_URL}/${image['url']}` : image['url']}
                      alt={product.slug}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Detail Content */}
            <div className="p-4 flex flex-col">
              <div className="mb-4">
                <h1 className="text-lg font-semibold text-gray-800 mb-4">{product.name}</h1>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
{/*                   <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Price (SAP)</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatCurrency(product.sap_price)}</dd>
                  </div */}
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatCurrency(product.price)}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">No. SKU</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.sku_number}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Stock</dt>
                    <Stocks product={product} />
                  </div>
                </dl>
              </div>
              {product.discount_type ? (
                <div className="mb-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Price after Discount </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatCurrency(product.price - product.discount_price)}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Discount Setting</dt>
                      <dd className="mt-1 text-sm text-red-500">
                        {product.discount_type === 'PRICE'
                          ? `-${formatCurrency(product.discount_price)}`
                          : `${product.discount_percentage}%`}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : null}
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500 mb-2">Category</dt>
                <div className="flex">
                  <Categories categories={product.categories} />
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <Description description={product.description} />
              </div>
              {product.promotion_headers.length != 0 ? (
                  <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Promotion</h3>
                  {product.promotion_headers.map((product) => (
                    <div>{product.name}</div>
                  ))}
                </div>
              ): ""}

              <Button onClick={() => history.push(`/products/${id}/edit`)}>Edit</Button>
            </div>
          </div>
        </div>
      </div>
      {data.length !== 0 ? (
        <>
          <div className="max-w-7xl px-4 sm:px-6 md:px-8">
            <h1 className="text-xl font-semibold text-gray-900">Product Review</h1>
          </div>
          <div className="py-4 mx-auto">
            <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                {isLoadingReview || data.length === 0 ? (
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
      ) : null}
    </>
  )
}

function Description({description}) {
  if (!description) return <span>-</span>

  return <p className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{__html: description}}></p>
}

function Stocks({product}) {
  if (product.branches.length === 0) return <span>-</span>

  return (
    <ul className="text-sm list-inside">
      {product.branches.map((branch) => (
        <li key={branch.branch_code}>
          {branch.location}: {Number(branch.stock).toLocaleString()} {product.unit}
        </li>
      ))}
    </ul>
  )
}

function Categories({categories}) {
  if (categories.length === 0) return <span>-</span>

  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((category) => (
        <div
          key={category.id}
          className="border border-dnr-dark-turqoise text-dnr-dark-turqoise py-1.5 px-3 h-16 w-32 rounded-md font-light text-sm flex items-center space-x-2 cursor-pointer "
        >
          <img src={category.icon_url} alt={category.name} className="w-5 h-5" />
          <span>{formatSentenceCase(category.name)}</span>
        </div>
      ))}
    </div>
  )
}
