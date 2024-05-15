import {useEffect} from 'react'
import {ExclamationCircleIcon} from '@heroicons/react/solid'
import useInput from 'hooks/useInput'
import InputLabel from './InputLabel'

export default function Input({
  id,
  label,
  type = 'text',
  error,
  placeholder,
  onChange = () => {},
  prefix,
  disabled,
  className,
  width = 'w-full',
  withLabel = true,
  PrefixComponent,
  defaultValue = '',
  background = 'bg-dnr-gray',
  border = 'border-gray-300',
  boldLabel = false,
  validation = {},
  isError = () => {},
  ...rest
}) {
  const errorClasses = 'border border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
  const baseClassess = `border ${border} ${background} text-gray-900 focus:ring-dnr-turqoise focus:border-gray-900 focus:bg-white`

  const withPrefixClasses = 'rounded-none rounded-r-md'
  const withoutPrefixClasses = 'rounded-md'

  const disabledClass = 'bg-gray-100 border-gray-300 cursor-not-allowed'

  const [value, setValue, setFocus, errorValue] = useInput(defaultValue, validation)

  function handleOnChange(e) {
    if (onChange) {
      const newValue = onChange(e.target.value) || e.target.value
      setValue(newValue)
    } else {
      setValue(e.target.value)
    }
  }

  useEffect(() => {
    errorValue ? isError(true) : isError(false)
  }, [errorValue, isError])

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className={width}>
      {withLabel ? <InputLabel error={errorValue || error} id={id} label={label} boldLabel={boldLabel} /> : null}
      <div className="mt-1 relative flex rounded-md shadow-sm">
        {prefix ? (
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            {prefix}
          </span>
        ) : PrefixComponent ? (
          <PrefixComponent />
        ) : null}
        <input
          type={type}
          name={id}
          id={id}
          value={value}
          className={`block w-full focus:outline-none sm:text-sm ${errorValue || error ? errorClasses : ''} ${
            prefix || PrefixComponent ? withPrefixClasses : withoutPrefixClasses
          } ${disabled ? disabledClass : baseClassess} ${className}`}
          placeholder={placeholder}
          onChange={handleOnChange}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          {...rest}
        />
        {errorValue || error ? (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        ) : null}
      </div>
      {errorValue || error ? <p className="mt-2 text-sm text-red-600">{errorValue || error}</p> : null}
    </div>
  )
}
