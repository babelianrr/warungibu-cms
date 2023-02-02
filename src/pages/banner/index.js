import {useState} from 'react'
import {useHistory} from 'react-router'
import {useMutation, useQuery} from 'react-query'
import {PlusIcon} from '@heroicons/react/outline'

import {ReactTable, LoadingTable} from 'components/table'
import {LoadingPage, ErrorPage} from 'components/base'
import ConfirmationModal from 'components/base/ConfirmationModal'

import {fetchBanner, deleteBanner} from 'API'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'

function DeleteBanner({banner, onSuccess, refetch}) {
  const [open, setOpen] = useState(false)
  const {isLoading, mutate: handleMutate} = useMutation('delete-banner', deleteBanner, {
    onSuccess() {
      setOpen(false)
      refetch()
    },
  })
  return (
    <>
      <ConfirmationModal
        open={open}
        setOpen={setOpen}
        title="Konfirmasi hapus banner"
        message="Apakah anda yakin untuk menghapus banner ini"
        confirmLabel="Konfirmasi"
        processing={isLoading}
        onConfirm={() => handleMutate(banner.id)}
      />
      <div className="text-red-500 hover:underline cursor-pointer" onClick={() => setOpen(true)}>
        Hapus Banner
      </div>
    </>
  )
}

export default function Banner() {
  const history = useHistory()

  const {data, isLoading, isError, error, refetch} = useQuery('banner', fetchBanner, {
    select(response) {
      return response.map((banner) => ({
        image: (
          <div className="flex-shrink-0 p-2 border border-gray-200 rounded-md">
            <img className="" src={banner.image} />
          </div>
        ),
        action: <DeleteBanner banner={banner} refetch={() => refetch()} />,
      }))
    },
  })

  // define columns
  const columns = useMemoColumnsTable(['image', 'action'])

  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Banner</h1>
        <button
          className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
          onClick={() => history.push('/banners/create')}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Banner
        </button>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {isLoading ? <LoadingTable col={2} row={5} /> : <ReactTable columns={columns} data={data} />}
          </div>
        </div>
      </div>
    </>
  )
}
