export default function InputSelect({
  label,
  register = () => {},
  disabled,
  PrefixComponent,
  errors,
  note,
  data,
  defaultValue,
  ...rest
}) {

  return (
    <div className="sm:col-span-6">
      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
        {errors?.type === 'required' ? <p className="text-red-500">{label} is required</p> : errors?.type === 'max' ? <p className="text-red-500">{label} max is exceed</p> 
        : errors?.type === 'min' ? <p className="text-red-500">{label} does not meet the minimum length</p>: label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <select
          className={`flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block w-full min-w-0 sm:text-sm border-gray-300 rounded-md 
           ${disabled && 'bg-gray-100 border-gray-300 cursor-not-allowed'}`}
          autoComplete="off"
          disabled={disabled}
          {...register(rest.name)}
          {...rest}
        >
          <option 
            className={`flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block w-full min-w-0 sm:text-sm border-gray-300 rounded-md`}
            value=''
          >
            --
          </option>
          {
             data && data?.map((item) => {
              return <option 
                className={`flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block w-full min-w-0 sm:text-sm border-gray-300 rounded-md`}
                value={item.value}
                selected={item.value === defaultValue ? true : false}
              >
                {item.label}
              </option>
            })
          }
        </select>
      </div>
    </div>
  )
}
