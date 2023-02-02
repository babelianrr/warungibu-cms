import {useState} from 'react'
import {useQuery} from 'react-query'
import {useParams} from 'react-router'
import format from 'date-fns/format'

import ColoredLabel from 'components/base/ColoredLabel'
import {ReactTable, LoadingTable} from 'components/table'
import LoadingPage from 'components/base/LoadingPage'
import ErrorPage from 'components/base/ErrorPage'
import ModalConfirmDocument from 'components/pageUser/ModalConfirmDocument'

import {fetchDetailUser} from 'API'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'

export default function UserDetail() {
  const {email} = useParams()

  const {data: user, isLoading, isError, error, refetch} = useQuery(['product', email], () => fetchDetailUser(email))

  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Detail User</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-4">
            <div className="ml-4">
              <img
                className="w-32 h-32 rounded-full mb-4"
                src={
                  user.photo_url
                    ? `${process.env.REACT_APP_PUBLIC_URL}${user.photo_url}`
                    : 'https://nrcqmmgoobssxyudfvxm.supabase.in/storage/v1/object/public/dnr-asset/user.png'
                }
                alt={user.name}
              />
              <p className="mx-auto font-semibold text-2xl">{user.name}</p>
            </div>
            <div className="mt-6 mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold">Profile</h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 mb-8">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.phone_number || '-'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Customer Id</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.customer_id || '-'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.gender}</dd>
                    </div>
                  </dl>
                </div>
                {user.outlet_types_id && (
                  <div>
                    <h3 className="mb-2 font-semibold">Client</h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Client Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.outlet_types_id.name || '-'}</dd>
                      </div>
                      {/* <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Outlet Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.outlet_types_id.type || '-'}</dd>
                      </div> */}
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.outlet_types_id.phone || '-'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">NPWP</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.outlet_types_id.npwp || '-'}</dd>
                      </div>
                      {/* <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">No. SIA</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.outlet_types_id.no_sia || '-'}</dd>
                        <dd className="mt-1 text-sm text-gray-900">
                          Exp:{' '}
                          {user.outlets.no_sia_expired_date
                            ? format(new Date(user.outlets.no_sia_expired_date), 'dd-MM-yyyy')
                            : '-'}
                        </dd>
                      </div> */}
                      {/* <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">No. SIPA</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.outlets.no_sipa || '-'}</dd>
                        <dd className="mt-1 text-sm text-gray-900">
                          Exp:{' '}
                          {user.outlets.no_sipa_expired_date
                            ? format(new Date(user.outlets.no_sipa_expired_date), 'dd-MM-yyyy')
                            : '-'}
                        </dd>
                      </div> */}
                    </dl>
                  </div>
                )}
              </div>
            </div>
            {/* {user.outlets && user.outlets.outlet_docs.length !== 0 ? (
              <div className="mt-6 mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="mb-2 font-semibold">Outlet Docs</h3>
                <TableOutletDocs docs={user.outlets.outlet_docs} refetch={refetch} />
              </div>
            ) : null} */}
          </div>
        </div>
      </div>
    </>
  )
}

function OutletAction({doc, refetch}) {
  const [open, setOpen] = useState(false)
  if (doc.status === 'PENDING' && doc.path) {
    return (
      <>
        <ModalConfirmDocument open={open} setOpen={setOpen} refetch={refetch} doc={doc} />
        <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setOpen(true)}>
          Verifikasi Dokumen
        </div>
      </>
    )
  }
  return null
}

function TableOutletDocs({docs = [], refetch}) {
  const DocType = {
    PENDING: {
      color: 'yellow',
      text: 'Pending',
    },
    APPROVED: {
      color: 'green',
      text: 'Approved',
    },
    DECLINED: {
      color: 'red',
      text: 'Decline',
    },
  }

  // define columns
  const columns = useMemoColumnsTable(['name', 'fileNo', 'status', 'file', 'action'])

  docs.sort(function (a, b) {
    var nameA = a.name.toUpperCase() // ignore upper and lowercase
    var nameB = b.name.toUpperCase() // ignore upper and lowercase
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    // names must be equal
    return 0
  })

  const data = docs.map((doc) => {
    return {
      name: doc.name,
      fileNo: doc.file_no || '-',
      status: <ColoredLabel {...DocType[doc.status]} />,
      file: <FilePath path={doc.path} />,
      action: <OutletAction doc={doc} refetch={refetch} />,
    }
  })
  return (
    <div className="py-4 mx-auto">
      <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <ReactTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}

function FilePath({path}) {
  if (!path) return <span>-</span>
  return (
    <a
      href={`${process.env.REACT_APP_PUBLIC_URL}${path}`}
      target="_blank"
      className="cursor-pointer font-medium text-blue-600 hover:text-blue-500"
    >
      See
    </a>
  )
}
