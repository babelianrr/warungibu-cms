import {useState} from 'react'
import {NavLink} from 'react-router-dom'
import {format} from 'date-fns'
import ModalDelete from 'components/promotion/ModalDelete'
import ModalUpdate from 'components/promotion/ModalPromotion'

export default function ActionRowPromotion({promotion,editPath, detailPath, deletePath, id, DeleteComponent = ModalDelete, UpdateComponent =  ModalUpdate, refetch}) {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const today = format(new Date(), 'yyyy-MM-dd')

  function openModal() {
    setOpen(true)
  }

  function openEdit(){
    setEdit(true)
  }
  return (
    <div className="flex justify-around space-x-4">
      <DeleteComponent open={open} setOpen={setOpen} id={id} />
      <UpdateComponent open={edit} setOpen={setEdit} id={id} promotion={promotion} refetch={refetch} action={'edit'}/>

      {promotion.start_date > today  && promotion.status === 'ACTIVE'? (
          <p className="text-dnr-dark-orange hover:underline cursor-pointer flex w-10" onClick={openEdit}>
            Edit
          </p>
      ) : (<div className="flex w-10"></div>) }


      {detailPath && (
        <>
        <NavLink to={detailPath} className="text-dnr-dark-orange hover:underline cursor-pointer flex w-10">
        Detail
      </NavLink>
        </>
      )}

      {promotion.status === 'ACTIVE' ?  (
        <>
          <p className="text-red-500 hover:underline cursor-pointer flex w-10" onClick={openModal}>
            Delete
          </p>
        </>
      ) : (<div className="flex w-10"></div>)}
    </div>
  )
}