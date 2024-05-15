import {useState} from 'react'
import {useQuery} from 'react-query'
import {useParams} from 'react-router'
import format from 'date-fns/format'

import ColoredLabel from 'components/base/ColoredLabel'
import {ReactTable, LoadingTable} from 'components/table'
import LoadingPage from 'components/base/LoadingPage'
import ErrorPage from 'components/base/ErrorPage'
import ModalConfirmDocument from 'components/pageUser/ModalConfirmDocument'

import {fetchDetailUser, fetchOutletTypeById} from 'API'
import useMemoColumnsTable from 'hooks/useMemoColumnsTable'
import { formatCurrency } from 'helpers/formatter'

export default function OutletTypeDetailPage() {
  const {id} = useParams()

  const {data: client, isLoading, isError, error, refetch} = useQuery(['outlet', id], () => fetchOutletTypeById(id))

  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Detail Client Name</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg p-4">
            <div className="ml-4">
              <img
                className="w-32 h-32 rounded-full mb-4"
                src={
                  client.photo_url
                    ? `${process.env.REACT_APP_PUBLIC_URL}${client.photo_url}`
                    : 'https://nrcqmmgoobssxyudfvxm.supabase.in/storage/v1/object/public/dnr-asset/user.png'
                }
                alt={client.name}
              />
              <p className="mx-auto font-semibold text-2xl">{client.name}</p>
            </div>
            <div className="mt-6 mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold">Profile</h3>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 mb-8">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">NPWP</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client?.npwp || '-'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client?.phone || '-'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Credit Limit</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatCurrency(client.loan_limit || 0)}</dd>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 mb-8">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.address || '-'}</dd>
                    </div>
                  </div>
                </div>
                {client.outlets && (
                  <div>
                    <h3 className="mb-2 font-semibold">Client</h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Client Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{client.outlets.name || '-'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{client.outlets.mobile_phone || '-'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">NPWP</dt>
                        <dd className="mt-1 text-sm text-gray-900">{client.outlets.npwp || '-'}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
