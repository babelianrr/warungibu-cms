import {useQuery} from 'react-query'
import {useParams} from 'react-router'

import currencyConverter from 'helpers/currencyConverter'
import {formatDate} from 'helpers/formatter'
import dnrLogo from 'assets/logo.png'
import logo from 'assets/logo-wi.png'
import {fetchOrderById, fetchDetailUser} from 'API'

function generatePriceFromCart(cart) {
  if (cart.discount_percentage) {
    return Math.ceil(cart.unit_price - (cart.discount_percentage / 100) * cart.unit_price)
  }

  return cart.unit_price
}

export default function Detail() {
  const {orderId} = useParams()
  const {isLoading, data, isIdle} = useQuery(
    ['order-detail', orderId],
    () => {
      return fetchOrderById(orderId)
    },
    {enabled: Boolean(orderId)}
  )
  const {data: user} = useQuery(['users'], () => fetchDetailUser(data?.user_id), {
    enabled: Boolean(data?.user_id),
  })
  // const mainAddress = user?.outlet_addresses?.find((address) => address.isMain) || user?.outlet_addresses[0]

  function calculateSubTotal(carts) {
    return currencyConverter(carts.reduce((sum, cart) => sum + cart.final_unit_price, 0))
  }

  if (isLoading || isIdle || data === '' || !user) {
    return (
      <div className="w-full mb-4 text-sm">
        <h4>Proses Pengambilan Data</h4>
      </div>
    )
  }

  //let total_diskon = payment.promotion_discount !== null ? payment.promotion_discount : 0;
/*   let total_diskon = 0;

  function generateDiscount(cart){
    let diskon = Math.ceil( cart.unit_price - (cart.final_unit_price / cart.quantity) )
    total_diskon = total_diskon + Math.ceil((cart.unit_price * cart.quantity ) - cart.final_unit_price )

    if(diskon != 0){
      return currencyConverter(diskon)
    } else {
      return "-"
    }
  } */

  return (
    <main className="bg-white min-h-screen ">
      <section className="py-4 px-4 sm:px-0 sm:max-w-screen-lg lg:max-w-screen-lg xl:max-w-screen-xl mx-auto text-gray-900">
        <section className={`w-full sm:w-3/4 mx-auto relative`}>
          
          <div className="mb-2 flex justify-between items-center">
            <img src={logo} width={100} height={40} alt="DNR" />
            <h1 className="text-base font-semibold text-gray-900">Surat Pesanan {data.transaction_number}</h1>
          </div>
          <hr className={` bg-gray-500 opacity-30border-dashed mb-4`} />

          <section className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 items-center">
                <p className="text-gray-700 font-bold tracking-wide text-sm">Pembeli</p>
                <p className="text-gray-900 col-span-2">: {user?.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <p className="text-gray-700 font-bold tracking-wide text-sm">Tanggal</p>
                <p className="text-gray-900 col-span-2">: {formatDate(data.created_at)}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div>
                <p className="text-gray-700 font-bold tracking-wide text-sm">Alamat Pengiriman :</p>
                <p className="text-gray-900 col-span-2">{user?.outlet_types_id?.address}</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="bg-gray-400 border border-black px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                          >
                            Produk
                          </th>
                          <th
                            scope="col"
                            className="bg-gray-400 border border-black px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                          >
                            Jumlah
                          </th>
                          <th
                            scope="col"
                            className="bg-gray-400 border border-black px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                          >
                            Harga Produk
                          </th>
                          <th
                            scope="col"
                            className="bg-gray-400 border border-black px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                          >
                            Diskon/pcs
                          </th>
                          <th
                            scope="col"
                            className="bg-gray-400 border border-black px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                          >
                            Harga Diskon
                          </th>
                          <th
                            scope="col"
                            className="bg-gray-400 border border-black px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                          >
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.carts.map((cart) => (
                          <tr className={'bg-white'} key={cart.id}>
                            <td className="px-6 py-4 border border-black whitespace-nowrap text-sm font-medium text-gray-900">
                              {cart.product.name}
                            </td>
                            <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">{cart.quantity}</td>
                            <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                              {currencyConverter(cart.unit_price)}
                            </td>
                            <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                              {cart.discount_percentage ? `${cart.discount_percentage}%` : '-'}
                              {/* {generateDiscount(cart)} */}
                            </td>
                            <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                              {/* {currencyConverter(generatePriceFromCart(cart))} */}
                              {cart?.discount_percentage ? currencyConverter((cart.unit_price * cart?.discount_percentage/100)) : '-'}
                            </td>
                            <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                              {currencyConverter(cart.final_unit_price)}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-4 border border-black whitespace-nowrap text-sm font-bold text-gray-700 text-right"
                          >
                            Total
                          </td>
                          <td className="px-6 py-4 border border-black whitespace-nowrap text-sm font-bold text-gray-700">
                            {calculateSubTotal(data.carts)}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr className={'bg-white'} key={1}>
                          <td colSpan={6} className="px-6 py-4 whitespace-nowrap">
                          </td>
                        </tr>
                        <tr className={'bg-white'} key='total'>
                          <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 border border-black">
                            Biaya Layanan
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border border-black">
                            {currencyConverter(0)}
                          </td>
                        </tr>
                        <tr className={'bg-white'} key='total'>
                          <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 border border-black">
                            Total Pembayaran
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border border-black">
                            {currencyConverter(data.payment.total_amount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* <section className="border border-gray-300 rounded-md divide-y divide-gray-300 mb-8">
            {data.payment.order_discount ? (
              <div className="flex justify-between items-center px-6 py-4">
                <span className="text-gray-700 tracking-wide text-sm">Potongan Discount</span>

                <div className="text-red-500 font-semibold ">- {currencyConverter(data.payment.order_discount)}</div>
              </div>
            ) : null} */}
{/*             {total_diskon != 0 ? (
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-gray-700 tracking-wide text-sm">Potongan Discount</span>
              <div className="text-red-500 font-semibold">- {currencyConverter(total_diskon)}</div>
            </div> ) : null } */}             
            {/* <div className="flex justify-between items-center px-6 py-4">
              <span className="text-gray-700 tracking-wide text-sm">Biaya Layanan</span>
              <div className="text-gray-900 font-semibold">{state}</div>
              <div className="text-gray-900 font-semibold">{currencyConverter(data.payment.channel_fee)}</div>
            </div> */}
            {/* <div className="flex justify-between items-center px-6 py-4">
              <span className="text-gray-700 tracking-wide text-sm">Pajak 11%</span>
              <div className="text-gray-900 font-semibold">{currencyConverter(data.payment.tax)}</div>
            </div>
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-gray-700 tracking-wide text-sm">Ongkos Kirim</span>
              <div className="text-gray-900 font-semibold">Rp 0</div>
            </div> */}
          </section>

          {/* <section className="mb-8">
            <div className="flex justify-end space-x-4 items-center p-4 bg-gray-50 rounded-md">
              <span className="text-gray-700 tracking-wide text-sm">Total Bayar</span>
              <div className="text-gray-900 font-semibold">{state}</div>
              <div className="text-gray-900 font-semibold">{currencyConverter(data.payment.total_amount)}</div>
            </div>
          </section> */}
        {/* </section> */}
      </section>
    </main>
  )
}
