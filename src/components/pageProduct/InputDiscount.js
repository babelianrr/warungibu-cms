import {useState} from 'react'
import {PencilAltIcon} from '@heroicons/react/outline'
import Modal from '../base/Modal'

export default function InputDiscount({value}) {
  const [discount, setDiscount] = useState(value)
  const [isOpenModal, setIsOpenModal] = useState(false)

  const handleOnChange = (e) => {
    setDiscount(e.target.value)
  }

  const handleOpenModal = (params) => {
    setIsOpenModal(params)
  }

  return (
    <>
      <Modal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        onChange={() => handleOpenModal(false)}
        title="Change Discount %"
      >
        <span>Are you sure to change this discount product?</span>
        <input
          type="number"
          className="mt-2 flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block w-full min-w-0 sm:text-sm border-gray-300 rounded-md"
          autoComplete="off"
          placeholder="input discount"
          value={discount}
          onChange={handleOnChange}
        />
      </Modal>
      <div className="flex justify-between space-x-2">
        <div className="text-sm text-right text-gray-900">{discount}%</div>
        <button onClick={() => handleOpenModal(true)}>
          <PencilAltIcon className="w-5 h-5 text-yellow-400 hover:text-yellow-200" />
        </button>
      </div>
    </>
  )
}
