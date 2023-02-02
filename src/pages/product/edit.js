import { useState, useEffect, memo } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Input, InputNumber, InputFiles, InputTextRich, InputCheckbox } from 'components/form'
import LoadingPage from 'components/base/LoadingPage'
import ErrorPage from 'components/base/ErrorPage'
import Button from 'components/base/Button'
import BaseInput from 'components/base/Input'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  fetchDeleteImageProduct,
  fetchProductById,
  fetchUpdateProduct,
  fetchUploadImageProduct,
  fetchCategories,
} from 'API'
import SelectInput from 'components/base/SelectInput'

export default function ProductEditPage() {
  const { id } = useParams()

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery(['products', id], () => fetchProductById(id), {
    refetchOnMount: false,
  })

  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="mt-4 grid grid-cols-1 gap-y-4">
              <Input label="No.SKU" name={'noSKU'} type={'text'} defaultValue={product.sku_number} disabled={true} />
            </div>
            <MemoizedInputImages defaultValue={product.images} isLoading={isLoading} />
            <MemoizedInputDescriptionCategories />
          </div>
        </div>
      </div>
    </>
  )
}

const MemoizedInputDescriptionCategories = memo(InputDescriptionProduct)

function InputDescriptionProduct() {
  const history = useHistory()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const authUser = JSON.parse(localStorage.user)
  const [productType, setProductType] = useState('')
  const [validTo, setValidTo] = useState('')
  const [product, setProduct] = useState({
    id: null,
    categories: [],
  })

  const discountTypes = [
    { id: 1, value: 'Persentase Discount', key: 'discount_percentage' },
    { id: 2, value: 'Pengurangan Harga', key: 'discount_price' },
  ]

  const [categories, setCategories] = useState([])
  const [description, setDescription] = useState('')
  const [qty, setQty] = useState('')
  const [price, setPrice] = useState(0)
  const [dpf, setDpf] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountType, setDiscountType] = useState(discountTypes[0])
  const [discountEndDate, setDiscountEndDate] = useState('')

  useEffect(() => {
    async function fetchData() {
      // get product
      const product = await fetchProductById(id)
      setProduct(product)
      setDescription(product.description || '')
      setPrice(product.price)
      setDpf(product.dpf)
      setValidTo((product?.valid_to) ? new Date(parseISO(product?.valid_to)) : '')
      setQty(product?.branches[0]?.stock)
      setProductType(product.product_type)
      const categories = await fetchCategories()
      setCategories(categories)

      if (product.discount_type) {
        const map = {
          PERCENTAGE: {
            index: 0,
            key: 'discount_percentage',
          },
          PRICE: {
            index: 1,
            key: 'discount_price',
          },
        }
        const { index, key } = map[product.discount_type]

        setDiscountType(discountTypes[index])
        setDiscountAmount(product[key])
        setDpf(product.dpf)
        setDiscountEndDate(format(new Date(product.discount_end_date), 'yyyy-MM-dd'))
      }
    }
    fetchData()
  }, [id])


  function calculateDiscount(discountAmount, discountType, price) {
    if (discountType.key === 'discount_percentage') {
      return price - Math.floor((discountAmount / 100) * price)
    } else {
      return price - discountAmount
    }
  }

  // update product
  const { mutate, isLoading } = useMutation((payload) => fetchUpdateProduct(id, payload), {
    onSuccess: async (data) => {
      // Masukin ke cache dari response API ?
      queryClient.invalidateQueries(['products', id])
      history.push(`/products/${id}/detail`)
    },
  })

  function buttonType() {
    //console.log(discountAmount, dpf, discountEndDate)
    if (authUser.role_status === 'SUPER_ADMIN' && discountAmount) {
      if (!dpf || !discountEndDate) {
        return 'disabled'
      }
    }

    if (isLoading) {
      return 'processing'
    }

    return 'submit'
  }

  const onSubmit = (data) => {
    const keys = Object.keys(data)
    const categoriesSelected = keys.filter((key) => data[key] === true)
    const payload = {
      // name: data.name || product.name,
      unit: data.unit || product.unit,
      description: description,
      price: Number(price),
      categories: categoriesSelected,
      valid_to: format(new Date(zonedTimeToUtc(validTo)), 'yyyy/MM/dd HH:MM:SS'),
      product_type: productType,
      branches: [qty],
    }


    if (authUser.role_status === 'SUPER_ADMIN') {
      if (discountEndDate) {
        payload.discount_end_date = discountEndDate
      }
      payload.dpf = dpf
      payload[discountType.key] = Number(discountAmount) || null
    }
    mutate(payload)
  }

  return (
    <form className="min-w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* <InputNumber
        register={register}
        label="Harga"
        prefix="Rp."
        name={'price'}
        type={'number'}
        defaultValue={price}
        onChange={setPrice}
      /> */}
      {/*       {authUser.role_status === 'SUPER_ADMIN' ? (
        <>
          <InputNumber
            type="number"
            id="discount"
            label="Discount"
            defaultValue={discountAmount}
            onChange={setDiscountAmount}
            PrefixComponent={() => {
              return (
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  <div className="relative">
                    <SelectInput
                      defaultValue={discountType}
                      data={discountTypes}
                      onChange={setDiscountType}
                      id="discount"
                      noLabel
                      rounded="rounded-l-md"
                      background="bg-gray-50"
                      border=""
                    />
                  </div>
                </span>
              )
            }}
          />
          <InputNumber
            label="Harga Setelah Discount"
            prefix="Rp."
            type={'number'}
            defaultValue={calculateDiscount(discountAmount, discountType, price)}
            disabled
          />
          <BaseInput label="DPF" name={'dpf'} type={'text'} defaultValue={dpf} onChange={setDpf} />

          <BaseInput
            id="endDate"
            label="Batas Akhir Discount"
            type="date"
            defaultValue={discountEndDate}
            onChange={setDiscountEndDate}
          />
        </>
      ) : null} */}
      <Input label="Name" name={'name'} type={'text'} register={register} defaultValue={product.name} disabled={true} />
      <Input label="Unit" name={'unit'} type={'text'} register={register} defaultValue={product.unit} />
      <InputNumber
        label="Harga"
        prefix="Rp."
        type={'number'}
        defaultValue={price}
        onChange={setPrice}
      />
      <Input label="Quantity" register={register} name={'qty'} type={'text'} onChange={(e) => setQty(e.target.value)} defaultValue={qty} />
      {/* <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
            Tipe Produk
          </label>
          <select name="product_type" value={productType} onChange={(e) => setProductType(e.target.value)} className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
            <option value="0">- Pilih Tipe Produk -</option>
            <option value="MAT_LICNS">Pharma</option>
            <option value="NPH_LICNS">Non Pharma</option>
            <option value="ALK_LINCS">Alat Kesehatan</option>
          </select>
        </div>
      </div> */}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
            Valid To
          </label>
          <DatePicker
            dateFormat={"yyyy-MM-dd HH:mm:ss"}
            selected={validTo}
            onChange={(date) => setValidTo(date)}
            minDate={new Date()}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            showMonthDropdown
            showYearDropdown
          />
        </div>
      </div>
      <InputTextRich
        label="Description"
        name={'description'}
        value={description}
        setValue={setDescription}
        defaultValue={description}
      />
      <InputCheckbox
        register={register}
        label="Category"
        name={'category'}
        values={categories}
        selected={product.categories}
      />
      <div className="pt-5">
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-bicart focus:border-wi-blue"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
          <Button color="bicart" padding="py-2 px-3" type={buttonType()}>
            Save
          </Button>
        </div>
      </div>
    </form>
  )
}

const MemoizedInputImages = memo(InputImageProduct)

function InputImageProduct({ isLoading, defaultValue }) {
  const { id } = useParams()
  const [images, setImages] = useState(defaultValue)
  // upload images
  const { mutate: mutateUploadImage } = useMutation((payload) => fetchUploadImageProduct(id, payload), {
    onSuccess: (product) => {
      setImages(product.images)
    },
  })

  // delete images
  const { mutate: mutateDeleteImage, isLoading: isLoadingDeleteImage } = useMutation(fetchDeleteImageProduct, {
    onSuccess: (_) => {
      // queryClient.invalidateQueries(['products', id])
      // refetch()
      // setImages(product.images)
    },
  })

  const handleDeleteImage = (id) => {
    const currentImage = images.filter((image) => image.id !== id)
    setImages(currentImage)
  }

  return (
    <InputFiles
      label="Images"
      images={images}
      isLoading={isLoading}
      mutateUploadImage={mutateUploadImage}
      mutateDeleteImage={mutateDeleteImage}
      handleDeleteImage={handleDeleteImage}
      isLoadingDeleteImage={isLoadingDeleteImage}
    />
  )
}
