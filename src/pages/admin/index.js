import {useState} from 'react'
import {useHistory} from 'react-router'
import {useQuery} from 'react-query'
import {PlusIcon} from '@heroicons/react/outline'

import {ReactTable, LoadingTable} from 'components/table'
import {ErrorPage} from 'components/base'

import {fetchAdmin} from 'API'
import usePagination from 'hooks/usePagination'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'
import { SUPER_USER } from 'helpers/utils'
import { authenticatedUser } from 'helpers/isAuthenticated'

export default function AdminPage() {
  const history = useHistory()
  const Users = authenticatedUser()
  const [totalPage, setTotalPage] = useState(1)
  const {page, nextPage, prevPage} = usePagination(totalPage)
  const [data, setData] = useState(undefined)
  const {isLoading, isError, error} = useQuery(
    ['admins', page],
    () => fetchAdmin({page: page, limit: 15, role: 'ADMIN'}),
    {
      onSuccess: (res) => {
        const admins = res.users.map((admin) => ({
          name: admin.name,
          email: admin.email,
        }))
        setData(admins)
        setTotalPage(res.totalPage)
      },
    }
  )

  // define columns
  const columns = useMemoColumnsTable(['name', 'email'])

  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Admin</h1>
        {Users.role_status === SUPER_USER ?
          <button
            className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
            onClick={() => history.push('/admins/create')}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Admin
          </button>
        : ''
        }
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {isLoading || data === undefined ? (
              <LoadingTable col={2} row={5} />
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
