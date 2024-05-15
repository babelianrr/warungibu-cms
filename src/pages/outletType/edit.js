import {useState, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {useForm} from 'react-hook-form'
import {useHistory, useParams} from 'react-router-dom'

import {Input, InputFile, InputNumber} from 'components/form'
import {fetchOutletTypeById, updateOutletType} from 'API'
import { AUTH, SUPER_USER } from 'helpers/utils'
import NotFoundPage from 'pages/NotFound'
import InputTextArea from 'components/form/InputTextArea'

export default function OutletTypeEditPage() {
  const history = useHistory()
  const queryClient = useQueryClient()
  const {id} = useParams()
  const [data, setData] = useState({})
  const {register, handleSubmit} = useForm()
  const [address, setAddress] = useState('')
  const [loanLimit, setLoanLimit] = useState('')

  // fetch by id
  useEffect(() => {
    async function fetch() {
      let outletType = await fetchOutletTypeById(id)
      setData({
        ...outletType,
        phone:outletType?.phone ? outletType?.phone.slice(3) : ''
      })
      setLoanLimit(outletType?.loan_limit)
    }
    fetch()
  }, [id])

  // patch by id
  const {mutate} = useMutation((payload) => updateOutletType(id, payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['outlet-types'])
      history.push('/outlet_types')
    },
  })

  const onSubmit = (payload) => {
    mutate({
      name: payload.name || data.name,
      npwp: payload.npwp || data.npwp,
      phone: payload.phone ? `+62${payload.phone}` : `+62${data.phone}`,
      address: payload.address || data.address,
      loan_limit: loanLimit,
    })
  }

  if (AUTH.role_status !== SUPER_USER) return <NotFoundPage />

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Client Name</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div>
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <Input register={register} label="Client Name" name={'name'} type={'text'} defaultValue={data?.name} />
                <Input register={register} label="NPWP" name={'npwp'} type={'text'} defaultValue={data?.npwp} />
                <Input register={register} label="Phone" name={'phone'} type={'number'} defaultValue={data?.phone} prefix={'+62'} />
                <InputTextArea register={register} label="Address" name={'address'} defaultValue={data?.address} />
                {/* <Input register={register} label="Credit Limit" name={'loan_limit'} type={'number'} note="*Input nominal saja" defaultValue={data?.loan_limit} /> */}
                <InputNumber
                  label="Credit Limit"
                  prefix="Rp."
                  type={'number'}
                  defaultValue={loanLimit}
                  onChange={setLoanLimit}
                />
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
    </>
  )
}
