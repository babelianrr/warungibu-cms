import {useMutation, useQueryClient} from 'react-query'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

import {Input} from 'components/form'
import LoadingPage from 'components/base/LoadingPage'

import {fetchCreateAdmin} from 'API'
import { AUTH, SUPER_USER } from 'helpers/utils'
import { NotFound } from 'pages'

export default function AdminCreatePage() {
  const history = useHistory()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm()

  const {mutate, isLoading, isError, error} = useMutation(fetchCreateAdmin, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admins'])
      history.push('/admins')
    },
  })

  const onSubmit = (data) => {
    // console.log(data)
    mutate(data)
  }

  if (isLoading) return <LoadingPage />
  // if (isError) return <ErrorPage error={error} />
  if (AUTH.role_status !== SUPER_USER) return <NotFound />

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Create Admin</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div>
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <Input label="Name" name={'name'} type={'text'} register={register} />
                <Input
                  label="Email"
                  name={'email'}
                  type={'email'}
                  register={() => register('email', {required: true})}
                  errors={errors.email}
                />
                <Input
                  label="Password"
                  name={'password'}
                  type={'password'}
                  register={() => register('password', {required: true})}
                  errors={errors.password}
                />
              </div>
              {isError && <p className="mt-4 text-red-500">{error.message}</p>}
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
    </>
  )
}
