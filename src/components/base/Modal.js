import {Fragment} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {XCircleIcon} from '@heroicons/react/outline'
import { classNames } from 'helpers/classNames'

export default function Modal({
  open,
  setOpen,
  children,
  overflowHidden = true,
  Button,
  size = 'standard',
  closable = true,
  display
}) {
  const sizeTable = {
    standard: 'max-w-xl',
    bigger: 'max-w-2xl',
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-20 inset-0 overflow-y-auto"
        open={open}
        onClose={(val) => {
          if (closable) {
            setOpen(val)
          }
        }}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={`inline-block transform transition-all ${sizeTable[size]} w-full`}>
              <div className="hidden sm:block absolute top-0 right-0 rounded-full">
                {closable ? (
                  <button
                    type="button"
                    className="rounded-md text-white hover:text-gray-900 focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XCircleIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <div
                className={`inline-block align-bottom bg-white rounded-lg px-2 pt-5 pb-4 text-left ${
                  overflowHidden ? 'overflow-hidden' : null
                } shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:p-6`}
              >
                <div className={classNames(display === `block` ? `sm:block sm:items-start` : `sm:flex sm:items-start`)}>{children}</div>

                {Button ? (
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button />
                  </div>
                ) : null}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

Modal.Title = Dialog.Title
