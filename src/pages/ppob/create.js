import {useState,useEffect, memo} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {useForm} from 'react-hook-form'
import {useHistory} from 'react-router-dom'

import {Input,InputFile, InputTextRich} from 'components/form'
import LoadingPage from 'components/base/LoadingPage'
import Button from 'components/base/Button'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {createProduct,fetchCategories,fetchUploadProduct} from 'API'

export default function PpobCreate() {
  const history = useHistory()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm()

  const [images, setImages] = useState([])
  const [price, setPrice] = useState([])
  const [description,setDescription]= useState('')
  const [validTo,setValidTo]= useState('')
  const [productType,setProductType]= useState('')
  const [categories, setCategories] = useState([])
  const [errorForm,setErrorForm] = useState('')

  let kategori = []

    //categories start here
    const handleCheckbox = (e) =>{
      const checked = e.target.checked;
      if (checked) {
       //checked
       kategori.push(e.target.name)
      } else {
       //uncheckeds
       var selected = kategori.indexOf(e.target.name);
       if (selected !== -1) {
         kategori.splice(selected, 1);
       }
      }
    } 
  

    let count = 0;

    useEffect(() => {
      async function fetchData() {
        const categories = await fetchCategories()
        setCategories(categories)

      }
      fetchData()
    },[count])

    //end categories

 const {mutate, isLoading, isError, error} = useMutation(createProduct, {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['products'])
        history.push('/products')
      },
    })

    const handleProductType = (e) =>{
      setProductType(e.target.value);
    } 

  const {mutate: mutateUploadImage} = useMutation(fetchUploadProduct, {
    onSuccess: (icon) => {
      setImages([icon])
    },
  })

 const onSubmit = (data) => {
    const keys = Object.keys(data)
    const categoriesSelected = keys.filter((key) => data[key] === true)

    if (images[0] == undefined){
        setErrorForm("Please upload image")
    } else {
        mutate({
          sku_number : data.noSKU,
          name: data.name,
          unit: data.unit,
          company_name : "PT XXX",
          price: Number(data.price),
          picture: [images[0].url],
          discount_percentage : 0,
          discount_price: 0,
          status: "ACTIVE",
          branches: [data.qty],
          categories: categoriesSelected,
          description: description,
          valid_to : validTo,
          product_type : productType

        })
    }

  }

  if (isLoading) return <LoadingPage />
  //if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Create Products</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="mt-4 grid grid-cols-1 gap-y-4">
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <Input label="No. SKU" register={() => register('noSKU', {required: true})} errors={errors.noSKU} name={'noSKU'} type={'text'} />
              <Input label="Name" register={() => register('name', {required: true})} errors={errors.name} name={'name'} type={'text'} />
              <Input label="Unit" register={() => register('unit', {required: true})} errors={errors.unit} name={'unit'} type={'text'} />
              <Input label="Price" register={() => register('price', {required: true})} errors={errors.price} name={'price'} type={'text'} />
              <Input label="Quantity" register={register} name={'qty'} type={'text'} />
{/*               <InputNumberCreate
                name={'price'}
                label="Harga SAP"
                register={register}
                prefix="Rp."
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />  */}
              <InputFile label="Images" images={images} setImages={setImages} mutateUploadImage={mutateUploadImage}/>
              <span className='text-red-500'>{errorForm}</span>
            {/* <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                  Tipe Produk
                </label>
                <select name="product_type" onChange={(e) => handleProductType(e)} className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
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
                  register={register}
                  name={'description'}
                  setValue={setDescription}
                />
              <fieldset className="sm:col-span-3">
                  <legend className="block text-sm font-medium text-gray-700">Categories</legend>
                  <div className="grid grid-rows-3 grid-flow-col p-4">
                    {categories.map((value) => (
                      <div key={value.id} className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={value.id}
                            name={value.name}
                            onClick={(e) => handleCheckbox(e)}
                            //onClick={props}
                            type="checkbox"
                            className="focus:ring-dnr-bicart focus:border-wi-blue border-gray-300 rounded"
                            {...register(value.name)}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="comments" className="font-medium text-gray-700">
                            {value.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>

            <div className="pt-5">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-bicart focus:border-wi-blue"
                  onClick={() => history.goBack()}
                >
                  Cancel
                </button>
                <Button color="bicart" padding="py-2 px-3" type="button">
                  Save
                </Button>
              </div>
            </div>
            </form>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
