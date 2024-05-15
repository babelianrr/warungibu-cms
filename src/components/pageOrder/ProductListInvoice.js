import { useQuery } from 'react-query'
import { useState } from 'react'
import currencyConverter from 'helpers/currencyConverter'
import { formatDate } from 'helpers/formatter'
import dnrLogo from 'assets/logo.png'
import { ActionRowOrder } from 'components/table'
import { fetchOrderById, fetchDetailUser, fetchGetCartsBatch } from 'API'
import ModalAdd from './ModalCartProduct'
import ModalAddBatch from './ModalAddBatch'
import ModalEditBatch from './ModalEditBatch'
import ModalDeleteBatch from './ModalDeleteBatch'
import {
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/outline'


export default function ProductInvoiceList({ cart, data, refetch }) {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [addBatch, setAddBatch] = useState(false)
  const [TQty, setTQty] = useState(0)
  const [rawBatchData, setRawBatchData] = useState(cart.quantity)
  const defaultQty = cart.quantity

  const [showBatchTable, setShowBatchTable] = useState(false);
  const [showButton, setShowButton] = useState(false);

  function generatePriceFromCart(cart) {
    if (cart.discount_percentage) {
      return Math.ceil(cart.unit_price - (cart.discount_percentage / 100) * cart.unit_price)
    }
    return cart.unit_price
  }

  function batchValue(cart) {
    if (cart.quantity === TQty) {
      return (
        <p className="text-green-500 hover:underline cursor-pointer">
          Assigned
        </p>
      )
    } else if (TQty < cart.quantity && TQty !== 0) {
      return (
        <p className="text-dnr-dark-orange hover:underline cursor-pointer">
          Partially Assigned
        </p>
      )
    } else {
      return (
        <p className="text-red-500 hover:underline cursor-pointer">
          Unassigned
        </p>
      )
    }
  }

  function BatchRow({ cartData, cartId }) {
    const batch_data = useQuery(
      ['carts_batch', cartId],
      () => {
        return fetchGetCartsBatch(cartId)
      }
    )
    setRawBatchData(batch_data.data)

    let totalQty = 0;
    batch_data.data && (
      batch_data.data.map((batch) => {
        totalQty += batch.quantity
      })
    )
    setTQty(totalQty)

    return (
      batch_data.data ? (
        batch_data.data.map((batch) => (
          <tr key={batch.id}>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">{batch.batch_no}</td>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">{formatDate(batch.exp_date)}</td>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600 text-center">{batch.quantity}</td>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
              <BatchAction cartData={cartData} batchData={batch} totalQty={TQty} refetch={() => refetch()} />
            </td>
          </tr>
        ))
      ) : ('')
    )

  }

  function BatchAction({ batchData, cartData, refetch, totalQty }) {
    const [editBatch, setEditBatch] = useState(false)
    const [deleteBatch, setDeleteBatch] = useState(false)

    return (
      <div className="flex justify-around space-x-4">
        <ModalEditBatch open={editBatch} batchData={batchData} rawBatchData={rawBatchData} totalQty={totalQty} setOpen={setEditBatch} cart={cartData} refetch={refetch} />
        <ModalDeleteBatch open={deleteBatch} batchData={batchData} setOpen={setDeleteBatch} refetch={refetch} />
        <p className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setEditBatch(true)}>
          Update
        </p>
        <p className="text-red-500 hover:underline cursor-pointer" onClick={() => setDeleteBatch(true)}>
          Delete
        </p>
      </div>
    )
  }

  function AddBatch({ cartData, refetch }) {
    return (
      <div className="flex justify-around space-x-4">
        <>
          <ModalAddBatch open={addBatch} batchData={rawBatchData} totalQty={TQty} setOpen={setAddBatch} cart={cartData} refetch={refetch} />
          <p className="text-dnr-dark-orange hover:underline cursor-pointer"></p>
          <p className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setAddBatch(true)}>
            Add Batch
          </p>
        </>
      </div>
    )
  }

  return (
    <>
      <tr className={'bg-white'} key={cart.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          <div className='flex'>
            {
              showButton ?
                <ChevronRightIcon id='right-icon' className="h-4 w-4 mr-5 right-icon" onClick={() => { setShowBatchTable(!showBatchTable); setShowButton(!showButton) }} />
                :
                <ChevronDownIcon id='down-icon' className="h-4 w-4 mr-5 down-icon" onClick={() => { setShowBatchTable(!showBatchTable); setShowButton(!showButton) }} />
            }

            {/* <ChevronRightIcon id='right-icon' className="h-4 w-4 mr-5 right-icon" onClick={() => { setShowBatchTable(!showBatchTable); setShowButton(!showButton) }} />
            <ChevronDownIcon id='down-icon' className="h-4 w-4 mr-5 down-icon hidden" onClick={() => { setShowBatchTable(!showBatchTable); setShowButton(!showButton) }} /> */}

            {cart.product.name}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batchValue(cart)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cart.quantity}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {currencyConverter(cart.unit_price)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {cart.discount_percentage ? `${cart.discount_percentage}%` : '-'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {currencyConverter(generatePriceFromCart(cart))}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {currencyConverter(cart.final_unit_price)}
        </td>
        <td className="px-4">
          <ActionRowOrder cart={cart} transaction_number={data.transaction_number} totalQty={TQty} dataCount={data.carts.length} editPath={`/promotion/${cart.id}/edit`} detailPath={`/promotion/${cart.id}/detail`} deletePath id={cart.id} refetch={refetch} />
        </td>
      </tr >

      {
        showBatchTable ?
          <tr id='batch-table' className='batch-table'>
            <td colSpan={8} className="px-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className=''>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider"
                    >
                      Batch No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider"
                    >
                      Exp. Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider text-center"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider text-center"
                    >

                    </th>
                  </tr>
                </thead>
                <tbody>

                  <BatchRow cartData={cart} cartId={cart.id} />
                  <tr id='add-batch-row'>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">-</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">-</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">-</td>
                    <td className="py-2 whitespace-nowrap text-sm text-gray-600">
                      {
                        TQty !== defaultQty ?
                          <AddBatch cartData={cart} refetch={() => refetch()} />
                          : null
                      }
                    </td>
                  </tr>

                </tbody>
              </table>
            </td>
          </tr>
          :
          <tr id='batch-table' className='batch-table hidden'>
            <td colSpan={8} className="px-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className=''>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider"
                    >
                      Batch No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider"
                    >
                      Exp. Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider text-center"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-2 text-left text-sm font-medium text-gray-500 tracking-wider text-center"
                    >

                    </th>
                  </tr>
                </thead>
                <tbody>

                  <BatchRow cartData={cart} cartId={cart.id} />
                  <tr id='add-batch-row'>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">-</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">-</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">-</td>
                    <td className="py-2 whitespace-nowrap text-sm text-gray-600">
                      {
                        TQty !== defaultQty ?
                          <AddBatch cartData={cart} refetch={() => refetch()} />
                          : null
                      }
                    </td>
                  </tr>

                </tbody>
              </table>
            </td>
          </tr>
      }

    </>
  )
}
