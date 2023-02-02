import {useMutation, useQueryClient} from 'react-query'

import ConfirmationModal from 'components/base/ConfirmationModal'

import {DeleteProductCart} from 'API'

export default function ModalDelete({transaction_number, cart_id, open, setOpen, refetch}) {
  const queryClient = useQueryClient()

  const {mutate, isLoading} = useMutation(`productCart`, (payload) => DeleteProductCart(transaction_number, payload), 
  {
    onSuccess: () => {
      queryClient.invalidateQueries('productCart')
      setOpen(false)
      refetch()
    },
  })

  function handleMutate() {
    mutate({
      cart_id : cart_id
    })
  }

  return (
    <ConfirmationModal
      open={open}
      setOpen={setOpen}
      title="Konfirmasi hapus Produk"
      message="Apakah anda yakin untuk menghapus Produk ini"
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={handleMutate}
    />
  )
}
