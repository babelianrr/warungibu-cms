import {useState} from 'react'
import {useMutation} from 'react-query'
import {useForm} from 'react-hook-form'
import {format} from 'date-fns'
import {Input} from 'components/form'
import { Button, Modal } from 'components/base'
import { createPromotion, updatePromotion } from 'API'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ModalPromotion({ open, setOpen, promotion, refetch,action }) {

  const [startDate, setStartDate] = useState(action == 'edit' ? new Date(promotion.start_date) : null)
  const [endDate, setEndDate] = useState(action == 'edit' ? new Date(promotion.end_date) : null)
  const [tipePromosi,setTipePromosi] = useState(action == 'edit' ? promotion.type : 'default')
  const [errDate,setErrDate] = useState()
  const [maxPromo,setMaxPromo] = useState()
  const [channelBank,setChannelBank] = useState()
  const [paymentMethod,setPaymentMethod] = useState()

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm()

  const {mutate, isLoading, error, isError} = useMutation(
    'edit-promotion',
    action == 'edit' ? (payload) => updatePromotion(promotion.id, payload) : createPromotion ,
    {
      onSuccess(data) {
        reset()
        resetFormAdd()
        setOpen(false)
        refetch()
      },
    }
  )

  const resetFormAdd = () => {
    setTipePromosi('default')
    setStartDate(null)
    setEndDate(null)
  };

  function onSubmit(data) {
    if(startDate && endDate){
        if(format(new Date(endDate), 'yyyy/MM/dd') < format(new Date(startDate), 'yyyy/MM/dd')){
            setErrDate("Start Date must be early from End Date")
            } else {
                    mutate({
                        start_date: format(new Date(startDate), 'yyyy/MM/dd'),
                        end_date: format(new Date(endDate), 'yyyy/MM/dd'),
                        name: data.name,
                        type: tipePromosi,
                        code: data.code || "",
                        min_purchase: parseInt(data.MinPurchase) || 0,
                        max_usage_promo: parseInt(data.max_usage_promo) || 0,
                        max_usage_user: parseInt(data.max_usage_user) || 0,
                        discount_percentage: data.discount_percentage,
                        max_discount_amount: parseInt(data.max_discount_amount)||0
                        })
                    }
    } else {
      setErrDate("Start Date and End Date is required")
    }
  }

  const handleMaxPromo = (e) =>{
    setMaxPromo(e.target.value);
  }
  //handle SELECT

  const handleChangeCategory = (e) => {
    setTipePromosi(e.target.value);
  }

  return (
    <Modal open={open} setOpen={setOpen} overflowHidden={false}>
      <div className="my-3 text-center flex-1 sm:text-left">
        <div className="mt-2 w-full">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>

            {/* MAIN START HERE */}
            <Input name={'name'} register={register} defaultValue={action == 'edit' ? promotion.name : null } label="Nama Promosi" type="text" />
            <div className="flex flex-wrap overflow-hidden xl:-mx-1">
            <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                  Periode
                </label>
            </div>
              <div className="w-2/5 overflow-hidden xl:my-1 xl:px-1">
                {/* <Input name={'startDate'} register={() => register('startDate', {required: true})} errors={errors.startDate} label="Periode" type="date"   /> */}
                <DatePicker
                  dateFormat={'dd-MM-yyyy'}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                />
              </div>
              <div className='w-1/5 text-center mt-4'>-</div>
              <div className="w-2/5 overflow-hidden xl:my-1 xl:px-1"> 
              <DatePicker
                dateFormat={'dd-MM-yyyy'}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />
              </div>
              <p className="text-red-500">{errDate}</p>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                  Tipe Promosi
                </label>
                <select name="promotion_type" disabled={action == 'edit' ? true : false} value={tipePromosi} onChange={(e) => handleChangeCategory(e)} className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option value="0">- Pilih Promosi -</option>
                  <option value="TIERED">Tiered Promotion</option>
                  <option value="CODE">Promotion Code</option>
                </select>
              </div>
            </div>
            {/* MAIN END HERE */}

            { tipePromosi == "TIERED" || tipePromosi == "default" ? "" : (
                <>
                <Input name={'code'} defaultValue={action == 'edit' ? promotion.code : null } register={register} label="Code" type="text"  />
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                      Channel Bank
                    </label>
                    <select onChange={(e) => setChannelBank(e.target.value)} className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" >
                      <option value="debitbri">Debit BRI</option>
                      <option value="ccbri">Kredit BRI</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                      Metode Pembayaran
                    </label>
                    <select onChange={(e) => setPaymentMethod(e.target.value)}  className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" >
                      <option value="debit">Kartu Debit</option>
                      <option value="cc">Kartu Kredit</option>
                    </select>
                  </div>
                </div>
                <Input name={'MinPurchase'} register={register} defaultValue={action == 'edit' ? promotion.min_purchase : null } id="name" label="Min. Transaksi (Rp.)" type="text"/>
                <Input name={'discount_percentage'} register={() => register('discount_percentage', {max: 100})} errors={errors.discount_percentage} defaultValue={action == 'edit' ? promotion.discount_percentage : null } label="Diskon (%)" type="text"/>
                <Input name={'max_discount_amount'} register={register} defaultValue={action == 'edit' ? promotion.max_discount_amount : null } label="Max. Potongan (Rp.)" type="text" />
                <Input name={'max_usage_promo'} register={() => register('max_usage_promo', {min: 1})} onChange={(e) => handleMaxPromo(e)} errors={errors.max_usage_promo} defaultValue={action == 'edit' ? promotion.max_usage_promo : null } label="Max. Penukaran/Periode" type="text"/>
                <Input name={'max_usage_user'} register={() => register('max_usage_user', {min: 1, max: maxPromo})} errors={errors.max_usage_user} defaultValue={action == 'edit' ? promotion.max_usage_user : null } label="Max. Penukaran/Pengguna" type="text"/>
                {isError && <p className="mt-4 text-red-500">{error.message}</p>}
                </>
            ) }

            <Button
              type="button"
              className="w-full mb-1"
            >
              {action == 'edit' ? 'Update Promotion' : 'Save Promotion'}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
