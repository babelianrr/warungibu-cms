import {useMutation} from 'react-query'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router'
import {LockClosedIcon} from '@heroicons/react/solid'

import {fetchLogin} from 'API'
// import logo from 'assets/logo.png'
import logo from 'assets/logo-wi.png'

export default function LoginPage() {
  const history = useHistory()

  const {
    register,
    formState: {errors},
    handleSubmit,
  } = useForm()

  const {mutate, isError, error} = useMutation(fetchLogin, {
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      history.push('/')
    },
  })

  const onSubmit = async (payload) => {
    mutate({
      email: payload.email,
      password: payload.password,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-16 w-auto" src={logo} alt="DNR" />
          <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900">CMS System</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* <input type="hidden" name="remember" value="true" /> */}
          {isError && <p className="mt-4 text-red-400">{error.message}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              {errors.email?.type === 'required' && <p className="mt-4 text-red-400">Email is required</p>}
              <input
                {...register('email', {required: true})}
                id="email-address"
                name="email"
                type="email"
                autoComplete="off"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-dnr-turqoise focus:border-dnr-turqoise focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              {errors.password?.type === 'required' && <p className="mt-4 text-red-400">Password is required</p>}
              <input
                {...register('password', {required: true})}
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-dnr-turqoise focus:border-dnr-turqoise focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-dnr-dark-turqoise focus:ring-dnr-turqoise border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div> */}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-dnr-turqoise hover:bg-dnr-dark-turqoise focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-turqoise"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-dnr-dark-turqoise group-hover:text-dnr-turqoise" />
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
