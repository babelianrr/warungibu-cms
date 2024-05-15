import {Fragment, useState} from 'react'
import {Listbox, Transition} from '@headlessui/react'

export default function Selectoption({data, defaultValue = data[0], selectedElement, children, onChange, disabled}) {
  const [selected, setSelected] = useState(defaultValue)

  function handleOnChange(value) {
    setSelected(value)

    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Listbox value={selected} onChange={handleOnChange} disabled={disabled}>
      {({open}) => (
        <>
          {selectedElement(selected)}
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {children}
          </Transition>
        </>
      )}
    </Listbox>
  )
}

Selectoption.Button = Listbox.Button
Selectoption.Option = Listbox.Option
Selectoption.Options = Listbox.Options
Selectoption.Label = Listbox.Label
