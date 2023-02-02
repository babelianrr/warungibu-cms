import { useState } from 'react'
import { useMutation } from 'react-query'
import { useForm } from 'react-hook-form'
import { Input } from 'components/form'
import { Button, Modal } from 'components/base'
import { AddBatch } from 'API'

export default function ModalAddBatch({ open, setOpen, totalQty, cart, batchData, transaction_number, action, refetch }) {

  const cartId = cart.id
  const productName = cart.product.name
  const [batchNo, setBatchNo] = useState('')
  const [expDate, setExpDate] = useState('')
  const [quantity, setQuantity] = useState('')
  const qtyWOBatch = cart.quantity - totalQty

  const [isErrorBatchNo, setIsErrorBatchNo] = useState(false)
  const [isMessageBatchNo, setIsMessageBatchNo] = useState('')

  const [isErrorExpDate, setIsErrorExpDate] = useState(false)
  const [isMessageExpDate, setIsMessageExpDate] = useState('')

  const [isErrorQuantity, setIsErrorQuantity] = useState(false)
  const [isMessageQuantity, setIsMessageQuantity] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const { mutate, isLoading, error, isError } = useMutation(
    'cartProduct', (payload) => AddBatch(payload),
    {
      onSuccess(data) {
        reset()
        setOpen(false)
        refetch()
      },
    }
  )

  function checkBatchNo(batchNo) {
    let temp = batchData
    const check = temp.filter(x => x.batch_no === batchNo)
    if (check.length > 0) {
      return true
    } else {
      return false
    }
  }

  function checkExpDate(expDate) {
    const date = new Date()
    const today = date.toISOString().slice(0, 10)

    if (expDate <= today) {
      return true
    } else {
      return false
    }
  }

  function checkQty(qty) {
    var totalTemp = qty + totalQty
    if (totalTemp > cart.quantity) {
      return true
    } else {
      return false
    }
  }

  function onSubmit() {

    if (batchNo === '') {
      setIsErrorBatchNo(true)
      setIsMessageBatchNo('Batch No. Harus Diisi')
      return false
    } else if (checkBatchNo(batchNo) === true) {
      setIsErrorBatchNo(true)
      setIsMessageBatchNo('Batch No. sudah terdaftar pada transaksi yang sama')
      return false
    } else {
      setIsErrorBatchNo(false)
    }

    if (expDate === '') {
      setIsErrorExpDate(true)
      setIsMessageExpDate('Exp. Date Harus Diisi')
      return false
    } else if (checkExpDate(expDate) === true) {
      setIsErrorExpDate(true)
      setIsMessageExpDate('Exp. Date sudah lewat')
      return false
    } else {
      setIsErrorExpDate(false)
    }

    if (quantity === '') {
      setIsErrorQuantity(true)
      setIsMessageQuantity('Quantity Harus Diisi')
      return false
    } else if (checkQty(parseInt(quantity)) === true) {
      setIsErrorQuantity(true)
      setIsMessageQuantity('Quantity tidak dapat melebihi Qty Tanpa Batch')
      return false
    } else {
      setIsErrorQuantity(false)
    }

    mutate({
      carts_id: cartId,
      batch_no: batchNo,
      exp_date: expDate,
      quantity: parseInt(quantity)
    })
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
            <Input name={'product-name'} defaultValue={productName} type="text" label="Produk" disabled />
            <Input name={'qty-main'} defaultValue={qtyWOBatch} type="number" label="Qty Tanpa Batch" disabled />
            <Input name={'batch-no'} type="text" label="Batch No." onChange={(e) => setBatchNo(e.target.value)} />
            {isErrorBatchNo ? <span className="text-red-500">{isMessageBatchNo}</span> : null}

            <Input name={'exp-date'} type="date" label="Exp. Date" onChange={(e) => setExpDate(e.target.value)} />
            {isErrorExpDate ? <span className="text-red-500">{isMessageExpDate}</span> : null}

            <Input name={'qty'} type="number" label="Quantity" onChange={(e) => setQuantity(e.target.value)} />
            {isErrorQuantity ? <span className="text-red-500">{isMessageQuantity}</span> : null}
            <Button
              type="button"
              className="w-full mb-1"
            >
              Add Batch
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
