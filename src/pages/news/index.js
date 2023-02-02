import {useHistory} from 'react-router'
import {useQuery} from 'react-query'
import {PlusIcon} from '@heroicons/react/outline'

import {ReactTable, LoadingTable, ActionRow} from 'components/table'
import {LoadingPage, ErrorPage} from 'components/base'
import ModalDelete from 'components/pageNews/ModalDelete'

import {getNews} from 'API'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'

export default function NewsPage() {
  const history = useHistory()

  const {data, isLoading, isError, error} = useQuery('news', getNews, {
    select: (news) => {
      return news.map((item) => ({
        title: item.title,
        action: (
          <ActionRow
            editPath={`/news/${item.slug}/${item.id}/edit`}
            detailPath={`/news/${item.slug}/detail`}
            deletePath
            id={item.id}
            DeleteComponent={ModalDelete}
          />
        ),
      }))
    },
  })

  // define columns
  const columns = useMemoColumnsTable(['title', 'action'])

  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">News</h1>
        <button
          className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
          onClick={() => history.push('/news/create')}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          News
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
