import {useMutation, useQueryClient} from 'react-query'

import ConfirmationModal from 'components/base/ConfirmationModal'

import {deletePromotion} from 'API'

export default function ModalDelete({id, open, setOpen}) {
  const queryClient = useQueryClient()

  const {mutate, isLoading} = useMutation(`promotion`, deletePromotion, {
    onSuccess: () => {
      queryClient.invalidateQueries('promotion')
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
      title="Konfirmasi hapus Promotion"
      message="Apakah anda yakin untuk menghapus Promotion ini"
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={handleMutate}
    />
  )
}
