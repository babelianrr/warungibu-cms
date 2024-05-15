import {useMutation} from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'

export default function ModalRemovedReview({open, setOpen, id, refetch}) {
  const {mutate, isLoading} = useMutation(
    'remove-review',
    () =>
      serverAuthAPI({
        url: `/admin/product_reviews/${id}`,
        method: 'DELETE',
        payload: {},
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
      title="Konfirmasi pembatalan pesanan"
      message="Apakah anda yakin untuk membatalkan pesanan ini"
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={() => mutate()}
    />
  )
}
