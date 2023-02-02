import {useState} from 'react'
import {useHistory} from 'react-router'
import {useMutation, useQuery} from 'react-query'
import debounce from 'lodash.debounce'
import {SearchIcon} from '@heroicons/react/outline'
import {PlusIcon} from '@heroicons/react/outline'
import {format} from 'date-fns'
import {ReactTable, LoadingTable, ActionRowPromotion} from 'components/table'
import usePagination from 'hooks/usePagination'
import {LoadingPage, ErrorPage} from 'components/base'
import ColoredLabel from 'components/base/ColoredLabel'
import ModalAdd from 'components/promotion/ModalPromotion'
import ModalDelete from 'components/promotion/ModalDelete'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'

import { getPromotion } from 'API'

export default function Promotion() {
  const history = useHistory()
  
  const [activeFilter, setActiveFilter] = useState('')
  const [search, setSearch] = useState('')
  const debounceSearch = debounce((e) => setSearch(e.target.value), 250)
  const promotionStatus = ['ACTIVE', 'INACTIVE']

  const [totalPage, setTotalPage] = useState(1)
  const {page, nextPage, prevPage} = usePagination(totalPage)
  const [data, setData] = useState(undefined)
  const limit = 10;

  const [openAddModal, setOpenAddModal] = useState(false)
  
  const {isLoading, isError, error, refetch} = useQuery(
    ['promotion', page, search, activeFilter],
    () => getPromotion({page: page, limit: limit, name: search, status: activeFilter}),
    {
      onSuccess: (res) => {
        //start = ($num_rec_per_page * ($page-1))+1;
        let start = (limit * (page-1))+1;
        const promotions = res.promotions.map((promotion,i) => ({
          No:  <span className="">{i+start}</span>,
          NamaPromo: <span className="">{promotion.name}</span>,
          TipePromo: <span className="">{promotion.type}</span>,        
          StartDate: format(new Date(promotion.start_date), 'dd/MM/yyyy'),
          EndDate: format(new Date(promotion.end_date), 'dd/MM/yyyy'),
          status: <ColoredLabel color={promotion.status === 'ACTIVE' ? 'green' : 'red'} text={promotion.status} />,
          action: <ActionRowPromotion promotion={promotion} editPath={`/promotion/${promotion.id}/edit`}  detailPath={`/promotion/${promotion.id}/detail`}  deletePath id={promotion.id} refetch={refetch} />,
        }))
        setData(promotions)
        setTotalPage(res.totalPage)
      },
    }
  )

  // define columns
  const columns = useMemoColumnsTable(['No', 'NamaPromo', 'TipePromo', 'StartDate','EndDate','status', 'action'])

  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="px-8 flex justify-between">
        <ModalAdd open={openAddModal} setOpen={setOpenAddModal} refetch={refetch} action={'add'}/>
        <h1 className="text-2xl font-semibold text-gray-900">Promotion</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        
        <div className="flex space-x-4">
            <div>
              <h5 className="text-gray-900 mb-2">Status Promotion</h5>
              <div className="flex space-x-2 text-sm">
                <div
                  onClick={() => setActiveFilter('')}
                  className={`${
                    activeFilter === ''
                      ? 'bg-wi-dark-wi border-wi-blue text-white '
                      : 'bg-white border-wi-blue text-dnr-dark-bicart'
                  } rounded-md  px-2 py-2 my-auto hover:bg-wi-dark-wi hover:text-white transition-colors ease-in-out cursor-pointer border`}
                >
                  <span>Semua</span>
                </div>
                {promotionStatus.map((status, index) => (
                  <div
                    key={index}
                    className={`${
                      activeFilter === status
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
            <div className="flex-1 mb-4">
              <h5 className="text-gray-900 mb-2">Cari Promotion</h5>

              <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={debounceSearch}
                  className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block w-full pr-10 sm:text-sm placeholder-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white focus:text-gray-900"
                  placeholder="Search Promotion By Name"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                </div>
              </form>
            </div>
            <div className="flex mt-7 mb-2">
              <button className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
                      onClick={() => setOpenAddModal(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Promotion
              </button>
            </div>
          </div>

          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {isLoading || data === undefined ? (<LoadingTable />) : (
              <ReactTable
              columns={columns}
              data={data}
              pagination={true}
              page={page}
              totalPage={totalPage}
              nextPage={nextPage}
              prevPage={prevPage}/>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
