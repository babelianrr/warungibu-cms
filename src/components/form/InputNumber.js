import NumberFormat from 'react-number-format'

export default function InputNumber({
  label,
  prefix = false,
  disabled,
  register = () => {},
  onChange = () => {},
  defaultValue,
  PrefixComponent,
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
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        {prefix ? <PrefixLabel prefix={prefix} /> : PrefixComponent ? <PrefixComponent /> : null}
        <NumberFormat
          className={`flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block w-full min-w-0 sm:text-sm border-gray-300 ${
            prefix || PrefixComponent ? 'rounded-r-md' : 'rounded-md'
          } ${disabled && 'bg-gray-100 border-gray-300 cursor-not-allowed'}`}
          autoComplete="off"
          thousandSeparator={true}
          disabled={disabled}
          renderText={(value, props) => <div {...props}>{value}</div>}
          value={defaultValue}
          onValueChange={(values) => {
            onChange(values.value)
          }}
          // {...rest}
        />
      </div>
    </div>
  )
}
