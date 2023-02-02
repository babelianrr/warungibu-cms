import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import debounce from 'lodash.debounce'
import format from 'date-fns/format'
import { PrinterIcon, SearchIcon } from '@heroicons/react/outline'

import { ReactTable, LoadingTable } from 'components/table'
import ErrorPage from 'components/base/ErrorPage'
import ModalPaymentConfirmation from 'components/pageOrder/ModalPaymentConfirmation'
import ModalOngoing from 'components/pageOrder/ModalOngoing'
import ModalDelivered from 'components/pageOrder/ModalDelivered'
import ModalCancel from 'components/pageOrder/ModalCancel'
import ModalRefund from 'components/pageOrder/ModalRefund'
import ColoredLabel from 'components/base/ColoredLabel'

import { fetchOrders, downloadInvoice, fetchOutletTypes, exportOrders } from 'API'
import usePagination from 'hooks/usePagination'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'
import { formatCurrency } from 'helpers/formatter'
import { Input } from 'components/base'
import { AUTH, SUPER_USER } from 'helpers/utils'

// const paymentStatus = {
//   DIRECT: {
//     color: 'green',
//     text: 'Pembayaran Langsung',
//   },
//   CASH_ON_DELIVERY: {
//     color: 'blue',
//     text: 'Pembayaran COD',
//   },
//   LOAN: {
//     color: 'red',
//     text: 'Pembayaran Tempo',
//   },
//   Paylater: {
//     color: 'red',
//     text: 'Paylater',
//   },
// }

const orderType = {
  ORDERED: 'Menunggu Pembayaran',
  PROCESSED: 'Diproses',
  ONGOING: 'Dikirim',
  DELIVERED: 'Sampai Tujuan',
  COMPLETED: 'Selesai',
  CANCELED: 'Dibatalkan',
}

