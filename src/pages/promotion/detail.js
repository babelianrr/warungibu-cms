import {useState} from 'react'
import {useHistory,useParams} from 'react-router'
import {useMutation, useQuery} from 'react-query'
import {format} from 'date-fns'
import {PlusIcon} from '@heroicons/react/outline'
import ColoredLabel from 'components/base/ColoredLabel'
import {ReactTable, LoadingTable, ActionRowProduct} from 'components/table'
import {LoadingPage, ErrorPage} from 'components/base'
import ModalAdd from 'components/promotion/ModalProduct'
import { detailPromotion } from 'API'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'

export default function PromotionDetail() {
  const history = useHistory()
  const [openAddModal, setOpenAddModal] = useState(false)
  const {id} = useParams()
  const {data: user, isLoading, isError, error, refetch} = useQuery(['promotion', id], () => detailPromotion(id))

  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorPage error={error} />
  return (
    <>
      <ModalAdd open={openAddModal} setOpen={setOpenAddModal} id={id} refetch={refetch} action={'add'} />
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Promotion Detail</h1>
        {user.type == "CODE" ? "" : (
            <button
            className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
            onClick={() => setOpenAddModal(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Tambah Produk
            </button>
          )
        }

      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="rounded-md border border-grey-900 p-3 ">
          Nama Promotion: {user.name} <br/>
          Periode Promotion: { format(new Date(user.start_date), 'dd/MM/yyyy') } - { format(new Date(user.end_date), 'dd/MM/yyyy') }<br/>
          Tipe Promotion: {user.type}<br/>
          {user.type == "CODE" ? (<span> Max. Use/Periode: {user.max_usage_promo}</span>): ""}
          </div>

          <div className="flex flex-wrap mt-8 overflow-hidden xl:-mx-1">
            </div>
            {user.type == "CODE" ? (
              <table className="min-w-full px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border rounded-lg border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border rounded-lg border-gray-200">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border rounded-lg border-gray-200">Min. Transaksi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border rounded-lg border-gray-200">Max. Potongan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border rounded-lg border-gray-200">Max. Usage/Pengguna</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border rounded-lg border-gray-200">Diskon (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm whitespace-nowrap border rounded-lg border-gray-200">{user.code}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap border rounded-lg border-gray-200">{user.min_purchase}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap border rounded-lg border-gray-200">{user.max_discount_amount}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap border rounded-lg border-gray-200">{user.max_usage_user}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap border rounded-lg border-gray-200">{user.discount_percentage}</td>
                  </tr>
                </tbody>
            </table>

            ): <TableProduct products={user.promotion_products} refetch={refetch} />}
           
        </div>
      </div>
    </>
  )
}

function TableProduct({products = [], refetch}) {

  // define columns
  const columns = useMemoColumnsTable(['No','Nama','NoSKU','QtyMin', 'QtyMax','Percentage','Status','Action'])

  //define data
  const data = products.map((products,i) => {
    return {
      No: i+1,
      Nama: products.product.name,
      NoSKU: products.product.sku_number,
      QtyMin: products.qty_min || '-',
      QtyMax: products.qty_max || '-',
      Percentage: products.percentage || '-',
      Status: <ColoredLabel color={products.status === 'ACTIVE' ? 'green' : 'red'} text={products.status} /> ,
      Action: <ActionRowProduct products={products} editPath={`/promotion/${products.id}/edit`}  detailPath={`/promotion/${products.id}/detail`}  deletePath id={products.id} refetch={refetch}/>
    }
  })

  //view
  return (
    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <ReactTable columns={columns} data={data} />
    </div>
  )
}