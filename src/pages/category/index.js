import {useHistory} from 'react-router'
import {useQuery} from 'react-query'
import {PlusIcon} from '@heroicons/react/outline'

import {ReactTable, LoadingTable, ActionRow} from 'components/table'
import {LoadingPage, ErrorPage} from 'components/base'

import {fetchCategories} from 'API'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'
import {formatSentenceCase} from 'helpers/formatter'

export default function CategoryPage() {
  const history = useHistory()

  const {data, isLoading, isError, error} = useQuery('categories', fetchCategories, {
    select: (categories) => {
      return categories.map((category) => ({
        name: formatSentenceCase(category.name),
        icon: <img src={category.icon_url} alt={category.name} className="w-16 h-16" />,
        action: <ActionRow editPath={`/categories/${category.id}/edit`} deletePath={true} id={category.id} />,
      }))
    },
  })

  // define columns
  const columns = useMemoColumnsTable(['name', 'icon', 'action'])

  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <button
          className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
          onClick={() => history.push('/categories/create')}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Category
        </button>
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
