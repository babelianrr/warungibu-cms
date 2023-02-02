import {useState} from 'react'
import Modal from '../base/Modal'

export default function ProductItem({skuID, name, imageUrl, category, description, ...rest}) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const handleOpenModal = (params) => {
    setIsOpenModal(params)
  }

  return (
    <>
      <Modal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        onChange={() => handleOpenModal(false)}
        title="Product Detail"
      >
        <span>{description}</span>
      </Modal>
      <div className="flex flex-row space-x-2 items-center">
        <div className="flex-shrink-0 h-16 w-16">
          <img className="w-16" src={imageUrl} alt={name} />
        </div>
        <div className="flex flex-col space-y-3">
          <div className="text-sm text-left font-medium text-gray-500">No.SKU: {skuID}</div>
          <span className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => handleOpenModal(true)}>
            {name}
          </span>
          <div className="w-1/4 px-4 text-center text-xs leading-5 font-semibold rounded-full bg-dnr-turqoise text-white">
            {category}
          </div>
        </div>
      </div>
    </>
  )
}
