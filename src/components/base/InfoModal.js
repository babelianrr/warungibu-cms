/* This example requires Tailwind CSS v2.0+ */

import Modal from './Modal'
import Button from './Button'
import ModalDelete from 'components/pageOutletType/ModalDelete'

export default function InfoModal({open, setOpen, title, message}) {
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="text-center sm:mt-0 sm:w-full">
        <Modal.Title as="h3" className="text-xl leading-6 tracking-wide font-dayOne text-gray-900 text-center mb-4">
          {title}
        </Modal.Title>
        <div className="mt-2 flex flex-col items-center space-y-4">
          <p className="text-gray-900 leading-6 mx-2 text-sm ">{message}</p>

          <Button className="ml-auto" color="turqoise" onClick={() => setOpen(false)}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  )
}
