import {useState} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

import {Input, InputFile, InputSelect} from 'components/form'
import LoadingPage from 'components/base/LoadingPage'
import ErrorPage from 'components/base/ErrorPage'
import {createOutletType, fetchCreateUser, fetchOutletTypes} from 'API'
import { AUTH, SUPER_USER } from 'helpers/utils'
import NotFoundPage from 'pages/NotFound'
import ConfirmationModal from 'components/base/ConfirmationModal'

export default function OutletTypeCreatePage() {
  const history = useHistory()
  const queryClient = useQueryClient()

  const {register, handleSubmit} = useForm()
  const [images, setImages] = useState([])
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {data: clients} = useQuery('clients', fetchOutletTypes, {
    select: (clients) => {
      return clients.map((client) => ({
        value: client.id,
        label:client.name,
      }))
    },
  })

  const {mutate, isLoading, isError, error} = useMutation(fetchCreateUser, {
    onSuccess: (data) => {
      // queryClient.invalidateQueries(['outlet-types'])
      history.push('/users')
    },
    onError: (err) => {
      setErrorMessage(err.message)
      setOpen(true)
    }
  })

  const onSubmit = (data) => {
    mutate({
      name: data.name,
      email: data.email,
      phone_number: `${data.phone_number}`,
      gender: data.gender,
      ktp: data.ktp,
      outlet_types_id: data.outlet_types_id,
    })
  }

  // console.log('clients :',clients)

  if (isLoading) return <LoadingPage />
  // if (isError) return <ErrorPage error={errorMessage} />
  if (AUTH.role_status !== SUPER_USER) return <NotFoundPage />

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Create User</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div>
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <Input register={register} label="Name" name={'name'} type={'text'} />
                <Input register={register} label="Email" name={'email'} type={'email'} />
                <Input register={register} label="Phone" name={'phone_number'} type={'number'} prefix={'+62'} />
                <Input register={register} label="NIK" name={'ktp'} type={'number'} />
                <InputSelect register={register} label="Gender" name={'gender'} 
                  data={[
                    {value:'Male', label:'Male'},
                    {value:'Female', label:'Female'}
                  ]}/>
                <InputSelect register={register} label="Client Name" name={'outlet_types_id'} 
                  data={clients}/>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-bicart focus:border-wi-blue"
                    onClick={() => history.goBack()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-wi-blue hover:bg-wi-dark-wi focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-bicart focus:border-wi-blue"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ConfirmationModal
        open={open}
        setOpen={setOpen}
        title="Failed"
        message={errorMessage}
        confirmLabel="Oke"
        canCelButton={false}
        onConfirm={() => setOpen(false)}
      />
    </>
  )
}
