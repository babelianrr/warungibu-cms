import {useState} from 'react'
import {useForm} from 'react-hook-form'
import Modal from '../base/Modal'

export default function ModalAddAdmin() {
  const {register, handleSubmit} = useForm()
  const [isOpenModal, setIsOpenModal] = useState(false)

  const handleOpenModal = (params) => {
    setIsOpenModal(params)
  }
  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <>
      <Modal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        onChange={() => handleOpenModal(false)}
        title="Create New Admin"
      >
        <span>Are you sure to add new admin?</span>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register('email')}
            type="email"
            className="mt-2 flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block w-full min-w-0 sm:text-sm border-gray-300 rounded-md"
            autoComplete="off"
            placeholder="input email"
          />
          <input
            {...register('name')}
            type="text"
            className="mt-2 flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block w-full min-w-0 sm:text-sm border-gray-300 rounded-md"
            autoComplete="off"
            placeholder="input name"
          />
          <input
            {...register('password')}
            type="password"
            className="mt-2 flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block w-full min-w-0 sm:text-sm border-gray-300 rounded-md"
            autoComplete="off"
            placeholder="input password"
          />
          <input type="submit" />
        </form>
      </Modal>

      <button
        className="mb-4 border border-dnr-turqoise py-2 px-3 rounded-md flex space-x-1 items-center text-dnr-turqoise cursor-pointer hover:bg-dnr-turqoise hover:text-white transition-colors ease-in-out"
        onClick={() => setIsOpenModal(true)}
      >
        Add Admin
      </button>
    </>
  )
}
