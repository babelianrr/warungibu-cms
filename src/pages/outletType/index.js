import {useHistory} from 'react-router'
import {useQuery} from 'react-query'
import {PlusIcon} from '@heroicons/react/outline'

import {ReactTable, LoadingTable, ActionRow} from 'components/table'
import { ProductRow, StatusItem } from 'components/pageProduct'
import {LoadingPage, ErrorPage} from 'components/base'
import ModalDelete from 'components/pageOutletType/ModalDelete'

import {fetchOutletTypes} from 'API'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'
import { AUTH, SUPER_USER } from 'helpers/utils'
import { authenticatedUser } from 'helpers/isAuthenticated'
import ModalStatus from 'components/pageOutletType/ModalStatus'

export default function OutletTypePage() {
  const history = useHistory()
  const Users = authenticatedUser()

  const {data, isLoading, isError, error} = useQuery('outlet-types', fetchOutletTypes, {
    select: (outletTypes) => {
      return outletTypes.map((outletType) => ({
        name: outletType.name,
        status: 
          outletType?.active ?
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}>
              Active
            </span>
          :
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800`}>
              InActive
            </span>
          ,
        action: (
          <ActionRow
            editPath={`/outlet_types/${outletType.id}/edit`}
            statusPath={`/outlet_types/${outletType.id}/status`}
            detailPath={`/outlet_types/${outletType.id}/detail`}
            status={outletType?.active}
            deletePath
            id={outletType.id}
            DeleteComponent={ModalDelete}
            StatusComponent={ModalStatus}
          />
        ),
      }))
    },
  })

  // define columns
  let dataColumns = ['name', 'status', 'action']
  let columns

  if (Users.role_status !== SUPER_USER) {
    dataColumns.splice(1, 1)
  }

  columns = useMemoColumnsTable(dataColumns)
  
  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Client Name</h1>
        {Users.role_status === SUPER_USER ? 
        <button
          className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
          onClick={() => history.push('/outlet_types/create')}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Client Name
        </button>
        : ''
        }
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {isLoading ? <LoadingTable col={3} row={5} /> : <ReactTable columns={columns} data={data} />}
          </div>
        </div>
      </div>
    </>
  )
}
