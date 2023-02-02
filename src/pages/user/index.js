import { useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useHistory } from 'react-router'
import { DownloadIcon, PrinterIcon, SearchIcon } from '@heroicons/react/outline'
import debounce from 'lodash.debounce'

import { exportUser, fetchImportUser, fetchUsers } from 'API'
import usePagination from 'hooks/usePagination'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'

import { ReactTable, LoadingTable } from 'components/table'
import { ErrorPage } from 'components/base'
import ColoredLabel from 'components/base/ColoredLabel'
import { ModalConfirmUser } from 'components/pageUser'
import ModalImportUser from 'components/pageUser/ModalImportUser'
import { async } from '@firebase/util'
import { formatCurrency } from 'helpers/formatter'
import { PlusIcon } from '@heroicons/react/solid'
import ModalInActivateUser from 'components/pageUser/ModalInActivateUser'
import ConfirmationModal from 'components/base/ConfirmationModal'

const UserType = {
  AUTHORIZED_USER: {
    color: 'green',
    text: 'User tanpa izin farma',
  },
  AJP_USER: {
    color: 'blue',
    text: 'User dengan izin farma',
  },
  BASIC_USER: {
    color: 'red',
    text: 'User belum terverifikasi',
  },
  UNVERIFIED_USER: {
    color: 'red',
    text: 'User belum terverifikasi',
  },
  ADMIN: {
    color: 'blue',
    text: 'Admin',
  },
}

