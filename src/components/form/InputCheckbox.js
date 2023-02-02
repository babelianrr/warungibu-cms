export default function InputCheckbox({label, values, register, selected, ...rest}) {
  return (
    <fieldset className="sm:col-span-3">
      <legend className="block text-sm font-medium text-gray-700">{label}</legend>
      <div className="grid grid-rows-3 grid-flow-col p-4">
        {values.map((value) => (
          <div key={value.id} className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id={value.id}
                name={value.name}
                type="checkbox"
                defaultChecked={selected.find((item) => item.id === value.id)}
                className="focus:ring-dnr-turqoise focus:border-dnr-turqoise border-gray-300 rounded"
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
  )
}
