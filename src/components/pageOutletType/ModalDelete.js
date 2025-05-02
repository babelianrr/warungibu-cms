import {useMutation, useQueryClient} from 'react-query'

import ConfirmationModal from 'components/base/ConfirmationModal'

import {deleteOutletType} from 'API'

export default function ModalDelete({id, open, setOpen}) {
  const queryClient = useQueryClient()

  const {mutate, isLoading} = useMutation(`outlet-types`, deleteOutletType, {
    onSuccess: () => {
      queryClient.invalidateQueries('outlet-types')
      setOpen(false)
    },
  })

  function handleMutate() {
    mutate(id)
  }

  return (
    <ConfirmationModal
      open={open}
      setOpen={setOpen}
      title="Konfirmasi hapus Client Name"
      message="Apakah anda yakin untuk menghapus Client Name ini"
      // type='information'
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={handleMutate}
    />
  )
}
