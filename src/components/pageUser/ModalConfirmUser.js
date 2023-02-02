import {useState} from 'react'
import {useMutation} from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'

export default function ModalConfirmUser({open, setOpen, refetch, email, id}) {
  const [selectedType, setSelectedType] = useState({})

  const {mutate, isLoading} = useMutation(
    'verified_user',
    (email, type) =>
      serverAuthAPI({
        url: `/admin/users/${id}/verify`,
        method: 'PATCH',
        payload: {
          role_status: "AUTHORIZED_USER",
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
      title="Verifikasi Pendaftaran User "
      message="Apakah anda yakin untuk mengkonfirmasi verifikasi pendaftaran user"
      confirmLabel="Konfirmasi"
      type="information"
      processing={isLoading}
      onConfirm={() => mutate(email, selectedType)}
      // Body={<CustomerType onChange={(type) => setSelectedType(type)} />}
    />
  )
}
