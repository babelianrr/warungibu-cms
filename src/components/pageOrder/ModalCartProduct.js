import { useState } from 'react'
import { useMutation } from 'react-query'
import { useForm } from 'react-hook-form'
import { Input } from 'components/form'
import { Button, Modal } from 'components/base'
import { AddProductCart, UpdateProductCart } from 'API'
import Autocomplete from 'components/promotion/Autocomplete'

export default function ModalCartProduct({ open, setOpen, totalQty, cart, transaction_number, action, refetch }) {

  const [value, setValue] = useState(action === 'edit' ? [{ label: cart.product.name, value: cart.product.id }] : null);
  const productName = action === 'edit' ? cart.product.name : null;
  const productId = action === 'edit' ? cart.product.id : null;

  const [isErrorQuantity, setIsErrorQuantity] = useState(false)
  const [isMessageQuantity, setIsMessageQuantity] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const { mutate, isLoading, error, isError } = useMutation(
    'cartProduct',
    action === 'edit' ? (payload) => UpdateProductCart(transaction_number, payload) : (payload) => AddProductCart(transaction_number, payload),
    {
      onSuccess(data) {
        reset()
        setOpen(false)
        refetch()
      },
    }
  )

  function checkQty(qty) {
    if (qty < totalQty) {
      return true
    } else {
      return false
    }
  }

  function onSubmit(data) {

    if (data.quantity === '') {
      setIsErrorQuantity(true)
      setIsMessageQuantity('Quantity Harus Diisi')
      return false
    } else if (checkQty(parseInt(data.quantity)) == true) {
      setIsErrorQuantity(true)
      setIsMessageQuantity('Quantity tidak boleh kurang dari total quantity batch produk')
      return false
    } else {
      setIsErrorQuantity(false)
    }

    if (action === 'edit') {
      mutate({
        cart_id: cart.id,
        product_id: productId,
        quantity: parseInt(data.quantity),
        //price : data.price,
        discount: cart.discount_percentage
      })
    } else {
      mutate({
        product_id: value.value,
        location: value.location,
        quantity: parseInt(data.quantity)
      })
    }

  }

  /*   function generatePriceFromCart(cart) {
      if (cart.discount_percentage) {
        return Math.ceil(cart.unit_price - (cart.discount_percentage / 100) * cart.unit_price)
      }
    
      return cart.unit_price
    } */

  return (
    <Modal open={open} setOpen={setOpen} overflowHidden={false}>
      <div className="my-3 text-center flex-1 sm:text-left">
        <div className="mt-2 w-full">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>

            <Autocomplete changeWord={word => setValue(word)} label={productName} value={productId} disabled={action === 'edit' ? true : false} />
            <Input name={'quantity'} register={() => register('quantity', { min: 1 })} errors={errors.quantity} defaultValue={action === 'edit' ? cart.quantity : null} label="Quantity" type="text" />
            {isErrorQuantity ? <span className="text-red-500">{isMessageQuantity}</span> : null}
            {/*             {action === 'edit' ? (
               <Input name={'price'} register={register} defaultValue={action === 'edit' ? generatePriceFromCart(cart) : null } label="Harga" type="text" />
            ) : "" } */}


            <Button
              type="button"
              className="w-full mb-1"
            >
              {action === 'edit' ? 'Update Produk' : 'Tambah Produk'}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
