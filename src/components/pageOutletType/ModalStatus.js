import {useMutation, useQueryClient} from 'react-query'

import ConfirmationModal from 'components/base/ConfirmationModal'

import {updateOutletType} from 'API'

export default function ModalStatus({id, status, open, setOpen, refetch}) {
  const queryClient = useQueryClient()

  const {mutate, isLoading} = useMutation(`outlet-types`, () => updateOutletType(id, {active:status}), {
    onSuccess: () => {
      queryClient.invalidateQueries('outlet-types')
      setOpen(false)
    },
  })

  function handleMutate() {
    mutate()
  }

  return (
    <ConfirmationModal
      open={open}
      setOpen={setOpen}
      title="Konfirmasi ubah status Client"
      message="Apakah anda yakin untuk mengubah status Client ini"
      type='information'
      confirmLabel="Konfirmasi"
      processing={isLoading}
      onConfirm={handleMutate}
    />
  )
}