export default function OrderPage() {
  const authUser = JSON.parse(localStorage.user)
  const [totalPage, setTotalPage] = useState(1)
  const [search, setSearch] = useState('')
  const [client, setClient] = useState('')
  const [statusPesanan, setStatusPesanan] = useState('')
  const [start_date, setStartDate] = useState('')
  const [end_date, setEndDate] = useState('')
  const { page, nextPage, prevPage } = usePagination(totalPage)
  const debounceSearch = debounce((e) => setSearch(e.target.value), 250)
  const debounceClient = debounce((e) => setClient(e.target.value), 250)


  const [data, setData] = useState(undefined)
  const [company, setCompany] = useState(undefined)

  const resetParam = () => {
    setSearch('')
    setClient('')
    setStatusPesanan('')
    setStartDate('')
    setEndDate('')
  }

  function generateText(order) {
    if (order.payment.status === 'NEED_REFUND') {
      return 'Perlu Refund'
    }
    return orderType[order.status]
  }

  const {isLoading: isLoadingClient, isError: isErrorClient, error: errorClient} = useQuery(
    ['outlet-types'], () => fetchOutletTypes(),
    {
      onSuccess: res => {
        setCompany(res)
      },
      onError: (errorClient) => {
        console.log(errorClient)
      },
    }
  )

  const { isLoading, isError, refetch, error } = useQuery(
    // ['orders', page, statusPesanan, search, client, start_date, end_date, statusPesanan],
    ['orders', page],
    () => fetchOrders({ page, limit: 15, status: statusPesanan, search, client, start_date, end_date }),
    {
      onSuccess: (res) => {
        const orders = res.orders.map((order, index) => ({
          nomorTransaksi: <p>{order.transaction_number}</p>,
          products: <OrderProduct order={order} />,
          totalPenjualan: <p>{formatCurrency(order.payment.total_amount)}</p>,
          pembeli: (
            <div className="space-y-2" key={`key${index}`}>
              {/* <p className="text-gray-500 text-xs">{order.user.customer_id}</p> */}
              <p className="text-gray-900">{order.user?.name}</p>
              <p className="text-gray-500 text-xs">{order.user?.outlet_types_id?.name}</p>
            </div>
          ),
          // statusPembayaran: <ColoredLabel {...paymentStatus[order.payment.type]} />,
          statusPembayaran: <ColoredLabel color={order.payment.status === 'SUCCESS' ? 'green' : 'red'} text={order.payment.status === 'SUCCESS' ? 'Lunas' : 'Belum Lunas'} />,
          statusPesanan: <ColoredLabel color="blue" text={generateText(order)} />,
          tanggalPemesanan: <p>{format(new Date(order.created_at), "dd-MM-yyyy', 'HH:mm:ss")}</p>,
          action: <OrderAction key={order.id} order={order} />,
        }))

        setData(orders)
        setTotalPage(res.totalPage)
      },
      onError: (error) => {
        console.log(error)
      },
    }
  )

  const { mutate: mutateExport, isLoading: isLoadingExport  } = useMutation(
    () => exportOrders({ page, limit: 15, status: statusPesanan, search, client, start_date, end_date }), {
    onSuccess: async (res) => {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      // Warung Ibu_26/12/22-25/01/23_Order List

      link.setAttribute('download', `${client ? client+'_' : ''}${start_date && end_date ? start_date+'_'+end_date+'_' :(start_date ? start_date+'_' : (end_date && end_date+'_' ) )}Order List.xlsx`);
      document.body.appendChild(link);
      link.click();

      return res
    },
  })

  const columns = useMemoColumnsTable([
    'nomorTransaksi',
    'products',
    'totalPenjualan',
    'pembeli',
    'statusPembayaran',
    'statusPesanan',
    'tanggalPemesanan',
    'action',
  ])

  if (isError) return <ErrorPage error={error} />

  function OrderAction({ order }) {
    const [open, setOpen] = useState(false)
    const [ongoingOpen, setOngoingOpen] = useState(false)
    const [deliveredOpen, setDeliveredOpen] = useState(false)
    const [cancelOpen, setCancelOpen] = useState(false)
    const [refundOpen, setRefundOpen] = useState(false)

    let action = []

    if (
      // (order.payment.type === 'LOAN' && order.payment.status === 'PENDING') ||
      // (order.payment.type === 'CASH_ON_DELIVERY' && order.status === 'PENDING') ||
      // (order.status === 'ORDERED' && order.payment.method === 'BANK_TRANSFER')
      (order.status === 'COMPLETED' && order.payment.status !== 'SUCCESS')
    ) {
      if (authUser.role_status === 'SUPER_ADMIN') {
        action.push(
          <div key={1} className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setOpen(true)}>
            Konfirmasi Pembayaran
          </div>
        )
      }
    }

    if (order.status === 'PROCESSED') {
      action.push(
        <div
          key={2}
          className="text-dnr-dark-orange hover:underline cursor-pointer"
          onClick={() => setOngoingOpen(true)}
        >
          Konfirmasi Pengiriman Barang
        </div>
      )
    }

    if (order.status === 'ONGOING') {
      action.push(
        <div
          key={3}
          className="text-dnr-dark-orange hover:underline cursor-pointer"
          onClick={() => setDeliveredOpen(true)}
        >
          Konfirmasi Barang Telah Sampai
        </div>
      )
    }

    if (order.payment.status === 'NEED_REFUND') {
      action.push(
        <div
          key={4}
          className="text-dnr-dark-orange hover:underline cursor-pointer"
          onClick={() => setRefundOpen(true)}
        >
          Proses Refund Dana
        </div>
      )
    }

    if (order.status !== 'COMPLETED' && order.status !== 'DELIVERED' && order.status !== 'CANCELED' && order.status !== 'ONGOING') {
      action.push(
        <div key={5} className="text-red-500 hover:underline cursor-pointer" onClick={() => setCancelOpen(true)}>
          Batalkan Pesanan
        </div>
      )
    }

    // if (order.status !== 'COMPLETED' && order.status !== 'CANCELED' && order.status !== 'ONGOING' && order.status !== 'DELIVERED') {
    //   action.push(
    //     <div>
    //       <a
    //         href={`/orders/EditInvoice/${order.transaction_number}`}
    //         target="_blank"
    //         rel="noreferrer"
    //         key={6}
    //         className="text-dnr-dark-orange hover:underline cursor-pointer"
    //       >
    //         Edit Surat Pesanan
    //       </a>
    //     </div>
    //   )
    // }

    action.push(
      <>
        <div>
          <a
            href={`/orders/invoice/${order.transaction_number}`}
            target="_blank"
            rel="noreferrer"
            key={7}
            className="text-dnr-dark-orange hover:underline cursor-pointer"
          >
            Lihat Surat Pesanan
          </a>
        </div>
        <div>
          <a
            // href={`${process.env.REACT_APP_BASE_URL}admin/orders/${order.transaction_number}/invoice`}
            href={`${process.env.REACT_APP_BASE_URL}admin/orders/${order.transaction_number}/faktur`}
            key={8}
            className="text-dnr-dark-orange hover:underline cursor-pointer"
          >
            Download Surat Pesanan
          </a>
        </div>
      </>
    )

    if (order.status !== 'PROCESSED' && order.status !== 'ORDERED') {
      action.push(
        <>
          <div>
            <a
              href={`/orders/faktur/${order.transaction_number}`}
              target="_blank"
              rel="noreferrer"
              key={7}
              className="text-dnr-dark-orange hover:underline cursor-pointer"
            >
              Lihat Faktur
            </a>
          </div>
          <div>
            <a
              href={`${process.env.REACT_APP_BASE_URL}admin/orders/${order.transaction_number}/invoice`}
              // href={`${process.env.REACT_APP_BASE_URL}admin/orders/${order.transaction_number}/faktur`}
              key={8}
              className="text-dnr-dark-orange hover:underline cursor-pointer"
            >
              Download Faktur
            </a>
          </div>
        </>
      )
    }

    return (
      <div className="space-y-2">
        <ModalPaymentConfirmation open={open} setOpen={setOpen} order={order} refetch={refetch} />
        <ModalRefund open={refundOpen} setOpen={setRefundOpen} order={order} refetch={refetch} />
        <ModalOngoing open={ongoingOpen} setOpen={setOngoingOpen} order={order} refetch={refetch} />
        <ModalDelivered open={deliveredOpen} setOpen={setDeliveredOpen} order={order} refetch={refetch} />
        <ModalCancel open={cancelOpen} setOpen={setCancelOpen} order={order} refetch={refetch} />
        {action}
      </div>
    )
  }

  return (
    <>
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Order</h1>
        <button
          className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
          onClick={() => mutateExport()}
        >
          <PrinterIcon className="h-5 w-5 mr-2" />
          Export Document
        </button>
      </div>
      <div className="py-4 mx-auto">
        <div className="sm:px-6 lg:px-8 mb-4 flex justify-between items-end space-x-10">
          <div className='flex gap-4'>
            <select
              onChange={(e) => setStatusPesanan(e.target.value)}
              className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block pr-10 sm:text-sm text-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white"
              aria-label="Default select example" value={statusPesanan}>
              <option selected value={''}>Status Pesanan</option>
              <option value="ORDERED">Menunggu Pembayaran</option>
              <option value="PROCESSED">Diproses</option>
              <option value="ONGOING">Dikirim</option>
              <option value="DELIVERED">Sampai Tujuan</option>
              <option value="COMPLETED">Selesai</option>
              <option value="CANCELED">Dibatalkan</option>
            </select>

            <select
              onChange={(e) => setClient(e.target.value)}
              className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block pr-10 sm:text-sm text-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white"
              aria-label="Default select example" value={client}>                    
              <option selected value={''}>Company</option>
              {!isLoadingClient || !company === undefined ? 
                company?.map((v, k) => {
                  return(
                    <option value={v.name} key={k}>{v.name}</option>
                  )
                })
                :''
              }
            </select>
          </div>
          <div>
            <h5 className="text-gray-900 mb-1">Periode</h5>
            <div className='flex gap-4'>
              <div>
                <label className="text-gray-900 mb-1 text-sm">From</label>
                <Input id="name" placeholder="Start Date" value={start_date} type="date" onChange={(e) => setStartDate(e)} />
              </div>
              <div>
                <label className="text-gray-900 mb-1 text-xs">To</label>
                <Input id="name" placeholder="End Date" value={end_date} type="date" onChange={(e) => setEndDate(e)} />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h5 className="text-gray-900 mb-2">Cari Pesanan</h5>
            <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
              <input
                id="name"
                name="name"
                type="text"
                value={search}
                // onChange={debounceSearch}
                onChange={(e) => setSearch(e.target.value)}
                className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block w-full pr-10 sm:text-sm placeholder-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white focus:text-gray-900"
                placeholder="Cari Pesanan"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
              </div>
            </form>
          </div>
          <div className="flex gap-2 items-end">
            <button
              className="cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
              onClick={() => refetch()}
            >
              Cari
            </button>
            <button
              className="cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
              onClick={() => resetParam()}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="-my-2 py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {isLoading || data === undefined ? (
              <LoadingTable col={8} row={5} />
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

function OrderProduct({ order }) {
  function OrderDetail({ cart }) {
    if (cart.discount_percentage > 0) {
      return (
        <span className="text-xs text-gray-600">
          {cart.quantity} {cart.product.unit} X ({formatCurrency(cart.product.price)}{' '}
          <span className="text-red-500">
            - {formatCurrency((cart.product.price * cart.discount_percentage) / 100)}
          </span>
          ) = {formatCurrency(cart.final_unit_price)}
        </span>
      )
    }

    return (
      <span className="text-xs text-gray-600">
        {cart.quantity} {cart.product.unit} X {formatCurrency(cart.product.price)} ={' '}
        {formatCurrency(cart.final_unit_price)}
      </span>
    )
  }

  return (
    <>
      <div className="text-left flex flex-col space-y-2 items-start mb-2">
        {/* <div className="border border-gray-300 p-1 rounded-md w-10">
          <img
            className="w-10"
            src={
              cart?.product?.images && cart.product.images[0]
                ? cart?.product?.images[0].url
                : 'https://via.placeholder.com/300/F7FFFC'
            }
            alt={cart?.product?.name}
          />
        </div> */}
        {order.carts.map((cart) => (
          <div className="flex flex-col items-start" key={cart.id}>
            <h5 className="text-sm text-gray-900">{cart.product.name}</h5>
            <OrderDetail cart={cart} />
          </div>
        ))}
      </div>
      {/* {order.carts.length > 1 ? (
        <h5 className="text-sm text-left text-gray-500 hover:underline cursor-pointer">
          +{order.carts.length - 1} produk lainnya
        </h5>
      ) : null} */}
    </>
  )
}
