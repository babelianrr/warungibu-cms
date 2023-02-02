import React, {useState} from 'react'
import Selectoption from 'components/base/SelectOption'
import {classNames} from 'helpers/classNames'
import {ChevronDownIcon} from '@heroicons/react/outline'
import {SelectorIcon} from '@heroicons/react/solid'
import InputLabel from 'components/base/InputLabel'

export default function SelectInput({
  onChange = () => {},
  data = [],
  placeholder,
  id,
  label,
  disabled,
  noLabel = false,
  className,
  rounded = 'rounded-md',
  background = 'bg-white',
  border = 'border-gray-300',
  defaultValue = null,
}) {
  const activeClasses = `${background} ${border} focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 cursor-default`
  const disabledClassess = 'bg-gray-100 ${border} cursor-not-allowed'
  return (
    <Selectoption
      data={data}
      disabled={disabled}
      defaultValue={defaultValue}
      onChange={onChange}
      selectedElement={(selected) => (
        <>
          <div className="relative">
            {!noLabel ? (
              <Selectoption.Label>
                <InputLabel id={id} error={null} label={label} className="mb-1" />
              </Selectoption.Label>
            ) : null}
            <Selectoption.Button
              className={` relative w-full border ${rounded} shadow-sm pl-3 pr-10 py-2 text-left  focus:outline-none sm:text-sm ${
                disabled ? disabledClassess : activeClasses
              } ${className}`}
            >
              <span className={`${selected ? 'text-gray-900' : 'text-gray-500'} text-sm `}>
                {selected?.value ?? placeholder}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Selectoption.Button>
          </div>
        </>
      )}
    >
      <Selectoption.Options
        static
        className="absolute z-10 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      >
        {data.map((data) => (
          <Selectoption.Option
            key={data.id}
            className={({active}) =>
              classNames(
                active ? 'text-white bg-dnr-dark-orange' : 'text-gray-900',
                'cursor-default select-none relative py-2 px-4'
              )
            }
            value={data}
          >
            {({selected, disabled}) => (
              <div className="flex justify-between">
                <span
                  className={classNames(
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate',
                    disabled ? 'text-gray-300' : null
                  )}
                >
                  {data.value}
                </span>
              </div>
            )}
          </Selectoption.Option>
        ))}
      </Selectoption.Options>
    </Selectoption>
  )
}
