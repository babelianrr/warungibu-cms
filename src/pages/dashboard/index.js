import {useQuery} from 'react-query'

import {LoadingPage, ErrorPage} from 'components/base'
import {UserIcon, ShoppingCartIcon, CalculatorIcon} from '@heroicons/react/outline'

import {fetchReport} from 'API'
import {formatCurrency} from 'helpers/formatter'

export default function DashboardPage() {
  const {data, isLoading, isError, error} = useQuery('report', fetchReport)

  if (isLoading) return <LoadingPage />

  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="mx-auto sm:px-6 md:px-8">
        <div className="py-4">
          <div className="h-96 grid grid-cols-2 gap-4 p-4">
            <div className="bg-white shadow rounded-lg overflow-hidden sm:p-6 flex space-x-8 justify-start items-center">
              <CalculatorIcon className="bg-wi-blue rounded-md h-16 w-16 text-white p-2" />
              <dd className="flex flex-col">
                <p className="text-xl font-medium text-gray-500 truncate">Total Purchases</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(data.total_transaction)}</p>
              </dd>
            </div>

            <div className="w-full grid grid-rows-2 gap-4">
              <div className="bg-white shadow rounded-lg overflow-hidden sm:p-6 flex space-x-8 justify-start items-center">
                <UserIcon className="bg-wi-blue rounded-md h-16 w-16 text-white p-2" />
                <dd className="flex flex-col">
                  <p className="text-xl font-medium text-gray-500 truncate">Active Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{data.active_user}</p>
                </dd>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden sm:p-6 flex space-x-8 justify-start items-center">
                <ShoppingCartIcon className="bg-wi-blue rounded-md h-16 w-16 text-white p-2" />
                <dd className="flex flex-col">
                  <p className="text-xl font-medium text-gray-500 truncate">Total Transactions</p>
                  <p className="text-2xl font-semibold text-gray-900">{data.total_sales}</p>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
