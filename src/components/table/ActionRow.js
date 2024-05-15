import {useState} from 'react'
import {NavLink} from 'react-router-dom'

import ModalDelete from 'components/pageCategory/ModalDelete'
import ModalStatus from 'components/pageOutletType/ModalStatus'

export default function ActionRow({editPath, statusPath, status, detailPath, deletePath, id, DeleteComponent = ModalDelete, StatusComponent = ModalStatus}) {
  const [open, setOpen] = useState(false)
  const [openStatus, setOpenStatus] = useState(false)

  function openModal() {
    setOpen(true)
  }

  function openModalStatus() {
    setOpenStatus(true)
  }

  return (
    <div className="flex justify-around space-x-4">
      <DeleteComponent open={open} setOpen={setOpen} id={id} />
      <StatusComponent open={openStatus} status={!status} setOpen={setOpenStatus} id={id} />
      <NavLink to={editPath} className="text-dnr-dark-orange hover:underline cursor-pointer w-full">
        Edit
      </NavLink>
      {statusPath && (
        <>
          {/* <NavLink to={statusPath} className="text-dnr-dark-orange hover:underline cursor-pointer w-full">
            {status ? 'InActivate' : 'Activate'}
          </NavLink> */}
          <p className="text-dnr-dark-orange hover:underline cursor-pointer w-full" onClick={openModalStatus}>
            {status ? 'InActivate' : 'Activate'}
          </p>
        </>
      )}
      {detailPath && (
        <>
          <NavLink to={detailPath} className="text-dnr-dark-orange hover:underline cursor-pointer w-full">
            Detail
          </NavLink>
        </>
      )}
      {deletePath && (
        <>
          <p className="text-red-500 hover:underline cursor-pointer w-full" onClick={openModal}>
            Delete
          </p>
        </>
      )}
    </div>
  )
}
