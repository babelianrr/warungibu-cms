import { useMutation, useQueryClient } from 'react-query'

import ConfirmationModal from 'components/base/ConfirmationModal'

import { DeleteBatch } from 'API'

export default function ModalDeleteBatch({ batchData, transaction_number, cart_id, open, setOpen, refetch }) {
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(`DeleteBatch`, (payload) => DeleteBatch(batchData.id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('DeleteBatch')
        setOpen(false)
        refetch()
      },
    })

  function handleMutate() {
    mutate({
      id: batchData.id
    })
  }

  return (
    <ConfirmationModal
      open={open}
      setOpen={setOpen}
      title="Konfirmasi hapus Batch"
      message="Apakah anda yakin untuk menghapus Batch ini"
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={handleMutate}
    />
  )
}
