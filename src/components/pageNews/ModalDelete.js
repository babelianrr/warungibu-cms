import {useMutation, useQueryClient} from 'react-query'

import ConfirmationModal from 'components/base/ConfirmationModal'

import {deleteNews} from 'API'

export default function ModalDelete({id, open, setOpen}) {
  const queryClient = useQueryClient()

  const {mutate, isLoading} = useMutation(`news`, deleteNews, {
    onSuccess: () => {
      queryClient.invalidateQueries('news')
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
      title="Konfirmasi hapus News"
      message="Apakah anda yakin untuk menghapus News ini"
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={handleMutate}
    />
  )
}
