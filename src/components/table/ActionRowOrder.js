import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { format } from 'date-fns'
import ModalDelete from 'components/pageOrder/ModalDelete'
import ModalUpdate from 'components/pageOrder/ModalCartProduct'

export default function ActionRowOrder({ cart, transaction_number, dataCount, totalQty, editPath, detailPath, deletePath, DeleteComponent = ModalDelete, UpdateComponent = ModalUpdate, refetch }) {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const today = format(new Date(), 'yyyy-MM-dd')

  function openModal() {
    setOpen(true)
  }

  function openEdit() {
    setEdit(true)
  }

  return (
    <div className="flex justify-around space-x-4">
      <DeleteComponent open={open} setOpen={setOpen} cart_id={cart.id} transaction_number={transaction_number} refetch={refetch} />
      <UpdateComponent open={edit} setOpen={setEdit} totalQty={totalQty} cart={cart} transaction_number={transaction_number} action={'edit'} refetch={refetch} />

      <p className="text-dnr-dark-orange hover:underline cursor-pointer flex w-10" onClick={openEdit}>
        Update
      </p>

      {dataCount > 1 ? (
        <p className="text-red-500 hover:underline cursor-pointer flex w-10" onClick={openModal}>
          Delete
        </p>
      ) : ""}
    </div>
  )
}
