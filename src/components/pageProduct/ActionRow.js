import {useState} from 'react'
import {NavLink} from 'react-router-dom'

import ModalDelete from 'components/pageCategory/ModalDelete'

export default function ActionRow({editPath, detailPath, deletePath, id, DeleteComponent = ModalDelete}) {
  const [open, setOpen] = useState(false)

  function openModal() {
    setOpen(true)
  }

  return (
    <div className="space-y-1">
      <DeleteComponent open={open} setOpen={setOpen} id={id} />
      <NavLink to={editPath} className="text-dnr-dark-orange hover:underline cursor-pointer block">
        Edit
      </NavLink>
      {detailPath && (
        <>
          <NavLink to={detailPath} className="text-dnr-dark-orange hover:underline cursor-pointer block">
            Detail
          </NavLink>
        </>
      )}
      {deletePath && (
        <>
          <p className="text-red-500 hover:underline cursor-pointer block" onClick={openModal}>
            Delete
          </p>
        </>
      )}
    </div>
  )
}
