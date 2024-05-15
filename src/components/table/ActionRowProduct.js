import {useState} from 'react'
import {NavLink} from 'react-router-dom'

import ModalToggle from 'components/promotion/ModalToggle'
import ModalUpdate from 'components/promotion/ModalProduct' 

export default function ActionRowProduct({products,editPath, detailPath, deletePath, id, /* DeleteComponent = ModalDelete,*/ UpdateComponent =  ModalUpdate,refetch }) {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)

  function openModal() {
    setOpen(true)
  }

  function openEdit(){
    setEdit(true)
  }
  
  return (
    <div className="flex justify-around space-x-4">
      <ModalToggle open={open} setOpen={setOpen} id={id} status={products.status} refetch={refetch}/>
      <UpdateComponent open={edit} setOpen={setEdit} id={products.id} products={products} refetch={refetch} action={'edit'}/> 
      {editPath && (
        <>
          <p className="text-dnr-dark-orange hover:underline cursor-pointer" onClick={openEdit}>
            Edit
          </p>
        </>
      )}

    {/* TOGGLE ACTIVE/INACTIVE */}

    {products.status === "ACTIVE" ? (
          <p className="text-red-500 hover:underline cursor-pointer" onClick={openModal}>
            Inactive
          </p>
      ) : (
        <p className="text-red-500 hover:underline cursor-pointer" onClick={openModal}>
           Active
        </p>
      ) 
    }

    </div>
  )
}
