import {useState} from 'react'
import {NavLink} from 'react-router-dom'

import ModalDelete from 'components/pageCategory/ModalDelete'
import ModalConfirmation from 'components/ppob/ModalConfirmation'
import ModalEdit from 'components/ppob/ModalEdit'

export default function ActionRow({product, refetch}) {
  const [openEdit, setOpenEdit] = useState(false)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(false)
  // let title = ''

  function openModalEdit() {
    setOpenEdit(true)
  }

  function openModal(title) {
    // title=title
    setTitle(title)
    setOpen(true)
  }

  return (
    <div>
      <ModalConfirmation open={open} status={product.active} product={product} setOpen={setOpen} title={title} 
        message={`Apakah anda yakin untuk ${product.active ? 'Deaktivasi':'Aktivasi'} Aktivasi PPOB ini`} email={product?.email} refetch={refetch} />
      <ModalEdit openEdit={openEdit} setOpenEdit={setOpenEdit} product={product} refetch={refetch} />
      <div>
        <p className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={() => openModalEdit("Konfirmasi Aktivasi PPOB")}>
          Edit
        </p>
      </div>
      <div>
        {
          product.active ?
            <p className="text-red-600 hover:underline cursor-pointer" onClick={() => openModal("Konfirmasi Deaktivasi PPOB")}>
              Deactivate
            </p>
          :
            <p className="text-green-600 hover:underline cursor-pointer" onClick={() => openModal("Konfirmasi Aktivasi PPOB")}>
              Activate
            </p>
        }
      </div>
    </div>
  )
}
