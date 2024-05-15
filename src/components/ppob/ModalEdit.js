import {ExclamationCircleIcon, InformationCircleIcon} from '@heroicons/react/outline'
import {useEffect, useState} from 'react'
import {useMutation} from 'react-query'
import serverAuthAPI from 'API/serverAuthAPI'
import Input from 'components/base/Input'
import { Modal } from 'components/base'
import { classNames } from 'helpers/classNames'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { InputNumber } from 'components/form'

function ReceiverInput({onChange}) {
  return (
    <div className="mt-4">
      <Input id="receiverName" label="Nama Penerima" type="text" onChange={onChange} />
    </div>
  )
}

export default function ModalEdit({openEdit, setOpenEdit, product, refetch}) {
  const cancelButtonRef = useRef(null)
  const [productName, setProductName] = useState(product?.product_name)
  const [sellPrice, setSellPrice] = useState(product?.sell_price)
  const [note, setNote] = useState(false)

  const {mutate, isLoading, error, isError} = useMutation(
    'update-ppob',
    (payload) =>
      serverAuthAPI({
        url: `/admin/ppob/update`,
        method: 'PATCH',
        payload: payload,
      }),
    {
      onSuccess() {
        setOpenEdit(false)
        refetch()
      },
    }
  )

  function onSubmit(e) {
    e.preventDefault()
    mutate({
      id: product.id,
      // product_name: productName,
      sell_price: sellPrice
    })
  }

  useEffect(() => {
    if (sellPrice === '') {
      setNote('Harga jual tidak boleh kosong')
    }else if(sellPrice < product?.price) {
      setNote('Harga jual tidak boleh lebih kecil dari harga seller')
    }else{
      setNote(false)
    }
  },[sellPrice])

  const colorScheme = {
      classes: 'bg-wi-blue hover:text-wi-blue hover:bg-white hover:border hover:border-wi-blue transition-colors ease-in-out',
      Icon: <ExclamationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />,
      background: 'bg-dnr-dark-orange',
    }

  const {classes, Icon, background} = colorScheme

  return (
    <Modal
      open={openEdit}
      setOpen={setOpenEdit}
      display="block"
    >
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="block sm:items-start px-3">
          <Input disabled onChange={setProductName} label="Nama Paket" name={'product_name'} type={'text'} defaultValue={productName} />
          <div className='h-3'/>
          <InputNumber
              label="Harga Seller"
              prefix="Rp."
              type={'number'}
              defaultValue={product?.price}
              disabled
            />
          <div className='h-3'/>
          <InputNumber
            label="Harga Jual"
            prefix="Rp."
            type={'number'}
            defaultValue={sellPrice}
            onChange={setSellPrice}
            required={true}
            note={note}
          />

          <button type="submit" 
            className={classNames(`mb-2  mt-4 w-full inline-block px-6 py-2.5 text-white font-medium text-base sm:text-sm rounded-md border border-transparent
            active:shadow-lg transition duration-150 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed`,
            isLoading || sellPrice === '' || sellPrice < product?.price ? 'bg-gray-300 text-white cursor-not-allowed' : classes
            )}
            disabled={sellPrice === '' || sellPrice < product?.price ? true : false}
            // disabled={true}
          >
            {isLoading ? 'Memproses Data' : 'Save Promotion'}
          </button>
          {isError ? <span className="text-red-500">{error.message}</span> : null}
        </div>
      </form>
    </Modal>
  )
}
