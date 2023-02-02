import {useMutation, useQueryClient} from 'react-query'

import ConfirmationModal from 'components/base/ConfirmationModal'

import {fetchDeleteCategory} from 'API'

export default function ModalDelete({id, open, setOpen}) {
  const queryClient = useQueryClient()

  const {mutate, isLoading} = useMutation(`categories`, fetchDeleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
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
      title="Konfirmasi hapus category"
      message="Apakah anda yakin untuk menghapus category ini"
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={handleMutate}
    />
  )
}
