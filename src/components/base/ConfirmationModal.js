import {ExclamationCircleIcon, InformationCircleIcon} from '@heroicons/react/outline'
import {useRef} from 'react'
import Modal from './Modal'
import {classNames} from 'helpers/classNames'

export default function ConfirmationModal({
  open,
  setOpen,
  title,
  message,
  onConfirm,
  confirmLabel = 'Setuju',
  canCelButton=true,
  type = 'danger',
  processing,
  Body,
}) {
  const cancelButtonRef = useRef(null)

  const colorScheme = {
    danger: {
      classes: 'bg-red-600 hover:bg-red-700',
      Icon: <ExclamationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />,
      background: 'bg-red-100',
    },
    information: {
      classes: 'bg-blue-600 hover:bg-blue-600',
      Icon: <InformationCircleIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />,
      background: 'bg-blue-100',
    },
  }

  const {classes, Icon, background} = colorScheme[type]

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      Button={() => (
        <>
          <button
            type="button"
            className={classNames(
              'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm',
              processing ? 'bg-gray-300 text-white cursor-not-allowed' : classes
            )}
            onClick={() => {
              onConfirm()
              // setOpen(false)
            }}
          >
            {processing ? 'Memproses Data' : confirmLabel}
          </button>
          {
            canCelButton ?
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setOpen(false)}
                ref={cancelButtonRef}
              >
                Batalkan
              </button>
            :''
          }
        </>
      )}
    >
      <div className="sm:flex sm:items-start">
        <div
          className={classNames(
            'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full  sm:mx-0 sm:h-10 sm:w-10',
            background
          )}
        >
          {Icon}
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Modal.Title as="h3" className="text-lg leading-6 font-dayOne text-gray-900">
            {title}
          </Modal.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
            {Body ? Body : null}
          </div>
        </div>
      </div>
    </Modal>
  )
}
