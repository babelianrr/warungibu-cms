import {useState} from 'react'
import {useMutation} from 'react-query'
import ConfirmationModal from 'components/base/ConfirmationModal'
import serverAuthAPI from 'API/serverAuthAPI'

function DocumentType({onChange}) {
  const [type, setType] = useState([
    {id: 1, name: 'Approved', key: 'APPROVED', selected: false},
    {id: 2, name: 'Decline', key: 'DECLINED', selected: false},
  ])

  function handleChange(selected) {
    setType(
      type.map((item) => ({
        ...item,
        selected: selected.id === item.id,
      }))
    )

    onChange(selected)
  }

  return (
    <div className="flex space-x-4 my-2">
      {type.map((item) => (
        <button
          key={item.id}
          onClick={() => handleChange(item)}
          className={`p-2 flex-1 text-sm rounded-md ${
            item.selected ? 'bg-dnr-dark-orange text-white' : 'border border-dnr-dark-orange text-dnr-dark-orange'
          } hover:text-white hover:bg-dnr-dark-orange transition-colors ease-in-out`}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
}

export default function ModalConfirmDocument({open, setOpen, refetch, email, doc}) {
  const [selectedType, setSelectedType] = useState({})

  const {mutate, isLoading} = useMutation(
    'verified_document',
    () =>
      serverAuthAPI({
        url: `/admin/outlet_docs/${doc.id}`,
        method: 'PATCH',
        payload: {
          status: selectedType.key,
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
      title="Verifikasi Dokumen"
      message="Apakah anda yakin untuk mengkonfirmasi dokumen ini"
      confirmLabel="Konfirmasi"
      type="information"
      processing={isLoading}
      onConfirm={() => mutate()}
      Body={<DocumentType onChange={(type) => setSelectedType(type)} />}
    />
  )
}
