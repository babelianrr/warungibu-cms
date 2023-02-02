export default function InputTextArea({
  label,
  prefix = false,
  register = () => {},
  disabled,
  PrefixComponent,
  errors,
  note,
  ...rest
}) {
  const PrefixLabel = ({prefix}) => {
    return (
      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
        {prefix}
      </span>
    )
  }

  return (
    <div className="sm:col-span-6">
      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
        {errors?.type === 'required' ? <p className="text-red-500">{label} is required</p> : errors?.type === 'max' ? <p className="text-red-500">{label} max is exceed</p> 
        : errors?.type === 'min' ? <p className="text-red-500">{label} does not meet the minimum length</p>: label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        {prefix ? <PrefixLabel prefix={prefix} /> : PrefixComponent ? <PrefixComponent /> : null}
        
        <textarea
          className={`flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block w-full min-w-0 sm:text-sm border-gray-300 ${
            prefix || PrefixComponent ? 'rounded-r-md' : 'rounded-md'
          } ${disabled && 'bg-gray-100 border-gray-300 cursor-not-allowed'}`}
          autoComplete="off"
          disabled={disabled}
          {...register(rest.name)}
          {...rest}
        >

        </textarea>
      </div>
      {
        note && <p id="note" className="text-sm">{note}</p>
      }
    </div>
  )
}
