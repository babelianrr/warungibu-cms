import {useState, useEffect} from 'react'
import {useMutation, useQuery} from 'react-query'
import debounce from 'lodash.debounce'
import {SearchIcon} from '@heroicons/react/outline'

import Input from 'components/base/Input'
import {Modal} from 'components/base'
import {LoadingTable} from 'components/table'

import {fetchActiveProducts, addProductFlashSale, removeProductFlashSale} from 'API'

function ListItem({action, product, flashSaleId, onSuccess}) {
  const {mutate: addProduct, isLoading} = useMutation(
    'add-product-to-flash-sale',
    ({flashSaleId, productIds}) => addProductFlashSale(flashSaleId, productIds),
    {
      onSuccess,
    }
  )

  const {mutate: removeProduct, isLoading: isLoadingRemove} = useMutation(
    'remove-product-to-flash-sale',
    ({flashSaleId, productIds}) => removeProductFlashSale(flashSaleId, productIds),
    {
      onSuccess,
    }
  )

  return (
    <li className="py-2">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            className="h-12 w-12 rounded-md"
            src={
              product?.images && product.images.length !== 0
                ? product.images[0].url
                : 'https://via.placeholder.com/300/F7FFFC'
            }
            alt=""
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{product?.name}</p>
        </div>
        <div>
          {action === 'remove' ? (
            <button
              onClick={() => removeProduct({flashSaleId, productIds: [product.id]})}
              className={`inline-flex text-sm items-center shadow-sm px-2.5 py-1 border border-gray-300 leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-red-500 hover:text-white ${
                isLoadingRemove ? 'cursor-not-allowed' : ''
              }`}
            >
              {isLoadingRemove ? 'Diproses' : 'Hapus'}
            </button>
          ) : action === 'add' ? (
            <button
              onClick={() => addProduct({flashSaleId, productIds: [product.id]})}
              className={`inline-flex text-sm items-center shadow-sm px-2.5 py-1 border border-gray-300 leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-blue-500 hover:text-white ${
                isLoading ? 'cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Diproses' : 'Tambah'}
            </button>
          ) : (
            <button
              className={`inline-flex text-sm items-center shadow-sm px-2.5 py-1 border bg-gray-300 leading-5 font-medium rounded-md text-gray-700 cursor-not-allowed disabled `}
            >
              Ditambahkan
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

export default function ModalProductFlashSale({open, setOpen, flashSaleId, flashSale, refetch}) {
  const [search, setSearch] = useState('')
  const [searchExistingProduct, setSearchExistingProduct] = useState('')
  const debounceSearch = debounce((e) => setSearch(e.target.value), 250)
  const debounceProductSearch = debounce((e) => setSearchExistingProduct(e.target.value), 250)

  const {
    data: productSearch,
    isLoading: isLoadingSearch,
    refetch: refetchSearch,
  } = useQuery(['search-product-flash-sale', search], () => fetchActiveProducts({page: 1, limit: 3, name: search}), {
    enabled: !!search,
  })

  useEffect(() => {
    if (search) {
      refetchSearch()
    }
  }, [search])

  function filterProduct(product) {
    if (!searchExistingProduct) {
      return true
    }
    return product.name.toLowerCase().includes(searchExistingProduct.toLowerCase())
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      Button={() => (
        <>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => setOpen(false)}
          >
            Tutup
          </button>
        </>
      )}
    >
      <div className="my-3 text-center flex-1 sm:text-left">
        <Modal.Title as="h3" className="text-lg leading-6 font-dayOne text-gray-900 mb-5">
          Detail Flash Sale
        </Modal.Title>
        <div className="mt-2 w-full">
          <div className="mb-10">
            <h4 className="tracking-wide text-gray-900 mb-1">Cari Produk</h4>
            <form className="relative w-full mb-4" onSubmit={(e) => e.preventDefault()}>
              <input
                id="name"
                name="name"
                type="text"
                onChange={debounceSearch}
                className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block w-full pr-10 sm:text-sm placeholder-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white focus:text-gray-900"
                placeholder="Cari Produk"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
              </div>
            </form>
            {isLoadingSearch ? (
              <LoadingTable />
            ) : productSearch && productSearch.products.length !== 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <h4 className="tracking-wide text-gray-900">Hasil Pencarian</h4>
                </div>
                <div>
                  <div className="flow-root mt-6">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                      {productSearch.products.map((product) => (
                        <ListItem
                          key={product.id}
                          action={flashSale.products.find((item) => item.id === product.id) ? 'added' : 'add'}
                          product={product}
                          flashSaleId={flashSaleId}
                          onSuccess={refetch}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : productSearch && productSearch.products.length === 0 ? (
              <h4 className="tracking-wide text-gray-900">Produk tidak ditemukan</h4>
            ) : null}
          </div>

          <div className="flex justify-between items-center">
            <h4 className="tracking-wide text-gray-900">List Item</h4>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                id="name"
                name="name"
                type="text"
                onChange={debounceProductSearch}
                className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block w-full pr-10 sm:text-sm placeholder-gray-400 rounded-md  px-4 bg-gray-100 border-gray-100 focus:bg-white focus:text-gray-900"
                placeholder="Cari Produk"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
              </div>
            </form>
          </div>
          <div>
            <div className="flow-root mt-6">
              <ul role="list" className="-my-5 divide-y divide-gray-200 h-96 overflow-y-auto ">
                {flashSale.products.filter(filterProduct).map((product) => (
                  <ListItem
                    key={product.id}
                    action="remove"
                    product={product}
                    flashSaleId={flashSaleId}
                    onSuccess={refetch}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