export default function UserPage() {
  const history = useHistory()
  const fileInput = useRef();
  const [totalPage, setTotalPage] = useState(1)
  const { page, nextPage, prevPage } = usePagination(totalPage)
  const [search, setSearch] = useState('')
  const [param, setParam] = useState('')
  const [openImport, setOpenImport] = useState(false)
  const [data, setData] = useState(undefined)

  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const debounceParam = debounce((e) => setParam(e.target.value), 250)
  const debounceSearch = debounce((e) => setSearch(e.target.value), 250)

  const { isLoading, isError, error, refetch } = useQuery(
    ['users', page, search],
    // () => fetchUsers({ page: page, limit: 15, email: search, role: 'NON_ADMIN' }),
    () => fetchUsers({ page: page, limit: 15, type: param, search: search, role: 'NON_ADMIN' }),
    {
      onSuccess: (res) => {
        const users = res.users.map((user) => ({
          name: (
            <div className="flex flex-row space-x-2 items-center">
              <div className="flex flex-col space-y-1">
                <span
                  className="text-dnr-dark hover:underline cursor-pointer"
                  onClick={() => history.push(`/users/${user?.email}`)}
                >
                  {user?.name}
                </span>
              </div>
            </div>
          ),
          customerId: user?.customer_id || '-',
          ktp: user?.ktp || '-',
          creditLimit: formatCurrency(user?.loan_level ?? 0) || '-',
          currentLimit: formatCurrency(user?.loan_limit ?? 0) || '-',
          status: user?.role_status === 'AUTHORIZED_USER' || user?.role_status === 'BASIC_USER'  ? <span className='text-green-500'>User terverifikasi</span>: ( user?.role_status === 'UNVERIFIED_USER' ? <span className='text-red-500'>User belum terverifikasi</span> : '-'),
          role: <ColoredLabel {...UserType[user?.role_status]} />,
          clientName: <span className='text-red-500'>{user?.outlet_types_id?.name}</span>,
          action: <UserAction user={user} refetch={() => refetch()} history={history} />,
        }))
        setData(users)
        setTotalPage(res.totalPage)
      },
    }
  )

  const selectFile = () => {
    fileInput.current.click();
  }

  const { mutate, isLoading:isLoadingUser } = useMutation((formData) => fetchImportUser(formData), {
    onSuccess: () => {
      fetchUsers({ page: page, limit: 15, type: param, search: search, role: 'NON_ADMIN' }).then((res) => {
        const users = res.users.map((user) => ({
          name: (
            <div className="flex flex-row space-x-2 items-center">
              <div className="flex flex-col space-y-1">
                <span
                  className="text-dnr-dark hover:underline cursor-pointer"
                  onClick={() => history.push(`/users/${user?.email}`)}
                >
                  {user?.name}
                </span>
              </div>
            </div>
          ),
          customerId: user?.customer_id || '-',
          ktp: user?.ktp || '-',
          creditLimit: formatCurrency(user?.loan_level ?? 0) || '-',
          currentLimit: formatCurrency(user?.loan_limit ?? 0) || '-',
          status: user?.role_status === 'AUTHORIZED_USER' ? <span className='text-green-500'>User terverifikasi</span>: ( user?.role_status === 'UNVERIFIED_USER' ? <span className='text-red-500'>User belum terverifikasi</span> : '-'),
          role: <ColoredLabel {...UserType[user?.role_status]} />,
          clientName: <span className='text-red-500'>{user?.outlet_types_id?.name}</span>,
          action: <UserAction user={user} refetch={() => refetch()} history={history} />,
        }))
        setData(users)
        setTotalPage(res.totalPage)
      })
      window.location.reload();
    },
    onError: (err) => {
      setErrorMessage(err.message)
      setOpen(true)
      // window.location.reload();
    },
  })

  const { mutate: mutateExport, isLoading: isLoadingExport  } = useMutation(
    () => exportUser({ type: param, search: search, role: 'NON_ADMIN' }), {
    onSuccess: async (res) => {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user-list.xlsx`);
      document.body.appendChild(link);
      link.click();

      return res
    },
  })

  const handleExport = () => {
    mutateExport()
  }

  const handleChange = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    mutate(formData)
  }

  // define columns
  const columns = useMemoColumnsTable(['name', 'customerId', 'ktp', 'creditLimit', 'currentLimit', 'status', 'clientName', 'action'])

  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">User </h1>
        <div className='flex gap-4'>
          <ModalImportUser open={openImport} setOpen={setOpenImport} refetch={refetch} />
          <button
            className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
            onClick={() => history.push(`/users/create`)}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah User
          </button>
          <button
            className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
            onClick={() => selectFile()}
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Import Document
          </button>
          <input type="file" accept='.xlsx' onChange={(e) => handleChange(e.target.files[0])} ref={fileInput} style={{ "display": "none" }}/>
          <button
            className="mb-4 cursor-pointer border border-wi-blue py-2 px-3 rounded-md flex space-x-1 items-center text-white hover:text-wi-blue bg-wi-blue hover:bg-white transition-colors ease-in-out"
            onClick={() => handleExport()}
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Export Document
          </button>
        </div>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="flex-1 mb-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className='flex gap-x-2'>
                <select
                  onChange={debounceParam}
                  className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block pr-10 sm:text-sm text-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white"
                  aria-label="Default select example">
                  <option selected>Filter By</option>
                  <option value="customer_id">ID</option>
                  <option value="name">Name</option>
                  <option value="client">Client Name</option>
                </select>

                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={debounceSearch}
                  className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block pr-10 sm:text-sm placeholder-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 w-full focus:bg-white focus:text-gray-900"
                  placeholder="Search User"
                  autoComplete="off"
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                </div>
              </div>
            </form>
          </div>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {isLoading || isLoadingUser || data === undefined ? (
              <LoadingTable col={6} row={5} />
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
      <ConfirmationModal
        open={open}
        setOpen={(isOpen) => {
          setOpen(isOpen)
          window.location.reload();
        }}
        title="Failed"
        message={errorMessage}
        confirmLabel="Oke"
        canCelButton={false}
        onConfirm={() => {
          setOpen(false) 
          window.location.reload();
        }}
      />
    </>
  )
}

function UserAction({ user, refetch, history }) {
  const [open, setOpen] = useState(false)
  const [openInActivate, setOpenInActivate] = useState(false)

  return (
    <div className="space-y-2">
      <ModalConfirmUser open={open} setOpen={setOpen} email={user?.email} id={user?.id} refetch={refetch} />
      <ModalInActivateUser open={openInActivate} setOpen={setOpenInActivate} email={user?.email} id={user?.id} refetch={refetch} />
      {/* {user?.role_status === 'BASIC_USER' || user?.role_status === 'UNVERIFIED_USER' ? ( */}
      {user?.role_status === 'UNVERIFIED_USER' ? (
        <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setOpen(true)}>
          Verifikasi User
        </div>
      ) : null}

      {user?.role_status === 'BASIC_USER' || user?.role_status === 'AUTHORIZED_USER' ? (
        <div className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => setOpenInActivate(true)}>
          Nonaktifkan User
        </div>
      ) : null}
      <div
        className="text-dnr-dark-orange hover:underline cursor-pointer"
        onClick={() => history.push(`/users/${user?.email}`)}
      >
        Details
      </div>
      <div
        className="text-dnr-dark-orange hover:underline cursor-pointer"
        onClick={() => history.push(`/users/edit/${user?.email}`)}
      >
        Edit
      </div>
    </div>
  )
}
