import {useState} from 'react'
import {Switch} from '@headlessui/react'
import {XIcon, CheckIcon} from '@heroicons/react/outline'
import Modal from '../base/Modal'
import {classNames} from 'helpers/classNames'

export default function InputToggle({value}) {
  const [status, setStatus] = useState(value)
  const [open, setOpen] = useState(false)
  const handleOnChange = () => {
    setOpen(true)
  }
  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        Button={() => (
          <>
            <button
              type="button"
              className="mr-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => {
                handleOnChange()
                setStatus((prev) => !prev)
                setOpen(false)
              }}
            >
              Iya
            </button>
            <button
              type="button"
              className="mr-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Batalkan
            </button>
          </>
        )}
      >
        Are you sure to change this flash sale product?
      </Modal>
      <Switch.Group>
        <div className="flex items-center">
          <Switch
            checked={status}
            onChange={handleOnChange}
            className={`${
              status ? 'bg-dnr-turqoise' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-turqoise`}
          >
            <span
              className={`${
                status ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            >
              {status ? <CheckIcon className="h-4 w-4 text-gray-400" /> : <XIcon className="h-4 w-4 text-gray-400" />}
            </span>
          </Switch>
        </div>
      </Switch.Group>
    </>
  )
}
