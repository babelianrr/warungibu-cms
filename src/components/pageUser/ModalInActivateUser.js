import {useState} from 'react'
import {useMutation} from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'

export default function ModalInActivateUser({open, setOpen, refetch, email, id}) {
  const [selectedType, setSelectedType] = useState({})

  const {mutate, isLoading} = useMutation(
    'unverified_user',
    (email, type) =>
      serverAuthAPI({
        url: `/admin/users/${id}/verify`,
        method: 'PATCH',
        payload: { 
          role_status: "UNVERIFIED_USER",
        },
      }),
    {
      onSuccess() {
        setOpen(false)
        refetch()
      },
    }
  )
  return (
    <ConfirmationModal
      open={open}
      setOpen={setOpen}
      title="Nonaktifkan User"
      message="Apakah anda yakin untuk menonaktifkan user"
      confirmLabel="Konfirmasi"
      type="information"
      processing={isLoading}
      onConfirm={() => mutate(email, selectedType)}
      // Body={<CustomerType onChange={(type) => setSelectedType(type)} />}
    />
  )
}
