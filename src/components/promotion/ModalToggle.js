import {useMutation, useQueryClient} from 'react-query'

import ConfirmationModal from 'components/base/ConfirmationModal'

import {updateProductDetail} from 'API'

export default function ModalToggle({id, open, setOpen,status,refetch}) {
  const queryClient = useQueryClient()

  const {mutate, isLoading, error, isError} = useMutation(
    'change-status-detail',
    (payload) => updateProductDetail(id, payload),
    {
      onSuccess() {
        setOpen(false)
        refetch()
      },
    }
  )

  function handleMutate() {

      if(status == "ACTIVE"){
        mutate({
            status: "INACTIVE"
          })
      } else {
        mutate({
            status: "ACTIVE"
          })
      }

  }
  return (
    <>
    {status === "ACTIVE" ? (
        <ConfirmationModal
          open={open}
          setOpen={setOpen}
          title="Konfirmasi Non Aktif Produk"
          message="Apakah anda yakin untuk Non-aktifkan produk ini"
          confirmLabel="Konfirmasi"
          processing={isLoading}
          onConfirm={handleMutate}
        />
      ) : (
        <ConfirmationModal
          open={open}
          setOpen={setOpen}
          title="Konfirmasi Aktif Produk"
          message="Apakah anda yakin untuk Mengaktifkan produk ini"
          confirmLabel="Konfirmasi"
          processing={isLoading}
          onConfirm={handleMutate}
        />
      ) 
    }
    </>
  )
}
