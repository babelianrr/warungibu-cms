import {useState} from 'react'
import {useMutation} from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'
import { Input } from 'components/base'
import InputFileNoneImage from 'components/form/InputFileNoneImage'

export default function ModalImportUser({open, setOpen, refetch}) {
  const [selectedFile, setSelectedFile] = useState('')

  function FileInput({ onChange }) {
    return (
      <div className="mt-4">
        <InputFileNoneImage file={selectedFile} setFile={onChange}/>
      </div>
    )
  }

  const {mutate, isLoading} = useMutation(
    'import_user',
    (type) =>
      serverAuthAPI({
        url: `/users/import-excel`,
        method: 'PATCH',
        payload: {
          role_status: selectedFile.key,
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
      title="Import User"
      message="Pilih file yang akan di import"
      confirmLabel="Konfirmasi"
      type="information"
      processing={isLoading}
      onConfirm={() => mutate(selectedFile)}
      Body={<FileInput onChange={(file) => {
        setSelectedFile(file.target.files[0].size)
      } }/>}
    />
  )
}
