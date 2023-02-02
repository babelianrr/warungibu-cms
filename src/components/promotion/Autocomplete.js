import { useState, useCallback } from 'react'
import AsyncSelect from 'react-select/async'
import { fetchProducts } from 'API'

export default function Autocomplete(props) {


  const [prod, setProd] = useState();

  //SELECT REACT PRODUCT
  const handleChange = useCallback((inputValue) => props.changeWord(inputValue), (inputValue) => setProd(inputValue), []);

  const loadOptions = async (inputText, callback) => {
    const res = await fetchProducts({ page: 1, limit: 15, name: inputText })
    const location = res.products[0].branches[0].location
    // callback(res.products.map(i => ({ label: i.name, value: i.id, location: i[0].branches[0].location })))
    callback(res.products.map(i => ({ label: i.name, value: i.id, location: location })))
  }

  return (

    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full px-3">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
          Produk
        </label>
        <AsyncSelect
          defaultValue={props.label ? { label: String(props.label), value: String(props.value) } : null}
          value={prod}
          isDisabled={props.disabled}
          onChange={handleChange}
          placeholder={'Pilih Produk'}
          loadOptions={loadOptions} />
      </div>
    </div>
  )
}
