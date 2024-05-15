import { useState } from 'react'
import { useMutation } from 'react-query'
import { useForm } from 'react-hook-form'
import { Input } from 'components/form'
import { Button, Modal } from 'components/base'
import { createProductDetail, updateProductDetail } from 'API'
import Autocomplete from './Autocomplete'

export default function ModalProduct({ open, setOpen, id, products, refetch, action }) {

  const [qtyMin, setQtyMin] = useState(action == 'edit' ? products.qty_min : null)
  const [value, setValue] = useState(action == 'edit' ? [{ label: products.product.name, value: products.product.id }] : null);
  const productName = action == 'edit' ? products.product.name : null;
  const productId = action == 'edit' ? products.product.id : null;
  const [errorp, setErrorp] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { mutate, isLoading, error, isError } = useMutation(
    'edit-promotion-detail',
    action == 'edit' ? (payload) => updateProductDetail(id, payload) : (payload) => createProductDetail(id, payload),
    {
      onSuccess() {
        setOpen(false)
        setErrorp("")
        refetch()
      },
    }
  )

  function onSubmit(data) {
    if (value) {
      mutate({
        product_id: value.value,
        qty_max: parseInt(data.qtyMax) || 50,
        qty_min: parseInt(data.qtyMin),
        percentage: data.percent
      })
    } else {
      setErrorp("Product is required")
    }
  }

  const handleQty = (e) => {
    setQtyMin(e.target.value);
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="my-3 text-center flex-1 sm:text-left">
        <div className="mt-2 w-full">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full px-3">
                <p className="text-red-500">{errorp}</p>
                <Autocomplete changeWord={word => setValue(word)} label={productName} value={productId} />
              </div>
            </div>

            <div className="flex flex-wrap overflow-hidden xl:-mx-1">
              <div className="w-2/5 overflow-hidden xl:my-1 xl:px-1">
                <Input name={'qtyMin'} register={() => register('qtyMin', { required: true })} errors={errors.qtyMin} label="Qty Min" onChange={(e) => handleQty(e)} defaultValue={action == 'edit' ? qtyMin : null} type="text" />
              </div>
              <div className='w-1/5 text-center mt-8'>-</div>
              <div className="w-2/5 pl-2 overflow-hidden xl:my-1 xl:px-1">
                <Input name={'qtyMax'} register={() => register('qtyMax', { min: qtyMin, max: 50 })} errors={errors.qtyMax} label="Qty Max" defaultValue={action == 'edit' ? products.qty_max : null} type="text" />
              </div>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <Input label="Persentase (%)" name={'percent'} defaultValue={action == 'edit' ? products.percentage : null} register={() => register('percent', { required: true, max: 100 })} errors={errors.percent} className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" />
              {isError && <p className="mt-4 text-red-500">{error.message}</p>}
            </div>

            <Button
              type="button"
              className="w-full mb-1"
            >
              {action == 'edit' ? 'Update Product' : 'Save Product'}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
